import { ApolloError } from "apollo-server-express";
import Employee from "../../models/Employee";
import jwt from "jsonwebtoken";
import User, { UserRole } from "../../models/User";
import dotenv from "dotenv";
import { sendEmail } from "../mailService";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET!;

// Функция для генерации URL с токеном
export const generateUrlWithToken = (userId: number) => {
    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
    return `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;
};

// Универсальная функция для отправки email с токеном
const sendVerificationEmail = (user: User) => {
    const tokenUrl = generateUrlWithToken(user.id);
    // Вызов sendEmail с параметрами для отправки email
    sendEmail(user.email!, 'Verify your account', `Click the link to verify your account: ${tokenUrl}`);
};

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
        
        if (newEmployee) {
            const reloadNewEmployee = await newEmployee.reload({ include: { model: User, as: 'user' } });
            // sendVerificationEmail(user);
            return reloadNewEmployee;
        }
        
        throw new ApolloError('Employee creation failed');
    },
}

export default employeeService;
