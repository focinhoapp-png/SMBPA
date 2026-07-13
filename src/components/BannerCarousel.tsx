import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1200&h=400',
    title: 'Feira de Adoção Especial',
    description: 'Neste fim de semana na Praça da Matriz. Venha conhecer seu novo melhor amigo!',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&q=80&w=1200&h=400',
    title: 'Campanha de Vacinação Antirrábica',
    description: 'Proteja seu pet! Vacinação gratuita em diversos pontos da cidade.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=1200&h=400',
    title: 'Dicas de Cuidados no Inverno',
    description: 'Saiba como manter seu pet aquecido e saudável durante os dias mais frios.',
  }
];

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

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
            {/* Background Image */}
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 md:p-10">
                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  {slides[currentIndex].title}
                </h2>
                <p className="text-gray-200 text-sm md:text-lg max-w-2xl">
                  {slides[currentIndex].description}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 hover:bg-white/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden sm:flex"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 hover:bg-white/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden sm:flex"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
