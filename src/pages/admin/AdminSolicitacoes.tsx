import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle, XCircle, Eye, Inbox, Heart } from 'lucide-react';
import { adminListarPets, adminAtualizarStatusPet, adminDeletarPet, adminListarPetsDosSonhos } from '../../lib/api/admin';

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-guapi-green" />
          <h1 className="text-2xl font-light text-gray-800">Solicitações</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pets')}
            className={`flex-1 min-w-[200px] text-center py-4 text-sm font-medium border-b-4 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'pets' 
                ? 'border-yellow-400 text-gray-900' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Inbox className="w-5 h-5" />
            Aprovação de Pets
            {activeTab === 'pets' && petsTotal > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{petsTotal}</span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('sonhos')}
            className={`flex-1 min-w-[200px] text-center py-4 text-sm font-medium border-b-4 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'sonhos' 
                ? 'border-yellow-400 text-gray-900' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className="w-5 h-5" />
            Pedidos Pet dos Sonhos
          </button>
        </div>

        <div className="p-6">
          
          {/* Aba Aprovação de Pets */}
          {activeTab === 'pets' && (
            <div>
              {loadingPets ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-guapi-green"></div>
                </div>
              ) : pets.length === 0 ? (
                <div className="text-center p-12 text-gray-500">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p>Nenhum pet pendente de aprovação no momento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pets.map((pet) => (
                    <div key={pet.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-gray-50">
                      <div className="h-48 bg-gray-200 relative">
                        {pet.imagem_principal_url ? (
                          <img src={pet.imagem_principal_url} alt={pet.nome} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">Sem Imagem</div>
                        )}
                        <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow">
                          PENDENTE
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-800">{pet.nome}</h3>
                        <p className="text-sm text-gray-600 mb-2 capitalize">{pet.especie} • {pet.sexo}</p>
                        
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleAprovarPet(pet.id)}
                            className="flex-1 bg-guapi-green text-white py-2 px-3 rounded text-sm font-medium flex items-center justify-center gap-1 hover:bg-guapi-green-dark transition"
                          >
                            <CheckCircle className="w-4 h-4" /> Aprovar
                          </button>
                          <button
                            onClick={() => handleRecusarPet(pet.id)}
                            className="flex-1 bg-red-100 text-red-600 py-2 px-3 rounded text-sm font-medium flex items-center justify-center gap-1 hover:bg-red-200 transition"
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
            <div>
              {loadingSonhos ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-guapi-green"></div>
                </div>
              ) : sonhos.length === 0 ? (
                <div className="text-center p-12 text-gray-500">
                  <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>Nenhum pedido de pet dos sonhos encontrado.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Data</th>
                        <th className="px-4 py-3">Solicitante</th>
                        <th className="px-4 py-3">Preferência</th>
                        <th className="px-4 py-3">Contato</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sonhos.map((pedido) => (
                        <tr key={pedido.id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {pedido.usuarios?.nome_completo || 'Desconhecido'}
                          </td>
                          <td className="px-4 py-3">
                            <ul className="list-disc pl-4 space-y-1">
                              {pedido.especie && <li>Espécie: <span className="capitalize">{pedido.especie}</span></li>}
                              {pedido.sexo && <li>Sexo: <span className="capitalize">{pedido.sexo}</span></li>}
                              {pedido.porte && <li>Porte: <span className="capitalize">{pedido.porte}</span></li>}
                              {pedido.faixa_etaria && <li>Idade: <span className="capitalize">{pedido.faixa_etaria}</span></li>}
                            </ul>
                            {!pedido.especie && !pedido.sexo && !pedido.porte && !pedido.faixa_etaria && (
                              <span className="italic text-gray-400">Qualquer característica</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <p>{pedido.usuarios?.telefone || 'Sem telefone'}</p>
                            <p className="text-xs text-gray-400">{pedido.usuarios?.email}</p>
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
    </div>
  );
}
