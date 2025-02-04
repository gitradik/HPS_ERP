import { UserRole } from '../models/User';
import Staff from '../models/Staff';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import staffService, { CreateStaffInput, UpdateStaffInput } from '../services/api/staffApiService';
import { GetAllQueryParams } from '../utils/types/query';

const staffResolvers = {
  Query: {
    staffs: async (
      parent: any,
      args: { queryParams: GetAllQueryParams<Staff> },
      context: any,
      info: any,
    ): Promise<{ items: Staff[]; totalCount: number }> =>
      authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            async () => {
              const { queryParams } = _args;
              const [items, totalCount] = await Promise.all([
                staffService.getStaffs(queryParams),
                staffService.getStaffsCount(queryParams.filters),
              ]);
              return { items, totalCount };
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
      authMiddleware(
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
      authMiddleware(
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
      authMiddleware(
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
