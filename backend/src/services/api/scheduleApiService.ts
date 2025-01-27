import { ApolloError } from 'apollo-server-express';
import Schedule from '../../models/Schedule';
import Staff from '../../models/Staff';
import Client from '../../models/Client';
import { updateExistingFields } from '../../utils/updateExistingFields';
import User from '../../models/User';

export interface CreateScheduleInput {
  title: string;
  allDay: boolean;
  start: string;
  end: string;
  color?: string;
  staffId: number;
  clientId: number;
}

export interface UpdateScheduleInput {
  id: number;
  title?: string;
  allDay?: boolean;
  start?: string;
  end?: string;
  color?: string;
}

const scheduleService = {
  async getSchedules() {
    return await Schedule.findAll({
      include: [
        {
          model: Staff,
          required: true,
          as: 'staff',
          include: [
            {
              model: User,
              required: true,
              as: 'user',
            },
          ],
        },
        {
          model: Client,
          required: true,
          as: 'client',
          include: [
            {
              model: User,
              required: true,
              as: 'user',
            },
          ],
        },
      ],
    });
  },
  async getScheduleById(id: number): Promise<Schedule | null> {
    const schedule = await Schedule.findByPk(id, {
      include: [
        {
          model: Staff,
          required: true,
          as: 'staff',
          include: [
            {
              model: User,
              required: true,
              as: 'user',
            },
          ],
        },
        {
          model: Client,
          required: true,
          as: 'client',
          include: [
            {
              model: User,
              required: true,
              as: 'user',
            },
          ],
        },
      ],
    });

    if (!schedule) {
      throw new ApolloError(`Schedule mit der ID ${id} wurde nicht gefunden`);
    }

    return schedule;
  },

  async createSchedule(input: CreateScheduleInput): Promise<Schedule> {
    const { staffId, clientId } = input;

    const staff = await Staff.findByPk(staffId);
    if (!staff) {
      throw new ApolloError(`Staff mit der ID ${staffId} wurde nicht gefunden`);
    }

    const client = await Client.findByPk(clientId);
    if (!client) {
      throw new ApolloError(`Client mit der ID ${clientId} wurde nicht gefunden`);
    }

    const newSchedule = await Schedule.create({
      ...input,
      staffId,
      clientId,
    });

    await staff.update({ isAssigned: true });
    await client.update({ isWorking: true });

    await newSchedule.reload({
      include: [
        {
          model: Staff,
          required: true,
          as: 'staff',
          include: [
            {
              model: User,
              required: true,
              as: 'user',
            },
          ],
        },
        {
          model: Client,
          required: true,
          as: 'client',
          include: [
            {
              model: User,
              required: true,
              as: 'user',
            },
          ],
        },
      ],
    });

    return newSchedule;
  },

  async updateSchedule(input: UpdateScheduleInput): Promise<Schedule> {
    const schedule = await Schedule.findByPk(input.id, {
      include: [
        {
          model: Staff,
          required: true,
          as: 'staff',
          include: [
            {
              model: User,
              required: true,
              as: 'user',
            },
          ],
        },
        {
          model: Client,
          required: true,
          as: 'client',
          include: [
            {
              model: User,
              required: true,
              as: 'user',
            },
          ],
        },
      ],
    });

    if (!schedule) {
      throw new ApolloError(`Schedule mit der ID ${input.id} wurde nicht gefunden`);
    }

    return await updateExistingFields<Schedule>(schedule, input).save();
  },

  async deleteSchedule(id: number): Promise<boolean> {
    const schedule = await Schedule.findByPk(id, {
      include: [
        {
          model: Staff,
          required: true,
          as: 'staff',
        },
        {
          model: Client,
          required: true,
          as: 'client',
        },
      ],
    });

    if (!schedule) {
      throw new ApolloError(`Schedule mit der ID ${id} wurde nicht gefunden`);
    }

    const { staff, client } = schedule;

    await schedule.destroy();

    if (staff) {
      await staff.update({ isAssigned: false });
    }

    if (client) {
      await client.update({ isWorking: false });
    }

    return true;
  },
};

export default scheduleService;
