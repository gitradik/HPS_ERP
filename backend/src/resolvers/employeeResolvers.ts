import GraphQLJSON from 'graphql-type-json';
import { UserRole } from '../models/User';
import Employee from '../models/Employee';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import employeeService from '../services/api/employeeApiService';
import { GetAllQueryParams } from '../utils/types/query';

const employeeResolvers = {
  JSON: GraphQLJSON,
  Query: {
    employees: async (
      parent: any,
      args: { queryParams: GetAllQueryParams<Employee> },
      context: any,
      info: any,
    ): Promise<{ items: Employee[]; totalCount: number }> =>
      authMiddleware(
        (_parent: any, _args: any, _context: any, _info: any) =>
          roleMiddleware(
            [UserRole.SUPER_ADMIN, UserRole.ADMIN],
            async () => {
              const { queryParams } = _args;
              const [items, totalCount] = await Promise.all([
                employeeService.getEmployees(queryParams),
                employeeService.getEmployeesCount(queryParams.filters),
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
    employee: async (
      parent: any,
      { id }: { id: number },
      context: any,
      info: any,
    ): Promise<Employee | null> =>
      authMiddleware(
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
      authMiddleware(
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
