import { User } from '../entities/User';

export interface IUserRepository {
  getRefugios(): Promise<User[]>;
}
