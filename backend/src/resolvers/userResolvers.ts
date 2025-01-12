import { Op } from "sequelize";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { UserRole } from "../models/User";
import User from "../models/User";
import { UserResponse } from "../utils/types";
import { LoginResponse } from "../utils/types/auth";
import RefreshToken from "../models/RefreshToken";
import { authMiddleware } from "../middlewares/authMiddleware";

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

const createTokens = (userId: number, role: UserRole) => {
    const accessToken = jwt.sign({ id: userId, role }, SECRET_KEY, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: userId, role }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
    return { accessToken, refreshToken };
};

const resolvers = {
    Query: {
        users: async (parent: any, args: any, context: any, info: any) => {
            return await authMiddleware(
                (_parent: any, _args: any, _context: any, _info: any) => {
                    return User.findAll();
                },
                parent, args, context, info
            );
        },

        user: async (parent: any, { id }: { id: number }, context: any, info: any) => {
            return await authMiddleware(
                (_parent: any, _args: any, _context: any, _info: any) => {
                    return User.findByPk(id);
                },
                parent, { id }, context, info
            );
        },

        usersByRole: async (parent: any, { role }: { role: UserRole }, context: any, info: any) => {
            return await authMiddleware(
                (_parent: any, _args: any, _context: any, _info: any) => {
                    return User.findAll({ where: { role } });
                },
                parent, { role }, context, info
            );
        },

        activeUsers: async (parent: any, args: any, context: any, info: any) => {
            return await authMiddleware(
                (_parent: any, _args: any, _context: any, _info: any) => {
                    return User.findAll({ where: { isActive: true } });
                },
                parent, args, context, info
            );
        },

        usersByName: async (parent: any, { name }: { name: string }, context: any, info: any) => {
            return await authMiddleware(
                (_parent: any, _args: any, _context: any, _info: any) => {
                    return User.findAll({
                        where: {
                            [Op.or]: [
                                { firstName: { [Op.like]: `%${name}%` } },
                                { lastName: { [Op.like]: `%${name}%` } },
                            ],
                        },
                    });
                },
                parent, { name }, context, info
            );
        },
    },

    Mutation: {
        update: async (parent: any, { id, input }: { id: number; input: UpdateUserInput }, context: any, info: any) => {
            return await authMiddleware(
                async (_parent: any, _args: any, _context: any, _info: any) => {
                    await User.update(input, { where: { id } });
                    return await User.findByPk(id);
                },
                parent, { id, input }, context, info
            );
        },

        delete: async (parent: any, { id }: { id: number }, context: any, info: any) => {
            return await authMiddleware(
                async (_parent: any, _args: any, _context: any, _info: any) => {
                    await User.destroy({ where: { id } });
                    return true;
                },
                parent, { id }, context, info
            );
        },

        login: async (_: unknown, input: { email?: string; phoneNumber?: string; password: string }): Promise<LoginResponse> => {
            const { email, phoneNumber, password } = input;
            try {
                if (!email && !phoneNumber) {
                    throw new ApolloError("Either email or phone number must be provided.");
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
            } catch (error: any) {
                throw new ApolloError(error.message || "An unexpected error occurred during login.");
            }
        },

        register: async (_: unknown, { input }: { input: CreateUserInput }): Promise<UserResponse> => {
            const { email, phoneNumber, password, firstName, lastName, role } = input;

            try {
                if (!email && !phoneNumber) {
                    throw new ApolloError("Either email or phone number must be provided.");
                }

                let existingUser = null;

                if (phoneNumber) {
                    existingUser = await User.findOne({ where: { phoneNumber } });
                }

                if (email) {
                    existingUser = await User.findOne({ where: { email } });
                }

                if (existingUser) {
                    throw new ApolloError("User with this email or phone number already exists.");
                }

                const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
                const newUser = await User.create({
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    password: hashedPassword,
                    role: role || UserRole.USER,
                    isActive: true,
                });

                if (!newUser) {
                    throw new ApolloError("Failed to create user.");
                }

                return {
                    success: true,
                    message: "User registered successfully.",
                    user: newUser,
                };
            } catch (error: any) {
                throw new ApolloError(error.message || "An unexpected error occurred.");
            }
        },

        refreshToken: async (parent: any, { refreshToken }: { refreshToken: string }, context: any, info: any) => {
            return await authMiddleware(
                async (_parent: any, _args: any, _context: any, _info: any) => {
                    try {
                        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtPayload & { id: number };
                        if (!decoded.id) {
                            throw new ApolloError("Invalid refresh token.");
                        }

                        const storedToken = await RefreshToken.findOne({ where: { userId: decoded.id, token: refreshToken } });
                        if (!storedToken) {
                            throw new ApolloError("Invalid or expired refresh token.");
                        }

                        const user = await User.findByPk(decoded.id);
                        if (!user) {
                            throw new ApolloError("User not found.");
                        }

                        const { accessToken, refreshToken: newRefreshToken } = createTokens(user.id, user.role);

                        await storedToken.update({ token: newRefreshToken });

                        return {
                            success: true,
                            message: "Tokens refreshed successfully.",
                            accessToken,
                            refreshToken: newRefreshToken,
                            user,
                        };
                    } catch (error: any) {
                        console.error("Error during token refresh:", error);
                        throw new ApolloError(error.message || "An unexpected error occurred while refreshing tokens.");
                    }
                },
                parent, { refreshToken }, context, info
            );
        },

        logout: async (parent: any, args: any, context: any, info: any) => {
            return await authMiddleware(
                async (_parent: any, _args: any, _context: any, _info: any) => {
                    return {
                        success: true,
                        message: "User logged out successfully.",
                    };
                },
                parent, args, context, info
            );
        },
    },
};

export default resolvers;
