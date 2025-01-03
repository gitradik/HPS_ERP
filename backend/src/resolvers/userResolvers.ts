import { Op } from "sequelize";
import { UserRole } from "../models/User";
import User from "../models/User";

export interface CreateUserInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: UserRole;
    isActive?: boolean;
    position?: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {}

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
    },
};

export default resolvers;
