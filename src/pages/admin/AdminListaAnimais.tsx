import { useEffect, useState } from 'react';
import { adminListarPets, adminDeletarPet } from '../../lib/api/admin';
import { Trash2, FileSpreadsheet, Upload, PlusCircle, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'disponivel', label: 'Seguro (Disponível)' },
  { value: 'em_processo', label: 'Em Processo' },
  { value: 'adotado', label: 'Adotado' },
  { value: 'cadastrado', label: 'Cadastrado' },
];

const ESPECIE_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'canino', label: 'Canino' },
  { value: 'felino', label: 'Felino' },
  { value: 'ave', label: 'Ave' },
  { value: 'roedor', label: 'Roedor' },
  { value: 'outro', label: 'Outro' },
];

const SEXO_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'macho', label: 'Macho' },
  { value: 'femea', label: 'Fêmea' },
];

export default function AdminListaAnimais() {
  const navigate = useNavigate();
  const [pets, setPets] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [especieFiltro, setEspecieFiltro] = useState('');
  const [nomeFiltro, setNomeFiltro] = useState('');
  const [microchipFiltro, setMicrochipFiltro] = useState('');
  const [sexoFiltro, setSexoFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');

  const loadPets = () => {
    setLoading(true);
    // Usando os filtros existentes no backend (nome e status)
    adminListarPets(page, 50, { search: nomeFiltro, status: statusFiltro || undefined, especie: especieFiltro || undefined })
      .then(({ pets, total }) => {
        let filteredPets = pets || [];
        
        // Filtros no frontend para o que não tem suporte no backend ainda
        if (sexoFiltro) {
          filteredPets = filteredPets.filter(p => p.sexo === sexoFiltro);
        }
        if (microchipFiltro) {
          // Assume que pode haver um campo microchip no banco ou exibe vazio
          filteredPets = filteredPets.filter(p => p.microchip?.includes(microchipFiltro));
        }

        setPets(filteredPets);
        setTotal(total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleLimparPets = async () => {
    if (!window.confirm('Tem certeza que deseja apagar todos os pets exceto o Guará?')) return;
    try {
      setLoading(true);
      const petsToDelete = pets.filter(p => !p.nome.toLowerCase().includes('guará') && !p.nome.toLowerCase().includes('guara'));
      for (const p of petsToDelete) {
        await adminDeletarPet(p.id);
      }
      loadPets();
      alert('Pets removidos com sucesso!');
    } catch (e) {
      console.error(e);
      alert('Erro ao apagar pets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPets(); }, [page, nomeFiltro, statusFiltro, especieFiltro, sexoFiltro, microchipFiltro]);

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja deletar o pet "${nome}"?`)) return;
    try {
      await adminDeletarPet(id);
      loadPets();
    } catch (err) {
      alert('Erro ao deletar pet.');
    }
  };
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Lista de Animais">
        {/* Botões de Ação */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="hidden xl:flex items-center gap-2 bg-[#FA8912]/10 hover:bg-[#FA8912]/20 text-[#FA8912] px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
            <FileSpreadsheet className="w-4 h-4" />
            Exportar
          </button>
          <button className="hidden xl:flex items-center gap-2 bg-[#FA8912]/10 hover:bg-[#FA8912]/20 text-[#FA8912] px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
            <Upload className="w-4 h-4" />
            Importar
          </button>

          <button className="flex items-center gap-2 bg-guapi-green hover:bg-[#044F3F] text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Novo Animal
          </button>
        </div>
      </AdminPageHeader>

      {/* Tabela de Animais */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            {/* Linha 1: Títulos das Colunas */}
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Espécie</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Nome</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Microchip</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Sexo</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Status</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">Ações</th>
            </tr>
            {/* Linha 2: Campos de Filtro */}
            <tr className="border-b border-gray-100 bg-white">
              <th className="px-6 pb-4 font-normal">
                <select 
                  value={especieFiltro}
                  onChange={e => setEspecieFiltro(e.target.value)}
                  className="w-full text-sm font-medium border-0 border-b border-gray-200 bg-transparent focus:ring-0 focus:border-guapi-green pb-2 px-0 text-gray-700"
                >
                  {ESPECIE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </th>
              <th className="px-6 pb-4 font-normal">
                <input 
                  type="text" 
                  placeholder="Buscar Nome"
                  value={nomeFiltro}
                  onChange={e => setNomeFiltro(e.target.value)}
                  className="w-full text-sm font-medium border-0 border-b border-gray-200 bg-transparent focus:ring-0 focus:border-guapi-green pb-2 px-0 placeholder-gray-400 text-gray-700"
                />
              </th>
              <th className="px-6 pb-4 font-normal">
                <input 
                  type="text" 
                  placeholder="Buscar Chip"
                  value={microchipFiltro}
                  onChange={e => setMicrochipFiltro(e.target.value)}
                  className="w-full text-sm font-medium border-0 border-b border-gray-200 bg-transparent focus:ring-0 focus:border-guapi-green pb-2 px-0 placeholder-gray-400 text-gray-700"
                />
              </th>
              <th className="px-6 pb-4 font-normal">
                <select 
                  value={sexoFiltro}
                  onChange={e => setSexoFiltro(e.target.value)}
                  className="w-full text-sm font-medium border-0 border-b border-gray-200 bg-transparent focus:ring-0 focus:border-guapi-green pb-2 px-0 text-gray-700"
                >
                  {SEXO_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </th>
              <th className="px-6 pb-4 font-normal">
                <select 
                  value={statusFiltro}
                  onChange={e => setStatusFiltro(e.target.value)}
                  className="w-full text-sm font-medium border-0 border-b border-gray-200 bg-transparent focus:ring-0 focus:border-guapi-green pb-2 px-0 text-gray-700"
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </th>
              <th className="px-6 pb-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-16 text-gray-400">Carregando...</td></tr>
            ) : pets.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-gray-400">Nenhum pet encontrado.</td></tr>
            ) : pets.map((pet, index) => (
              <tr 
                key={pet.id} 
                onClick={() => navigate(`/admin/lista-animais/${pet.id}`)}
                className="hover:bg-gray-50/50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 text-gray-600 capitalize">{pet.especie || '-'}</td>
                <td className="px-6 py-4 font-bold text-gray-800">
                  <span className="hover:text-guapi-green transition-colors">
                    {pet.nome || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 font-mono text-xs">{pet.microchip || '-'}</td>
                <td className="px-6 py-4 text-gray-600 capitalize">{pet.sexo || '-'}</td>
                <td className="px-6 py-4 text-gray-600 capitalize">
                  <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase inline-block ${
                    pet.status === 'disponivel' ? 'bg-emerald-50 text-emerald-700' : 
                    pet.status === 'em_processo' ? 'bg-yellow-50 text-yellow-700' : 
                    pet.status === 'adotado' ? 'bg-blue-50 text-blue-700' : 
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {pet.status === 'disponivel' ? 'Seguro' : pet.status?.replace('_', ' ') || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(pet.id, pet.nome);
                      }} 
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Deletar"
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
    </div>
  );
}
