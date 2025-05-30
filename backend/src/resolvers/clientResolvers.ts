import { GraphQLJSON } from 'graphql-type-json';
import { UserRole } from '../models/User';
import Client from '../models/Client';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import clientService, {
  CreateClientInput,
  UpdateClientInput,
} from '../services/api/clientApiService';
import { GetAllQueryParams } from '../utils/types/query';

const clientResolvers = {
  JSON: GraphQLJSON,
  Query: {
    clients: async (
      parent: any,
      args: { queryParams: GetAllQueryParams<Client> },
      context: any,
      info: any,
    ): Promise<{ items: Client[]; totalCount: number }> =>
      authMiddleware(
        async (_parent: any, _args: typeof args, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            async () => {
              const { queryParams } = _args;
              const [items, totalCount] = await Promise.all([
                clientService.getClients(queryParams),
                clientService.getClientsCount(queryParams.filters),
              ]);
              return { items, totalCount };
            },
            _parent,
            _args,
            _context,
            _info,
          ),
        parent,
        args,
        context,
        info,
      ),
    client: async (
      parent: any,
      { id }: { id: number },
      context: any,
      info: any,
    ): Promise<Client | null> =>
      authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            () => clientService.getClientById(id),
            _parent,
            _args,
            _context,
            _info,
          ),
        parent,
        { id },
        context,
        info,
      ),
  },
  Mutation: {
    createClient: async (
      parent: any,
      { input }: { input: CreateClientInput },
      context: any,
      info: any,
    ): Promise<Client> =>
      authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            () => clientService.createClient(input),
            _parent,
            _args,
            _context,
            _info,
          ),
        parent,
        { input },
        context,
        info,
      ),
    updateClient: async (
      parent: any,
      { id, input }: { id: number; input: UpdateClientInput },
      context: any,
      info: any,
    ): Promise<Client> =>
      authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            () => clientService.updateClient(id, input),
            _parent,
            _args,
            _context,
            _info,
          ),
        parent,
        { id, input },
        context,
        info,
      ),
  },
};

export default clientResolvers;
