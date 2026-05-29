import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/src/data/sources/supabaseClient';

interface AuthState {
  user: import('@supabase/supabase-js').User | null;
  role: 'adoptante' | 'refugio' | null;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({
  user: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user ?? null;

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        setState({
          user,
          role: (profile?.role as 'adoptante' | 'refugio') ?? null,
          loading: false,
        });
      } else {
        setState({ user: null, role: null, loading: false });
      }
    };

    fetchUser();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
