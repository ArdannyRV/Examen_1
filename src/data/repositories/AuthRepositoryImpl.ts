import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { supabase } from '../sources/supabaseClient';

export class AuthRepositoryImpl implements IAuthRepository {
  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No se pudo iniciar sesión');

    const user = data.user;
    return {
      id: user.id,
      email: user.email ?? '',
      name: user.user_metadata?.name ?? '',
      role: user.user_metadata?.role ?? 'adoptante',
      location: user.user_metadata?.location,
    };
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async register(
    email: string,
    password: string,
    name: string,
    role: 'adoptante' | 'refugio',
    location?: string
  ): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          location,
        },
      },
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No se pudo registrar el usuario');

    const user = data.user;
    return {
      id: user.id,
      email: user.email ?? '',
      name: user.user_metadata?.name ?? '',
      role: user.user_metadata?.role ?? 'adoptante',
      location: user.user_metadata?.location,
    };
  }
}
