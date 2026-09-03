import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, MapPin, Plus, Trash2, Edit2, X, Check, Save, ChevronLeft, ChevronRight, AlertCircle, Building2, Clock
} from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { 
  listarClinicas, adicionarClinica, editarClinica, excluirClinica, 
  listarDatasPorClinica, salvarVagasData, listarAgendamentos, atualizarStatusAgendamento, Clinica, AgendamentoData 
} from '../../lib/api/agendamentos';

export default function AdminAgendamentos() {
  const [activeTab, setActiveTab] = useState<'datas' | 'clinicas' | 'agendados'>('datas');
  
  // States for Agendados
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(false);
  
  // States for Clinicas
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loadingClinicas, setLoadingClinicas] = useState(true);
  const [isClinicaModalOpen, setIsClinicaModalOpen] = useState(false);
  const [editingClinica, setEditingClinica] = useState<Clinica | null>(null);
  const [clinicaFormData, setClinicaFormData] = useState<Partial<Clinica>>({
    tipo: 'fixa', nome: '', endereco: '', bairro: '', cidade: 'Guapimirim/RJ', dias: '', horario: '', observacoes: ''
  });

  // States for Datas
  const [selectedClinicaId, setSelectedClinicaId] = useState<string>('');
  const [datas, setDatas] = useState<AgendamentoData[]>([]);
  const [loadingDatas, setLoadingDatas] = useState(false);
  
  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [vagasGatas, setVagasGatas] = useState<number>(0);
  const [vagasCadelas, setVagasCadelas] = useState<number>(0);
  const [vagasMachos, setVagasMachos] = useState<number>(0);
  const [savingVagas, setSavingVagas] = useState(false);

  useEffect(() => {
    fetchClinicas();
    fetchAgendamentos();
  }, []);

  const fetchAgendamentos = async () => {
    try {
      setLoadingAgendamentos(true);
      const data = await listarAgendamentos();
      setAgendamentos(data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoadingAgendamentos(false);
    }
  };

  const handleUpdateStatusAgendamento = async (id: string, novoStatus: string) => {
    if (!window.confirm(`Deseja alterar o status para ${novoStatus}?`)) return;
    try {
      await atualizarStatusAgendamento(id, novoStatus);
      fetchAgendamentos();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  useEffect(() => {
    if (selectedClinicaId) {
      fetchDatas(selectedClinicaId);
    } else {
      setDatas([]);
    }
  }, [selectedClinicaId]);

  const fetchClinicas = async () => {
    try {
      setLoadingClinicas(true);
      const data = await listarClinicas();
      setClinicas(data);
    } catch (error) {
      console.error('Erro ao buscar clínicas:', error);
    } finally {
      setLoadingClinicas(false);
    }
  };

  const fetchDatas = async (clinicaId: string) => {
    try {
      setLoadingDatas(true);
      const data = await listarDatasPorClinica(clinicaId);
      setDatas(data);
    } catch (error) {
      console.error('Erro ao buscar datas:', error);
    } finally {
      setLoadingDatas(false);
    }
  };

  // ─── Clinicas Handlers ────────────────────────────────────────────────────────
  const handleOpenClinicaModal = (clinica?: Clinica) => {
    if (clinica) {
      setEditingClinica(clinica);
      setClinicaFormData(clinica);
    } else {
      setEditingClinica(null);
      setClinicaFormData({
        tipo: 'fixa', nome: '', endereco: '', bairro: '', cidade: 'Guapimirim/RJ', dias: '', horario: '', observacoes: ''
      });
    }
    setIsClinicaModalOpen(true);
  };

  const handleSaveClinica = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClinica) {
        await editarClinica(editingClinica.id, clinicaFormData);
      } else {
        await adicionarClinica(clinicaFormData as any);
      }
      setIsClinicaModalOpen(false);
      fetchClinicas();
    } catch (error) {
      console.error('Erro ao salvar clínica:', error);
      alert('Erro ao salvar local de atendimento.');
    }
  };

  const handleDeleteClinica = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este local? Todas as datas vinculadas também serão perdidas.')) return;
    try {
      await excluirClinica(id);
      if (selectedClinicaId === id) setSelectedClinicaId('');
      fetchClinicas();
    } catch (error) {
      console.error('Erro ao deletar clínica:', error);
      alert('Erro ao excluir.');
    }
  };

  // ─── Calendar Handlers ────────────────────────────────────────────────────────
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    const existing = datas.find(d => d.data === dateStr);
    setVagasGatas(existing ? existing.vagas_gatas : 0);
    setVagasCadelas(existing ? existing.vagas_cadelas : 0);
    setVagasMachos(existing ? existing.vagas_machos : 0);
  };

  const handleSaveVagas = async () => {
    if (!selectedClinicaId || !selectedDate) return;
    try {
      setSavingVagas(true);
      await salvarVagasData(selectedClinicaId, selectedDate, vagasGatas, vagasCadelas, vagasMachos);
      await fetchDatas(selectedClinicaId);
      setSelectedDate(null);
    } catch (error) {
      console.error('Erro ao salvar vagas:', error);
      alert('Erro ao salvar vagas.');
    } finally {
      setSavingVagas(false);
    }
  };

  // Render Calendar
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50 rounded-lg border border-gray-100"></div>);
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isToday = new Date().toISOString().split('T')[0] === dateStr;
      const dataInfo = datas.find(d => d.data === dateStr);
      const totalVagas = dataInfo ? (dataInfo.vagas_gatas + dataInfo.vagas_cadelas + dataInfo.vagas_machos) : 0;
      const hasVagas = totalVagas > 0;
      
      days.push(
        <div 
          key={dateStr}
          onClick={() => handleDateClick(dateStr)}
          className={`h-24 p-2 rounded-lg border cursor-pointer transition-all hover:border-guapi-green hover:shadow-sm flex flex-col justify-between
            ${isToday ? 'bg-guapi-green/5 border-guapi-green/30' : 'bg-white border-gray-200'}
            ${selectedDate === dateStr ? 'ring-2 ring-guapi-green border-transparent' : ''}
          `}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium ${isToday ? 'text-guapi-green' : 'text-gray-700'}`}>{i}</span>
            {hasVagas && (
              <span className="bg-guapi-green text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {totalVagas} vagas
              </span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">{monthNames[month]} {year}</h3>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={nextMonth} className="p-2 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-7 gap-2 mb-3">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
              <div key={d} className="text-center text-[11px] font-bold uppercase tracking-wider text-gray-400">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Agendamentos de Castração" 
        subtitle="Gerencie as clínicas e vagas disponíveis" 
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('datas')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'datas' ? 'border-guapi-green text-guapi-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
          }`}
        >
          <CalendarDays className="w-4 h-4" /> Datas Disponíveis
        </button>
        <button
          onClick={() => setActiveTab('clinicas')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'clinicas' ? 'border-guapi-green text-guapi-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
          }`}
        >
          <Building2 className="w-4 h-4" /> Locais de Atendimento
        </button>
        <button
          onClick={() => setActiveTab('agendados')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'agendados' ? 'border-guapi-green text-guapi-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
          }`}
        >
          <Check className="w-4 h-4" /> Agendados
        </button>
      </div>

      {/* Tab: Datas Disponíveis */}
      {activeTab === 'datas' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-3">Selecione o Local de Atendimento</label>
            <select
              value={selectedClinicaId}
              onChange={(e) => setSelectedClinicaId(e.target.value)}
              className="w-full md:w-1/2 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white"
            >
              <option value="">-- Selecione uma clínica ou castramóvel --</option>
              {clinicas.map(c => (
                <option key={c.id} value={c.id}>{c.nome} ({c.tipo === 'fixa' ? 'Fixa' : 'Móvel'})</option>
              ))}
            </select>
          </div>

          {selectedClinicaId ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                {renderCalendar()}
              </div>
              <div className="lg:col-span-1 space-y-6">
                {selectedDate ? (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-guapi-green/30 relative">
                    <button onClick={() => setSelectedDate(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">Definir Vagas</h4>
                    <p className="text-sm text-gray-500 mb-6">
                      Data: <span className="font-semibold text-gray-700">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                    </p>
                    
                    <div className="mb-6 space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Gatas</label>
                        <input 
                          type="number" 
                          min="0"
                          value={vagasGatas}
                          onChange={(e) => setVagasGatas(parseInt(e.target.value) || 0)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Cadelas</label>
                        <input 
                          type="number" 
                          min="0"
                          value={vagasCadelas}
                          onChange={(e) => setVagasCadelas(parseInt(e.target.value) || 0)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Machos (Cães e Gatos)</label>
                        <input 
                          type="number" 
                          min="0"
                          value={vagasMachos}
                          onChange={(e) => setVagasMachos(parseInt(e.target.value) || 0)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green transition-all bg-gray-50 hover:bg-white"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> Coloque 0 em todos para remover a data.</p>
                    </div>
                    
                    <button 
                      onClick={handleSaveVagas}
                      disabled={savingVagas}
                      className="w-full bg-guapi-green hover:bg-[#044F3F] text-white py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-sm"
                    >
                      {savingVagas ? 'Salvando...' : <><Save className="w-4 h-4" /> Salvar Vagas</>}
                    </button>
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <CalendarDays className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-500 max-w-[200px] leading-relaxed">Clique em um dia no calendário para gerenciar as vagas disponíveis.</p>
                  </div>
                )}

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-3">Resumo do Mês</h4>
                  <div className="space-y-3">
                    {datas
                      .filter(d => d.data.startsWith(`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`))
                      .sort((a, b) => a.data.localeCompare(b.data))
                      .map(d => (
                        <div key={d.id} className="flex flex-col text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-600">{new Date(d.data + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                            <span className="font-semibold text-guapi-green">{d.vagas_gatas + d.vagas_cadelas + d.vagas_machos} vagas</span>
                          </div>
                          <div className="text-xs text-gray-400 flex gap-2">
                            <span>Gatas: {d.vagas_gatas}</span>
                            <span>Cadelas: {d.vagas_cadelas}</span>
                            <span>Machos: {d.vagas_machos}</span>
                          </div>
                        </div>
                    ))}
                    {datas.filter(d => d.data.startsWith(`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`)).length === 0 && (
                      <p className="text-sm text-gray-400 italic">Nenhuma data cadastrada neste mês.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Selecione um local de atendimento para ver e editar o calendário.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Clínicas */}
      {activeTab === 'clinicas' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Locais Cadastrados</h2>
            <button 
              onClick={() => handleOpenClinicaModal()}
              className="bg-guapi-green hover:bg-guapi-green-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Novo Local
            </button>
          </div>

          {loadingClinicas ? (
            <div className="text-center py-8 text-gray-500">Carregando locais...</div>
          ) : clinicas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum local cadastrado ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clinicas.map(clinica => (
                <div key={clinica.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-md">
                  <div className={`p-5 border-b border-gray-100 flex justify-between items-start ${clinica.tipo === 'fixa' ? 'bg-blue-50/30' : 'bg-orange-50/30'}`}>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 inline-block ${clinica.tipo === 'fixa' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                        {clinica.tipo === 'fixa' ? 'Clínica Fixa' : 'Castramóvel'}
                      </span>
                      <h3 className="font-bold text-gray-800 leading-tight">{clinica.nome}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleOpenClinicaModal(clinica)} className="p-1.5 text-gray-400 hover:text-guapi-green hover:bg-green-50 rounded-md transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteClinica(clinica.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="p-5 flex-grow text-sm space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-50 p-2 rounded-lg shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-gray-600">{clinica.endereco}, {clinica.bairro} - {clinica.cidade}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-50 p-2 rounded-lg shrink-0 mt-0.5">
                        <CalendarDays className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-gray-600">{clinica.dias} • {clinica.horario}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Clínica */}
      {isClinicaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{editingClinica ? 'Editar Local' : 'Novo Local'}</h2>
              <button onClick={() => setIsClinicaModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="clinica-form" onSubmit={handleSaveClinica} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input type="text" required value={clinicaFormData.nome} onChange={e => setClinicaFormData({...clinicaFormData, nome: e.target.value})} className="w-full border-gray-300 rounded-md focus:border-guapi-green focus:ring-guapi-green" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select required value={clinicaFormData.tipo} onChange={e => setClinicaFormData({...clinicaFormData, tipo: e.target.value as any})} className="w-full border-gray-300 rounded-md focus:border-guapi-green focus:ring-guapi-green">
                      <option value="fixa">Clínica Fixa</option>
                      <option value="castramóvel">Castramóvel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dias de Funcionamento</label>
                    <input type="text" required placeholder="Ex: Segunda a Sexta" value={clinicaFormData.dias} onChange={e => setClinicaFormData({...clinicaFormData, dias: e.target.value})} className="w-full border-gray-300 rounded-md focus:border-guapi-green focus:ring-guapi-green" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                    <input type="text" required placeholder="Ex: 08:00 às 17:00" value={clinicaFormData.horario} onChange={e => setClinicaFormData({...clinicaFormData, horario: e.target.value})} className="w-full border-gray-300 rounded-md focus:border-guapi-green focus:ring-guapi-green" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP / Bairro</label>
                    <input type="text" required value={clinicaFormData.bairro} onChange={e => setClinicaFormData({...clinicaFormData, bairro: e.target.value})} className="w-full border-gray-300 rounded-md focus:border-guapi-green focus:ring-guapi-green" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço (Rua, Número)</label>
                    <input type="text" required value={clinicaFormData.endereco} onChange={e => setClinicaFormData({...clinicaFormData, endereco: e.target.value})} className="w-full border-gray-300 rounded-md focus:border-guapi-green focus:ring-guapi-green" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações Especiais (Opcional)</label>
                    <textarea rows={3} value={clinicaFormData.observacoes || ''} onChange={e => setClinicaFormData({...clinicaFormData, observacoes: e.target.value})} className="w-full border-gray-300 rounded-md focus:border-guapi-green focus:ring-guapi-green"></textarea>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <button type="button" onClick={() => setIsClinicaModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-md transition-colors">Cancelar</button>
              <button type="submit" form="clinica-form" className="px-4 py-2 bg-guapi-green hover:bg-guapi-green-dark text-white font-medium rounded-md transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Agendados */}
      {activeTab === 'agendados' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loadingAgendamentos ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-10 h-10 border-4 border-guapi-green border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-400 font-medium">Carregando agendamentos...</p>
              </div>
            ) : agendamentos.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Nenhum agendamento encontrado</h3>
                <p className="text-gray-500 text-sm">Não há dados para exibir no momento.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Data / Local</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Tutor</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Animal</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {agendamentos.map(ag => (
                      <tr key={ag.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800">
                            {ag.data_agendamento ? new Date(ag.data_agendamento + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{ag.clinica?.nome || 'Local Desconhecido'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800">{ag.usuario?.nome_completo || 'Desconhecido'}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{ag.usuario?.telefone || '-'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800">{ag.pet?.nome || 'Desconhecido'}</div>
                          <div className="text-xs text-gray-500 mt-0.5 capitalize">{ag.pet?.especie || '-'} • {ag.pet?.sexo || '-'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase inline-block ${
                            ag.status === 'agendado' ? 'bg-blue-50 text-blue-700' :
                            ag.status === 'concluido' ? 'bg-emerald-50 text-emerald-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {ag.status.charAt(0).toUpperCase() + ag.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {ag.status === 'agendado' && (
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleUpdateStatusAgendamento(ag.id, 'concluido')}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
                              >
                                <Check className="w-3.5 h-3.5"/> Concluir
                              </button>
                              <button 
                                onClick={() => handleUpdateStatusAgendamento(ag.id, 'cancelado')}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors border border-red-200"
                              >
                                <X className="w-3.5 h-3.5"/> Cancelar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
