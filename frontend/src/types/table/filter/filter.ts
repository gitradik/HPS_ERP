import { UserRole } from 'src/types/auth/auth';

export type FilterStatusType = 'active' | 'inactive' | 'all';
export interface FilterFormValues {
  status?: FilterStatusType;
  role?: UserRole;
  search?: string;
}