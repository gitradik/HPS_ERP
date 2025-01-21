import { UserRole } from '../models/User';
import Employee from '../models/Employee';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import employeeService from '../services/api/employeeApiService';

const employeeResolvers = {
  Query: {
    employees: async (parent: any, args: any, context: any, info: any): Promise<Employee[]> =>
      await authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            () => employeeService.getEmployees(),
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
    employee: async (
      parent: any,
      { id }: { id: number },
      context: any,
      info: any,
    ): Promise<Employee | null> =>
      await authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN], // Роли, которым разрешен доступ
            () => employeeService.getEmployeeById(id), // Получаем сотрудника по id
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
    createEmployee: async (
      parent: any,
      { input }: { input: { userId: number } },
      context: any,
      info: any,
    ): Promise<Employee> =>
      await authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            () => employeeService.createEmployee(input),
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
  },
};

export default employeeResolvers;
