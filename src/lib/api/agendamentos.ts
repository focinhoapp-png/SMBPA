import { supabase } from '../supabase';
import { registrarLog } from './admin';

export interface Clinica {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
  dias: string;
  horario: string;
  tipo: 'fixa' | 'castramóvel';
  observacoes?: string;
  created_at?: string;
}

export interface AgendamentoData {
  id: string;
  clinica_id: string;
  data: string; // ISO format YYYY-MM-DD
  vagas_gatas: number;
  vagas_cadelas: number;
  vagas_machos: number;
  created_at?: string;
}

// ─── Clínicas ─────────────────────────────────────────────────────────────────
export async function listarClinicas() {
  const { data, error } = await supabase
    .from('clinicas')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as Clinica[];
}

export async function adicionarClinica(clinica: Omit<Clinica, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('clinicas')
    .insert([clinica])
    .select()
    .single();
  if (error) throw error;
  await registrarLog({ acao: 'adicionar_clinica', tabela_afetada: 'clinicas', registro_id: data.id, dados_novos: clinica });
  return data;
}

export async function editarClinica(id: string, clinica: Partial<Clinica>) {
  const { data, error } = await supabase
    .from('clinicas')
    .update(clinica)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  await registrarLog({ acao: 'editar_clinica', tabela_afetada: 'clinicas', registro_id: id, dados_novos: clinica });
  return data;
}

export async function excluirClinica(id: string) {
  const { error } = await supabase.from('clinicas').delete().eq('id', id);
  if (error) throw error;
  await registrarLog({ acao: 'excluir_clinica', tabela_afetada: 'clinicas', registro_id: id });
}

// ─── Datas de Agendamento ─────────────────────────────────────────────────────
export async function listarDatasPorClinica(clinicaId: string) {
  const { data, error } = await supabase
    .from('agendamento_datas')
    .select('*')
    .eq('clinica_id', clinicaId)
    .order('data', { ascending: true });
  if (error) throw error;
  return data as AgendamentoData[];
}

export async function salvarVagasData(clinicaId: string, dataIso: string, vagasGatas: number, vagasCadelas: number, vagasMachos: number) {
  // Verifica se já existe para fazer upsert ou insert
  const { data: existente } = await supabase
    .from('agendamento_datas')
    .select('id')
    .eq('clinica_id', clinicaId)
    .eq('data', dataIso)
    .maybeSingle();

  const totalVagas = vagasGatas + vagasCadelas + vagasMachos;

  if (existente) {
    if (totalVagas <= 0) {
      // Remover se vagas for 0
      const { error } = await supabase.from('agendamento_datas').delete().eq('id', existente.id);
      if (error) throw error;
      await registrarLog({ acao: 'excluir_data_agendamento', tabela_afetada: 'agendamento_datas', registro_id: existente.id });
    } else {
      const payload = { vagas_gatas: vagasGatas, vagas_cadelas: vagasCadelas, vagas_machos: vagasMachos };
      const { data, error } = await supabase
        .from('agendamento_datas')
        .update(payload)
        .eq('id', existente.id)
        .select()
        .single();
      if (error) throw error;
      await registrarLog({ acao: 'editar_vagas_data', tabela_afetada: 'agendamento_datas', registro_id: existente.id, dados_novos: payload });
      return data;
    }
  } else if (totalVagas > 0) {
    const payload = { clinica_id: clinicaId, data: dataIso, vagas_gatas: vagasGatas, vagas_cadelas: vagasCadelas, vagas_machos: vagasMachos };
    const { data, error } = await supabase
      .from('agendamento_datas')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    await registrarLog({ acao: 'adicionar_data_agendamento', tabela_afetada: 'agendamento_datas', registro_id: data.id, dados_novos: payload });
    return data;
  }
}
export interface Agendamento {
  id: string;
  usuario_id: string;
  pet_id: string;
  clinica_id: string;
  data_agendamento: string;
  status: 'agendado' | 'cancelado' | 'concluido';
  created_at?: string;
  usuario?: any;
  pet?: any;
  clinica?: any;
}

export async function realizarAgendamento(usuarioId: string, petId: string, clinicaId: string, dataIso: string, especie: string, sexo: string) {
  const { data: agendamentoData, error: errData } = await supabase
    .from('agendamento_datas')
    .select('*')
    .eq('clinica_id', clinicaId)
    .eq('data', dataIso)
    .maybeSingle();

  if (errData) throw errData;
  if (!agendamentoData) throw new Error('Data não disponível para agendamento.');

  let temVaga = false;
  let atualizacaoVagas: any = {};

  if (especie.toLowerCase() === 'gato') {
    if (agendamentoData.vagas_gatas > 0) {
      temVaga = true;
      atualizacaoVagas = { vagas_gatas: agendamentoData.vagas_gatas - 1 };
    }
  } else if (especie.toLowerCase() === 'cachorro') {
    if (sexo.toLowerCase() === 'macho') {
      if (agendamentoData.vagas_machos > 0) {
        temVaga = true;
        atualizacaoVagas = { vagas_machos: agendamentoData.vagas_machos - 1 };
      }
    } else {
      if (agendamentoData.vagas_cadelas > 0) {
        temVaga = true;
        atualizacaoVagas = { vagas_cadelas: agendamentoData.vagas_cadelas - 1 };
      }
    }
  }

  if (!temVaga) throw new Error('Não há vagas disponíveis para o seu tipo de pet nesta data.');

  const payload = {
    usuario_id: usuarioId,
    pet_id: petId,
    clinica_id: clinicaId,
    data_agendamento: dataIso,
    status: 'agendado'
  };

  const { data: novoAgendamento, error: errInsert } = await supabase
    .from('agendamentos')
    .insert([payload])
    .select()
    .single();

  if (errInsert) throw errInsert;

  const { error: errUpdate } = await supabase
    .from('agendamento_datas')
    .update(atualizacaoVagas)
    .eq('id', agendamentoData.id);

  if (errUpdate) throw errUpdate;

  await registrarLog({ acao: 'realizar_agendamento', tabela_afetada: 'agendamentos', registro_id: novoAgendamento.id, dados_novos: payload });

  return novoAgendamento;
}

export async function listarAgendamentos() {
  const { data, error } = await supabase
    .from('agendamentos')
    .select(`
      *,
      usuario:usuarios(*),
      pet:pets(*),
      clinica:clinicas(*)
    `)
    .order('data_agendamento', { ascending: false });

  if (error) throw error;
  return data as Agendamento[];
}

export async function atualizarStatusAgendamento(id: string, status: string) {
  const { data, error } = await supabase
    .from('agendamentos')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  await registrarLog({ acao: 'atualizar_status_agendamento', tabela_afetada: 'agendamentos', registro_id: id, dados_novos: { status } });
  return data;
}

