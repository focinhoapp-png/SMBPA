import { useEffect, useState } from 'react';
import { adminListarAdocoes, adminAtualizarAdocao } from '../../lib/api/admin';
import { RefreshCw, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_analise', label: 'Em Análise' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'recusado', label: 'Recusado' },
  { value: 'concluido', label: 'Concluído' },
];

const STATUS_BADGE: Record<string, string> = {
  pendente: 'bg-yellow-100 text-yellow-700',
  em_analise: 'bg-blue-100 text-blue-700',
  aprovado: 'bg-green-100 text-green-700',
  recusado: 'bg-red-100 text-red-700',
  concluido: 'bg-gray-100 text-gray-700',
};

export default function AdminAdocoes() {
  const [adocoes, setAdocoes] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFiltro, setStatusFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [respostaTexto, setRespostaTexto] = useState('');

  const loadAdocoes = () => {
    setLoading(true);
    adminListarAdocoes(page, 20, statusFiltro || undefined)
      .then(({ adocoes, total }) => {
        setAdocoes(adocoes || []);
        setTotal(total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAdocoes(); }, [page, statusFiltro]);

  const handleAtualizarStatus = async (id: string, status: string) => {
    try {
      await adminAtualizarAdocao(id, status, respostaTexto);
      setExpandedId(null);
      setRespostaTexto('');
      loadAdocoes();
    } catch (err) {
      alert('Erro ao atualizar adoção.');
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Solicitações de Adoção</h1>
        <span className="text-sm text-gray-500">{total} solicitação(ões)</span>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex gap-3">
        <select
          value={statusFiltro}
          onChange={e => { setStatusFiltro(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-guapi-green bg-white"
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button onClick={loadAdocoes} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm transition-colors">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-400 py-12">Carregando...</p>
        ) : adocoes.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Nenhuma solicitação encontrada.</p>
        ) : adocoes.map((adocao: any) => (
          <div key={adocao.id} className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedId(expandedId === adocao.id ? null : adocao.id)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={adocao.pets?.imagem_principal_url || `https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=60&w=50`}
                  alt={adocao.pets?.nome}
                  className="w-12 h-12 rounded-full object-cover bg-gray-200"
                />
                <div>
                  <p className="font-semibold text-gray-800">{adocao.pets?.nome} <span className="text-gray-400 font-normal text-xs ml-1 capitalize">({adocao.pets?.especie})</span></p>
                  <p className="text-sm text-gray-500">Solicitante: <span className="font-medium text-gray-700">{adocao.usuarios?.nome_completo}</span></p>
                  <p className="text-xs text-gray-400">{new Date(adocao.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[adocao.status] ?? 'bg-gray-100 text-gray-700'}`}>
                  {adocao.status}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedId === adocao.id ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {expandedId === adocao.id && (
              <div className="border-t border-gray-100 p-5 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">E-mail</p>
                    <p className="font-medium text-gray-700">{adocao.usuarios?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Telefone</p>
                    <p className="font-medium text-gray-700">{adocao.usuarios?.telefone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Tipo de Moradia</p>
                    <p className="font-medium text-gray-700 capitalize">{adocao.moradia || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Tipo de Interação</p>
                    <p className="font-medium text-gray-700 capitalize">{adocao.tipo_interacao || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Outros Animais</p>
                    <p className="font-medium text-gray-700">{adocao.outros_animais ? 'Sim' : 'Não'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Todos de Acordo</p>
                    <p className="font-medium text-gray-700">{adocao.todos_acordo ? 'Sim' : 'Não'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Resposta / Observação para o solicitante (opcional)</label>
                  <textarea
                    value={respostaTexto}
                    onChange={e => setRespostaTexto(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-guapi-green resize-none"
                    placeholder="Escreva uma resposta..."
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => handleAtualizarStatus(adocao.id, 'em_analise')} className="px-4 py-2 text-sm rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors font-medium">Em Análise</button>
                  <button onClick={() => handleAtualizarStatus(adocao.id, 'aprovado')} className="px-4 py-2 text-sm rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors font-medium">Aprovar</button>
                  <button onClick={() => handleAtualizarStatus(adocao.id, 'concluido')} className="px-4 py-2 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium">Concluído</button>
                  <button onClick={() => handleAtualizarStatus(adocao.id, 'recusado')} className="px-4 py-2 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors font-medium">Recusar</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <span>Página {page} de {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-50">Anterior</button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-50">Próxima</button>
          </div>
        </div>
      )}
    </div>
  );
}
