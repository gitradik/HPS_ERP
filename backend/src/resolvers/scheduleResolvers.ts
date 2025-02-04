import { UserRole } from '../models/User';
import Schedule from '../models/Schedule';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import scheduleService, {
  CreateScheduleInput,
  UpdateScheduleInput,
} from '../services/api/scheduleApiService';

const scheduleResolvers = {
  Query: {
    schedules: async (parent: any, args: any, context: any, info: any): Promise<Schedule[]> =>
      authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
            () => scheduleService.getSchedules(),
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
    schedule: async (
      parent: any,
      { id }: { id: number },
      context: any,
      info: any,
    ): Promise<Schedule | null> =>
      authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
            () => scheduleService.getScheduleById(id),
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
    schedulesByStaffId: async (
      parent: any,
      { staffId }: { staffId: number },
      context: any,
      info: any,
    ): Promise<Schedule | null> =>
      authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
            () => scheduleService.getSchedulesByStaffId(_args.staffId),
            _parent,
            _args,
            _context,
            _info,
          ),
        parent,
        { staffId },
        context,
        info,
      ),
  },
  Mutation: {
    createSchedule: async (
      parent: any,
      { input }: { input: CreateScheduleInput },
      context: any,
      info: any,
    ): Promise<Schedule> =>
      authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            () => scheduleService.createSchedule(input),
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
    updateSchedule: async (
      parent: any,
      { input }: { input: UpdateScheduleInput },
      context: any,
      info: any,
    ): Promise<Schedule> =>
      authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            () => scheduleService.updateSchedule(input),
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
    deleteSchedule: async (
      parent: any,
      { id }: { id: number },
      context: any,
      info: any,
    ): Promise<boolean> =>
      authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            () => scheduleService.deleteSchedule(id),
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
};

export default scheduleResolvers;
