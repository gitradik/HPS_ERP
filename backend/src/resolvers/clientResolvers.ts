import { UserRole } from "../models/User";
import Client from "../models/Client";
import User from "../models/User";
import Employee from "../models/Employee";

const clientResolvers = {
    Query: {
        clients: async (): Promise<Client[]> => await Client.findAll(),
        client: async (
            _: unknown,
            { id }: { id: number }
        ): Promise<Client | null> => await Client.findByPk(id),
        activeClients: async (): Promise<Client[]> =>
            await Client.findAll({ where: { isActive: true }, include: User }),
        clientByUserId: async (
            _: unknown,
            { userId }: { userId: number }
        ): Promise<Client | null> =>
            await Client.findOne({ where: { userId } }),
    },
    Mutation: {
        createClient: async (
            _: unknown,
            { input }: { input: { userId: number } }
        ): Promise<Client> => {
            const { userId } = input;

            const user = await User.findByPk(userId);

            if (!user) {
                throw new Error(`User with id ${userId} not found`);
            }

            if (user.role !== UserRole.USER) {
                throw new Error(
                    `User with id ${userId} already has a different role`
                );
            }

            const newClient = await Client.create({ userId });

            await user.update({ role: UserRole.CLIENT });

            return newClient;
        },

        deleteClient: async (
            _: unknown,
            { id }: { id: number }
        ): Promise<boolean> => {
            const client = await Client.findByPk(id);
            if (!client) {
                throw new Error(`Client with id ${id} not found`);
            }

            await client.destroy();
            const user = await User.findByPk(client.userId);
            if (user) {
                await user.destroy();
            }

            return true;
        },
    },
};

export default clientResolvers;
