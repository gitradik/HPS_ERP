import { UserRole } from 'src/types/auth/auth';

export enum FilterStatusType {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ALL = 'all',
}
export interface FilterFormValues {
  status?: FilterStatusType;
  role?: UserRole;
  search?: string;
}
