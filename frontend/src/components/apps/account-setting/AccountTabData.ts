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
    {
      value: UserRole.STAFF,
      label: UserRole.STAFF,
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
    firstName: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    lastName: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    email: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    position: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  }