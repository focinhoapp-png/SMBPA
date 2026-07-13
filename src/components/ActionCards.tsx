import React from 'react';
import { Search, PlayCircle, PlusCircle, Smartphone, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ActionCards() {
  return (
    <section className="py-16 bg-white/50 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-between group shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-guapi-green/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="mb-6 text-guapi-green transform group-hover:scale-110 transition-transform duration-300 origin-left inline-block">
                <Search className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-guapi-green transition-colors">Quero adotar um animalzinho</h3>
              <p className="text-gray-600 text-sm mb-8 leading-relaxed font-medium">
                Está procurando um bichinho para adotar? Então é só clicar no botão abaixo e ver nossos pets lindos!
              </p>
            </div>
            <div className="relative z-10 mt-auto">
              <Link to="/adotar" className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-guapi-green text-white rounded-xl text-sm font-semibold hover:bg-guapi-green/90 transition-colors gap-2">
                Procurar Pets
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
           <Link to="/historias-de-recomeco" className="bg-gradient-to-br from-[#ff2000] to-[#ff6600] rounded-[2rem] p-8 relative overflow-hidden group shadow-[0_8px_30px_rgb(255,32,0,0.2)] hover:shadow-[0_12px_40px_rgb(255,32,0,0.3)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-center items-center text-center outline-none focus:ring-4 focus:ring-[#ff2000]/30 min-h-[300px]">
             <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
             
             <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300 inline-block">
                  <PlayCircle className="w-12 h-12 text-white/90" strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight drop-shadow-sm">Histórias de</h3>
                <div className="flex items-center justify-center space-x-2">
                   <Heart className="w-8 h-8 text-[#fae284] fill-[#fae284] drop-shadow-sm" />
                   <h3 className="text-3xl sm:text-4xl font-black text-[#fae284] tracking-tight drop-shadow-sm">Recomeço</h3>
                </div>
             </div>
           </Link>

          {/* Card 3 */}
          <div className="bg-white rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-between group shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff2000]/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="mb-6 text-[#ff2000] transform group-hover:scale-110 transition-transform duration-300 origin-left inline-block">
                <PlusCircle className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#ff2000] transition-colors">Cadastrar pet para adoção</h3>
              <p className="text-gray-600 text-sm mb-8 leading-relaxed font-medium">
                Resgatou um animalzinho ou não pode mais cuidar do seu? Veja aqui como disponibilizar um pet para adoção de forma responsável.
              </p>
            </div>
            <div className="relative z-10 mt-auto">
              <Link to="/doe-um-pet" className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-[#ff2000] text-white rounded-xl text-sm font-semibold hover:bg-[#ff2000]/90 transition-colors gap-2">
                Acessar Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-between group shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="mb-6 text-blue-600 transform group-hover:scale-110 transition-transform duration-300 origin-left inline-block">
                <Smartphone className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">SMBEPA Responde</h3>
              <p className="text-gray-600 text-sm mb-8 leading-relaxed font-medium">
                Tem dúvidas sobre proteção e bem-estar animal? Fale diretamente conosco, envie sua dúvida, denúncia ou solicitação de ajuda.
              </p>
            </div>
            <div className="relative z-10 mt-auto">
              <Link to="/smbepa-responde" className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors gap-2">
                Fale Conosco
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
