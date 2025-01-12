import { UserRole } from "src/types/auth/auth";
import { ListItem } from "src/types/list";

// roles
export const roles: ListItem<UserRole>[] = [
    {
      value: UserRole.SUPER_ADMIN,
      label: UserRole.SUPER_ADMIN.replace('_', ' '),
    },
    {
      value: UserRole.ADMIN,
      label: UserRole.ADMIN,
    },
    {
      value: UserRole.MANAGER,
      label: UserRole.MANAGER,
    },
    {
      value: UserRole.CLIENT,
      label: UserRole.CLIENT,
    },
    {
      value: UserRole.EMPLOYEE,
      label: UserRole.EMPLOYEE,
    },
    {
      value: UserRole.USER,
      label: UserRole.USER,
    },
  ];
  // currency
export const actives: ListItem<boolean>[] = [
    {
      value: true,
      label: 'ON',
    },
    {
      value: false,
      label: 'OFF',
    }
  ];
  
export const userAccessRules = {
    role: [UserRole.SUPER_ADMIN],
    email: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER],
    phoneNumber: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER],
    isActive: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  }