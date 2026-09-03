import React, { useEffect, useState } from 'react';
import { adminListarEventos, adminSalvarEvento, adminDeletarEvento } from '../../lib/api/admin';
import { Trash2, Edit2, Plus, Calendar, X, Save } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

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
    <div className="space-y-6">
      <AdminPageHeader title="Gerenciar Eventos">
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-guapi-green hover:bg-[#044F3F] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors">
          <Plus className="w-4 h-4" /> Novo Evento
        </button>
      </AdminPageHeader>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Título</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Data</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Local</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-4 border-guapi-green border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-gray-400 font-medium">Carregando eventos...</p>
                    </div>
                  </td>
                </tr>
              ) : eventos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Nenhum evento encontrado</h3>
                    <p className="text-gray-500 text-sm">Não há dados para exibir no momento.</p>
                  </td>
                </tr>
              ) : eventos.map(e => (
                <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800">{e.titulo || '—'}</td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{new Date(e.data_evento).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{e.local || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleOpenModal(e)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(e.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col relative">
            <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-800">{editingEvento ? 'Editar Evento' : 'Novo Evento'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6 flex-grow">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Título do Evento</label>
                <input type="text" required value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Data de Início</label>
                  <input type="date" required value={formData.data_evento} onChange={e => setFormData({ ...formData, data_evento: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Data de Encerramento</label>
                  <input type="date" value={formData.data_fim} onChange={e => setFormData({ ...formData, data_fim: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Horário de Início</label>
                  <input type="time" value={formData.horario_inicio} onChange={e => setFormData({ ...formData, horario_inicio: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Horário de Encerramento</label>
                  <input type="time" value={formData.horario_fim} onChange={e => setFormData({ ...formData, horario_fim: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Local do Evento</label>
                <input type="text" value={formData.local} onChange={e => setFormData({ ...formData, local: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Link "Saber Mais"</label>
                <input type="url" value={formData.link_saber_mais} onChange={e => setFormData({ ...formData, link_saber_mais: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white" placeholder="https://" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Descrição</label>
                <textarea rows={4} value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white resize-none"></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Imagem do Evento (Opcional)</label>
                <input type="file" accept="image/*" onChange={e => setImagemFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-guapi-green/10 file:text-guapi-green hover:file:bg-guapi-green/20 transition-all cursor-pointer" />
                {formData.imagem_url && !imagemFile && (
                  <div className="mt-3 relative w-32 h-20 rounded-xl overflow-hidden border border-gray-200">
                    <img src={formData.imagem_url} alt="Atual" className="w-full h-full object-cover" />
                  </div>
                )}
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
