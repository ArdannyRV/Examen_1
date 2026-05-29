import { User } from '../entities/User';

export interface IUserRepository {
  getRefugios(): Promise<User[]>;
  getContacts(currentRole: string): Promise<User[]>;
}
