import { supabase } from '../supabase';

// ─── Tipos ───────────────────────────────────────────────────────────────────
export interface SignUpData {
  email: string;
  password: string;
  nome_completo: string;
  cpf_cnpj?: string;
  telefone?: string;
  data_nascimento?: string;
  genero?: string;
  is_pcd?: boolean;
  tipo_perfil?: string;
}

// ─── Cadastro ────────────────────────────────────────────────────────────────
export async function signUp(data: SignUpData) {
  const { email, password, ...profileData } = data;

  // 1. Criar conta no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError) throw authError;

  // 2. Criar registro na tabela usuarios
  if (authData.user) {
    const { error: profileError } = await supabase.from('usuarios').insert({
      auth_id: authData.user.id,
      email,
      tipo_perfil: data.tipo_perfil || 'fisica',
      ...profileData,
    });
    if (profileError) throw profileError;
  }

  return authData;
}

// ─── Login ───────────────────────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// ─── Logout ──────────────────────────────────────────────────────────────────
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ─── Usuário atual ───────────────────────────────────────────────────────────
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  if (error) return null;
  return data;
}

// ─── Sessão ──────────────────────────────────────────────────────────────────
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ─── Recuperação de senha ────────────────────────────────────────────────────
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/redefinir-senha`,
  });
  if (error) throw error;
}

// ─── Atualizar senha ─────────────────────────────────────────────────────────
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}
