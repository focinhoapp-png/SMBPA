import { useState, useEffect } from 'react';
import { ChevronDown, Scissors, MapPin, Clock, CheckCircle, AlertTriangle, Info, CalendarDays, ChevronLeft, ChevronRight, X, Download, Printer, Dog, Cat } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { listarClinicas, listarDatasPorClinica, realizarAgendamento, Clinica, AgendamentoData } from '../lib/api/agendamentos';
import { getCurrentUser } from '../lib/api/auth';
import { meusPets, Pet } from '../lib/api/pets';
import { logoBase64 } from '../lib/logoBase64';
import { useNavigate } from 'react-router-dom';

const TERMOS = [
  'O animal precisa residir na cidade de Guapimirim/RJ;',
  'O animal deverá ter no mínimo 6 meses de idade;',
  'O animal deverá ter no máximo 7 anos de idade;',
  'O animal deve estar em jejum absoluto (água e comida) por um período de 8 horas antes da cirurgia;',
  'Se possível, dê banho no animal um dia antes do procedimento;',
  'O animal não pode ter sido vacinado com menos de 21 dias da data do procedimento;',
  'No dia da cirurgia, informar ao veterinário caso o animal esteja fazendo uso de algum medicamento;',
  'Fêmeas no cio, gestantes ou que estão amamentando não poderão ser castradas;',
  'Cães (machos e fêmeas) devem ser levados com guias e coleiras. Caso sejam agressivos, usar focinheira;',
  'Cães e gatos devem ter os dois testículos no saco escrotal;',
  'O animal passará pela avaliação do veterinário antes da cirurgia, e caso ele julgue necessário, o animal não será castrado;',
  'O responsável deverá levar um documento de identidade com foto no dia da cirurgia. Caso seja digital, levar impresso;',
  'O responsável deverá permanecer na clínica veterinária durante todo o procedimento.',
];

const PRIVACIDADE = 'AVISO DE PRIVACIDADE: Informamos que os dados pessoais fornecidos neste atendimento poderão ser coletados, tratados e compartilhados pela Administração Pública Municipal, no âmbito de suas competências legais e para execução de políticas públicas. O tratamento será realizado em conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais – LGPD), observando os princípios da finalidade, adequação, necessidade, segurança e transparência.';

export default function Castracao() {
  const navigate = useNavigate();
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [datas, setDatas] = useState<AgendamentoData[]>([]);
  const [clinicaSelecionada, setClinicaSelecionada] = useState<Clinica | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isOrientacoesModalOpen, setIsOrientacoesModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agendamentoError, setAgendamentoError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [usuario, setUsuario] = useState<any>(null);
  const [petsData, setPetsData] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');

  useEffect(() => {
    fetchClinicas();
    fetchUserAndPets();
  }, []);

  const fetchUserAndPets = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setUsuario(user);
        const userPets = await meusPets();
        if (userPets.length === 0) {
          navigate('/cadastrar-animal', { replace: true });
          return;
        }
        setPetsData(userPets);
        setSelectedPetId(userPets[0].id);
      }
    } catch (err) {
      console.error('Erro ao buscar usuário e pets', err);
    }
  };

  const fetchClinicas = async () => {
    try {
      const data = await listarClinicas();
      setClinicas(data);
    } catch (error) {
      console.error('Erro ao buscar clínicas:', error);
    } finally {
      setLoading(false);
    }
  };


  const getPrintHTML = () => {
    const petName = petsData.length === 1 
      ? `${petsData[0].nome} (${petsData[0].especie})` 
      : (petsData.find(p => p.id === selectedPetId)?.nome || '');
      
    const dateStr = dataSelecionada ? new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR') : '';

    return `
      <html>
        <head>
          <title>Orientações Pré-Operatórias</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            
            @page {
              size: A4;
              margin: 0;
            }

            body { 
              font-family: 'Arial', sans-serif; 
              margin: 0; 
              padding: 0;
              background-color: #fff;
              color: #000;
              box-sizing: border-box;
            }

            .a4-page {
              width: 210mm;
              height: 297mm;
              padding: 20mm;
              margin: 0 auto;
              position: relative;
              background: #fff;
              box-sizing: border-box;
              overflow: hidden;
            }

            .header-pets {
              width: 100%;
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }

            .title {
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 25px;
            }

            .fields-container {
              display: flex;
              flex-direction: column;
              gap: 15px;
              margin-bottom: 35px;
              padding: 0 20px;
            }

            .fields-row {
              display: flex;
              justify-content: center;
              gap: 30px;
            }

            .field {
              font-size: 14px;
              display: flex;
              align-items: center;
            }

            .field-label {
              font-weight: normal;
              text-transform: uppercase;
              margin-right: 5px;
            }

            .field-value {
              font-weight: bold;
              border-bottom: 1px solid #000;
              min-width: 150px;
              padding: 0 5px;
              text-align: center;
            }

            ol { 
              margin: 0 0 35px 0; 
              padding-left: 30px;
              line-height: 1.8; 
              font-size: 14px; 
              color: #000;
            }

            ol li {
              margin-bottom: 15px;
              padding-left: 5px;
            }

            .warnings {
              text-align: center;
              font-size: 14px;
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 40px;
            }

            .warnings div {
              margin-bottom: 10px;
            }

            .footer-logo {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .footer-logo img {
              height: 220px;
              width: auto;
              max-width: 100%;
              opacity: 0.9;
              object-fit: contain;
              mix-blend-mode: multiply;
            }

            @media print {
              html, body {
                width: 210mm;
                height: 297mm;
              }
              body > *:not(.a4-page) {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="a4-page">
            
            <div class="header-pets">
              ${renderToString(
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '30px' }}>
                  <Dog size={100} strokeWidth={1} color="#000" />
                  <Cat size={85} strokeWidth={1} color="#000" />
                  <Dog size={115} strokeWidth={1} color="#000" />
                  <Cat size={95} strokeWidth={1} color="#000" />
                </div>
              )}
            </div>
            
            <div class="title">
              Orientações Pré Operatórias
            </div>

            <div class="fields-container">
              <div class="fields-row">
                <div class="field">
                  <span class="field-label">Data da cirurgia:</span>
                  <span class="field-value">${dateStr}</span>
                </div>
                <div class="field">
                  <span class="field-label">Horário de chegada:</span>
                  <span class="field-value">${clinicaSelecionada?.horario || ''}</span>
                </div>
              </div>
              <div class="fields-row">
                <div class="field">
                  <span class="field-label">ANIMAL:</span>
                  <span class="field-value">${petName}</span>
                </div>
                <div class="field">
                  <span class="field-label">TUTOR:</span>
                  <span class="field-value">${usuario?.nome_completo || ''}</span>
                </div>
              </div>
            </div>

            <ol>
              <li>Período de jejum (água e alimentos): das 22h00 às 23h00, antes da cirurgia.</li>
              <li>Banho: no dia anterior com shampoo neutro;</li>
              <li>Levar xerox do RG, CPF e COMPROVANTE DE RESIDÊNCIA;</li>
              <li>Levar tapete higiênico (1 por animal);</li>
              <li>Cães devem ser levados com coleira e guia (animais agressivos devem estar com focinheira);</li>
              <li>Gatos devem ser levados dentro da caixa de transporte própria;</li>
              <li>Caso outra pessoa leve o animal em seu lugar, é necessário apresentar uma declaração com autorização para representação;</li>
              <li>Apresentar caderneta de vacinação com a vacina antirrábica em dia, a vacina deve ser feita com um prazo de 15 dias antes da castração;</li>
              <li>O animal deverá realizar exame de sangue pré-operatório e apresentar no dia da cirurgia (HEMOGRAMA, ALT e CREATININA) – Os exames pré-operatórios têm validade de 30 dias apenas.</li>
            </ol>

            <div class="warnings">
              <div>* NÃO SERÃO ACEITOS EXAMES COM PRAZO DE VALIDADE SUPERIOR A 30 DIAS.</div>
              <div>* É NECESSÁRIO APRESENTAÇÃO DESTE DOCUMENTO NO DIA DA CIRURGIA.</div>
            </div>

            <div class="footer-logo">
              <img src="${logoBase64}" alt="Logo Guapimirim" />
            </div>

          </div>

          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) {
      alert('Por favor, permita pop-ups para imprimir.');
      return;
    }
    const html = getPrintHTML();
    win.document.write(html);
    win.document.close();
  };

  const handleSavePDF = () => {
    const processPDF = () => {
      const html = getPrintHTML();
      
      const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
      const styleContent = styleMatch ? styleMatch[1] : '';
      
      const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
      const bodyContent = bodyMatch ? bodyMatch[1] : '';

      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.innerHTML = `<style>${styleContent}</style>${bodyContent}`;
      document.body.appendChild(container);
      
      const targetElement = container.querySelector('.a4-page') || container;

      const opt = {
        margin:       0,
        filename:     'orientacoes-cirurgia.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      (window as any).html2pdf().set(opt).from(targetElement).save().then(() => {
        document.body.removeChild(container);
      });
    };

    if (!(window as any).html2pdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => processPDF();
      document.body.appendChild(script);
    } else {
      processPDF();
    }
  };

  const fetchDatas = async (clinicaId: string) => {
    try {
      const datasAgendamento = await listarDatasPorClinica(clinicaId);
      setDatas(datasAgendamento);
    } catch (error) {
      console.error('Erro ao buscar datas:', error);
    }
  };

  const handleSelectClinica = async (clinica: Clinica) => {
    setClinicaSelecionada(clinica);
    setAceitouTermos(false);
    setDataSelecionada(null);
    setIsOpen(false);
    await fetchDatas(clinica.id);
  };

  const handleAgendar = async () => {
    if (!usuario || !selectedPetId || !clinicaSelecionada || !dataSelecionada) {
      setAgendamentoError('Dados incompletos para agendamento.');
      return;
    }
    
    const pet = petsData.find(p => p.id === selectedPetId);
    if (!pet) return;

    try {
      setIsSubmitting(true);
      setAgendamentoError('');
      await realizarAgendamento(
        usuario.id,
        pet.id,
        clinicaSelecionada.id,
        dataSelecionada,
        pet.especie,
        pet.sexo
      );
      
      setIsOrientacoesModalOpen(false);
      setIsSuccessModalOpen(true);
      fetchDatas(clinicaSelecionada.id);
    } catch (err: any) {
      setAgendamentoError(err.message || 'Erro ao realizar o agendamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 bg-gray-50/50 rounded-lg border border-gray-100"></div>);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dataInfo = datas.find(d => d.data === dateStr);
      const totalVagas = dataInfo ? (dataInfo.vagas_gatas + dataInfo.vagas_cadelas + dataInfo.vagas_machos) : 0;
      const isAvailable = totalVagas > 0;
      
      days.push(
        <div 
          key={dateStr}
          onClick={() => isAvailable && setDataSelecionada(dateStr)}
          className={`h-16 p-2 rounded-lg border flex flex-col items-center justify-center transition-all 
            ${isAvailable ? 'cursor-pointer bg-guapi-green border-guapi-green hover:bg-[#044F3F] hover:shadow-sm shadow-sm' : 'cursor-not-allowed bg-gray-50 text-gray-400 border-gray-100'}
            ${dataSelecionada === dateStr ? 'ring-2 ring-offset-2 ring-guapi-green' : ''}
          `}
        >
          <span className={`text-sm font-bold ${isAvailable ? 'text-white' : ''}`}>{i}</span>
          {isAvailable && (
            <span className="text-[10px] font-bold text-white/90 mt-1">{totalVagas} vagas</span>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-guapi-orange" /> {monthNames[month]} {year}
          </h3>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-1 rounded-md text-gray-600 hover:bg-gray-200 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={nextMonth} className="p-1 rounded-md text-gray-600 hover:bg-gray-200 transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
              <div key={d} className="text-center text-xs font-bold text-gray-400">{d}</div>
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
    <div className="font-sans bg-gray-50 selection:bg-guapi-orange selection:text-white pt-[80px] min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col">
        {/* Banner */}
        <section className="bg-guapi-green py-12 px-4 shadow-sm relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-4">
              <Scissors className="w-10 h-10 text-guapi-orange" />
              <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-md tracking-tight">
                Castração <span className="text-guapi-orange">Gratuita</span>
              </h1>
            </div>
            <p className="text-lg md:text-xl text-center text-gray-100 max-w-2xl font-medium">
              A Secretaria Municipal de Bem - Estar e Proteção Animal oferece castração gratuita para cães e gatos de tutores residentes no município. Agende agora!
            </p>
          </div>
          <div className="absolute top-0 right-10 w-32 h-32 md:w-64 md:h-64 bg-guapi-orange rounded-bl-full opacity-90 transform translate-x-1/4 -translate-y-1/4" />
        </section>



        {/* Formulário de Agendamento */}
        <section className="py-12 px-4 flex-grow">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Agendamento de Castração</h2>

            {/* Dropdown Clínica */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Escolha uma clínica ou castramóvel
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full flex items-center justify-between bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-left text-gray-700 hover:border-guapi-green transition-colors focus:outline-none focus:border-guapi-green shadow-sm"
                >
                  <span className={clinicaSelecionada ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                    {clinicaSelecionada ? clinicaSelecionada.nome : 'Selecione um local de atendimento...'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-sm text-gray-500">Carregando locais...</div>
                    ) : clinicas.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">Nenhum local cadastrado no momento.</div>
                    ) : (
                      clinicas.map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSelectClinica(c)}
                          className="w-full text-left px-4 py-3 hover:bg-guapi-green/5 text-sm text-gray-700 border-b last:border-0 border-gray-100 transition-colors"
                        >
                          <div className="font-semibold">{c.nome}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{c.bairro} · {c.dias} · {c.horario}</div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Detalhes da Clínica Selecionada */}
            {clinicaSelecionada && (
              <div className="animate-[fadeIn_0.3s_ease]">
                {/* Header laranja */}
                <div className="bg-guapi-orange rounded-t-xl px-6 py-4">
                  <h3 className="text-white font-bold text-lg leading-tight">{clinicaSelecionada.nome}</h3>
                </div>

                <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl px-6 py-5 shadow-sm">
                  {/* Endereço */}
                  <div className="flex items-start gap-2 mb-5 pb-5 border-b border-gray-100">
                    <MapPin className="w-4 h-4 text-guapi-orange shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-sm text-gray-700">Endereço: </span>
                      <span className="text-sm text-gray-600">
                        {clinicaSelecionada.endereco}, {clinicaSelecionada.bairro} – {clinicaSelecionada.cidade}
                      </span>
                    </div>
                  </div>

                  {/* Horário */}
                  <div className="flex items-center gap-2 mb-6 pb-5 border-b border-gray-100">
                    <Clock className="w-4 h-4 text-guapi-orange shrink-0" />
                    <span className="font-semibold text-sm text-gray-700">Horário: </span>
                    <span className="text-sm text-gray-600">{clinicaSelecionada.dias} – {clinicaSelecionada.horario}</span>
                  </div>

                  {/* Calendário */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Escolha a data do agendamento</h4>
                    {renderCalendar()}
                    {dataSelecionada && (
                      <div className="bg-guapi-green/10 border border-guapi-green/20 rounded-lg p-3 text-center text-sm font-medium text-guapi-green">
                        Data selecionada: {new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>

                  {/* Termos */}
                  <div className="mb-5">
                    <p className="text-sm text-gray-700 font-semibold mb-3">
                      Antes de iniciar o agendamento, é preciso concordar que está ciente e concorda com os termos da castração:
                    </p>
                    <ul className="space-y-2">
                      {TERMOS.map((termo, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-guapi-orange">
                          <span className="shrink-0 mt-1">•</span>
                          <span>{termo}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Observação específica da clínica */}
                    {clinicaSelecionada.observacoes && (
                      <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 font-medium">
                          <strong>Observação:</strong> {clinicaSelecionada.observacoes}
                          {clinicaSelecionada.limiteKg && ` Limite máximo de peso: ${clinicaSelecionada.limiteKg} kg por animal.`}
                        </p>
                      </div>
                    )}

                    {/* LGPD */}
                    <div className="mt-4 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-800">{PRIVACIDADE}</p>
                    </div>
                  </div>

                  {/* Checkbox Aceite */}
                  <label className="flex items-center gap-3 cursor-pointer group mb-6 select-none">
                    <div
                      onClick={() => setAceitouTermos(!aceitouTermos)}
                      className={`w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center transition-all ${
                        aceitouTermos
                          ? 'bg-guapi-orange border-guapi-orange'
                          : 'border-gray-300 bg-white group-hover:border-guapi-orange'
                      }`}
                    >
                      {aceitouTermos && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Estou ciente e quero prosseguir</span>
                  </label>

                  {/* Botão Agendar */}
                  {aceitouTermos && dataSelecionada && (
                    <div className="animate-[fadeIn_0.3s_ease]">
                      <button
                        type="button"
                        onClick={() => setIsConfirmModalOpen(true)}
                        className="block w-full text-center bg-guapi-orange hover:bg-guapi-orange/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Realizar Agendamento
                      </button>
                      <p className="text-xs text-center text-gray-500 mt-2">
                        Você será redirecionado para a plataforma de agendamento.
                      </p>
                    </div>
                  )}
                  {aceitouTermos && !dataSelecionada && (
                    <div className="text-center p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                      Por favor, selecione uma data no calendário acima para prosseguir.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sem clínica selecionada */}
            {!clinicaSelecionada && (
              <div className="text-center py-16 text-gray-400">
                <Scissors className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">Selecione um local de atendimento acima para ver os detalhes e realizar o agendamento.</p>
              </div>
            )}
          </div>
        </section>
        {/* Modal de Confirmação */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-[fadeIn_0.2s_ease]">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-[scaleIn_0.2s_ease]">
              <div className="bg-amber-100 p-5 flex items-center gap-3 border-b border-amber-200">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
                <h2 className="text-xl font-bold text-amber-900">Atenção</h2>
              </div>
              
              <div className="p-6 space-y-4 text-gray-700 text-sm leading-relaxed">
                <p className="font-semibold">
                  Antes de confirmar o agendamento, pedimos que tenha certeza de que poderá comparecer na data e horário escolhidos.
                </p>
                <p>
                  As vagas para a castração gratuita são limitadas e, ao realizar o agendamento, essa vaga fica reservada exclusivamente para o seu pet. Quando ocorre uma falta sem aviso prévio, outro animalzinho que poderia ser atendido acaba perdendo essa oportunidade.
                </p>
                <p>
                  Por isso, contamos com a sua responsabilidade e compromisso. Caso não possa comparecer, pedimos que comunique nossa equipe com antecedência, para que a vaga possa ser disponibilizada para outro animal.
                </p>
                <p className="text-red-600 font-semibold bg-red-50 p-3 rounded-lg border border-red-100">
                  Em caso de não comparecimento sem aviso prévio, poderá ser aplicada uma suspensão de 60 dias para a realização de novos agendamentos no Projeto de Castração Gratuita.
                </p>
                <p className="italic">
                  Ao continuar, você declara estar ciente deste aviso e confirma que poderá comparecer na data e horário escolhidos.
                </p>
              </div>

              <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                <button 
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setIsOrientacoesModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-guapi-orange hover:bg-guapi-orange/90 text-white font-bold rounded-lg transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Orientações Pré-Operatórias */}
        {isOrientacoesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-[fadeIn_0.2s_ease]">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-[scaleIn_0.2s_ease]">
              <div className="bg-guapi-green p-5 flex items-center justify-between border-b border-guapi-green-dark rounded-t-2xl">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Info className="w-6 h-6" /> Orientações Pré-Operatórias
                </h2>
                <button onClick={() => setIsOrientacoesModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-gray-50 p-5 border-b border-gray-100 flex flex-col gap-3 text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-bold text-gray-700 w-32">Animal:</span>
                  {petsData.length > 1 ? (
                    <select 
                      value={selectedPetId}
                      onChange={(e) => setSelectedPetId(e.target.value)}
                      className="border-gray-300 rounded-md py-1 px-2 text-sm focus:border-guapi-green focus:ring-guapi-green w-full max-w-xs"
                    >
                      {petsData.map(p => (
                        <option key={p.id} value={p.id}>{p.nome} ({p.especie})</option>
                      ))}
                    </select>
                  ) : petsData.length === 1 ? (
                    <span className="text-gray-600 font-medium">{petsData[0].nome} ({petsData[0].especie})</span>
                  ) : (
                    <span className="text-red-500 italic text-sm">Nenhum animal cadastrado. <a href="/cadastrar-animal" className="underline font-bold">Cadastre aqui</a>.</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700 w-32">Tutor:</span>
                  <span className="text-gray-600 font-medium">{usuario?.nome_completo || 'Carregando...'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700 w-32">Data da cirurgia:</span>
                  <span className="text-gray-600 font-medium">{dataSelecionada ? new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR') : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700 w-32">Horário de chegada:</span>
                  <span className="text-gray-600 font-medium">{clinicaSelecionada?.horario}</span>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-4 text-gray-700 text-sm leading-relaxed">
                <ol className="list-decimal list-inside space-y-3 font-medium">
                  <li>Período de jejum (água e alimentos): das 22h00 às 23h00, antes da cirurgia.</li>
                  <li>Banho: no dia anterior com shampoo neutro;</li>
                  <li>Levar xerox do RG, CPF e COMPROVANTE DE RESIDÊNCIA;</li>
                  <li>Levar tapete higiênico (1 por animal);</li>
                  <li>Cães devem ser levados com coleira e guia (animais agressivos devem estar com focinheira);</li>
                  <li>Gatos devem ser levados dentro da caixa de transporte própria;</li>
                  <li>Caso outra pessoa leve o animal em seu lugar, é necessário apresentar uma declaração com autorização para representação;</li>
                  <li>Apresentar caderneta de vacinação com a vacina antirrábica em dia, a vacina deve ser feita com um prazo de 15 dias antes da castração;</li>
                  <li>O animal deverá realizar exame de sangue pré-operatório e apresentar no dia da cirurgia (HEMOGRAMA, ALT e CREATININA) – Os exames pré-operatórios têm validade de 30 dias apenas.</li>
                </ol>

                <div className="mt-6 space-y-3">
                  <div className="bg-amber-50 text-amber-900 p-4 rounded-lg border border-amber-200 font-bold flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>NÃO SERÃO ACEITOS EXAMES COM PRAZO DE VALIDADE SUPERIOR A 30 DIAS.</span>
                  </div>
                  <div className="bg-blue-50 text-blue-900 p-4 rounded-lg border border-blue-200 font-bold flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>É NECESSÁRIO APRESENTAÇÃO DESTE DOCUMENTO NO DIA DA CIRURGIA.</span>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 flex justify-between gap-3 bg-gray-50 rounded-b-2xl">
                <div className="flex gap-3">
                  <button 
                    onClick={handleSavePDF}
                    className="px-5 py-2.5 text-guapi-green font-bold border border-guapi-green hover:bg-guapi-green/10 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" /> Salvar PDF
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="px-5 py-2.5 text-guapi-green font-bold border border-guapi-green hover:bg-guapi-green/10 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Printer className="w-5 h-5" /> Imprimir
                  </button>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsOrientacoesModalOpen(false)}
                      disabled={isSubmitting}
                      className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Voltar
                    </button>
                    <button 
                      onClick={handleAgendar}
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-guapi-orange hover:bg-guapi-orange/90 text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      {isSubmitting ? 'Agendando...' : 'Concordar e Agendar'}
                    </button>
                  </div>
                  {agendamentoError && (
                    <span className="text-red-500 text-sm font-bold">{agendamentoError}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Sucesso */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-[fadeIn_0.2s_ease]">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-[scaleIn_0.2s_ease]">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Agendamento Realizado!</h2>
              <p className="text-gray-600 mb-6">
                A vaga para castração do seu pet foi reservada com sucesso. Verifique as orientações no documento em PDF e não se esqueça de comparecer na data marcada.
              </p>
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full bg-guapi-green hover:bg-guapi-green/90 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Concluir
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
