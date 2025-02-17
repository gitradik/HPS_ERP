import { UserRole } from 'src/types/user/user';

export type RolesWithAccess = {
  [field: string]: UserRole[];
};

// Функция для создания настроек доступа
export const useRolesAccess = (rolesWithAccess: RolesWithAccess, userRole?: UserRole) => {
  // Метод для проверки, имеет ли роль доступ к конкретному полю
  const hasAccess = (field: string) => {
    const allowedRoles = rolesWithAccess[field];
    if (!userRole) return false;
    return allowedRoles ? allowedRoles.includes(userRole) : false;
  };

  // Возвращаем объект с методами проверки доступа
  return {
    hasAccess,
  };
};

// Пример объекта настроек ролей с доступом
// const rolesWithAccess: RolesWithAccess = {
//     firstName: [UserRole.ADMIN, UserRole.MANAGER],
//     lastName: [UserRole.ADMIN, UserRole.CLIENT],
//     adminField: [UserRole.ADMIN],
// };
