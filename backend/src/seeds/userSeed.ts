import bcrypt from 'bcrypt';
import User, { UserRole } from '../models/User';
import Employee from '../models/Employee';

export const userSeed = async () => {
  try {
    const user = await User.create({
      firstName: 'Hermann',
      lastName: 'Baun',
      email: 'info@info.com',
      password: await bcrypt.hash('admin', 10),
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      position: 'Geschäftsführung',
      contactDetails: 'Berlin, Deutschland - 10115',
    });

    const newEmployee = await Employee.create({ userId: user.id });
    await newEmployee.reload({ include: { model: User, as: 'user' } });

    console.log('Seed completed: User info@info.com created successfully', user.toJSON());
  } catch (error) {
    console.error('Error while seeding user:', error);
  }
};

export const userSeed2 = async () => {
  try {
    const user = await User.create({
      firstName: 'Ra',
      lastName: 'De',
      email: 'ra@de.com',
      password: await bcrypt.hash('admin', 10),
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    });

    console.log('Seed completed: User created successfully', user.toJSON());
  } catch (error) {
    console.error('Error while seeding user:', error);
  }
};
