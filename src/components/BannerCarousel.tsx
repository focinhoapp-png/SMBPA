import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { listarBanners, type Banner } from '../lib/api/conteudo';

export default function BannerCarousel() {
  const [slides, setSlides] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    listarBanners().then(setSlides).catch(() => setSlides([]));
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0) return null;

  const goToSlide = (index: number) => setCurrentIndex(index);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="w-full bg-white pt-4 pb-4">
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden rounded-2xl group h-[300px] md:h-[400px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[currentIndex].imagem_url})` }}
            >
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 md:p-10">
                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  {slides[currentIndex].titulo}
                </h2>
                {slides[currentIndex].descricao && (
                  <p className="text-gray-200 text-sm md:text-lg max-w-2xl">
                    {slides[currentIndex].descricao}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 hover:bg-white/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden sm:flex"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 hover:bg-white/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden sm:flex"
          aria-label="Próximo slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
