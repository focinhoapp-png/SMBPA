import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronDown, PawPrint } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminUsuarioDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState<any>(location.state?.usuario || null);
  const [animais, setAnimais] = useState<any[]>([]);
  const [loading, setLoading] = useState(!location.state?.usuario);
  const [loadingAnimais, setLoadingAnimais] = useState(false);
  const [activeTab, setActiveTab] = useState('dados');

  useEffect(() => {
    // Se já temos os dados via navigation state, não precisa buscar
    if (location.state?.usuario) return;

    async function loadUser() {
      try {
        // Usa o RPC que tem SECURITY DEFINER (ignora RLS)
        const { data, error } = await supabase
          .rpc('listar_proprietarios', { p_limit: 500, p_offset: 0 });
        if (error) throw error;
        const found = (data?.usuarios || []).find((u: any) => u.id === id);
        if (found) setUsuario(found);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadUser();
    }
  }, [id]);

  useEffect(() => {
    if (activeTab === 'animais' && id) {
      setLoadingAnimais(true);
      supabase
        .from('pets')
        .select('id, nome, especie, raca, sexo, status, imagem_principal_url, pet_imagens(id, url, ordem)')
        .eq('tutor_id', id)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error) setAnimais(data || []);
        })
        .finally(() => setLoadingAnimais(false));
    }
  }, [activeTab, id]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Carregando...</div>;
  }

  if (!usuario) {
    return <div className="p-8 text-center text-gray-500">Usuário não encontrado.</div>;
  }

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[26px] font-normal text-gray-800">
          Proprietário: {usuario.nome_completo?.toLowerCase()}
        </h1>
        <button 
          onClick={() => navigate('/admin/usuarios')}
          className="flex items-center gap-2 bg-guapi-orange hover:bg-guapi-orange-dark text-white px-5 py-2 rounded transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
      </div>

      <div className="bg-white shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('dados')}
            className={`flex-1 py-4 text-sm font-medium text-center ${
              activeTab === 'dados' 
                ? 'border-b-[3px] border-guapi-green text-guapi-green' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dados do proprietário
          </button>
          <button
            onClick={() => setActiveTab('animais')}
            className={`flex-1 py-4 text-sm font-medium text-center ${
              activeTab === 'animais' 
                ? 'border-b-[3px] border-guapi-green text-guapi-green' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lista de Animais
          </button>
          <button
            onClick={() => setActiveTab('historico')}
            className={`flex-1 py-4 text-sm font-medium text-center ${
              activeTab === 'historico' 
                ? 'border-b-[3px] border-guapi-green text-guapi-green' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Registro de alterações
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'dados' && (
            <div className="max-w-5xl space-y-10">
              
              {/* Dados da Conta */}
              <div className="border border-gray-100 shadow-sm rounded-sm overflow-hidden">
                <div className="bg-guapi-green px-4 py-3">
                  <h2 className="text-white font-medium">Dados da Conta</h2>
                </div>
                <div className="p-6 bg-white space-y-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Nome Completo <span className="text-red-500">*</span></label>
                    <div className="border-b border-gray-300 pb-1 pt-1 text-gray-800 text-sm">
                      {usuario.nome_completo?.toLowerCase() || '—'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Tipo de Usuário</label>
                      <div className="border-b border-gray-300 pb-1 pt-1 flex justify-between items-center text-gray-500 text-sm">
                        <span>Proprietário</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">E-mail</label>
                      <div className="border-b border-gray-300 pb-1 pt-1 text-gray-800 text-sm">
                        {usuario.email || '—'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="border border-gray-100 shadow-sm rounded-sm overflow-hidden">
                <div className="bg-guapi-green px-4 py-3">
                  <h2 className="text-white font-medium">Endereço</h2>
                </div>
                <div className="p-6 bg-white space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-8">
                      <label className="block text-sm text-gray-600 mb-1">Logradouro</label>
                      <div className="border-b border-gray-300 pb-1 pt-1 text-gray-800 text-sm">
                        {usuario.logradouro || 'rua tres'}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Número</label>
                      <div className="border-b border-gray-300 pb-1 pt-1 text-gray-800 text-sm">
                        {usuario.numero || '47'}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">CEP</label>
                      <div className="border-b border-gray-300 pb-1 pt-1 text-gray-800 text-sm">
                        {usuario.cep || '25949295'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Bairro</label>
                      <div className="border-b border-gray-300 pb-1 pt-1 text-gray-800 text-sm">
                        {usuario.bairro || 'caneca fina'}
                      </div>
                    </div>
                    <div className="flex items-end">
                      <div className="border-b border-gray-300 w-full pb-1 pt-1 flex items-center gap-3">
                        <img 
                          src="https://flagcdn.com/w20/br.png" 
                          alt="Brasil" 
                          className="w-6 rounded-sm shadow-sm"
                        />
                        <span className="text-gray-800 text-sm">
                          +55 {usuario.telefone || '(21) 98932-8583'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'animais' && (
            <div>
              {loadingAnimais ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-guapi-green border-t-transparent rounded-full animate-spin" />
                </div>
              ) : animais.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <PawPrint className="w-12 h-12 text-gray-200 mb-3" />
                  <p className="text-gray-400 font-medium">Nenhum animal cadastrado</p>
                  <p className="text-gray-400 text-sm">Este proprietário ainda não possui animais registrados.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Animal</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Espécie</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Raça</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Sexo</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {animais.map((animal) => (
                      <tr
                        key={animal.id}
                        onClick={() => navigate(`/admin/lista-animais/${animal.id}`)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {(() => {
                              const rgPhoto = animal.pet_imagens?.find((img: any) => img.ordem === 0)?.url || animal.imagem_principal_url;
                              return rgPhoto ? (
                                <img src={rgPhoto} alt={animal.nome} className="w-9 h-9 rounded-full object-cover border border-gray-100" />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                                  <PawPrint className="w-4 h-4 text-gray-300" />
                                </div>
                              );
                            })()}
                            <span className="font-semibold text-gray-800">{animal.nome}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 capitalize">{animal.especie || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{animal.raca || '—'}</td>
                        <td className="px-4 py-3 text-gray-600 capitalize">{animal.sexo || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            animal.status === 'adotado' ? 'bg-green-100 text-green-700' :
                            animal.status === 'disponivel' ? 'bg-blue-100 text-blue-700' :
                            animal.status === 'em_processo' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {animal.status === 'adotado' ? 'Adotado' :
                             animal.status === 'disponivel' ? 'Disponível' :
                             animal.status === 'em_processo' ? 'Em processo' :
                             animal.status || 'Cadastrado'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'historico' && (
            <div className="text-gray-500 text-sm">Histórico de alterações (em desenvolvimento).</div>
          )}
        </div>
      </div>
    </div>
  );
}
