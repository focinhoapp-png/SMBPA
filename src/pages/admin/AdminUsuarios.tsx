import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminListarUsuarios } from '../../lib/api/admin';
import { Plus, X, Check, Send, Trash2, Users } from 'lucide-react';
import AdminUserModal from '../../components/admin/AdminUserModal';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Filtros
  const [searchNome, setSearchNome] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchTelefone, setSearchTelefone] = useState('');
  const [searchBairro, setSearchBairro] = useState('');

  const loadUsuarios = () => {
    setLoading(true);
    adminListarUsuarios(page, 50, 'fisica')
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
    <div className="space-y-6">
      <AdminPageHeader title="Lista de Proprietários">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-guapi-green hover:bg-[#044F3F] text-white px-5 py-2.5 rounded-xl transition-colors text-sm font-bold shadow-sm"
        >
          <Plus className="w-4 h-4" /> Proprietário
        </button>
      </AdminPageHeader>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Nome</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">E-mail</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Telefone</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Bairro</th>
                <th className="px-6 py-4"></th>
              </tr>
              <tr className="bg-white border-b border-gray-100">
                <th className="px-6 pb-4 pt-1 font-normal">
                  <input
                    type="text"
                    placeholder="Buscar Nome"
                    value={searchNome}
                    onChange={(e) => setSearchNome(e.target.value)}
                    className="w-full text-sm font-medium border-0 border-b border-gray-200 bg-transparent focus:ring-0 focus:border-guapi-green pb-2 px-0 placeholder-gray-400 text-gray-700"
                  />
                </th>
                <th className="px-6 pb-4 pt-1 font-normal">
                  <input
                    type="text"
                    placeholder="Buscar E-mail"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="w-full text-sm font-medium border-0 border-b border-gray-200 bg-transparent focus:ring-0 focus:border-guapi-green pb-2 px-0 placeholder-gray-400 text-gray-700"
                  />
                </th>
                <th className="px-6 pb-4 pt-1 font-normal">
                  <input
                    type="text"
                    placeholder="Buscar Telefone"
                    value={searchTelefone}
                    onChange={(e) => setSearchTelefone(e.target.value)}
                    className="w-full text-sm font-medium border-0 border-b border-gray-200 bg-transparent focus:ring-0 focus:border-guapi-green pb-2 px-0 placeholder-gray-400 text-gray-700"
                  />
                </th>
                <th className="px-6 pb-4 pt-1 font-normal">
                  <input
                    type="text"
                    placeholder="Buscar Bairro"
                    value={searchBairro}
                    onChange={(e) => setSearchBairro(e.target.value)}
                    className="w-full text-sm font-medium border-0 border-b border-gray-200 bg-transparent focus:ring-0 focus:border-guapi-green pb-2 px-0 placeholder-gray-400 text-gray-700"
                  />
                </th>
                <th className="px-6 pb-4 pt-1 font-normal"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-4 border-guapi-green border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-gray-400 font-medium">Carregando usuários...</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Nenhum usuário encontrado</h3>
                    <p className="text-gray-500 text-sm">Não há dados para exibir no momento.</p>
                  </td>
                </tr>
              ) : filtered.map((u, index) => (
                <tr 
                  key={u.id} 
                  onClick={() => navigate(`/admin/usuarios/${u.id}`)}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-bold text-gray-800">{u.nome_completo || '—'}</td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{u.email || '—'}</td>
                  <td className="px-6 py-4 font-bold text-gray-700">{u.telefone || '—'}</td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{u.bairro || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <button 
                        onClick={(e) => e.stopPropagation()} 
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      <AdminUserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tipoPerfil="fisica"
        onSuccess={loadUsuarios}
      />
    </div>
  );
}
