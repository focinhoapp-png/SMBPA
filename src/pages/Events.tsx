import { Calendar, MapPin, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const events = [
  {
    id: 1,
    title: 'Cãominhada de Guapimirim 2026',
    date: '15 de Agosto, 2026',
    time: '08:00 - 12:00',
    location: 'Praça da Emancipação, Centro',
    description: 'Traga seu pet para uma manhã de exercícios e muita diversão na nossa tradicional Cãominhada! Teremos distribuição de brindes, feira de adoção e orientações veterinárias gratuitas.',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800',
    status: 'Inscrições abertas'
  },
  {
    id: 2,
    title: 'Mutirão de Vacinação Antirrábica',
    date: '10 de Setembro, 2026',
    time: '09:00 - 16:00',
    location: 'Ginásio Poliesportivo',
    description: 'A Secretaria de Saúde em parceria com o Bem-Estar Animal promove mais um mutirão de vacinação. Leve seu cão ou gato (acima de 3 meses). Proteja seu melhor amigo!',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800',
    status: 'Em breve'
  },
  {
    id: 3,
    title: 'Feira de Adoção Especial: Filhotes',
    date: '25 de Setembro, 2026',
    time: '10:00 - 15:00',
    location: 'Horto Municipal',
    description: 'Muitos filhotes estão esperando por um lar! Venha conhecer nossos pequenos e quem sabe sair com um novo membro para a sua família.',
    image: 'https://images.unsplash.com/photo-1596492784531-16447814cc5d?auto=format&fit=crop&q=80&w=800',
    status: 'Em breve'
  }
];

export default function Events() {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map(event => (
                <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="h-48 relative">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-guapi-green shadow-sm">
                      {event.status}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">{event.title}</h3>
                    
                    <div className="space-y-3 mb-6 flex-grow">
                      <div className="flex items-center text-gray-600 text-sm font-medium">
                        <Calendar className="w-4 h-4 mr-2 text-guapi-orange" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm font-medium">
                        <Clock className="w-4 h-4 mr-2 text-guapi-orange" />
                        {event.time}
                      </div>
                      <div className="flex items-start text-gray-600 text-sm font-medium">
                        <MapPin className="w-4 h-4 mr-2 text-guapi-orange mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{event.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                      {event.description}
                    </p>
                    
                    <button className="w-full bg-white text-guapi-green border-2 border-guapi-green py-2.5 rounded-xl font-bold hover:bg-guapi-green hover:text-white transition-colors mt-auto">
                      Saber mais
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
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
