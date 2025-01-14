import { UserRole } from "../models/User";
import { UserResponse } from "../utils/types";
import { LoginResponse } from "../utils/types/auth";
import { authMiddleware } from "../middlewares/authMiddleware";
import userService, {
    CreateUserInput,
    UpdateUserInput,
} from "../services/api/userApiService";

const resolvers = {
    Query: {
        users: async (parent: any, args: any, context: any, info: any) =>
            await authMiddleware(
                (_parent: any, _args: any, _context: any, _info: any) =>
                    userService.getUsers(),
                parent,
                args,
                context,
                info
            ),
        user: async (
            parent: any,
            { id }: { id: number },
            context: any,
            info: any
        ) =>
            await authMiddleware(
                (_parent: any, _args: any, _context: any, _info: any) =>
                    userService.getUserById(id),
                parent,
                { id },
                context,
                info
            ),
        usersByRole: async (
            parent: any,
            { role }: { role: UserRole },
            context: any,
            info: any
        ) =>
            await authMiddleware(
                (_parent: any, _args: any, _context: any, _info: any) =>
                    userService.getUsersByRole(role),
                parent,
                { role },
                context,
                info
            ),
        activeUsers: async (parent: any, args: any, context: any, info: any) =>
            await authMiddleware(
                (_parent: any, _args: any, _context: any, _info: any) =>
                    userService.getActiveUsers(),
                parent,
                args,
                context,
                info
            ),
        usersByName: async (
            parent: any,
            { name }: { name: string },
            context: any,
            info: any
        ) =>
            await authMiddleware(
                (_parent: any, _args: any, _context: any, _info: any) =>
                    userService.getUsersByName(name),
                parent,
                { name },
                context,
                info
            ),
    },

    Mutation: {
        update: async (
            parent: any,
            { id, input }: { id: number; input: UpdateUserInput },
            context: any,
            info: any
        ) =>
            await authMiddleware(
                async (_parent: any, _args: any, _context: any, _info: any) =>
                    userService.updateUser(id, input),
                parent,
                { id, input },
                context,
                info
            ),
        delete: async (
            parent: any,
            { id }: { id: number },
            context: any,
            info: any
        ) =>
            await authMiddleware(
                async (_parent: any, _args: any, _context: any, _info: any) =>
                    userService.deleteUser(id),
                parent,
                { id },
                context,
                info
            ),
        login: async (
            _: unknown,
            input: {
                email?: string;
                phoneNumber?: string;
                password: string;
            }
        ): Promise<LoginResponse> => await userService.loginUser(input),
        register: async (
            _: unknown,
            { input }: { input: CreateUserInput }
        ): Promise<UserResponse> => await userService.registerUser(input),
        refreshToken: async (
            parent: any,
            { refreshToken }: { refreshToken: string },
            context: any,
            info: any
        ) =>
            await authMiddleware(
                async (_parent: any, _args: any, _context: any, _info: any) =>
                    userService.refreshUserToken(refreshToken),
                parent,
                { refreshToken },
                context,
                info
            ),
        logout: async (parent: any, args: any, context: any, info: any) =>
            await authMiddleware(
                async (
                    _parent: any,
                    _args: any,
                    _context: any,
                    _info: any
                ) => userService.getLogoutResponse(),
                parent,
                args,
                context,
                info
            ),
    },
};

export default resolvers;
