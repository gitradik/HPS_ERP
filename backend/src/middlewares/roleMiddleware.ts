import { ApolloError } from "apollo-server-express";
import { UserRole } from "../models/User";

// Middleware для проверки роли пользователя
const roleMiddleware = (
    requiredRoles: UserRole[],
    resolve: (parent: any, args: any, context: any, info: any) => any,
    parent: any,
    args: any,
    context: any,
    info: any
) => {
    const user = context.user; // context.user (from authMiddleware)

    if (!user) {
        throw new ApolloError("Authentication required.");
    }

    // Проверяем, что роль пользователя входит в разрешенные
    if (!requiredRoles.includes(user.role)) {
        throw new ApolloError("You do not have permission to access this resource.");
    }

    // Если роль соответствует, передаем выполнение запроса дальше
    return resolve(parent, args, context, info);
};

export { roleMiddleware };
