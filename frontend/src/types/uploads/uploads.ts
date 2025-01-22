import { User } from '../auth/auth';

export interface UploadPhotoResponse {
  success: boolean;
  filePath: string;
  filename: string;
  mimetype: string;
  user: User;
}
