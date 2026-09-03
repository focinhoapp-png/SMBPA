import { useEffect, useState } from 'react';
import { adminListarAdocoes, adminAtualizarAdocao } from '../../lib/api/admin';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { RefreshCw, ChevronDown, Check, X, Clock, AlertCircle, Heart } from 'lucide-react';

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
    <div className="space-y-6">
      <AdminPageHeader 
        title="Solicitações de Adoção" 
        subtitle={`${total} solicitação(ões) registrada(s)`} 
      />

      {/* Filtros */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 flex gap-4 items-center">
        <div className="flex-1">
          <select
            value={statusFiltro}
            onChange={e => { setStatusFiltro(e.target.value); setPage(1); }}
            className="w-full sm:w-64 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button onClick={loadAdocoes} className="flex items-center justify-center gap-2 bg-guapi-green/10 hover:bg-guapi-green/20 text-guapi-green px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
          <RefreshCw className="w-4 h-4" /> 
          <span className="hidden sm:inline">Atualizar</span>
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-guapi-green border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400 font-medium">Buscando adoções...</p>
          </div>
        ) : adocoes.length === 0 ? (
          <div className="text-center bg-white rounded-2xl py-16 shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Nenhuma solicitação encontrada</h3>
            <p className="text-gray-500 text-sm">Não há solicitações de adoção para os filtros selecionados.</p>
          </div>
        ) : adocoes.map((adocao: any) => (
          <div key={adocao.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <div
              className="p-5 sm:px-6 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
              onClick={() => setExpandedId(expandedId === adocao.id ? null : adocao.id)}
            >
              <div className="flex items-center gap-5">
                <img
                  src={adocao.pets?.imagem_principal_url || `https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=60&w=50`}
                  alt={adocao.pets?.nome}
                  className="w-14 h-14 rounded-full object-cover bg-gray-100 ring-4 ring-gray-50"
                />
                <div>
                  <p className="font-bold text-gray-800 text-base">{adocao.pets?.nome} <span className="text-gray-400 font-medium text-xs ml-2 capitalize bg-gray-100 px-2 py-0.5 rounded-full">{adocao.pets?.especie}</span></p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                    <p className="text-sm text-gray-500">Solicitante: <span className="font-semibold text-gray-700">{adocao.usuarios?.nome_completo}</span></p>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(adocao.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold ${STATUS_BADGE[adocao.status] ?? 'bg-gray-100 text-gray-700'}`}>
                  {adocao.status}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${expandedId === adocao.id ? 'bg-gray-100' : 'bg-transparent'}`}>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === adocao.id ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>

            {expandedId === adocao.id && (
              <div className="border-t border-gray-100 bg-gray-50/30 p-6 space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">E-mail</p>
                    <p className="font-semibold text-gray-800">{adocao.usuarios?.email}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Telefone</p>
                    <p className="font-semibold text-gray-800">{adocao.usuarios?.telefone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Tipo de Moradia</p>
                    <p className="font-semibold text-gray-800 capitalize">{adocao.moradia || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Tipo de Interação</p>
                    <p className="font-semibold text-gray-800 capitalize">{adocao.tipo_interacao || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Outros Animais</p>
                    <p className="font-semibold text-gray-800">{adocao.outros_animais ? 'Sim' : 'Não'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Todos de Acordo</p>
                    <p className="font-semibold text-gray-800">{adocao.todos_acordo ? 'Sim' : 'Não'}</p>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                    <AlertCircle className="w-4 h-4"/> 
                    Resposta / Observação para o solicitante
                  </label>
                  <textarea
                    value={respostaTexto}
                    onChange={e => setRespostaTexto(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all resize-none bg-gray-50 hover:bg-white"
                    placeholder="Escreva uma resposta detalhada..."
                  />
                </div>
                
                <div className="flex flex-wrap gap-3 pt-2">
                  <button onClick={() => handleAtualizarStatus(adocao.id, 'em_analise')} className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-bold border border-blue-200">
                    <Clock className="w-4 h-4"/> Em Análise
                  </button>
                  <button onClick={() => handleAtualizarStatus(adocao.id, 'aprovado')} className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors font-bold border border-emerald-200">
                    <Check className="w-4 h-4"/> Aprovar
                  </button>
                  <button onClick={() => handleAtualizarStatus(adocao.id, 'concluido')} className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-bold border border-gray-200">
                    <Check className="w-4 h-4"/> Concluído
                  </button>
                  <button onClick={() => handleAtualizarStatus(adocao.id, 'recusado')} className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-colors font-bold border border-red-200 ml-auto">
                    <X className="w-4 h-4"/> Recusar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between text-sm text-gray-500 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <span className="font-medium">Página {page} de {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 font-semibold transition-colors">Anterior</button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 font-semibold transition-colors">Próxima</button>
          </div>
        </div>
      )}
    </div>
  );
}
