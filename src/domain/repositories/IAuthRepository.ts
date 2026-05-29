import { User } from '../entities/User';

export interface IAuthRepository {
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string, name: string, role: 'adoptante' | 'refugio', location?: string): Promise<User>;
  logout(): Promise<void>;
  resetPassword(email: string): Promise<void>;
}
