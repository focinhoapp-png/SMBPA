import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
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
              Adote um Amigo e faça a diferença em Guapimirim
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              O projeto de adoção é uma iniciativa da Secretaria Municipal de Bem-Estar e Proteção Animal de Guapimirim-RJ. Nosso objetivo é encontrar lares amorosos e responsáveis para animais resgatados em situação de risco no município.
            </p>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Todos os nossos animais disponíveis para adoção já estão castrados, vacinados e vermifugados, prontos para encher sua casa de alegria.
            </p>

            <div className="bg-guapi-green/5 rounded-2xl p-6 border border-guapi-green/10">
              <h4 className="font-bold text-guapi-green mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-guapi-orange" />
                Por que adotar conosco?
              </h4>
              <ul className="space-y-2 mt-4 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-guapi-orange mt-2 block shrink-0" />
                  Garantia de saúde (animais microchipados e vacinados)
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
            <img 
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Cachorro resgatado feliz" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
