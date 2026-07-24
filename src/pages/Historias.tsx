import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listarHistorias, type Historia } from '../lib/api/conteudo';

export default function Historias() {
  const [videos, setVideos] = useState<Historia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarHistorias()
      .then(setVideos)
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="font-sans bg-white pt-[80px] min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col">
        {/* Banner */}
        <section className="bg-[#ff2000] py-14 px-4 shadow-sm relative">
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center tracking-wide">
              Histórias de Recomeço
            </h1>
          </div>
        </section>

        <section className="py-8 px-4 flex-grow bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="text-sm mb-8 font-medium">
              <Link to="/" className="text-gray-500 hover:underline">Início</Link>
              <span className="mx-2 text-gray-400">&gt;</span>
              <span className="text-[#00ba88] font-medium text-sm">Histórias de Recomeço</span>
            </div>

            <p className="text-gray-700 mb-10 leading-relaxed font-medium max-w-5xl text-sm">
              Conheça as histórias emocionantes de animais que foram resgatados e ganharam uma nova chance de ser felizes. Aqui postamos vídeos que mostram o antes e o depois de pets que, com muito amor e cuidado, encontraram um verdadeiro lar. A sua adoção pode ser a próxima grande história!
            </p>

            {/* Video Gallery */}
            {loading ? (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-72 h-40 sm:w-80 sm:h-48 flex-shrink-0 bg-gray-200 rounded-sm animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                {videos.map((video) => (
                  <div key={video.id} className="relative w-72 h-40 sm:w-80 sm:h-48 flex-shrink-0 bg-gray-900 rounded-sm overflow-hidden group cursor-pointer snap-start">
                    {video.thumb_url && (
                      <img
                        src={video.thumb_url}
                        alt={video.titulo}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
                      />
                    )}
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-[#00a8ff] rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <Play className="w-6 h-6 text-white ml-1 fill-white" />
                      </div>
                    </div>
                    
                    {/* Video Controls Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex items-center space-x-2 text-white text-xs font-semibold">
                      <Play className="w-4 h-4 fill-white" />
                      <span>{video.duracao}</span>
                      <div className="flex-1 h-1 bg-white/30 rounded overflow-hidden">
                        <div className="w-1/3 h-full bg-[#00a8ff]"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
