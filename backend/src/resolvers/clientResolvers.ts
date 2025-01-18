import { UserRole } from "../models/User";
import Client from "../models/Client";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import clientService from "../services/api/clientApiService";

const clientResolvers = {
    Query: {
        clients: async (parent: any, args: any, context: any, info: any): Promise<Client[]> => {
            return await authMiddleware(
                (_parent: any, _args: any, _context: any, _info: any) =>
                    roleMiddleware(
                        [UserRole.SUPER_ADMIN, UserRole.ADMIN],
                        () => clientService.getClients(),
                        parent,
                        args,
                        context,
                        info
                    ),
                parent,
                args,
                context,
                info
            );
        },
        client: async (
            parent: any,
            { id }: { id: number },
            context: any,
            info: any
        ): Promise<Client | null> => {
            return await authMiddleware(
                (parent: any, args: any, context: any, info: any) =>
                    roleMiddleware(
                        [UserRole.SUPER_ADMIN, UserRole.ADMIN],
                        () => clientService.getClientById(id),
                        parent,
                        { id },
                        context,
                        info
                    ),
                parent,
                { id },
                context,
                info
            );
        },
    },
    Mutation: {
        createClient: async (
            parent: any,
            { input }: { input: { userId: number } },
            context: any,
            info: any
        ): Promise<Client> => {
            return await authMiddleware(
                (_parent: any, _args: any, _context: any, _info: any) =>
                    roleMiddleware(
                        [UserRole.SUPER_ADMIN, UserRole.ADMIN],
                        () => clientService.createClient(input.userId),
                        _parent,
                        { input },
                        _context,
                        _info
                    ),
                parent,
                { input },
                context,
                info
            );
        },
    },
};

export default clientResolvers;
