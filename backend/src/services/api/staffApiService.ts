import { ApolloError } from 'apollo-server-express';
import Staff from '../../models/Staff';
import User, { UserRole } from '../../models/User';
import { updateExistingFields } from '../../utils/updateExistingFields';
import userApiService from './userApiService';

export interface CreateStaffInput {
  userId: number;
}
export interface UpdateStaffInput extends Partial<CreateStaffInput> {
  isAssigned: boolean;
}

const staffService = {
  async getStaffs() {
    return await Staff.findAll({
      include: {
        model: User,
        required: true,
        as: 'user',
      },
    });
  },
  async getStaffById(id: number): Promise<Staff | null> {
    const staff = await Staff.findByPk(id, {
      include: {
        model: User,
        required: true,
        as: 'user',
      },
    });

    if (!staff) {
      throw new ApolloError(`Staff mit der ID ${id} wurde nicht gefunden`);
    }

    return staff;
  },

  async createStaff(input: CreateStaffInput): Promise<Staff> {
    const { userId } = input;
    const user = await User.findByPk(userId);

    if (!user) {
      throw new ApolloError(`Benutzer mit der ID ${userId} wurde nicht gefunden`);
    }

    if (user.role !== UserRole.USER) {
      throw new ApolloError(`Benutzer mit der ID ${userId} hat bereits eine andere Rolle`);
    }

    const newStaff = await Staff.create({ userId });
    await user.update({ role: UserRole.STAFF });

    await newStaff.reload({ include: { model: User, as: 'user' } });

    await userApiService.verification(user);

    return newStaff;
  },

  async updateStaff(id: number, input: UpdateStaffInput): Promise<Staff> {
    const staff = await Staff.findOne({
      where: { id },
      include: {
        model: User,
        required: true,
        as: 'user',
      },
    });

    if (!staff) {
      throw new ApolloError(`Staff mit der ID ${id} wurde nicht gefunden`);
    }

    return await updateExistingFields<Staff>(staff, input).save();
  },
};

export default staffService;
