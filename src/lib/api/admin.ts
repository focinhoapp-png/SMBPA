import { supabase } from '../supabase';

// ─── Tipos ────────────────────────────────────────────────────────────────────
export type AdminPapel = 'admin' | 'veterinario' | 'protetor' | 'proprietario';

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
  // Acesso total
  admin: [
    'dashboard', 'graficos', 'pets', 'adocoes', 'solicitacoes',
    'eventos', 'banners', 'historias', 'contatos',
    'usuarios', 'veterinarios', 'protetores', 'logs', 'meus_dados',
    'agendamentos'
  ],
  // Veterinário: vê pets e seu perfil
  veterinario: ['dashboard', 'pets', 'meus_dados'],
  // Protetor: pets comunitários, adoções e denúncias
  protetor: ['dashboard', 'pets', 'adocoes', 'contatos', 'meus_dados'],
  // Proprietário: seus pets, solicitações de adoção e seu perfil
  proprietario: ['dashboard', 'pets', 'solicitacoes', 'meus_dados'],
};

export const PAPEL_LABEL: Record<AdminPapel, string> = {
  admin:       'Administrador',
  veterinario: 'Veterinário',
  protetor:    'Protetor',
  proprietario:'Proprietário',
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

  // Filtro temporário para ocultar os pets de teste (incluindo os adotados) que não podem ser deletados via painel devido ao RLS
  const mockPetIds = '("0985efc8-8cff-4986-bb37-697f19dbcdad","4616a05c-98b5-4064-adea-7ffc042365c5","3692283f-898f-410b-a94d-759588b58d90","b4a87907-43ff-4d1c-928e-72d8eaeef7c5","e0bbec17-5c2e-4a42-b11b-107776e92f7d","42f9bb89-122f-4138-bf7d-c8bfc23e8ffb","fdd7363d-f9da-439b-9797-0a2d88da3601","240011d2-349a-49ea-a237-39bd0cae160a","c269bb6b-a395-4318-8e8c-9b7a40f6763b","9238ba74-9f26-4d94-89bc-1b6367b38cbd","fb04d030-97cc-4ff7-89f8-0e4fc652a628","145a76ee-9de3-45c0-9bc4-50d4a10bc9ab","528d1bb6-1eff-402b-9c68-dd8ec8434172","f4c1288c-428a-4028-8697-e917edf50af5","223abeb5-b80b-4700-b678-ee0715c86d20","f61278f8-f8da-4317-92ce-104769af57eb","9a86b768-caee-4a03-8080-c37223caa07e","25366412-ce1d-49cd-8bab-62148fdf92a0","b550ea79-800e-4273-9052-bd9c725ead9a","02b0c466-f8c1-4d2d-b464-4706eccbd975")';
  query = query.not('id', 'in', mockPetIds);

  const { data, error, count } = await query;
  if (error) throw error;
  return { pets: data, total: count ?? 0 };
}

export async function adminTransferirPet(petId: string, novoTutorId: string) {
  const { error } = await supabase.from('pets').update({ tutor_id: novoTutorId }).eq('id', petId);
  if (error) throw error;
  await registrarLog({ 
    acao: 'transferencia_pet_admin', 
    tabela_afetada: 'pets', 
    registro_id: petId, 
    dados_novos: { tutor_id: novoTutorId } 
  });
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

export async function adminObterPetDetalhes(id: string) {
  const { data, error } = await supabase
    .from('pets')
    .select(`
      *,
      pet_imagens(url, ordem),
      usuarios!tutor_id(
        nome_completo,
        email,
        telefone,
        tipo_perfil,
        cpf_cnpj,
        cep,
        logradouro,
        numero,
        bairro
      )
    `)
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
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
    const { data: uploaded, error: uploadError } = await supabase.storage.from('banners').upload(path, imagemFile, { upsert: true });
    
    if (uploadError) {
      console.error('Erro de upload:', uploadError);
      throw new Error(`Erro de upload: ${uploadError.message}`);
    }

    if (uploaded) {
      const { data: { publicUrl } } = supabase.storage.from('banners').getPublicUrl(path);
      imagem_url = publicUrl;
    }
  }

  const payload = { ...banner, imagem_url };
  if (payload.id) {
    const { id, ...rest } = payload;
    const { error } = await supabase.from('banners').update(rest).eq('id', id);
    if (error) throw error;
    await registrarLog({ acao: 'editar_banner', tabela_afetada: 'banners', registro_id: id });
    return { success: true };
  } else {
    const { error } = await supabase.from('banners').insert(payload);
    if (error) throw error;
    await registrarLog({ acao: 'criar_banner', tabela_afetada: 'banners' });
    return { success: true };
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

export async function adminAdicionarUsuario(dados: any) {
  // Inserts directly into the 'usuarios' table for admin-created profiles
  // Note: These users won't be able to login until they go through a password reset
  // or a proper auth account is linked to them.
  const id = crypto.randomUUID();
  const { data, error } = await supabase.from('usuarios').insert([{
    id,
    ...dados,
    created_at: new Date().toISOString()
  }]).select().single();
  
  if (error) throw error;
  
  await registrarLog({ 
    acao: 'adicionar_usuario', 
    tabela_afetada: 'usuarios', 
    registro_id: data?.id,
    dados_novos: dados 
  });
  
  return data;
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
