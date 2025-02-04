import { User } from '../user/user';

export interface UploadPhotoResponse {
  success: boolean;
  filePath: string;
  filename: string;
  mimetype: string;
  user: User;
}
