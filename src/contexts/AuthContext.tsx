import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  perfil: any | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  perfil: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<any | null>(null);

  const fetchPerfil = async (userId: string) => {
    const { data } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_id', userId)
      .single();
    setPerfil(data);
  };

  useEffect(() => {
    // Sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchPerfil(session.user.id);
      setLoading(false);
    });

    // Ouvir mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchPerfil(session.user.id);
      else setPerfil(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, perfil }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
