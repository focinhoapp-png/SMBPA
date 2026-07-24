import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const images = [
  '/petum.jfif',
  '/petdois.jfif',
  '/pettres.jfif',
  '/petquatro.jfif',
  '/petcinco.jfif'
];

export default function About() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="sobre" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold text-guapi-green tracking-wider uppercase mb-3">Sobre o Projeto</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Feira de Adoção
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              A Feira de Adoção é uma iniciativa da Secretaria Municipal de Bem-Estar e Proteção Animal de Guapimirim-RJ, realizada em edições na Feira do Produtor Rural, em Parada Modelo, normalmente aos domingos, das 8h às 12h.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Durante a feira, você poderá conhecer cães e gatos resgatados que aguardam a oportunidade de encontrar um lar seguro, cheio de amor e responsabilidade. Todos os animais disponíveis para adoção já estão castrados, vacinados e vermifugados, prontos para fazer parte de uma nova família.
            </p>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Venha nos visitar, conheça nossos animais e faça parte dessa corrente de amor e cuidado. Acompanhe nossos canais oficiais para conferir as próximas edições da Feira de Adoção.
            </p>

            <div className="bg-guapi-green/5 rounded-2xl p-6 border border-guapi-green/10">
              <h4 className="font-bold text-guapi-green mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-guapi-orange" />
                Por que adotar conosco?
              </h4>
              <ul className="space-y-2 mt-4 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-guapi-orange mt-2 block shrink-0" />
                  Garantia de saúde (animais castrados, microchipados e vacinados)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-guapi-orange mt-2 block shrink-0" />
                  Acompanhamento pós-adoção pela nossa equipe veterinária
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-guapi-orange mt-2 block shrink-0" />
                  Você salva uma vida e abre espaço para resgatarmos outro animal
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-xl"
          >
            {images.map((img, index) => (
              <img 
                key={img}
                src={img} 
                alt={`Pet para adoção ${index + 1}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
