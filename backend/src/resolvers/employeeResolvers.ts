import { UserRole } from "../models/User";
import Employee from "../models/Employee";
import User from "../models/User";

const employeeResolvers = {
  Query: {
    employees: async (): Promise<Employee[]> => await Employee.findAll(),
    employee: async (_: unknown, { id }: { id: number }): Promise<Employee | null> => await Employee.findByPk(id),
    activeEmployees: async (): Promise<Employee[]> => await Employee.findAll({ where: { isActive: true }, include: User }),
    employeeByUserId: async (_: unknown, { userId }: { userId: number }): Promise<Employee | null> => {
      return await Employee.findOne({ where: { userId } });
    },
  },
  Mutation: {
    createEmployee: async (_: unknown, { userId }: { userId: number; }): Promise<Employee> => {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }

      await user.update({ role: UserRole.EMPLOYEE });
    
      return await Employee.create({ userId });
    },
    

    deleteEmployee: async (_: unknown, { id }: { id: number }): Promise<boolean> => {
      const employee = await Employee.findByPk(id);
      if (!employee) {
        throw new Error(`Employee with id ${id} not found`);
      }

      await employee.destroy();
      const user = await User.findByPk(employee.userId);
      if (user) {
        await user.destroy();
      }

      return true;
    },
  },
};

export default employeeResolvers;
