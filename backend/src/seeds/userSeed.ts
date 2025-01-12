import bcrypt from "bcrypt";
import User, { UserRole } from "../models/User";

export const userSeed = async () => {
    try {
        const user = await User.create({
            firstName: "Hermann",
            lastName: "Baun",
            email: "info@info.com",
            password: await bcrypt.hash("admin", 10), // Рекомендуется хешировать пароль перед сохранением
            role: UserRole.SUPER_ADMIN,
            isActive: true,
            position: "Geschäftsführung",
            contactDetails: "Berlin, Deutschland - 10115", // Если это поле есть в модели User
        });

        console.log("Seed completed: User created successfully", user.toJSON());
    } catch (error) {
        console.error("Error while seeding user:", error);
    }
};
