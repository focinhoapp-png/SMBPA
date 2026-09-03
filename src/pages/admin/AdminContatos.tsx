import { useEffect, useState } from 'react';
import { adminListarContatos, adminResponderContato } from '../../lib/api/admin';
import { RefreshCw, ChevronDown, Check, Archive, MessageSquare } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'respondido', label: 'Respondido' },
  { value: 'arquivado', label: 'Arquivado' },
];

const STATUS_BADGE: Record<string, string> = {
  pendente: 'bg-yellow-100 text-yellow-700',
  respondido: 'bg-green-100 text-green-700',
  arquivado: 'bg-gray-100 text-gray-600',
};

export default function AdminContatos() {
  const [contatos, setContatos] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFiltro, setStatusFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resposta, setResposta] = useState('');
  const [salvando, setSalvando] = useState(false);

  const loadContatos = () => {
    setLoading(true);
    adminListarContatos(page, 20, statusFiltro || undefined)
      .then(({ contatos, total }) => {
        setContatos(contatos || []);
        setTotal(total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadContatos(); }, [page, statusFiltro]);

  const handleResponder = async (id: string, status: string) => {
    setSalvando(true);
    try {
      await adminResponderContato(id, resposta, status);
      setExpandedId(null);
      setResposta('');
      loadContatos();
    } catch {
      alert('Erro ao salvar resposta.');
    } finally {
      setSalvando(false);
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Denúncias e Contatos" subtitle={`${total} mensagem(ens) registradas`} />

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-3">
        <select
          value={statusFiltro}
          onChange={e => { setStatusFiltro(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green bg-gray-50 hover:bg-white transition-all text-gray-700"
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button onClick={loadContatos} className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors border border-gray-200">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-guapi-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : contatos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Nenhuma mensagem</h3>
            <p className="text-gray-500 text-sm">Não há contatos ou denúncias com este filtro.</p>
          </div>
        ) : contatos.map((contato: any) => (
          <div key={contato.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <div
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
              onClick={() => {
                setExpandedId(expandedId === contato.id ? null : contato.id);
                setResposta(contato.resposta || '');
              }}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-extrabold text-gray-800 text-lg">{contato.nome}</p>
                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold shadow-sm ${STATUS_BADGE[contato.status] ?? 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                    {contato.status}
                  </span>
                </div>
                <p className="font-medium text-gray-600 mb-1">{contato.assunto || contato.tipo_solicitacao}</p>
                <p className="text-xs font-medium text-gray-400">{contato.email} • {new Date(contato.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-transform duration-300 ${expandedId === contato.id ? 'rotate-180 bg-guapi-green/10 text-guapi-green' : 'text-gray-400'}`}>
                <ChevronDown className="w-5 h-5 shrink-0" />
              </div>
            </div>

            {expandedId === contato.id && (
              <div className="border-t border-gray-100 p-6 bg-gray-50/30">
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Mensagem recebida</p>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-700 whitespace-pre-wrap leading-relaxed">{contato.mensagem}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Sua Resposta</label>
                  <textarea
                    value={resposta}
                    onChange={e => setResposta(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-white resize-none shadow-sm"
                    placeholder="Digite a resposta que será enviada ou armazenada..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    disabled={salvando}
                    onClick={() => handleResponder(contato.id, 'respondido')}
                    className="px-5 py-2.5 text-sm rounded-xl bg-guapi-green text-white hover:bg-[#044F3F] transition-colors font-bold disabled:opacity-50 flex items-center gap-2 shadow-sm"
                  >
                    {salvando ? 'Salvando...' : <><Check className="w-4 h-4" /> Salvar Resposta</>}
                  </button>
                  <button
                    disabled={salvando}
                    onClick={() => handleResponder(contato.id, 'arquivado')}
                    className="px-5 py-2.5 text-sm rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-bold disabled:opacity-50 flex items-center gap-2"
                  >
                    <Archive className="w-4 h-4" /> Arquivar
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
