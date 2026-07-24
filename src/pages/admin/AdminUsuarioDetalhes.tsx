import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminUsuarioDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dados');

  useEffect(() => {
    async function loadUser() {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        setUsuario(data);
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
          className="flex items-center gap-2 bg-[#3f51b5] hover:bg-[#303f9f] text-white px-5 py-2 rounded transition-colors text-sm font-medium"
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
                ? 'border-b-[3px] border-[#fae12e] text-gray-800' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dados do proprietário
          </button>
          <button
            onClick={() => setActiveTab('animais')}
            className={`flex-1 py-4 text-sm font-medium text-center ${
              activeTab === 'animais' 
                ? 'border-b-[3px] border-[#fae12e] text-gray-800' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lista de Animais
          </button>
          <button
            onClick={() => setActiveTab('historico')}
            className={`flex-1 py-4 text-sm font-medium text-center ${
              activeTab === 'historico' 
                ? 'border-b-[3px] border-[#fae12e] text-gray-800' 
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
                <div className="bg-[#fae12e] px-4 py-3">
                  <h2 className="text-gray-800 font-medium">Dados da Conta</h2>
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
                <div className="bg-[#fae12e] px-4 py-3">
                  <h2 className="text-gray-800 font-medium">Endereço</h2>
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
            <div className="text-gray-500 text-sm">Lista de animais do proprietário (em desenvolvimento).</div>
          )}

          {activeTab === 'historico' && (
            <div className="text-gray-500 text-sm">Histórico de alterações (em desenvolvimento).</div>
          )}
        </div>
      </div>
    </div>
  );
}
