import { ApolloError } from 'apollo-server-express';
import Client from '../../models/Client';
import User, { UserRole } from '../../models/User';
import userApiService from './userApiService';
import { updateExistingFields } from '../../utils/updateExistingFields';

export interface CreateClientInput {
  userId: number;
}
export interface UpdateClientInput {
  companyName?: string;
  isWorking?: boolean;
}

const clientService = {
  async getClients(): Promise<Client[]> {
    return await Client.findAll({
      include: {
        model: User,
        where: { isActive: true },
        required: true,
        as: 'user',
      },
    });
  },

  async getClientById(id: number): Promise<Client | null> {
    return await Client.findByPk(id, {
      include: {
        model: User,
        where: { isActive: true },
        required: true,
        as: 'user',
      },
    });
  },

  async createClient(input: CreateClientInput): Promise<Client> {
    const { userId } = input;
    const user = await User.findByPk(userId);

    if (!user) {
      throw new ApolloError(`Benutzer mit der ID ${userId} wurde nicht gefunden`);
    }

    if (user.role !== UserRole.USER) {
      throw new ApolloError(`Benutzer mit der ID ${userId} hat bereits eine andere Rolle`);
    }

    const newClient = await Client.create({ userId });
    await user.update({ role: UserRole.CLIENT });

    await newClient.reload({ include: { model: User, as: 'user' } });

    await userApiService.verification(user);

    return newClient;
  },

  async updateClient(id: number, input: UpdateClientInput): Promise<Client> {
    const client = await Client.findOne({
      where: { id },
      include: {
        model: User,
        where: { isActive: true },
        required: true,
        as: 'user',
      },
    });

    if (!client) {
      throw new ApolloError(`Client mit der ID ${id} wurde nicht gefunden`);
    }

    return await updateExistingFields<Client>(client, input).save();
  },
};

export default clientService;
