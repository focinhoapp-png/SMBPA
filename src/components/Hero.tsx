import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=2000"
          alt="Cães sorrindo"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-guapi-green/95 to-guapi-green-dark/95" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-8">
              <img
                src="/logobranca.PNG"
                alt="Bem-Estar Animal"
                className="h-48 sm:h-72 lg:h-96 w-auto object-contain"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              O amor não tem raça, <br className="hidden sm:block" />
              <span className="text-guapi-orange">tem quatro patas.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 justify-center max-w-2xl mx-auto">
              Dê um lar cheio de amor a um animal resgatado e transforme duas
              vidas: a sua e a dele. Conheça nossos animais disponíveis para
              adoção.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
