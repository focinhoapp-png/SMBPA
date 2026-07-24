import { useState } from 'react';
import { ChevronDown, Scissors, MapPin, Clock, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Clinica {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
  dias: string;
  horario: string;
  tipo: 'fixa' | 'castramóvel';
  limiteKg?: number;
  observacoes?: string;
}

const CLINICAS: Clinica[] = [
  {
    id: '1',
    nome: 'Castramóvel Guapimirim – Centro',
    endereco: 'Praça da Emancipação, s/n',
    bairro: 'Centro',
    cidade: 'Guapimirim/RJ',
    dias: 'Conforme calendário',
    horario: '08:00 às 17:00',
    tipo: 'castramóvel',
    limiteKg: 16,
    observacoes: 'Não são realizadas castrações em cães braquicefálicos (Pug, Bulldog e Shih-tzu) na van castramóvel.'
  },
  {
    id: '2',
    nome: 'Clínica Veterinária Municipal – Sede SMBEPA',
    endereco: 'Rua dos Ipês, 100',
    bairro: 'Bairro Novo',
    cidade: 'Guapimirim/RJ',
    dias: 'Segunda a Sexta',
    horario: '08:00 às 16:00',
    tipo: 'fixa',
    observacoes: 'Atendimento exclusivo para moradores de Guapimirim com comprovante de residência.'
  },
];

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
  const [clinicaSelecionada, setClinicaSelecionada] = useState<Clinica | null>(null);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectClinica = (clinica: Clinica) => {
    setClinicaSelecionada(clinica);
    setAceitouTermos(false);
    setIsOpen(false);
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
              A Prefeitura de Guapimirim oferece castração gratuita para cães e gatos de tutores residentes no município. Agende agora!
            </p>
          </div>
          <div className="absolute top-0 right-10 w-32 h-32 md:w-64 md:h-64 bg-guapi-orange rounded-bl-full opacity-90 transform translate-x-1/4 -translate-y-1/4" />
        </section>

        {/* Info Cards */}
        <section className="py-10 px-4 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6 bg-guapi-green/5 rounded-2xl border border-guapi-green/20">
              <Scissors className="w-8 h-8 text-guapi-green mb-3" />
              <h3 className="font-bold text-gray-800 mb-1">100% Gratuito</h3>
              <p className="text-sm text-gray-600">Sem custo algum para tutores de Guapimirim</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-guapi-orange/5 rounded-2xl border border-guapi-orange/20">
              <MapPin className="w-8 h-8 text-guapi-orange mb-3" />
              <h3 className="font-bold text-gray-800 mb-1">Vários Locais</h3>
              <p className="text-sm text-gray-600">Unidade fixa e castramóvel percorrendo o município</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-guapi-green/5 rounded-2xl border border-guapi-green/20">
              <Clock className="w-8 h-8 text-guapi-green mb-3" />
              <h3 className="font-bold text-gray-800 mb-1">Agendamento</h3>
              <p className="text-sm text-gray-600">Escolha o local e confirme os termos para agendar</p>
            </div>
          </div>
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
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    {CLINICAS.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectClinica(c)}
                        className="w-full text-left px-4 py-3 hover:bg-guapi-green/5 text-sm text-gray-700 border-b last:border-0 border-gray-100 transition-colors"
                      >
                        <div className="font-semibold">{c.nome}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{c.bairro} · {c.dias} · {c.horario}</div>
                      </button>
                    ))}
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
                  <div className="flex items-center gap-2 mb-5 pb-5 border-b border-gray-100">
                    <Clock className="w-4 h-4 text-guapi-orange shrink-0" />
                    <span className="font-semibold text-sm text-gray-700">Horário: </span>
                    <span className="text-sm text-gray-600">{clinicaSelecionada.dias} – {clinicaSelecionada.horario}</span>
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
                  {aceitouTermos && (
                    <div className="animate-[fadeIn_0.3s_ease]">
                      <a
                        href="https://castramaisrj2.com.br"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-guapi-orange hover:bg-guapi-orange/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Realizar Agendamento
                      </a>
                      <p className="text-xs text-center text-gray-500 mt-2">
                        Você será redirecionado para a plataforma de agendamento.
                      </p>
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
      </main>

      <Footer />
    </div>
  );
}
