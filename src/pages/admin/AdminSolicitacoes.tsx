import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle, XCircle, Inbox, Heart, X, PawPrint, Users } from 'lucide-react';
import { adminListarPets, adminAtualizarStatusPet, adminDeletarPet, adminListarPetsDosSonhos } from '../../lib/api/admin';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

function PetDetalheModal({ pet, onClose, onAprovar, onRecusar }: { pet: any; onClose: () => void; onAprovar: (id: string) => void; onRecusar: (id: string) => void }) {
  const rgPhoto = pet.pet_imagens?.find((img: any) => img.ordem === 0)?.url || pet.imagem_principal_url;
  const outrasImagens = (pet.pet_imagens || []).filter((img: any) => img.ordem !== 0).sort((a: any, b: any) => a.ordem - b.ordem);

  const InfoItem = ({ label, value }: { label: string; value: any }) => (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-800 capitalize">{value || '—'}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-gray-800">{pet.nome}</h2>
            <p className="text-sm text-gray-500 capitalize">{pet.especie} • {pet.sexo}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            {rgPhoto ? (
              <img src={rgPhoto} alt={pet.nome} className="w-full h-64 object-cover rounded-2xl border border-gray-100 shadow-sm" />
            ) : (
              <div className="w-full h-64 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2 border border-gray-100">
                <PawPrint className="w-10 h-10 text-gray-200" />
                <span className="text-gray-400 text-sm">Sem foto de RG</span>
              </div>
            )}
            {outrasImagens.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {outrasImagens.map((img: any) => (
                  <img key={img.id} src={img.url} alt={pet.nome} className="w-20 h-20 object-cover rounded-xl border border-gray-100 shrink-0" />
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {pet.para_adocao && <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">Para Adocao</span>}
            {pet.comunitario && <span className="px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-bold">Comunitario</span>}
            {!pet.para_adocao && !pet.comunitario && <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">Pet Particular</span>}
            <span className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs font-bold uppercase">Pendente de Aprovacao</span>
          </div>

          {(() => {
            const tutor = Array.isArray(pet.usuarios) ? pet.usuarios[0] : pet.usuarios;
            if (!tutor) return null;
            return (
              <div className="bg-blue-50 rounded-2xl p-5 space-y-4 border border-blue-100">
                <h3 className="font-bold text-blue-800 flex items-center gap-2"><Users className="w-4 h-4" /> Informações do Responsável</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Nome Completo" value={tutor.nome_completo} />
                  <InfoItem label="Telefone" value={tutor.telefone} />
                  <InfoItem label="E-mail" value={tutor.email} />
                </div>
              </div>
            );
          })()}

          <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-gray-700 flex items-center gap-2"><PawPrint className="w-4 h-4" /> Informacoes Basicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Raca" value={pet.raca || 'Sem Raca Definida'} />
              <InfoItem label="Porte" value={pet.porte} />
              <InfoItem label="Cor da Pelagem" value={pet.cor} />
              <InfoItem label="Idade (meses)" value={pet.idade_meses} />
              <InfoItem label="Data de Nascimento" value={pet.data_nascimento ? new Date(pet.data_nascimento).toLocaleDateString('pt-BR') : null} />
              <InfoItem label="Bairro" value={pet.bairro} />
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-gray-700">Saude</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pet.castrado ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-400'}`}>
                  {pet.castrado ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </div>
                <span className="text-sm font-semibold text-gray-700">{pet.castrado ? 'Castrado' : 'Nao Castrado'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pet.microchipado ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-400'}`}>
                  {pet.microchipado ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">{pet.microchipado ? 'Microchipado' : 'Sem Microchip'}</span>
                  {pet.microchipado && pet.numero_microchip && <p className="text-xs text-gray-400 font-mono">{pet.numero_microchip}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pet.sociavel_animais ? 'bg-green-100 text-green-600' : 'bg-orange-50 text-orange-400'}`}>
                  <PawPrint className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-gray-700">{pet.sociavel_animais ? 'Sociavel com animais' : 'Nao sociavel com animais'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pet.sociavel_pessoas ? 'bg-green-100 text-green-600' : 'bg-orange-50 text-orange-400'}`}>
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-gray-700">{pet.sociavel_pessoas ? 'Sociavel com pessoas' : 'Nao sociavel com pessoas'}</span>
              </div>
            </div>
          </div>

          {pet.descricao && (
            <div className="bg-gray-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Descricao</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{pet.descricao}</p>
            </div>
          )}

          {pet.created_at && (
            <p className="text-xs text-gray-400 text-center">Cadastrado em {new Date(pet.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={() => { onAprovar(pet.id); onClose(); }} className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-sm">
              <CheckCircle className="w-4 h-4" /> Aprovar Cadastro
            </button>
            <button onClick={() => { onRecusar(pet.id); onClose(); }} className="flex-1 bg-red-50 text-red-600 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition border border-red-200">
              <XCircle className="w-4 h-4" /> Recusar e Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminSolicitacoes() {
  const [activeTab, setActiveTab] = useState<'pets' | 'sonhos'>('pets');
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [petsTotal, setPetsTotal] = useState(0);
  const [sonhos, setSonhos] = useState<any[]>([]);
  const [loadingSonhos, setLoadingSonhos] = useState(true);

  useEffect(() => {
    if (activeTab === 'pets') loadPets();
    else loadSonhos();
  }, [activeTab]);

  const loadPets = async () => {
    setLoadingPets(true);
    try {
      const { pets: data, total } = await adminListarPets(1, 50, { status: 'cadastrado' });
      setPets(data || []);
      setPetsTotal(total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPets(false);
    }
  };

  const loadSonhos = async () => {
    setLoadingSonhos(true);
    try {
      const { pedidos, total } = await adminListarPetsDosSonhos(1, 50);
      setSonhos(pedidos || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSonhos(false);
    }
  };

  const handleAprovarPet = async (id: string) => {
    if (!window.confirm('Aprovar este pet? Ele ficara disponivel para adocao.')) return;
    try {
      await adminAtualizarStatusPet(id, 'disponivel');
      setPets(pets.filter(p => p.id !== id));
      setPetsTotal(prev => prev - 1);
    } catch { alert('Erro ao aprovar pet'); }
  };

  const handleRecusarPet = async (id: string) => {
    if (!window.confirm('Recusar e EXCLUIR este cadastro? Esta acao nao pode ser desfeita.')) return;
    try {
      await adminDeletarPet(id);
      setPets(pets.filter(p => p.id !== id));
      setPetsTotal(prev => prev - 1);
    } catch { alert('Erro ao excluir pet'); }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Solicitacoes" subtitle="Aprovacoes pendentes e pedidos de adocao especiais" />

      <div className="flex gap-2 border-b border-gray-100 overflow-x-auto pb-px">
        <button onClick={() => setActiveTab('pets')} className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'pets' ? 'border-guapi-green text-guapi-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          <Inbox className="w-4 h-4" /> Aprovacao de Pets
          {petsTotal > 0 && <span className={`px-2 py-0.5 rounded-full text-[10px] ml-1 ${activeTab === 'pets' ? 'bg-guapi-green text-white' : 'bg-gray-200 text-gray-700'}`}>{petsTotal}</span>}
        </button>
        <button onClick={() => setActiveTab('sonhos')} className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'sonhos' ? 'border-guapi-green text-guapi-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          <Heart className="w-4 h-4" /> Pedidos Pet dos Sonhos
        </button>
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'pets' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {loadingPets ? (
              <div className="flex justify-center p-16"><div className="w-10 h-10 border-4 border-guapi-green border-t-transparent rounded-full animate-spin" /></div>
            ) : pets.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-400" /></div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Tudo em dia!</h3>
                <p className="text-gray-500 text-sm">Nenhum pet pendente de aprovacao no momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => {
                  const rgPhoto = pet.pet_imagens?.find((img: any) => img.ordem === 0)?.url || pet.imagem_principal_url;
                  return (
                    <div key={pet.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col cursor-pointer group" onClick={() => setSelectedPet(pet)}>
                      <div className="h-40 bg-gray-50 relative overflow-hidden">
                        {rgPhoto ? (
                          <img src={rgPhoto} alt={pet.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
                            <PawPrint className="w-10 h-10" /><span className="text-sm font-medium">Sem Imagem</span>
                          </div>
                        )}
                        <span className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 border border-yellow-200 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">Pendente</span>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-full shadow-lg">Ver detalhes</span>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-extrabold text-lg text-gray-800 mb-0.5 truncate">{pet.nome}</h3>
                        <p className="text-xs font-medium text-gray-500 mb-1 capitalize truncate">{pet.especie} - {pet.sexo}</p>
                        {pet.raca && <p className="text-[11px] text-gray-400 mb-3 truncate">{pet.raca}</p>}
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {pet.castrado && <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold border border-green-100">Castrado</span>}
                          {pet.microchipado && <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-100">Microchipado</span>}
                          {pet.para_adocao && <span className="text-[9px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold border border-purple-100">Adoção</span>}
                          {pet.comunitario && <span className="text-[9px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-bold border border-orange-100">Comunitário</span>}
                        </div>
                        <div className="flex gap-2 mt-auto">
                          <button onClick={(e) => { e.stopPropagation(); handleAprovarPet(pet.id); }} className="flex-1 bg-emerald-50 text-emerald-700 py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition border border-emerald-200">
                            <CheckCircle className="w-3 h-3" /> Aprovar
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleRecusarPet(pet.id); }} className="flex-1 bg-red-50 text-red-600 py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-red-100 transition border border-red-200">
                            <XCircle className="w-3 h-3" /> Recusar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sonhos' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loadingSonhos ? (
              <div className="flex justify-center p-16"><div className="w-10 h-10 border-4 border-guapi-green border-t-transparent rounded-full animate-spin" /></div>
            ) : sonhos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><Inbox className="w-8 h-8 text-gray-300" /></div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Nenhum pedido encontrado</h3>
                <p className="text-gray-500 text-sm">Nao ha pedidos de pet dos sonhos no momento.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Data</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Solicitante</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Preferencia</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Contato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sonhos.map((pedido) => (
                      <tr key={pedido.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5"><span className="font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-lg text-xs">{new Date(pedido.created_at).toLocaleDateString('pt-BR')}</span></td>
                        <td className="px-6 py-5 font-bold text-gray-800">{pedido.usuarios?.nome_completo || 'Desconhecido'}</td>
                        <td className="px-6 py-5">
                          <ul className="space-y-1 font-medium text-gray-600 text-xs">
                            {pedido.especie && <li>Especie: <span className="font-bold capitalize text-gray-800">{pedido.especie}</span></li>}
                            {pedido.sexo && <li>Sexo: <span className="font-bold capitalize text-gray-800">{pedido.sexo}</span></li>}
                            {pedido.porte && <li>Porte: <span className="font-bold capitalize text-gray-800">{pedido.porte}</span></li>}
                            {pedido.faixa_etaria && <li>Idade: <span className="font-bold capitalize text-gray-800">{pedido.faixa_etaria}</span></li>}
                          </ul>
                          {!pedido.especie && !pedido.sexo && !pedido.porte && !pedido.faixa_etaria && <span className="italic text-gray-400 font-medium">Qualquer caracteristica</span>}
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

      {selectedPet && (
        <PetDetalheModal pet={selectedPet} onClose={() => setSelectedPet(null)} onAprovar={handleAprovarPet} onRecusar={handleRecusarPet} />
      )}
    </div>
  );
}
