import { ApolloError } from "apollo-server-express";
import Employee from "../../models/Employee";
import User, { UserRole } from "../../models/User";
import userApiService from "./userApiService";


const employeeService = {
    async getEmployees(): Promise<Employee[]> {
        return await Employee.findAll({
            include: {
                model: User,
                where: { isActive: true },
                required: true,
                as: "user",
            },
        })
    },
    async getEmployeeById(id: number): Promise<Employee | null> {
        return await Employee.findByPk(id);
    },
    async createEmployee(userId: number): Promise<Employee> {
        const user = await User.findByPk(userId);
    
        if (!user) {
            throw new ApolloError(`User with id ${userId} not found`);
        }
        if (user.role !== UserRole.USER) {
            throw new ApolloError(`User with id ${userId} already has a different role`);
        }
    
        const newEmployee = await Employee.create({ userId });
        await user.update({ role: UserRole.EMPLOYEE });
    
        await newEmployee.reload({ include: { model: User, as: 'user' } });
    
        await userApiService.verification(user);
    
        return newEmployee;
    },
}

export default employeeService;
