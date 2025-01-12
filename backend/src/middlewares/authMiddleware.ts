import { ApolloError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Authentication and permission checking middleware
const authMiddleware = async (
    resolve: (parent: any, args: any, context: any, info: any) => any,
    parent: any, args: any, context: any, info: any
) => {
    // Logging request IP (you can add more logging information if needed)
    // console.log("Request from IP:", context.req.ip);

    // Authentication check - validate the JWT token from the request headers
    const token = context.req.headers.authorization || '';
    if (!token) {
        throw new ApolloError("Authentication token is required.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number, role: string };
        if (!decoded) {
            throw new ApolloError("Invalid or expired token.");
        }

        // Attach user information to the context (e.g., user id and role)
        context.user = decoded;

    } catch (error) {
        throw new ApolloError("Invalid or expired token.");
    }

    // Proceed to the resolver if authentication and permission checks pass
    return resolve(parent, args, context, info);
};

export { authMiddleware };
