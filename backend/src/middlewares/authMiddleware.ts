import express from 'express';
import { ApolloError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

function decodToken(token: string) {
  const decoded = jwt.verify(token, JWT_SECRET!) as {
    id: number;
    role: string;
  };

  if (!decoded) throw new ApolloError('Invalid or expired token.');

  return decoded;
}

// Authentication and permission checking middleware
const authMiddleware = async (
  resolve: (parent: any, args: any, context: any, info: any) => any,
  parent: any,
  args: any,
  context: any,
  info: any,
) => {
  // Logging request IP (you can add more logging information if needed)
  // console.log("Request from IP:", context.req.ip);

  // Authentication check - validate the JWT token from the request headers
  const token = context.req.headers.authorization || '';
  if (!token) {
    throw new ApolloError('Authentication token is required.');
  }

  try {
    // Attach user information to the context (e.g., user id and role)
    context.user = decodToken(token);
  } catch (error) {
    throw new ApolloError('Invalid or expired token.');
  }

  // Proceed to the resolver if authentication and permission checks pass
  return resolve(parent, args, context, info);
};

const authMiddlewareExpress = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const token = req.headers.authorization || '';
  if (!token) {
    return res.status(401).json({ error: 'Authentication token is required.' });
  }

  try {
    // @ts-ignore
    req.user = decodToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

export { authMiddleware, authMiddlewareExpress };
