import { ApolloError } from 'apollo-server-express';
import Employee from '../../models/Employee';
import User, { UserRole } from '../../models/User';
import userApiService from './userApiService';
import { GetAllQueryParams } from '../../utils/types/query';

export interface CreateEmployeeInput {
  userId: number;
}

const employeeService = {
  async getEmployees(queryOptions: GetAllQueryParams<Employee>): Promise<Employee[]> {
    const { filters, sortOptions, offset, limit } = queryOptions;

    return await Employee.findAll({
      include: {
        model: User,
        required: true,
        as: 'user',
      },
      where: filters,
      order: sortOptions,
      offset,
      limit,
    });
  },

  async getEmployeesCount(filters: any): Promise<number> {
    return await Employee.count({
      where: filters,
    });
  },

  async getEmployeeById(id: number): Promise<Employee | null> {
    return await Employee.findByPk(id, {
      include: {
        model: User,
        required: true,
        as: 'user',
      },
    });
  },
  async createEmployee(input: CreateEmployeeInput): Promise<Employee> {
    const { userId } = input;
    const user = await User.findByPk(userId);

    if (!user) {
      throw new ApolloError(`Benutzer mit der ID ${userId} wurde nicht gefunden`);
    }
    if (user.role !== UserRole.USER) {
      throw new ApolloError(`Benutzer mit der ID ${userId} hat bereits eine andere Rolle`);
    }

    const newEmployee = await Employee.create({ userId });
    await user.update({ role: UserRole.EMPLOYEE });

    await newEmployee.reload({ include: { model: User, as: 'user' } });

    await userApiService.verification(user);

    return newEmployee;
  },
};

export default employeeService;
