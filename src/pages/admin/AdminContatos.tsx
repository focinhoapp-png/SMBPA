import { useEffect, useState } from 'react';
import { adminListarContatos, adminResponderContato } from '../../lib/api/admin';
import { RefreshCw, ChevronDown } from 'lucide-react';

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Denúncias SMBEPA Responde</h1>
        <span className="text-sm text-gray-500">{total} mensagem(ens)</span>
      </div>

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
        <button onClick={loadContatos} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm transition-colors">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-gray-400 py-12">Carregando...</p>
        ) : contatos.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Nenhum contato encontrado.</p>
        ) : contatos.map((contato: any) => (
          <div key={contato.id} className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => {
                setExpandedId(expandedId === contato.id ? null : contato.id);
                setResposta(contato.resposta || '');
              }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-800">{contato.nome}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[contato.status] ?? 'bg-gray-100 text-gray-700'}`}>
                    {contato.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{contato.assunto || contato.tipo_solicitacao}</p>
                <p className="text-xs text-gray-400">{contato.email} · {new Date(contato.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${expandedId === contato.id ? 'rotate-180' : ''}`} />
            </div>

            {expandedId === contato.id && (
              <div className="border-t border-gray-100 p-5 space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Mensagem recebida</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap">{contato.mensagem}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Resposta</label>
                  <textarea
                    value={resposta}
                    onChange={e => setResposta(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-guapi-green resize-none"
                    placeholder="Digite a resposta..."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    disabled={salvando}
                    onClick={() => handleResponder(contato.id, 'respondido')}
                    className="px-4 py-2 text-sm rounded bg-guapi-green text-white hover:bg-guapi-green-dark transition-colors font-medium disabled:opacity-50"
                  >
                    {salvando ? 'Salvando...' : 'Salvar Resposta'}
                  </button>
                  <button
                    disabled={salvando}
                    onClick={() => handleResponder(contato.id, 'arquivado')}
                    className="px-4 py-2 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                  >
                    Arquivar
                  </button>
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
