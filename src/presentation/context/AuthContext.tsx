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

  const fetchProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    return (profile?.role as 'adoptante' | 'refugio') ?? null;
  };

  const refreshState = async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user ?? null;

    if (user) {
      const role = await fetchProfile(user.id);
      setState({ user, role, loading: false });
    } else {
      setState({ user: null, role: null, loading: false });
    }
  };

  useEffect(() => {
    refreshState();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      refreshState();
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
