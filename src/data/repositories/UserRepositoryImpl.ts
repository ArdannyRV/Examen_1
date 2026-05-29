import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { supabase } from '../sources/supabaseClient';

export class UserRepositoryImpl implements IUserRepository {
  async getRefugios(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'refugio')
      .not('location', 'is', null);

    if (error) throw new Error(error.message);

    return (data ?? []).map((item) => ({
      id: item.id,
      email: item.email ?? '',
      name: item.name ?? '',
      role: item.role as 'refugio',
      location: item.location,
    }));
  }
}
