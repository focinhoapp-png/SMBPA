import { useEffect, useState } from 'react';
import { adminListarBanners, adminSalvarBanner, adminDeletarBanner } from '../../lib/api/admin';
import { RefreshCw, Trash2, Edit2, Plus, Image as ImageIcon } from 'lucide-react';

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [formData, setFormData] = useState({ titulo: '', subtitulo: '', link: '', ordem: 0 });
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const loadBanners = () => {
    setLoading(true);
    adminListarBanners()
      .then(setBanners)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadBanners(); }, []);

  const handleOpenModal = (banner?: any) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        titulo: banner.titulo || '',
        subtitulo: banner.subtitulo || '',
        link: banner.link || '',
        ordem: banner.ordem || 0
      });
    } else {
      setEditingBanner(null);
      setFormData({ titulo: '', subtitulo: '', link: '', ordem: 0 });
    }
    setImagemFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...editingBanner, ...formData };
      await adminSalvarBanner(payload, imagemFile || undefined);
      setIsModalOpen(false);
      loadBanners();
    } catch {
      alert('Erro ao salvar banner.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja deletar este banner?')) return;
    try {
      await adminDeletarBanner(id);
      loadBanners();
    } catch {
      alert('Erro ao deletar banner.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Banners</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-guapi-green text-white px-4 py-2 rounded text-sm hover:bg-guapi-green-dark transition-colors">
          <Plus className="w-4 h-4" /> Novo Banner
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Imagem</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Título</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ordem</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400">Carregando...</td></tr>
            ) : banners.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400">Nenhum banner encontrado.</td></tr>
            ) : banners.map(b => (
              <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img src={b.imagem_url || ''} alt={b.titulo} className="h-12 w-24 object-cover rounded bg-gray-200" />
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{b.titulo || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{b.ordem}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenModal(b)} className="text-gray-400 hover:text-blue-500">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{editingBanner ? 'Editar Banner' : 'Novo Banner'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Título</label>
                <input type="text" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subtítulo</label>
                <input type="text" value={formData.subtitulo} onChange={e => setFormData({ ...formData, subtitulo: e.target.value })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Link de Ação</label>
                <input type="text" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ordem</label>
                <input type="number" value={formData.ordem} onChange={e => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Imagem (Desktop)
                </label>
                <input type="file" accept="image/*" onChange={e => setImagemFile(e.target.files?.[0] || null)} className="w-full text-sm" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-guapi-green text-white hover:bg-guapi-green-dark rounded transition-colors disabled:opacity-50">
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
