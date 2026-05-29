import { User } from '../entities/User';

export interface IUserRepository {
  getRefugios(): Promise<User[]>;
  getContacts(currentRole: string): Promise<User[]>;
  savePushToken(userId: string, token: string): Promise<void>;
}
