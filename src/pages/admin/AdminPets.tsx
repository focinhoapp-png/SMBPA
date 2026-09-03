import { useEffect, useState } from 'react';
import { adminListarPets, adminAtualizarStatusPet, adminDeletarPet } from '../../lib/api/admin';
import { Search, Trash2, RefreshCw, Eye, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'disponivel', label: 'Disponível' },
  { value: 'em_processo', label: 'Em Processo' },
  { value: 'adotado', label: 'Adotado' },
  { value: 'cadastrado', label: 'Cadastrado' },
];

const STATUS_BADGE: Record<string, string> = {
  disponivel: 'bg-green-100 text-green-700',
  em_processo: 'bg-yellow-100 text-yellow-700',
  adotado: 'bg-blue-100 text-blue-700',
  cadastrado: 'bg-gray-100 text-gray-700',
};

export default function AdminPets() {
  const [pets, setPets] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [loading, setLoading] = useState(true);

  const loadPets = () => {
    setLoading(true);
    adminListarPets(page, 20, { search, status: statusFiltro || undefined })
      .then(({ pets, total }) => {
        setPets(pets || []);
        setTotal(total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPets(); }, [page, search, statusFiltro]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await adminAtualizarStatusPet(id, status);
      loadPets();
    } catch (err) {
      alert('Erro ao atualizar status.');
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja deletar o pet "${nome}"?`)) return;
    try {
      await adminDeletarPet(id);
      loadPets();
    } catch (err) {
      alert('Erro ao deletar pet.');
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Gerenciar Pets" 
        subtitle={`${total} pet(s) encontrado(s)`} 
      />

      {/* Filtros */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white"
          />
        </div>
        <div className="w-full sm:w-64">
          <select
            value={statusFiltro}
            onChange={e => { setStatusFiltro(e.target.value); setPage(1); }}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button onClick={loadPets} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-guapi-green/10 hover:bg-guapi-green/20 text-guapi-green px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
          <RefreshCw className="w-4 h-4" /> 
          <span className="hidden sm:inline">Atualizar</span>
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Pet</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Espécie/Sexo</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Alterar Status</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-4 border-guapi-green border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-gray-400 font-medium">Carregando pets...</p>
                    </div>
                  </td>
                </tr>
              ) : pets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PawPrint className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Nenhum pet encontrado</h3>
                    <p className="text-gray-500 text-sm">Não há dados para exibir no momento.</p>
                  </td>
                </tr>
              ) : pets.map(pet => (
                <tr key={pet.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={pet.imagem_principal_url || `https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=60&w=50&h=50`}
                        alt={pet.nome}
                        className="w-12 h-12 rounded-full object-cover bg-gray-100 ring-4 ring-gray-50"
                      />
                      <span className="font-bold text-gray-800">{pet.nome}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-semibold capitalize">{pet.especie}</span>
                      <span className="text-xs text-gray-500 capitalize mt-0.5">{pet.sexo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase inline-block ${STATUS_BADGE[pet.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {pet.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={pet.status}
                      onChange={e => handleStatusChange(pet.id, e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white"
                    >
                      {STATUS_OPTIONS.filter(o => o.value).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link to={`/descricao-pet/${pet.id}`} target="_blank" className="p-2 text-gray-400 hover:text-guapi-green hover:bg-green-50 rounded-lg transition-colors" title="Ver no site">
                        <Eye className="w-5 h-5" />
                      </Link>
                      <button onClick={() => handleDelete(pet.id, pet.nome)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Deletar">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
