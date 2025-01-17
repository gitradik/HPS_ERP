import { Op } from "sequelize";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApolloError } from "apollo-server-express";
import dotenv from "dotenv";
import User from "../../models/User";
import RefreshToken from "../../models/RefreshToken";
import { UserRole } from "../../models/User";
import { sendEmail } from "../mailService";
import { LoginResponse } from "../../utils/types/auth";

dotenv.config();

export interface CreateUserInput {
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    password: string;
    role?: UserRole;
    isActive?: boolean;
    position?: string;
    contactDetails?: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {}

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.JWT_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;
const REFRESH_TOKEN_EXPIRATION = process.env.JWT_REFRESH_SECRET_EXPIRATION!;


// Функция для генерации URL с токеном
export const generateUrlWithToken = (userId: number) => {
    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
    return `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;
};

// Универсальная функция для отправки email с токеном
export const sendVerificationEmail = (userId: number, email: string) => {
    const tokenUrl = generateUrlWithToken(userId);
    sendEmail(email, 'Bestätigen Sie Ihr Konto', `Klicken Sie auf den Link, um Ihr Konto zu bestätigen: ${tokenUrl}`);
};


const createTokens = (userId: number, role: UserRole) => {
    const accessToken = jwt.sign({ id: userId, role }, SECRET_KEY, {
        expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ id: userId, role }, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRATION,
    });
    return { accessToken, refreshToken };
};

const userService = {
    async getUsers() {
        return await User.findAll();
    },
    async getUsersExcludingId(excludedId: number) {
        return await User.findAll({
            where: {
                id: {
                    [Op.ne]: excludedId,
                },
            },
        });
    },

    async getUserById(id: number) {
        return await User.findByPk(id);
    },

    async getUsersByRole(role: UserRole) {
        return await User.findAll({ where: { role } });
    },

    async getActiveUsers() {
        return await User.findAll({ where: { isActive: true } });
    },

    async getUsersByName(name: string) {
        return await User.findAll({
            where: {
                [Op.or]: [
                    {
                        firstName: {
                            [Op.like]: `%${name}%`,
                        },
                    },
                    {
                        lastName: {
                            [Op.like]: `%${name}%`,
                        },
                    },
                ],
            },
        });
    },

    async updateUser(id: number, input: UpdateUserInput) {
        if (input.password) {
            input.password = await bcrypt.hash(input.password, SALT_ROUNDS);
        }
        await User.update(input, { where: { id } });
        return await User.findByPk(id);
    },

    async deleteUser(id: number) {
        await User.destroy({ where: { id } });
        return true;
    },

    async loginUser({
        email,
        phoneNumber,
        password,
    }: {
        email?: string;
        phoneNumber?: string;
        password: string;
    }) {
        if (!email && !phoneNumber) {
            throw new ApolloError(
                "Either email must be provided."
            );
        }

        let user = null;

        if (phoneNumber) {
            user = await User.findOne({ where: { phoneNumber } });
        }
        if (email) {
            user = await User.findOne({ where: { email } });
        }

        if (!user) {
            throw new ApolloError("User not found.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApolloError("Invalid credentials.");
        }

        const { accessToken, refreshToken } = createTokens(user.id, user.role);

        await RefreshToken.create({
            userId: user.id,
            token: refreshToken,
        });

        return {
            success: true,
            message: "Login successful.",
            accessToken,
            refreshToken,
            user,
        };
    },

    async registerUser(input: CreateUserInput) {
        const { email, phoneNumber, password, firstName, lastName, role } =
            input;

        if (!email && !phoneNumber) {
            throw new ApolloError(
                "Either email must be provided."
            );
        }

        let existingUser = null;

        if (phoneNumber) {
            existingUser = await User.findOne({
                where: { phoneNumber },
            });
        }

        if (email) {
            existingUser = await User.findOne({ where: { email } });
        }

        if (existingUser) {
            throw new ApolloError(
                "User with this email already exists."
            );
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = await User.create({
            firstName,
            lastName,
            email: email?.toLowerCase(),
            phoneNumber,
            password: hashedPassword,
            role: role || UserRole.USER,
            isActive: false,
        });

        if (!newUser) {
            throw new ApolloError("Failed to create user.");
        }

        return {
            success: true,
            message: "User registered successfully.",
            user: newUser,
        };
    },

    async refreshUserToken(refreshToken: string) {
        const decoded = jwt.verify(
            refreshToken,
            REFRESH_TOKEN_SECRET
        ) as JwtPayload & { id: number };
        if (!decoded.id) {
            throw new ApolloError("Invalid refresh token.");
        }

        const storedToken = await RefreshToken.findOne({
            where: { userId: decoded.id, token: refreshToken },
        });
        if (!storedToken) {
            throw new ApolloError("Invalid or expired refresh token.");
        }

        const user = await User.findByPk(decoded.id);
        if (!user) {
            throw new ApolloError("User not found.");
        }

        const { accessToken, refreshToken: newRefreshToken } = createTokens(
            user.id,
            user.role
        );

        await storedToken.update({ token: newRefreshToken });

        return {
            success: true,
            message: "Tokens refreshed successfully.",
            accessToken,
            refreshToken: newRefreshToken,
            user,
        };
    },

    async getLogoutResponse() {
        return ({
            success: true,
            message: "User logged out successfully.",
        })
    },
    async verification(user: User): Promise<void> {
        const { id, email } = user;
        sendVerificationEmail(id, email!)
    },
    async verifyEmail(token: string): Promise<LoginResponse> {
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload & {
            userId: number;
        };

        if (!decoded.userId) {
            throw new ApolloError("Invalid token");
        }

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            throw new ApolloError("User not found");
        }

        if (user.isActive) {
            throw new ApolloError("User already verified");
        }

        await user.update({ isActive: true });

        
        const { accessToken, refreshToken } = createTokens(user.id, user.role);
        
        return ({
            success: true,
            message: "Email verification successful.",
            accessToken,
            refreshToken,
            user
        })
    },
};

export default userService;
