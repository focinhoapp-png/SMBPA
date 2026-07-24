import { supabase } from '../supabase';

// ─── Banners ──────────────────────────────────────────────────────────────────
export interface Banner {
  id: string;
  titulo: string;
  descricao?: string;
  imagem_url: string;
  link_url?: string;
  ordem: number;
  ativo: boolean;
}

export async function listarBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('ativo', true)
    .order('ordem', { ascending: true });
  if (error) throw error;
  return data as Banner[];
}

// ─── Eventos ──────────────────────────────────────────────────────────────────
export interface Evento {
  id: string;
  titulo: string;
  descricao?: string;
  data_evento: string;
  data_fim?: string;
  horario_inicio?: string;
  horario_fim?: string;
  local?: string;
  status: 'inscricoes_abertas' | 'em_breve' | 'encerrado';
  imagem_url?: string;
  link_saber_mais?: string;
}

export async function listarEventos(): Promise<Evento[]> {
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .order('data_evento', { ascending: true });
  if (error) throw error;
  return data as Evento[];
}

// ─── Histórias ────────────────────────────────────────────────────────────────
export interface Historia {
  id: string;
  titulo: string;
  thumb_url?: string;
  video_url?: string;
  duracao?: string;
  ordem: number;
}

export async function listarHistorias(): Promise<Historia[]> {
  const { data, error } = await supabase
    .from('historias')
    .select('*')
    .eq('ativo', true)
    .order('ordem', { ascending: true });
  if (error) throw error;
  return data as Historia[];
}

// ─── Contatos SMBEPA ─────────────────────────────────────────────────────────
export interface ContatoData {
  topico: string;
  mensagem: string;
  endereco?: string;
  ponto_referencia?: string;
  nome_contato?: string;
  email_contato?: string;
  arquivos?: File[];
}

export async function enviarContato(dados: ContatoData): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();

  let usuario_id: string | null = null;
  if (user) {
    const { data: u } = await supabase.from('usuarios').select('id').eq('auth_id', user.id).single();
    usuario_id = u?.id ?? null;
  }

  const { data: contato, error } = await supabase
    .from('contatos_smbepa')
    .insert({
      usuario_id,
      topico: dados.topico,
      mensagem: dados.mensagem,
      endereco: dados.endereco,
      ponto_referencia: dados.ponto_referencia,
      nome_contato: dados.nome_contato,
      email_contato: dados.email_contato,
    })
    .select()
    .single();
  if (error) throw error;

  // Upload de arquivos
  if (dados.arquivos && dados.arquivos.length > 0) {
    for (const arquivo of dados.arquivos) {
      const ext = arquivo.name.split('.').pop();
      const path = `${contato.id}/${Date.now()}.${ext}`;
      const { data: uploaded, error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(path, arquivo);

      if (!uploadError && uploaded) {
        const { data: { publicUrl } } = supabase.storage.from('documentos').getPublicUrl(path);
        await supabase.from('contato_arquivos').insert({
          contato_id: contato.id,
          arquivo_url: publicUrl,
          nome_arquivo: arquivo.name,
        });
      }
    }
  }
}

export async function listarMinhasMensagens() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: usuario } = await supabase.from('usuarios').select('id').eq('auth_id', user.id).single();
  if (!usuario) return [];

  const { data, error } = await supabase
    .from('contatos_smbepa')
    .select('*')
    .eq('usuario_id', usuario.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ─── Adoções ──────────────────────────────────────────────────────────────────
export interface AdocaoData {
  pet_id: string;
  tipo_moradia?: string;
  outros_animais?: boolean;
  todos_de_acordo?: boolean;
  tipo_interacao?: string;
  mudou_endereco?: boolean;
  observacoes?: string;
}

export async function solicitarAdocao(dados: AdocaoData): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('id')
    .eq('auth_id', user.id)
    .single();
  if (!usuario) throw new Error('Perfil não encontrado');

  const { error } = await supabase
    .from('solicitacoes_adocao')
    .insert({ ...dados, solicitante_id: usuario.id });
  if (error) throw error;

  // Atualizar status do pet para em_processo
  await supabase.from('pets').update({ status: 'em_processo' }).eq('id', dados.pet_id);
}

// ─── Configurações do sistema ─────────────────────────────────────────────────
export async function getConfiguracoes(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('configuracoes').select('chave, valor');
  if (error) return {};
  return Object.fromEntries((data ?? []).map((c) => [c.chave, c.valor ?? '']));
}

// ─── Pet dos sonhos ───────────────────────────────────────────────────────────
export interface PetSonhoData {
  especie?: string;
  sexo?: string;
  porte?: string;
  faixa_etaria?: string;
}

export async function salvarPetSonho(dados: PetSonhoData): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('id')
    .eq('auth_id', user.id)
    .single();
  if (!usuario) throw new Error('Perfil não encontrado');

  const { error } = await supabase
    .from('pets_dos_sonhos')
    .insert({ ...dados, usuario_id: usuario.id });
  if (error) throw error;
}
