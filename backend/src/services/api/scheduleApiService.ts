import { ApolloError } from 'apollo-server-express';
import { Op } from 'sequelize';
import Schedule from '../../models/Schedule';
import Staff from '../../models/Staff';
import Client from '../../models/Client';
import User from '../../models/User';
import { updateExistingFields } from '../../utils/updateExistingFields';
import { ConflictingScheduleStartEndError } from '../../errors/schedule/ConflictingScheduleError';

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

  async getSchedulesByStaffId(staffId: number): Promise<Schedule[]> {
    const schedules = await Schedule.findAll({
      where: { staffId },
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

    if (!schedules.length) {
      throw new ApolloError(`Keine Schedules für Personal mit der ID ${staffId} gefunden`);
    }

    return schedules;
  },

  async createSchedule(input: CreateScheduleInput): Promise<Schedule> {
    const { staffId, clientId, start, end } = input;

    const staff = await Staff.findByPk(staffId);
    if (!staff) {
      throw new ApolloError(`Personal mit der ID ${staffId} wurde nicht gefunden`);
    }

    const client = await Client.findByPk(clientId);
    if (!client) {
      throw new ApolloError(`Kunden mit der ID ${clientId} wurde nicht gefunden`);
    }

    const conflictingSchedules = await Schedule.findAll({
      where: {
        staffId,
        [Op.or]: [
          {
            start: { [Op.lt]: new Date(end) },
            end: { [Op.gt]: new Date(start) },
          },
        ],
      },
    });

    if (conflictingSchedules.length) {
      throw ConflictingScheduleStartEndError(conflictingSchedules, start, end);
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
    const { id, start, end } = input;

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

    if (start && end) {
      const conflictingSchedules = await Schedule.findAll({
        where: {
          staffId: schedule.staffId,
          id: { [Op.ne]: id },
          [Op.or]: [
            {
              start: { [Op.lt]: new Date(end) },
              end: { [Op.gt]: new Date(start) },
            },
          ],
        },
      });

      if (conflictingSchedules.length) {
        throw ConflictingScheduleStartEndError(conflictingSchedules, start, end);
      }
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

    if (staff)
      if ((await Schedule.count({ where: { staffId: staff.id } })) === 0)
        await staff.update({ isAssigned: false });

    if (client)
      if ((await Schedule.count({ where: { clientId: client.id } })) === 0)
        await client.update({ isWorking: false });

    return true;
  },
};

export default scheduleService;
