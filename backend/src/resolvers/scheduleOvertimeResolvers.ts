import { UserRole } from '../models/User';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import scheduleOvertimeService, {
  CreateScheduleOvertimeInput,
  UpdateScheduleOvertimeInput,
} from '../services/api/scheduleOvertimeApiService';

const scheduleOvertimeResolvers = {
  Query: {
    scheduleOvertimes: async (parent: any, args: any, context: any, info: any) =>
      authMiddleware(
        (_parent, _args, _context, _info) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
            () => scheduleOvertimeService.getScheduleOvertimes(),
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
    scheduleOvertime: async (parent: any, { id }: { id: number }, context: any, info: any) =>
      authMiddleware(
        (_parent, _args, _context, _info) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
            () => scheduleOvertimeService.getScheduleOvertimeById(id),
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
    scheduleOvertimesByScheduleId: async (
      parent: any,
      { scheduleId }: { scheduleId: number },
      context: any,
      info: any,
    ) =>
      authMiddleware(
        (_parent, _args, _context, _info) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
            () => scheduleOvertimeService.getScheduleOvertimesByScheduleId(scheduleId),
            _parent,
            _args,
            _context,
            _info,
          ),
        parent,
        { scheduleId },
        context,
        info,
      ),
  },
  Mutation: {
    createScheduleOvertime: async (
      parent: any,
      { input }: { input: CreateScheduleOvertimeInput },
      context: any,
      info: any,
    ) =>
      authMiddleware(
        (_parent, _args, _context, _info) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            () => scheduleOvertimeService.createScheduleOvertime(input),
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
    updateScheduleOvertime: async (
      parent: any,
      { input }: { input: UpdateScheduleOvertimeInput },
      context: any,
      info: any,
    ) =>
      authMiddleware(
        (_parent, _args, _context, _info) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            () => scheduleOvertimeService.updateScheduleOvertime(input),
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
    deleteScheduleOvertime: async (parent: any, { id }: { id: number }, context: any, info: any) =>
      authMiddleware(
        (_parent, _args, _context, _info) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            () => scheduleOvertimeService.deleteScheduleOvertime(id),
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

export default scheduleOvertimeResolvers;
