import { useEffect, useState } from 'react';
import { adminListarEventos, adminSalvarEvento, adminDeletarEvento } from '../../lib/api/admin';
import { Trash2, Edit2, Plus, Calendar } from 'lucide-react';

export default function AdminEventos() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvento, setEditingEvento] = useState<any>(null);
  const [formData, setFormData] = useState({ titulo: '', data_evento: '', data_fim: '', horario_inicio: '', horario_fim: '', descricao: '', local: '', link_saber_mais: '', imagem_url: '' });
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const loadEventos = () => {
    setLoading(true);
    adminListarEventos()
      .then(setEventos)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadEventos(); }, []);

  const handleOpenModal = (evento?: any) => {
    if (evento) {
      setEditingEvento(evento);
      setFormData({
        titulo: evento.titulo || '',
        data_evento: evento.data_evento ? evento.data_evento.split('T')[0] : '',
        data_fim: evento.data_fim ? evento.data_fim.split('T')[0] : '',
        horario_inicio: evento.horario_inicio || '',
        horario_fim: evento.horario_fim || '',
        descricao: evento.descricao || '',
        local: evento.local || '',
        link_saber_mais: evento.link_saber_mais || '',
        imagem_url: evento.imagem_url || ''
      });
      setImagemFile(null);
    } else {
      setEditingEvento(null);
      setFormData({ titulo: '', data_evento: '', data_fim: '', horario_inicio: '', horario_fim: '', descricao: '', local: '', link_saber_mais: '', imagem_url: '' });
      setImagemFile(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...editingEvento, ...formData };
      delete payload.created_at;
      delete payload.updated_at;
      // remove empty strings for dates
      if (!payload.data_evento) delete payload.data_evento;
      if (!payload.data_fim) payload.data_fim = null;

      await adminSalvarEvento(payload, imagemFile || undefined);
      setIsModalOpen(false);
      loadEventos();
    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar evento: ' + (err.message || 'Erro desconhecido. Veja o console.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja deletar este evento?')) return;
    try {
      await adminDeletarEvento(id);
      loadEventos();
    } catch {
      alert('Erro ao deletar evento.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Eventos</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-guapi-green text-white px-4 py-2 rounded text-sm hover:bg-guapi-green-dark transition-colors">
          <Plus className="w-4 h-4" /> Novo Evento
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Título</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Local</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400">Carregando...</td></tr>
            ) : eventos.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400">Nenhum evento encontrado.</td></tr>
            ) : eventos.map(e => (
              <tr key={e.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{e.titulo || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{new Date(e.data_evento).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3 text-gray-600">{e.local || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenModal(e)} className="text-gray-400 hover:text-blue-500">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(e.id)} className="text-gray-400 hover:text-red-500">
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">{editingEvento ? 'Editar Evento' : 'Novo Evento'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Título</label>
                <input type="text" required value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Data de Início</label>
                  <input type="date" required value={formData.data_evento} onChange={e => setFormData({ ...formData, data_evento: e.target.value })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Data de Encerramento</label>
                  <input type="date" value={formData.data_fim} onChange={e => setFormData({ ...formData, data_fim: e.target.value })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Horário de Início</label>
                  <input type="time" value={formData.horario_inicio} onChange={e => setFormData({ ...formData, horario_inicio: e.target.value })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Horário de Encerramento</label>
                  <input type="time" value={formData.horario_fim} onChange={e => setFormData({ ...formData, horario_fim: e.target.value })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Local</label>
                <input type="text" value={formData.local} onChange={e => setFormData({ ...formData, local: e.target.value })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Link "Saber Mais"</label>
                <input type="url" value={formData.link_saber_mais} onChange={e => setFormData({ ...formData, link_saber_mais: e.target.value })} placeholder="https://" className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Imagem (Opcional)</label>
                <input type="file" accept="image/*" onChange={e => setImagemFile(e.target.files?.[0] || null)} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green" />
                {formData.imagem_url && !imagemFile && (
                  <div className="mt-2 text-xs text-gray-500">Imagem atual já cadastrada.</div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Descrição</label>
                <textarea rows={3} value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-guapi-green resize-none" />
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
