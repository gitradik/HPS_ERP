import { Op } from 'sequelize';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ApolloError } from 'apollo-server-express';
import dotenv from 'dotenv';
import User from '../../models/User';
import RefreshToken from '../../models/RefreshToken';
import { UserRole } from '../../models/User';
import { sendEmail } from '../mailService';
import { LoginResponse } from '../../utils/types/auth';
import { updateExistingFields } from '../../utils/updateExistingFields';
import { GetAllQueryParams } from '../../utils/types/query';

dotenv.config();

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  role?: UserRole;
  isActive?: boolean;
  position?: string;
  contactDetails?: string;
  photo?: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {}

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.JWT_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;
const REFRESH_TOKEN_EXPIRATION = process.env.JWT_REFRESH_SECRET_EXPIRATION!;

// Функция для генерации URL с токеном
export const generateUrlWithToken = (userId: number) => {
  const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
  return `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;
};

// Универсальная функция для отправки email с токеном
export const sendVerificationEmail = (userId: number, email: string) => {
  const tokenUrl = generateUrlWithToken(userId);
  sendEmail(
    email,
    'HSP ERP – Bestätigung Ihres Kontos',
    `Willkommen bei HSP ERP!\n\nBitte bestätigen Sie Ihr Konto, indem Sie auf den folgenden Link klicken: ${tokenUrl}\n\nVielen Dank, dass Sie HSP ERP verwenden.`,
  );
};

const createTokens = (userId: number, role: UserRole) => {
  const accessToken = jwt.sign({ id: userId, role }, SECRET_KEY, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ id: userId, role }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
  return { accessToken, refreshToken };
};

const userService = {
  async getUsers(queryOptions: GetAllQueryParams<User>): Promise<User[]> {
    const { filters, sortOptions, offset, limit } = queryOptions;

    return await User.findAll({
      where: filters,
      order: sortOptions,
      offset,
      limit,
    });
  },
  async getUsersExcludingId(excludedId: number, queryOptions: GetAllQueryParams<User>) {
    const { filters, sortOptions, offset, limit } = queryOptions;

    return await User.findAll({
      where: {
        ...filters,
        id: {
          [Op.ne]: excludedId,
        },
      },
      order: sortOptions,
      offset,
      limit,
    });
  },

  async getUsersCount(filters: any): Promise<number> {
    return await User.count({
      where: filters,
    });
  },

  async getUserById(id: number) {
    return await User.findByPk(id);
  },

  async getUsersByRole(role: UserRole) {
    return await User.findAll({ where: { role } });
  },

  async getActiveUsers() {
    return await User.findAll({ where: { isActive: true } });
  },

  async getUsersByName(name: string) {
    return await User.findAll({
      where: {
        [Op.or]: [
          {
            firstName: {
              [Op.like]: `%${name}%`,
            },
          },
          {
            lastName: {
              [Op.like]: `%${name}%`,
            },
          },
        ],
      },
    });
  },

  async updateUser(id: number, input: UpdateUserInput) {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw new ApolloError(`User mit der ID ${id} wurde nicht gefunden`);
    }

    if (input.password) {
      input.password = await bcrypt.hash(input.password, SALT_ROUNDS);
    }

    return await updateExistingFields<User>(user!, input).save();
  },

  async deleteUser(id: number) {
    await User.destroy({ where: { id } });
    return true;
  },

  async loginUser({
    email,
    phoneNumber,
    password,
  }: {
    email?: string;
    phoneNumber?: string;
    password: string;
  }) {
    if (!email && !phoneNumber) {
      throw new ApolloError('Entweder eine E-Mail-Adresse muss angegeben werden.');
    }

    let user = null;

    if (phoneNumber) {
      user = await User.findOne({ where: { phoneNumber } });
    }
    if (email) {
      user = await User.findOne({ where: { email } });
    }

    if (!user) {
      throw new ApolloError('Benutzer nicht gefunden.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApolloError('Ungültige Anmeldedaten.');
    }

    const { accessToken, refreshToken } = createTokens(user.id, user.role);

    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
    });

    return {
      success: true,
      message: 'Anmeldung erfolgreich.',
      accessToken,
      refreshToken,
      user,
    };
  },

  async registerUser(input: CreateUserInput) {
    const { email, phoneNumber, password, firstName, lastName, role } = input;

    if (!email && !phoneNumber) {
      throw new ApolloError('Entweder eine E-Mail-Adresse muss angegeben werden.');
    }

    let existingUser = null;

    if (phoneNumber) {
      existingUser = await User.findOne({
        where: { phoneNumber },
      });
    }

    if (email) {
      existingUser = await User.findOne({ where: { email } });
    }

    if (existingUser) {
      throw new ApolloError('Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({
      firstName,
      lastName,
      email: email?.toLowerCase(),
      phoneNumber,
      password: hashedPassword,
      role: role || UserRole.USER,
      isActive: false,
    });

    if (!newUser) {
      throw new ApolloError('Benutzer konnte nicht erstellt werden.');
    }

    return {
      success: true,
      message: 'Benutzer erfolgreich registriert.',
      user: newUser,
    };
  },

  async refreshUserToken(refreshToken: string) {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtPayload & { id: number };
    if (!decoded.id) {
      throw new ApolloError('Ungültiges Refresh-Token.');
    }

    const storedToken = await RefreshToken.findOne({
      where: { userId: decoded.id, token: refreshToken },
    });
    if (!storedToken) {
      throw new ApolloError('Ungültiges oder abgelaufenes Refresh-Token.');
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new ApolloError('Benutzer nicht gefunden.');
    }

    const { accessToken, refreshToken: newRefreshToken } = createTokens(user.id, user.role);

    await storedToken.update({ token: newRefreshToken });

    return {
      success: true,
      message: 'Tokens erfolgreich aktualisiert.',
      accessToken,
      refreshToken: newRefreshToken,
      user,
    };
  },

  async getLogoutResponse() {
    return {
      success: true,
      message: 'Benutzer erfolgreich abgemeldet.',
    };
  },
  async verification(user: User): Promise<void> {
    const { id, email } = user;
    sendVerificationEmail(id, email!);
  },
  async verifyEmail(token: string): Promise<LoginResponse> {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload & {
      userId: number;
    };

    if (!decoded.userId) {
      throw new ApolloError('Ungültiges Token.');
    }

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      throw new ApolloError('Benutzer nicht gefunden.');
    }

    if (user.isActive) {
      throw new ApolloError('Benutzer wurde bereits verifiziert.');
    }

    await user.update({ isActive: true });

    const { accessToken, refreshToken } = createTokens(user.id, user.role);

    return {
      success: true,
      message: 'E-Mail-Verifizierung erfolgreich.',
      accessToken,
      refreshToken,
      user,
    };
  },
};

export default userService;
