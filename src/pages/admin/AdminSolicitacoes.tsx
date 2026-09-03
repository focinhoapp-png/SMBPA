import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle, XCircle, Eye, Inbox, Heart } from 'lucide-react';
import { adminListarPets, adminAtualizarStatusPet, adminDeletarPet, adminListarPetsDosSonhos } from '../../lib/api/admin';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

export default function AdminSolicitacoes() {
  const [activeTab, setActiveTab] = useState<'pets' | 'sonhos'>('pets');
  
  // States for Pets Pendentes
  const [pets, setPets] = useState<any[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [petsTotal, setPetsTotal] = useState(0);

  // States for Pet dos Sonhos
  const [sonhos, setSonhos] = useState<any[]>([]);
  const [loadingSonhos, setLoadingSonhos] = useState(true);
  const [sonhosTotal, setSonhosTotal] = useState(0);

  useEffect(() => {
    if (activeTab === 'pets') {
      loadPets();
    } else {
      loadSonhos();
    }
  }, [activeTab]);

  const loadPets = async () => {
    setLoadingPets(true);
    try {
      const { pets: data, total } = await adminListarPets(1, 50, { status: 'cadastrado' });
      setPets(data || []);
      setPetsTotal(total);
    } catch (err) {
      console.error('Erro ao carregar pets pendentes', err);
    } finally {
      setLoadingPets(false);
    }
  };

  const loadSonhos = async () => {
    setLoadingSonhos(true);
    try {
      const { pedidos, total } = await adminListarPetsDosSonhos(1, 50);
      setSonhos(pedidos || []);
      setSonhosTotal(total);
    } catch (err) {
      console.error('Erro ao carregar pets dos sonhos', err);
    } finally {
      setLoadingSonhos(false);
    }
  };

  const handleAprovarPet = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja aprovar este pet? Ele ficará disponível para adoção imediatamente.')) return;
    try {
      await adminAtualizarStatusPet(id, 'disponivel');
      setPets(pets.filter(p => p.id !== id));
      setPetsTotal(prev => prev - 1);
    } catch (err) {
      console.error('Erro ao aprovar pet', err);
      alert('Erro ao aprovar pet');
    }
  };

  const handleRecusarPet = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja RECUSAR e EXCLUIR este cadastro? Esta ação não pode ser desfeita.')) return;
    try {
      await adminDeletarPet(id);
      setPets(pets.filter(p => p.id !== id));
      setPetsTotal(prev => prev - 1);
    } catch (err) {
      console.error('Erro ao deletar pet', err);
      alert('Erro ao excluir pet');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Solicitações" subtitle="Aprovações pendentes e pedidos de adoção especiais" />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('pets')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'pets' 
              ? 'border-guapi-green text-guapi-green' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
          }`}
        >
          <Inbox className="w-4 h-4" />
          Aprovação de Pets
          {petsTotal > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] ml-1 ${activeTab === 'pets' ? 'bg-guapi-green text-white' : 'bg-gray-200 text-gray-700'}`}>
              {petsTotal}
            </span>
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('sonhos')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'sonhos' 
              ? 'border-guapi-green text-guapi-green' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          Pedidos Pet dos Sonhos
        </button>
      </div>

      <div className="min-h-[600px]">
          
        {/* Aba Aprovação de Pets */}
        {activeTab === 'pets' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {loadingPets ? (
              <div className="flex justify-center p-16">
                <div className="w-10 h-10 border-4 border-guapi-green border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : pets.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Tudo em dia!</h3>
                <p className="text-gray-500 text-sm">Nenhum pet pendente de aprovação no momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  <div key={pet.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col">
                    <div className="h-56 bg-gray-50 relative">
                      {pet.imagem_principal_url ? (
                        <img src={pet.imagem_principal_url} alt={pet.nome} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">Sem Imagem</div>
                      )}
                      <span className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 border border-yellow-200 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                        Pendente
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-extrabold text-xl text-gray-800 mb-1">{pet.nome}</h3>
                      <p className="text-sm font-medium text-gray-500 mb-4 capitalize">{pet.especie} • {pet.sexo}</p>
                      
                      <div className="flex gap-3 mt-auto">
                        <button
                          onClick={() => handleAprovarPet(pet.id)}
                          className="flex-1 bg-emerald-50 text-emerald-700 py-2.5 px-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition border border-emerald-200 shadow-sm"
                        >
                          <CheckCircle className="w-4 h-4" /> Aprovar
                        </button>
                        <button
                          onClick={() => handleRecusarPet(pet.id)}
                          className="flex-1 bg-red-50 text-red-600 py-2.5 px-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition border border-red-200 shadow-sm"
                        >
                          <XCircle className="w-4 h-4" /> Recusar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Aba Pet dos Sonhos */}
        {activeTab === 'sonhos' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loadingSonhos ? (
              <div className="flex justify-center p-16">
                <div className="w-10 h-10 border-4 border-guapi-green border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : sonhos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Inbox className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Nenhum pedido encontrado</h3>
                <p className="text-gray-500 text-sm">Não há pedidos de pet dos sonhos no momento.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Data</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Solicitante</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Preferência</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Contato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sonhos.map((pedido) => (
                      <tr key={pedido.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <span className="font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-lg text-xs">
                            {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-bold text-gray-800">
                          {pedido.usuarios?.nome_completo || 'Desconhecido'}
                        </td>
                        <td className="px-6 py-5">
                          <ul className="space-y-1 font-medium text-gray-600 text-xs">
                            {pedido.especie && <li>Espécie: <span className="font-bold capitalize text-gray-800">{pedido.especie}</span></li>}
                            {pedido.sexo && <li>Sexo: <span className="font-bold capitalize text-gray-800">{pedido.sexo}</span></li>}
                            {pedido.porte && <li>Porte: <span className="font-bold capitalize text-gray-800">{pedido.porte}</span></li>}
                            {pedido.faixa_etaria && <li>Idade: <span className="font-bold capitalize text-gray-800">{pedido.faixa_etaria}</span></li>}
                          </ul>
                          {!pedido.especie && !pedido.sexo && !pedido.porte && !pedido.faixa_etaria && (
                            <span className="italic text-gray-400 font-medium">Qualquer característica</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-bold text-gray-800">{pedido.usuarios?.telefone || 'Sem telefone'}</p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">{pedido.usuarios?.email}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
