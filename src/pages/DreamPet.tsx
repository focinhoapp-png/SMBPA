import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronDown } from 'lucide-react';

export default function DreamPet() {
  return (
    <div className="font-sans bg-white pt-[80px] min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col">
        {/* Banner */}
        <section className="bg-guapi-green py-14 px-4 shadow-sm relative">
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white text-center tracking-tight">
              Pet dos sonhos
            </h1>
          </div>
        </section>

        <section className="py-8 px-4 flex-grow bg-white">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="text-sm mb-6 font-medium">
              <span className="text-gray-400 font-semibold">Início</span>
              <span className="mx-2 text-gray-400">&gt;</span>
              <span className="text-guapi-green font-semibold text-sm">Pet dos sonhos</span>
            </div>

            <p className="text-gray-800 text-sm mb-8 leading-relaxed font-medium">
              Lamentamos que você não tenha encontrado um companheiro com as características que desejava. Selecione o perfil do seu próximo amiguinho nos campos abaixo e te avisaremos quando tivermos um disponível.
            </p>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Animal: *</label>
                  <div className="relative">
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-guapi-orange focus:ring-1 focus:ring-guapi-orange text-gray-600 bg-white cursor-pointer">
                      <option>Selecione</option>
                      <option>Cachorro</option>
                      <option>Gato</option>
                    </select>
                                      </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Sexo: *</label>
                  <div className="relative">
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-guapi-orange focus:ring-1 focus:ring-guapi-orange text-gray-600 bg-white cursor-pointer">
                      <option>Selecione</option>
                      <option>Fêmea</option>
                      <option>Macho</option>
                    </select>
                                      </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Idade: *</label>
                  <div className="relative">
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-guapi-orange focus:ring-1 focus:ring-guapi-orange text-gray-600 bg-white cursor-pointer">
                      <option>Selecione</option>
                      <option>0 a 1 ano</option>
                      <option>Mais de 1 ano</option>
                    </select>
                                      </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Porte: *</label>
                  <div className="relative">
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-guapi-orange focus:ring-1 focus:ring-guapi-orange text-gray-600 bg-white cursor-pointer">
                      <option>Selecione</option>
                      <option>Pequeno</option>
                      <option>Médio</option>
                      <option>Grande</option>
                    </select>
                                      </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Cor predominante da pelagem: *</label>
                  <div className="relative">
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-guapi-orange focus:ring-1 focus:ring-guapi-orange text-gray-600 bg-white cursor-pointer">
                      <option>Selecione</option>
                      <option>Amarelo</option>
                      <option>Branco</option>
                      <option>Preto</option>
                      <option>Marrom</option>
                    </select>
                                      </div>
                </div>
              </div>

              <div className="mt-10 mb-6">
                <h2 className="text-xl font-extrabold text-gray-900 mb-6">Informações pessoais</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-900 mb-1">Nome: *</label>
                    <input 
                      type="text" 
                      disabled 
                      value="RUAN ENNES GOMES" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Telefone: *</label>
                    <input 
                      type="text" 
                      disabled 
                      value="+55 (21) 9 8885-3407" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">E-mail: *</label>
                    <input 
                      type="email" 
                      disabled 
                      value="legendsruan@gmail.com" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <button type="button" className="bg-[#ff2000] hover:bg-red-600 text-white font-bold py-2 px-10 rounded text-sm flex items-center justify-center transition-colors">
                  Enviar
                </button>
              </div>
            </form>

            <div className="mt-8 bg-[#ff6b6b] text-white p-3 px-4 rounded text-sm font-semibold">
              Nenhum cadastro de Pet dos Sonhos foi encontrado.
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
