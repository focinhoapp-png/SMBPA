import { useEffect, useState } from 'react';
import { adminListarHistorias, adminSalvarHistoria, adminDeletarHistoria } from '../../lib/api/admin';
import { Trash2, Edit2, Plus } from 'lucide-react';

export default function AdminHistorias() {
  const [historias, setHistorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHistoria, setEditingHistoria] = useState<any>(null);
  const [formData, setFormData] = useState({ titulo: '', subtitulo: '', conteudo: '', imagem_url: '', video_url: '', ordem: 0 });
  const [saving, setSaving] = useState(false);

  const loadHistorias = () => {
    setLoading(true);
    adminListarHistorias()
      .then(setHistorias)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadHistorias(); }, []);

  const handleOpenModal = (historia?: any) => {
    if (historia) {
      setEditingHistoria(historia);
      setFormData({
        titulo: historia.titulo || '',
        subtitulo: historia.subtitulo || '',
        conteudo: historia.conteudo || '',
        imagem_url: historia.imagem_url || '',
        video_url: historia.video_url || '',
        ordem: historia.ordem || 0
      });
    } else {
      setEditingHistoria(null);
      setFormData({ titulo: '', subtitulo: '', conteudo: '', imagem_url: '', video_url: '', ordem: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...editingHistoria, ...formData };
      await adminSalvarHistoria(payload);
      setIsModalOpen(false);
      loadHistorias();
    } catch {
      alert('Erro ao salvar história.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja deletar esta história?')) return;
    try {
      await adminDeletarHistoria(id);
      loadHistorias();
    } catch {
      alert('Erro ao deletar história.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Histórias</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-guapi-green text-white px-4 py-2 rounded text-sm hover:bg-guapi-green-dark transition-colors">
          <Plus className="w-4 h-4" /> Nova História
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Mídia</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Título</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ordem</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400">Carregando...</td></tr>
            ) : historias.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400">Nenhuma história encontrada.</td></tr>
            ) : historias.map(h => (
              <tr key={h.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="h-10 w-16 bg-gray-200 rounded overflow-hidden">
                    {h.imagem_url ? (
                       <img src={h.imagem_url} alt="Capa" className="w-full h-full object-cover" />
                    ) : h.video_url ? (
                       <div className="w-full h-full flex items-center justify-center bg-gray-300 text-xs text-gray-600">Vídeo</div>
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sem Mídia</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{h.titulo || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{h.ordem}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenModal(h)} className="text-gray-400 hover:text-blue-500">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(h.id)} className="text-gray-400 hover:text-red-500">
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
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{editingHistoria ? 'Editar História' : 'Nova História'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Título</label>
                  <input type="text" required value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Subtítulo</label>
                  <input type="text" value={formData.subtitulo} onChange={e => setFormData({ ...formData, subtitulo: e.target.value })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">URL da Imagem</label>
                <input type="url" value={formData.imagem_url} onChange={e => setFormData({ ...formData, imagem_url: e.target.value })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">URL do Vídeo (Youtube Embed)</label>
                <input type="url" value={formData.video_url} onChange={e => setFormData({ ...formData, video_url: e.target.value })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Conteúdo (Texto longo)</label>
                <textarea rows={4} value={formData.conteudo} onChange={e => setFormData({ ...formData, conteudo: e.target.value })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ordem de exibição</label>
                <input type="number" value={formData.ordem} onChange={e => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
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
