import { ApolloError } from 'apollo-server-express';
import { UserRole } from '../models/User';

const roleMiddleware = (
  requiredRoles: UserRole[],
  resolve: (parent: any, args: any, context: any, info: any) => any,
  parent: any,
  args: any,
  context: any,
  info: any,
) => {
  const user = context.user; // context.user (from authMiddleware)

  if (!user) {
    throw new ApolloError('Authentifizierung erforderlich.'); // "Authentication required."
  }

  if (!requiredRoles.includes(user.role)) {
    throw new ApolloError('Sie haben keine Berechtigung, auf diese Ressource zuzugreifen.'); // "You do not have permission to access this resource."
  }

  return resolve(parent, args, context, info);
};

export { roleMiddleware };
