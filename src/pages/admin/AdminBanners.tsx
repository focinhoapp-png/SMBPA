import React, { useEffect, useState } from 'react';
import { adminListarBanners, adminSalvarBanner, adminDeletarBanner } from '../../lib/api/admin';
import { RefreshCw, Trash2, Edit2, Plus, Image as ImageIcon, X, Save } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

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
    <div className="space-y-6">
      <AdminPageHeader title="Gerenciar Banners">
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-guapi-green hover:bg-[#044F3F] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors">
          <Plus className="w-4 h-4" /> Novo Banner
        </button>
      </AdminPageHeader>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Imagem</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Título</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Ordem</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-4 border-guapi-green border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-gray-400 font-medium">Carregando banners...</p>
                    </div>
                  </td>
                </tr>
              ) : banners.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Nenhum banner encontrado</h3>
                    <p className="text-gray-500 text-sm">Não há dados para exibir no momento.</p>
                  </td>
                </tr>
              ) : banners.map(b => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-32 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
                      {b.imagem_url ? (
                        <img src={b.imagem_url} alt={b.titulo} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">{b.titulo || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-lg text-xs">{b.ordem}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleOpenModal(b)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto flex flex-col relative">
            <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-800">{editingBanner ? 'Editar Banner' : 'Novo Banner'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6 flex-grow">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Título</label>
                <input type="text" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Subtítulo</label>
                <input type="text" value={formData.subtitulo} onChange={e => setFormData({ ...formData, subtitulo: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Link de Ação</label>
                <input type="text" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white" placeholder="https://" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Ordem de Exibição</label>
                <input type="number" value={formData.ordem} onChange={e => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Imagem do Banner
                </label>
                <input type="file" accept="image/*" onChange={e => setImagemFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-guapi-green/10 file:text-guapi-green hover:file:bg-guapi-green/20 transition-all cursor-pointer" />
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors">Cancelar</button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-guapi-green hover:bg-[#044F3F] text-white rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50">
                  {saving ? 'Salvando...' : <><Save className="w-4 h-4" /> Salvar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
