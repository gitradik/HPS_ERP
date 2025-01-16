import { UserRole } from "../models/User";
import Employee from "../models/Employee";
import User from "../models/User";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import employeeService from "../services/api/employeeApiService";

const employeeResolvers = {
    Query: {
        employees: async (parent: any, args: any, context: any, info: any): Promise<Employee[]> => {
            return await authMiddleware(
                (_parent: any, _args: any, _context: any, _info: any) =>
                    roleMiddleware(
                        [UserRole.SUPER_ADMIN, UserRole.ADMIN],
                        () => employeeService.getEmployees(), 
                        parent,
                        args,
                        context,
                        info
                    ),
                parent,
                args,
                context,
                info
            );
        },
        employee: async (
            parent: any,
            { id }: { id: number },
            context: any,
            info: any
        ): Promise<Employee | null> => {
            return await authMiddleware(
                (parent: any, args: any, context: any, info: any) =>
                    roleMiddleware(
                        [UserRole.SUPER_ADMIN, UserRole.ADMIN], // Роли, которым разрешен доступ
                        () => employeeService.getEmployeeById(id), // Получаем сотрудника по id
                        parent,
                        { id },
                        context,
                        info
                    ),
                parent,
                { id },
                context,
                info
            );
        },
        activeEmployees: async (): Promise<Employee[]> =>
            await Employee.findAll({
                include: {
                    model: User,
                    where: { isActive: true },
                    required: true,
                    as: "user",
                },
            }),
        employeeByUserId: async (
            _: unknown,
            { userId }: { userId: number }
        ): Promise<Employee | null> => {
            return await Employee.findOne({ where: { userId } });
        },
    },
    Mutation: {
        createEmployee: async (
            parent: any,
            { input }: { input: { userId: number } },
            context: any,
            info: any
        ): Promise<Employee> => {
            return await authMiddleware(
                (_parent: any, _args: any, _context: any, _info: any) =>
                    roleMiddleware(
                        [UserRole.SUPER_ADMIN, UserRole.ADMIN], // Роли, которым разрешен доступ
                        () => employeeService.createEmployee(input.userId), // Вызов бизнес-логики для создания сотрудника
                        _parent,
                        { input },
                        _context,
                        _info
                    ),
                parent,
                { input },
                context,
                info
            );
        },
        
    },
};

export default employeeResolvers;
