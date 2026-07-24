import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { listarEventos, type Evento } from '../lib/api/conteudo';

const STATUS_MAP: Record<string, string> = {
  inscricoes_abertas: 'Inscrições abertas',
  em_breve: 'Em breve',
  encerrado: 'Encerrado',
};

function formatarData(dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function Events() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarEventos()
      .then(setEventos)
      .catch(() => setEventos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="font-sans bg-white selection:bg-guapi-orange selection:text-white pt-[80px] min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col">
        {/* Banner */}
        <section className="bg-guapi-green py-12 px-4 shadow-sm relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-6 drop-shadow-md tracking-tight">
              Eventos para o seu <span className="text-guapi-orange">Pet</span>
            </h1>
            <p className="text-lg md:text-xl text-center text-gray-100 max-w-2xl font-medium">
              Fique por dentro das campanhas, encontros e ações promovidas pela Prefeitura de Guapimirim para o bem-estar dos nossos animais.
            </p>
          </div>
          <div className="absolute top-0 right-10 w-32 h-32 md:w-64 md:h-64 bg-guapi-orange rounded-bl-full opacity-90 transform translate-x-1/4 -translate-y-1/4"></div>
        </section>

        {/* Content */}
        <section className="py-16 px-4 bg-gray-50 flex-grow">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {eventos.map((event) => (
                  <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className="aspect-[3/4] relative">
                      {event.imagem_url && (
                        <img src={event.imagem_url} alt={event.titulo} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-guapi-green shadow-sm">
                        {STATUS_MAP[event.status] ?? event.status}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">{event.titulo}</h3>
                      
                      <div className="space-y-3 mb-6 flex-grow">
                        <div className="flex items-center text-gray-600 text-sm font-medium">
                          <Calendar className="w-4 h-4 mr-2 text-guapi-orange shrink-0" />
                          <span>
                            {formatarData(event.data_evento)}
                            {event.data_fim ? ` até ${formatarData(event.data_fim)}` : ''}
                          </span>
                        </div>
                        {(event.horario_inicio || event.horario_fim) && (
                          <div className="flex items-center text-gray-600 text-sm font-medium">
                            <Clock className="w-4 h-4 mr-2 text-guapi-orange" />
                            {event.horario_inicio}{event.horario_fim ? ` - ${event.horario_fim}` : ''}
                          </div>
                        )}
                        {event.local && (
                          <div className="flex items-start text-gray-600 text-sm font-medium">
                            <MapPin className="w-4 h-4 mr-2 text-guapi-orange mt-0.5 shrink-0" />
                            <span className="line-clamp-2">{event.local}</span>
                          </div>
                        )}
                      </div>
                      
                      {event.descricao && (
                        <p className="text-gray-600 text-sm mb-6 line-clamp-3">{event.descricao}</p>
                      )}
                      
                      {event.link_saber_mais ? (
                        <a href={event.link_saber_mais} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-white text-guapi-green border-2 border-guapi-green py-2.5 rounded-xl font-bold hover:bg-guapi-green hover:text-white transition-colors mt-auto">
                          Saber mais
                        </a>
                      ) : (
                        <button className="w-full bg-white text-guapi-green border-2 border-guapi-green py-2.5 rounded-xl font-bold hover:bg-guapi-green hover:text-white transition-colors mt-auto">
                          Saber mais
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-16 text-center">
              <p className="text-gray-600 mb-4">Tem alguma sugestão de evento para a causa animal?</p>
              <button className="text-guapi-green font-bold hover:underline">
                Fale conosco pelo canal de atendimento
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
