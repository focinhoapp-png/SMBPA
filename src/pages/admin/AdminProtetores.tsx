import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminListarUsuarios } from '../../lib/api/admin';
import { Plus, X, Check, Send, Trash2 } from 'lucide-react';

export default function AdminProtetores() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Filtros
  const [searchNome, setSearchNome] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchTelefone, setSearchTelefone] = useState('');
  const [searchBairro, setSearchBairro] = useState('');

  const loadUsuarios = () => {
    setLoading(true);
    adminListarUsuarios(page, 50, 'protetor')
      .then(({ usuarios, total }) => {
        setUsuarios(usuarios || []);
        setTotal(total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsuarios(); }, [page]);

  const filtered = usuarios.filter(u => {
    const matchNome = !searchNome || u.nome_completo?.toLowerCase().includes(searchNome.toLowerCase());
    const matchEmail = !searchEmail || u.email?.toLowerCase().includes(searchEmail.toLowerCase());
    const matchTelefone = !searchTelefone || u.telefone?.includes(searchTelefone);
    const matchBairro = !searchBairro || u.bairro?.toLowerCase().includes(searchBairro.toLowerCase());
    return matchNome && matchEmail && matchTelefone && matchBairro;
  });

  const totalPages = Math.ceil(total / 50);

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[26px] text-gray-800">Lista de Proprietários</h1>
        <button className="flex items-center gap-2 bg-[#3f51b5] hover:bg-[#303f9f] text-white px-5 py-2 rounded transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Usuário
        </button>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 p-6 rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="px-4 pt-4 pb-2 font-semibold text-gray-800 border-b border-gray-200">Nome</th>
                <th className="px-4 pt-4 pb-2 font-semibold text-gray-800 border-b border-gray-200">E-mail</th>
                <th className="px-4 pt-4 pb-2 font-semibold text-gray-800 border-b border-gray-200">Telefone</th>
                <th className="px-4 pt-4 pb-2 font-semibold text-gray-800 border-b border-gray-200">Bairro</th>
                <th className="px-4 pt-4 pb-2 font-semibold text-gray-800 border-b border-gray-200">Coordenadas</th>
                <th className="px-4 pt-4 pb-2 font-semibold text-gray-800 border-b border-gray-200"></th>
              </tr>
              <tr>
                <th className="px-4 py-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Buscar"
                    value={searchNome}
                    onChange={(e) => setSearchNome(e.target.value)}
                    className="w-full border-b border-gray-300 py-1 outline-none text-gray-500 font-normal focus:border-gray-500 bg-transparent"
                  />
                </th>
                <th className="px-4 py-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Buscar"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="w-full border-b border-gray-300 py-1 outline-none text-gray-500 font-normal focus:border-gray-500 bg-transparent"
                  />
                </th>
                <th className="px-4 py-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Buscar"
                    value={searchTelefone}
                    onChange={(e) => setSearchTelefone(e.target.value)}
                    className="w-full border-b border-gray-300 py-1 outline-none text-gray-500 font-normal focus:border-gray-500 bg-transparent"
                  />
                </th>
                <th className="px-4 py-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Bairro"
                    value={searchBairro}
                    onChange={(e) => setSearchBairro(e.target.value)}
                    className="w-full border-b border-gray-300 py-1 outline-none text-gray-500 font-normal focus:border-gray-500 bg-transparent"
                  />
                </th>
                <th className="px-4 py-2 border-b border-gray-200">
                  <select className="w-full py-1 outline-none text-gray-800 font-medium bg-transparent cursor-pointer">
                    <option>Todos</option>
                  </select>
                </th>
                <th className="px-4 py-2 border-b border-gray-200"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Carregando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Nenhum usuário encontrado.</td></tr>
              ) : filtered.map((u, index) => (
                <tr 
                  key={u.id} 
                  onClick={() => navigate(`/admin/usuarios/${u.id}`)}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} hover:bg-gray-50 transition-colors cursor-pointer`}
                >
                  <td className="px-4 py-4 text-gray-700">{u.nome_completo || '—'}</td>
                  <td className="px-4 py-4 text-gray-600">{u.email || ''}</td>
                  <td className="px-4 py-4 text-gray-600">{u.telefone || ''}</td>
                  <td className="px-4 py-4 text-gray-600">{u.bairro || ''}</td>
                  <td className="px-4 py-4 text-center">
                    {/* Exemplo de check/x baseado em algum critério, ou fixo no mockup */}
                    {u.coordenadas_validas ? (
                      <Check className="w-4 h-4 mx-auto text-black font-bold" />
                    ) : (
                      <X className="w-4 h-4 mx-auto text-black font-bold" />
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4 text-gray-600 justify-end pr-4">
                      <button 
                        onClick={(e) => e.stopPropagation()} 
                        className="hover:text-gray-900 transition-colors" 
                        title="Enviar Mensagem"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()} 
                        className="hover:text-red-600 transition-colors" 
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}
