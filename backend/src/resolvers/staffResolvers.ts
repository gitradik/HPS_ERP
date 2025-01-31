import { UserRole } from '../models/User';
import Staff from '../models/Staff';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import staffService, { CreateStaffInput, UpdateStaffInput } from '../services/api/staffApiService';
import { GetAllQueryParams } from '../utils/types/query';

const staffResolvers = {
  Query: {
    staffs: async (parent: any, args: { queryParams: GetAllQueryParams<Staff> }, context: any, info: any): Promise<{ items: Staff[], totalCount: number }> =>
      await authMiddleware(
      (_parent: any, _args: any, _context: any, _info: any) =>
        roleMiddleware(
          [UserRole.SUPER_ADMIN, UserRole.ADMIN],
          async () => {
            const { queryParams } = args;
            const staffs = await staffService.getStaffs(queryParams);
            const totalCount = await staffService.getStaffsCount(queryParams.filters);
            return { items: staffs, totalCount };
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
    staff: async (
      parent: any,
      { id }: { id: number },
      context: any,
      info: any,
    ): Promise<Staff | null> =>
      await authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            () => staffService.getStaffById(id),
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
    createStaff: async (
      parent: any,
      { input }: { input: CreateStaffInput },
      context: any,
      info: any,
    ): Promise<Staff> =>
      await authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            () => staffService.createStaff(input),
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
    updateStaff: async (
      parent: any,
      { id, input }: { id: number; input: UpdateStaffInput },
      context: any,
      info: any,
    ): Promise<Staff> =>
      await authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            () => staffService.updateStaff(id, input),
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

export default staffResolvers;
