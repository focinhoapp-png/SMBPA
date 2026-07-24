import { supabase } from '../supabase';

// ─── Tipos ────────────────────────────────────────────────────────────────────
export type AdminPapel = 'master' | 'admin' | 'moderador' | 'operador';

export interface AdminUser {
  id: string;
  nome: string;
  email: string;
  papel: AdminPapel;
  status: 'ativo' | 'inativo' | 'bloqueado';
  tentativas_login: number;
  bloqueado_ate?: string;
  ultimo_acesso?: string;
  avatar_url?: string;
  created_at: string;
}

// ─── Login do Admin ──────────────────────────────────────────────────────────
export async function adminLogin(email: string, senha: string): Promise<{ admin: AdminUser; token: string }> {
  const { data, error } = await supabase
    .rpc('admin_login', { p_email: email, p_senha: senha });

  if (error) throw error;
  if (!data || data.error) throw new Error(data?.error ?? 'Erro ao fazer login');

  return { admin: data.admin, token: data.token };
}

// ─── Verificar se admin está logado (via localStorage) ────────────────────────
export function getAdminToken(): string | null {
  return localStorage.getItem('admin_token');
}

export function getAdminUser(): AdminUser | null {
  const raw = localStorage.getItem('admin_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function saveAdminSession(admin: AdminUser, token: string) {
  localStorage.setItem('admin_token', token);
  localStorage.setItem('admin_user', JSON.stringify(admin));
}

export function clearAdminSession() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

export function isAdminLoggedIn(): boolean {
  return !!getAdminToken() && !!getAdminUser();
}

// ─── Permissões por papel ─────────────────────────────────────────────────────
export const PERMISSOES: Record<AdminPapel, string[]> = {
  master:     ['dashboard','pets','adocoes','usuarios_ver','usuarios_editar','eventos','banners','historias','contatos','permissoes','logs','configuracoes','backup'],
  admin:      ['dashboard','pets','adocoes','usuarios_ver','usuarios_editar','eventos','banners','historias','contatos','logs'],
  moderador:  ['dashboard','pets','adocoes','usuarios_ver','eventos','historias','contatos'],
  operador:   ['dashboard','pets','adocoes','contatos'],
};

export function temPermissao(papel: AdminPapel, permissao: string): boolean {
  return PERMISSOES[papel]?.includes(permissao) ?? false;
}

// ─── Registrar log de auditoria ───────────────────────────────────────────────
export async function registrarLog(params: {
  acao: string;
  tabela_afetada?: string;
  registro_id?: string;
  dados_anteriores?: any;
  dados_novos?: any;
}) {
  const admin = getAdminUser();
  if (!admin) return;

  await supabase.from('admin_logs').insert({
    admin_id: admin.id,
    ...params,
    ip: null,
    user_agent: navigator.userAgent,
  });
}

// ─── Dashboard: estatísticas ──────────────────────────────────────────────────
export async function getDashboardStats() {
  const [
    { count: totalPets },
    { count: petsDisponiveis },
    { count: petsAdotados },
    { count: totalUsuarios },
    { count: contatosPendentes },
    { count: adocoesPendentes },
    { count: petsMachos },
    { count: petsFemeas },
    { count: petsCastrados },
    { count: petsParaAdocao },
    { count: petsComunitarios },
    { count: usuariosProprietarios },
    { count: usuariosVeterinarios },
    { count: usuariosProtetores },
    { count: usuariosEstabelecimento },
    { count: usuariosJuridica },
  ] = await Promise.all([
    supabase.from('pets').select('*', { count: 'exact', head: true }),
    supabase.from('pets').select('*', { count: 'exact', head: true }).eq('status', 'disponivel'),
    supabase.from('pets').select('*', { count: 'exact', head: true }).eq('status', 'adotado'),
    supabase.from('usuarios').select('*', { count: 'exact', head: true }),
    supabase.from('contatos_smbepa').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
    supabase.from('solicitacoes_adocao').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
    supabase.from('pets').select('*', { count: 'exact', head: true }).eq('sexo', 'macho'),
    supabase.from('pets').select('*', { count: 'exact', head: true }).eq('sexo', 'femea'),
    supabase.from('pets').select('*', { count: 'exact', head: true }).eq('castrado', true),
    supabase.from('pets').select('*', { count: 'exact', head: true }).eq('para_adocao', true),
    supabase.from('pets').select('*', { count: 'exact', head: true }).eq('comunitario', true),
    supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('tipo_perfil', 'fisica'),
    supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('tipo_perfil', 'veterinario'),
    supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('tipo_perfil', 'protetor'),
    supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('tipo_perfil', 'estabelecimento'),
    supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('tipo_perfil', 'juridica'),
  ]);

  return {
    totalPets: totalPets ?? 0,
    petsDisponiveis: petsDisponiveis ?? 0,
    petsAdotados: petsAdotados ?? 0,
    totalUsuarios: totalUsuarios ?? 0,
    contatosPendentes: contatosPendentes ?? 0,
    adocoesPendentes: adocoesPendentes ?? 0,
    petsMachos: petsMachos ?? 0,
    petsFemeas: petsFemeas ?? 0,
    petsCastrados: petsCastrados ?? 0,
    petsParaAdocao: petsParaAdocao ?? 0,
    petsComunitarios: petsComunitarios ?? 0,
    usuariosProprietarios: usuariosProprietarios ?? 0,
    usuariosVeterinarios: usuariosVeterinarios ?? 0,
    usuariosProtetores: usuariosProtetores ?? 0,
    usuariosEstabelecimento: usuariosEstabelecimento ?? 0,
    usuariosJuridica: usuariosJuridica ?? 0,
  };
}


// ─── Admin: listar pets (sem RLS) via service role ou direto ─────────────────
export async function adminListarPets(page = 1, limit = 20, filtros: any = {}) {
  const offset = (page - 1) * limit;
  let query = supabase
    .from('pets')
    .select('*, pet_imagens(id, url, ordem)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (filtros.status) query = query.eq('status', filtros.status);
  if (filtros.especie) query = query.eq('especie', filtros.especie);
  if (filtros.search) query = query.ilike('nome', `%${filtros.search}%`);

  const { data, error, count } = await query;
  if (error) throw error;
  return { pets: data, total: count ?? 0 };
}

export async function adminAtualizarStatusPet(id: string, status: string) {
  const { error } = await supabase.from('pets').update({ status }).eq('id', id);
  if (error) throw error;
  await registrarLog({ acao: 'atualizar_status_pet', tabela_afetada: 'pets', registro_id: id, dados_novos: { status } });
}

export async function adminDeletarPet(id: string) {
  const { error } = await supabase.from('pets').delete().eq('id', id);
  if (error) throw error;
  await registrarLog({ acao: 'deletar_pet', tabela_afetada: 'pets', registro_id: id });
}

// ─── Admin: Pet dos Sonhos ────────────────────────────────────────────────────
export async function adminListarPetsDosSonhos(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const { data, error, count } = await supabase
    .from('pets_dos_sonhos')
    .select('*, usuarios!usuario_id(nome_completo, email, telefone)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return { pedidos: data, total: count ?? 0 };
}

// ─── Admin: Gráficos ──────────────────────────────────────────────────────────
export async function adminObterDadosGraficos() {
  const { data, error } = await supabase.from('pets').select('id, especie, sexo, raca, idade_meses');
  if (error) throw error;
  return data || [];
}

// ─── Admin: eventos ───────────────────────────────────────────────────────────
export async function adminListarEventos() {
  const { data, error } = await supabase.from('eventos').select('*').order('data_evento', { ascending: false });
  if (error) throw error;
  return data;
}

export async function adminSalvarEvento(evento: any, imagemFile?: File) {
  let imagem_url = evento.imagem_url;

  if (imagemFile) {
    const ext = imagemFile.name.split('.').pop();
    const path = `eventos/${Date.now()}.${ext}`;
    const { data: uploaded, error: uploadError } = await supabase.storage.from('eventos').upload(path, imagemFile, { upsert: true });
    if (uploadError) throw new Error('Erro ao fazer upload da imagem: ' + uploadError.message);
    if (uploaded) {
      const { data: { publicUrl } } = supabase.storage.from('eventos').getPublicUrl(path);
      imagem_url = publicUrl;
    }
  }

  const payload = { ...evento, imagem_url };

  if (payload.id) {
    const { id, ...rest } = payload;
    const { error } = await supabase.from('eventos').update(rest).eq('id', id);
    if (error) throw error;
    await registrarLog({ acao: 'editar_evento', tabela_afetada: 'eventos', registro_id: id, dados_novos: rest });
    return payload;
  } else {
    const { error } = await supabase.from('eventos').insert(payload);
    if (error) throw error;
    await registrarLog({ acao: 'criar_evento', tabela_afetada: 'eventos', dados_novos: payload });
    return payload;
  }
}

export async function adminDeletarEvento(id: string) {
  const { error } = await supabase.from('eventos').delete().eq('id', id);
  if (error) throw error;
  await registrarLog({ acao: 'deletar_evento', tabela_afetada: 'eventos', registro_id: id });
}

// ─── Admin: banners ───────────────────────────────────────────────────────────
export async function adminListarBanners() {
  const { data, error } = await supabase.from('banners').select('*').order('ordem');
  if (error) throw error;
  return data;
}

export async function adminSalvarBanner(banner: any, imagemFile?: File) {
  let imagem_url = banner.imagem_url;

  if (imagemFile) {
    const ext = imagemFile.name.split('.').pop();
    const path = `banners/${Date.now()}.${ext}`;
    const { data: uploaded } = await supabase.storage.from('banners').upload(path, imagemFile, { upsert: true });
    if (uploaded) {
      const { data: { publicUrl } } = supabase.storage.from('banners').getPublicUrl(path);
      imagem_url = publicUrl;
    }
  }

  const payload = { ...banner, imagem_url };
  if (payload.id) {
    const { id, ...rest } = payload;
    const { data, error } = await supabase.from('banners').update(rest).eq('id', id).select().single();
    if (error) throw error;
    await registrarLog({ acao: 'editar_banner', tabela_afetada: 'banners', registro_id: id });
    return data;
  } else {
    const { data, error } = await supabase.from('banners').insert(payload).select().single();
    if (error) throw error;
    await registrarLog({ acao: 'criar_banner', tabela_afetada: 'banners' });
    return data;
  }
}

export async function adminDeletarBanner(id: string) {
  const { error } = await supabase.from('banners').delete().eq('id', id);
  if (error) throw error;
  await registrarLog({ acao: 'deletar_banner', tabela_afetada: 'banners', registro_id: id });
}

// ─── Admin: histórias ─────────────────────────────────────────────────────────
export async function adminListarHistorias() {
  const { data, error } = await supabase.from('historias').select('*').order('ordem');
  if (error) throw error;
  return data;
}

export async function adminSalvarHistoria(historia: any) {
  if (historia.id) {
    const { id, ...rest } = historia;
    const { data, error } = await supabase.from('historias').update(rest).eq('id', id).select().single();
    if (error) throw error;
    await registrarLog({ acao: 'editar_historia', tabela_afetada: 'historias', registro_id: id });
    return data;
  } else {
    const { data, error } = await supabase.from('historias').insert(historia).select().single();
    if (error) throw error;
    await registrarLog({ acao: 'criar_historia', tabela_afetada: 'historias' });
    return data;
  }
}

export async function adminDeletarHistoria(id: string) {
  const { error } = await supabase.from('historias').delete().eq('id', id);
  if (error) throw error;
  await registrarLog({ acao: 'deletar_historia', tabela_afetada: 'historias', registro_id: id });
}

// ─── Admin: contatos ──────────────────────────────────────────────────────────
export async function adminListarContatos(page = 1, limit = 20, status?: string) {
  const offset = (page - 1) * limit;
  let query = supabase
    .from('contatos_smbepa')
    .select('*, contato_arquivos(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (status) query = query.eq('status', status);
  const { data, error, count } = await query;
  if (error) throw error;
  return { contatos: data, total: count ?? 0 };
}

export async function adminResponderContato(id: string, resposta: string, status: string) {
  const { error } = await supabase.from('contatos_smbepa').update({
    resposta,
    status,
    respondido_em: new Date().toISOString(),
  }).eq('id', id);
  if (error) throw error;
  await registrarLog({ acao: 'responder_contato', tabela_afetada: 'contatos_smbepa', registro_id: id, dados_novos: { status, resposta } });
}

// ─── Admin: usuários ──────────────────────────────────────────────────────────
export async function adminListarUsuarios(page = 1, limit = 20, tipoPerfil?: string) {
  const offset = (page - 1) * limit;
  let query = supabase
    .from('usuarios')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
    
  if (tipoPerfil) {
    query = query.eq('tipo_perfil', tipoPerfil);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { usuarios: data, total: count ?? 0 };
}

// ─── Admin: logs ──────────────────────────────────────────────────────────────
export async function adminListarLogs(page = 1, limit = 50) {
  const offset = (page - 1) * limit;
  const { data, error, count } = await supabase
    .from('admin_logs')
    .select('*, admin_usuarios(nome, email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return { logs: data, total: count ?? 0 };
}

// ─── Admin: configurações ─────────────────────────────────────────────────────
export async function adminGetConfiguracoes() {
  const { data, error } = await supabase.from('configuracoes').select('*').order('chave');
  if (error) throw error;
  return data;
}

export async function adminSalvarConfiguracao(chave: string, valor: string) {
  const admin = getAdminUser();
  const { error } = await supabase.from('configuracoes')
    .upsert({ chave, valor, updated_by: admin?.id, updated_at: new Date().toISOString() }, { onConflict: 'chave' });
  if (error) throw error;
  await registrarLog({ acao: 'alterar_configuracao', tabela_afetada: 'configuracoes', dados_novos: { chave, valor } });
}

// ─── Admin: adoções ───────────────────────────────────────────────────────────
export async function adminListarAdocoes(page = 1, limit = 20, status?: string) {
  const offset = (page - 1) * limit;
  let query = supabase
    .from('solicitacoes_adocao')
    .select('*, pets(nome, especie, imagem_principal_url), usuarios!solicitante_id(nome_completo, email, telefone)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (status) query = query.eq('status', status);
  const { data, error, count } = await query;
  if (error) throw error;
  return { adocoes: data, total: count ?? 0 };
}

export async function adminAtualizarAdocao(id: string, status: string, resposta?: string) {
  const { error } = await supabase.from('solicitacoes_adocao').update({ status, resposta_admin: resposta }).eq('id', id);
  if (error) throw error;
  await registrarLog({ acao: 'atualizar_adocao', tabela_afetada: 'solicitacoes_adocao', registro_id: id, dados_novos: { status } });
}

// ─── Admin: gerenciar admins ──────────────────────────────────────────────────
export async function adminListarAdmins() {
  const { data, error } = await supabase
    .from('admin_usuarios')
    .select('id, nome, email, papel, status, ultimo_acesso, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function adminCriarAdmin(dados: { nome: string; email: string; senha: string; papel: AdminPapel }) {
  const { data, error } = await supabase.rpc('admin_criar_usuario', {
    p_nome: dados.nome,
    p_email: dados.email,
    p_senha: dados.senha,
    p_papel: dados.papel,
  });
  if (error) throw error;
  await registrarLog({ acao: 'criar_admin', tabela_afetada: 'admin_usuarios', dados_novos: { email: dados.email, papel: dados.papel } });
  return data;
}
