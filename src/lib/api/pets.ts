import { supabase } from '../supabase';

export type PetStatus = 'disponivel' | 'em_processo' | 'adotado' | 'cadastrado';
export type PetEspecie = 'cachorro' | 'gato';
export type PetSexo = 'macho' | 'femea';
export type PetPorte = 'pequeno' | 'medio' | 'grande';

export interface Pet {
  id: string;
  tutor_id?: string;
  nome: string;
  especie: PetEspecie;
  sexo: PetSexo;
  porte?: PetPorte;
  raca?: string;
  cor?: string;
  data_nascimento?: string;
  idade_meses?: number;
  castrado?: boolean;
  microchipado?: boolean;
  numero_microchip?: string;
  comunitario?: boolean;
  para_adocao?: boolean;
  bairro?: string;
  status: PetStatus;
  sociavel_animais?: boolean;
  sociavel_pessoas?: boolean;
  descricao?: string;
  imagem_principal_url?: string;
  created_at?: string;
  updated_at?: string;
  pet_imagens?: { id: string; url: string; ordem: number }[];
  pet_vacinas?: any[];
}

export interface PetFiltros {
  especie?: PetEspecie;
  sexo?: PetSexo;
  porte?: PetPorte;
  status?: PetStatus;
  search?: string;
  page?: number;
  limit?: number;
}

// ─── Listar pets (site público) ───────────────────────────────────────────────
export async function listarPets(filtros: PetFiltros = {}) {
  const { especie, sexo, porte, status, search, page = 1, limit = 12 } = filtros;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('pets')
    .select('*, pet_imagens(id, url, ordem)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (especie) query = query.eq('especie', especie);
  if (sexo) query = query.eq('sexo', sexo);
  if (porte) query = query.eq('porte', porte);
  if (status) query = query.eq('status', status);
  else query = query.neq('status', 'cadastrado');
  if (search) query = query.ilike('nome', `%${search}%`);

  const { data, error, count } = await query;
  if (error) throw error;
  return { pets: data as Pet[], total: count ?? 0 };
}

// ─── Pets disponíveis para adoção ────────────────────────────────────────────
export async function listarPetsDisponiveis(filtros: PetFiltros = {}) {
  return listarPets({ ...filtros, status: 'disponivel' });
}

// ─── Pets adotados ───────────────────────────────────────────────────────────
export async function listarPetsAdotados() {
  const { data, error } = await supabase
    .from('pets')
    .select('*, pet_imagens(id, url, ordem)')
    .eq('status', 'adotado')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data as Pet[];
}

// ─── Buscar pet por ID ───────────────────────────────────────────────────────
export async function buscarPet(id: string) {
  const { data, error } = await supabase
    .from('pets')
    .select('*, pet_imagens(id, url, ordem), pet_vacinas(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Pet;
}

// ─── Pets do usuário logado ───────────────────────────────────────────────────
export async function meusPets() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('id')
    .eq('auth_id', user.id)
    .single();
  if (!usuario) return [];

  const { data, error } = await supabase
    .from('pets')
    .select('*, pet_imagens(id, url, ordem), pet_vacinas(*)')
    .eq('tutor_id', usuario.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Pet[];
}

// ─── Cadastrar pet ───────────────────────────────────────────────────────────
export async function cadastrarPet(petData: Partial<Pet>, imagens?: File[]) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  const { data: pet, error } = await supabase
    .from('pets')
    .insert({ ...petData, tutor_id: usuario?.id })
    .select()
    .single();
  if (error) throw error;

  // Upload de imagens
  if (imagens && imagens.length > 0) {
    for (let i = 0; i < imagens.length; i++) {
      const file = imagens[i];
      const ext = file.name.split('.').pop();
      const path = `${pet.id}/${i + 1}.${ext}`;

      const { data: uploaded, error: uploadError } = await supabase.storage
        .from('pets')
        .upload(path, file, { upsert: true });

      if (!uploadError && uploaded) {
        const { data: { publicUrl } } = supabase.storage.from('pets').getPublicUrl(path);

        await supabase.from('pet_imagens').insert({
          pet_id: pet.id,
          url: publicUrl,
          ordem: i,
        });

        // A segunda imagem (índice 1) vira imagem_principal_url para exibição na adoção
        if (i === 1) {
          await supabase.from('pets').update({ imagem_principal_url: publicUrl }).eq('id', pet.id);
        }
      }
    }
  }

  return pet as Pet;
}

// ─── Atualizar pet ───────────────────────────────────────────────────────────
export async function atualizarPet(id: string, petData: Partial<Pet>) {
  const { data, error } = await supabase
    .from('pets')
    .update(petData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Pet;
}

// ─── Deletar pet ─────────────────────────────────────────────────────────────
export async function deletarPet(id: string) {
  const { error } = await supabase.from('pets').delete().eq('id', id);
  if (error) throw error;
}

// ─── Transparência (todos os pets paginado) ───────────────────────────────────
export async function listarTransparencia(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const { data, error, count } = await supabase
    .from('pets')
    .select('id, nome, especie, status, created_at, tutor_id, usuarios!tutor_id(nome_completo)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return { pets: data, total: count ?? 0 };
}
