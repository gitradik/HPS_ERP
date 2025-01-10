import { Op } from "sequelize";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import { UserRole } from "../models/User";
import User from "../models/User";
import { UserResponse } from "../utils/types";
import { LoginResponse } from "../utils/types/auth";
import RefreshToken from "../models/RefreshToken";

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
const SECRET_KEY = process.env.JWT_SECRET || "TXXS";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "TXXS_REFRESH";
const REFRESH_TOKEN_EXPIRATION = "7d"; // Реализация на 7 дней

const createTokens = (userId: number, role: UserRole) => {
    const accessToken = jwt.sign({ id: userId, role }, SECRET_KEY, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: userId, role }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
    return { accessToken, refreshToken };
};

const resolvers = {
    Query: {
        users: async (): Promise<User[]> => await User.findAll(),

        user: async (
            _: unknown,
            { id }: { id: number }
        ): Promise<User | null> => await User.findByPk(id),

        usersByRole: async (
            _: unknown,
            { role }: { role: UserRole }
        ): Promise<User[]> => await User.findAll({ where: { role } }),

        activeUsers: async (): Promise<User[]> =>
            await User.findAll({ where: { isActive: true } }),

        usersByName: async (
            _: unknown,
            { name }: { name: string }
        ): Promise<User[]> =>
            await User.findAll({
                where: {
                    [Op.or]: [
                        { firstName: { [Op.like]: `%${name}%` } },
                        { lastName: { [Op.like]: `%${name}%` } },
                    ],
                },
            }),
    },

    Mutation: {
        createUser: async (
            _: unknown,
            { input }: { input: CreateUserInput }
        ): Promise<User> => {
            const newUser = await User.create({
                ...input,
            });
            return newUser;
        },
        updateUser: async (
            _: unknown,
            { id, input }: { id: number; input: UpdateUserInput }
        ): Promise<User | null> => {
            await User.update(input, { where: { id } });
            return await User.findByPk(id);
        },
        deleteUser: async (
            _: unknown,
            { id }: { id: number }
        ): Promise<boolean> => {
            await User.destroy({ where: { id } });
            return true;
        },
        
        login: async (
            _: unknown,
            input: { email?: string; phoneNumber?: string; password: string }
        ): Promise<LoginResponse> => {
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
        
                // Создаем access и refresh токены
                const { accessToken, refreshToken } = createTokens(user.id, user.role);
        
                // Сохраняем рефреш-токен в базе данных
                await RefreshToken.create({
                    userId: user.id,
                    token: refreshToken,
                });
        
                return {
                    success: true,
                    message: "Login successful.",
                    accessToken,
                    refreshToken,
                };
            } catch (error: any) {
                throw new ApolloError(error.message || "An unexpected error occurred during login.");
            }
        },

        registerUser: async (
            _: unknown,
            { input }: { input: CreateUserInput }
        ): Promise<UserResponse> => {
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
                console.error("Error during user registration:", error);
                throw new ApolloError(error.message || "An unexpected error occurred.");
            }
        },

        refreshToken: async (_: unknown, { refreshToken }: { refreshToken: string }): Promise<LoginResponse> => {
            try {
                // Декодируем refresh token и явно указываем тип JwtPayload
                const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtPayload & { id: number };

                // Проверка наличия id в декодированном объекте
                if (!decoded.id) {
                    throw new ApolloError("Invalid refresh token.");
                }

                // Проверяем, существует ли рефреш-токен в базе данных
                const storedToken = await RefreshToken.findOne({ where: { userId: decoded.id, token: refreshToken } });
                if (!storedToken) {
                    throw new ApolloError("Invalid or expired refresh token.");
                }

                // Получаем пользователя по id из декодированного токена
                const user = await User.findByPk(decoded.id);
                if (!user) {
                    throw new ApolloError("User not found.");
                }

                // Функция для создания новых токенов
                const createTokens = (userId: number, role: string) => {
                    const accessToken = jwt.sign(
                        { id: userId, role },
                        SECRET_KEY || "TXXS",
                        { expiresIn: "15m" }
                    );
                    const newRefreshToken = jwt.sign(
                        { id: userId, role },
                        REFRESH_TOKEN_SECRET,
                        { expiresIn: "7d" }
                    );
                    return { accessToken, newRefreshToken };
                };

                // Создаем новые токены
                const { accessToken, newRefreshToken } = createTokens(user.id, user.role);

                // Обновляем рефреш-токен в базе данных
                await storedToken.update({ token: newRefreshToken });

                return {
                    success: true,
                    message: "Tokens refreshed successfully.",
                    accessToken,
                    refreshToken: newRefreshToken,
                };
            } catch (error: any) {
                console.error("Error during token refresh:", error);
                throw new ApolloError(error.message || "An unexpected error occurred while refreshing tokens.");
            }
        },
        
        logout: async (): Promise<boolean> => {
            // На серверной стороне это мутация может быть пустой.
            // Клиент должен просто удалить токен.
            return true;
        },

        
    },
};

export default resolvers;
