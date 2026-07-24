import { useEffect, useState } from 'react';
import { adminListarPets, adminAtualizarStatusPet, adminDeletarPet } from '../../lib/api/admin';
import { Search, Trash2, RefreshCw, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Pets</h1>
        <span className="text-sm text-gray-500">{total} pet(s) encontrado(s)</span>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-guapi-green"
          />
        </div>
        <select
          value={statusFiltro}
          onChange={e => { setStatusFiltro(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-guapi-green bg-white"
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button onClick={loadPets} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm transition-colors">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Foto</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nome</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Espécie</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Sexo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Alterar Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">Carregando...</td></tr>
            ) : pets.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">Nenhum pet encontrado.</td></tr>
            ) : pets.map(pet => (
              <tr key={pet.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <img
                    src={pet.imagem_principal_url || `https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=60&w=50&h=50`}
                    alt={pet.nome}
                    className="w-10 h-10 rounded-full object-cover bg-gray-200"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{pet.nome}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{pet.especie}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{pet.sexo}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[pet.status] ?? 'bg-gray-100 text-gray-700'}`}>
                    {pet.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={pet.status}
                    onChange={e => handleStatusChange(pet.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-guapi-green"
                  >
                    {STATUS_OPTIONS.filter(o => o.value).map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/descricao-pet/${pet.id}`} target="_blank" className="text-gray-400 hover:text-guapi-green transition-colors" title="Ver no site">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(pet.id, pet.nome)} className="text-gray-400 hover:text-red-500 transition-colors" title="Deletar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginação */}
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
