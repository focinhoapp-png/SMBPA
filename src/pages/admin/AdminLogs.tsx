import { useEffect, useState } from 'react';
import { adminListarLogs } from '../../lib/api/admin';
import { RefreshCw } from 'lucide-react';

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadLogs = () => {
    setLoading(true);
    adminListarLogs(page, 50)
      .then(({ logs, total }) => {
        setLogs(logs || []);
        setTotal(total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadLogs(); }, [page]);

  const totalPages = Math.ceil(total / 50);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Logs de Auditoria</h1>
        <span className="text-sm text-gray-500">{total} log(s)</span>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex justify-end">
        <button onClick={loadLogs} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm transition-colors">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Data / Hora</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Admin</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ação</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tabela</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ID Afetado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">Carregando...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">Nenhum log encontrado.</td></tr>
            ) : logs.map(l => (
              <tr key={l.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {new Date(l.created_at).toLocaleString('pt-BR')}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {l.admin_usuarios?.nome || 'Sistema'}
                </td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{l.acao}</td>
                <td className="px-4 py-3 text-gray-600">{l.tabela_afetada || '—'}</td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{l.registro_id || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Página {page} de {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-50">Anterior</button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-50">Próxima</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
