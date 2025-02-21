import { ApolloError } from 'apollo-server-express';
import ScheduleOvertime, { OvertimeType } from '../../models/ScheduleOvertime';
import Schedule from '../../models/Schedule';
import { updateExistingFields } from '../../utils/updateExistingFields';
import { ConflictingScheduleOvertimeError } from '../../errors/schedule/ConflictingScheduleOvertimeError';
import moment from 'moment';

export interface CreateScheduleOvertimeInput {
  scheduleId: number;
  date: Date;
  hours: number;
  type: OvertimeType;
}

export interface UpdateScheduleOvertimeInput {
  id: number;
  date: Date;
  hours: number;
  type: OvertimeType;
}

const scheduleOvertimeService = {
  async getScheduleOvertimes() {
    return await ScheduleOvertime.findAll({
      include: [{ model: Schedule, required: true, as: 'schedule' }],
    });
  },

  async getScheduleOvertimeById(id: number): Promise<ScheduleOvertime | null> {
    const overtime = await ScheduleOvertime.findByPk(id, {
      include: [{ model: Schedule, required: true, as: 'schedule' }],
    });

    if (!overtime) {
      throw new ApolloError(`ScheduleOvertime mit der ID ${id} wurde nicht gefunden`);
    }

    return overtime;
  },

  async getScheduleOvertimesByScheduleId(scheduleId: number): Promise<ScheduleOvertime[]> {
    return await ScheduleOvertime.findAll({
      where: { scheduleId },
      include: [{ model: Schedule, required: true, as: 'schedule' }],
    });
  },

  async createScheduleOvertime(input: CreateScheduleOvertimeInput): Promise<ScheduleOvertime> {
    const { scheduleId, date, hours, type } = input;

    const schedule = await Schedule.findByPk(scheduleId);
    if (!schedule) {
      throw new ApolloError(`Schedule mit der ID ${scheduleId} wurde nicht gefunden`);
    }

    const existingOvertime = await ScheduleOvertime.findOne({
      where: { scheduleId, date },
    });

    if (existingOvertime) {
      throw new ApolloError(
        `Für den angegebenen Zeitplan existiert bereits ein Overtime-Eintrag am ${moment(date).format('DD MMM YYYY')}`,
        'DUPLICATE_SCHEDULE_OVERTIME',
      );
    }

    ConflictingScheduleOvertimeError(schedule, date, hours, type);

    const overtime = await ScheduleOvertime.create({ ...input });
    await overtime.reload({
      include: [
        {
          model: Schedule,
          required: true,
          as: 'schedule',
        },
      ],
    });

    return overtime;
  },

  async updateScheduleOvertime(input: UpdateScheduleOvertimeInput): Promise<ScheduleOvertime> {
    const { id, date, hours, type } = input;

    const overtime = await ScheduleOvertime.findByPk(id, {
      include: [{ model: Schedule, required: true, as: 'schedule' }],
    });
    if (!overtime) {
      throw new ApolloError(`ScheduleOvertime mit der ID ${id} wurde nicht gefunden`);
    }

    ConflictingScheduleOvertimeError(overtime.schedule!, date, hours, type);

    return await updateExistingFields<ScheduleOvertime>(overtime, input).save();
  },

  async deleteScheduleOvertime(id: number): Promise<boolean> {
    const overtime = await ScheduleOvertime.findByPk(id);
    if (!overtime) {
      throw new ApolloError(`ScheduleOvertime mit der ID ${id} wurde nicht gefunden`);
    }

    await overtime.destroy();
    return true;
  },
};

export default scheduleOvertimeService;
