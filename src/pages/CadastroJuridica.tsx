import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Info, X } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CadastroJuridica = () => {
  const navigate = useNavigate();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/painel");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow pt-[100px] pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-blue-800 mb-8 font-medium">
          <Link to="/" className="hover:underline flex items-center gap-1">
            Início
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500">
            Cadastro de Responsável Pessoa Jurídica
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h1 className="text-[22px] font-light text-gray-800 mb-8 border-b border-gray-200 pb-2">
              Cadastro de Responsável Pessoa Jurídica
            </h1>

            <form onSubmit={handleUpdate}>
              <div className="space-y-6">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      Nome Fantasia:
                    </label>
                    <input
                      type="text"
                      placeholder="Nome Fantasia"
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      CNPJ:
                    </label>
                    <input
                      type="text"
                      placeholder="99.999.999/9999-99"
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-700 font-medium"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 max-w-full">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      Razão Social:
                    </label>
                    <input
                      type="text"
                      placeholder="Razão Social"
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-700 font-medium"
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-1 block text-[13px] font-medium text-gray-700 mb-1">
                      E-mail:
                      <Info className="w-3.5 h-3.5 text-gray-700 bg-gray-200 rounded-full cursor-help p-[1px]" />
                    </label>
                    <input
                      type="email"
                      placeholder="email@email.com.br"
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      Celular:
                    </label>
                    <input
                      type="text"
                      placeholder="(99) 99999-9999"
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-700 font-medium"
                    />
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      CEP:
                    </label>
                    <input
                      type="text"
                      placeholder="99999-999"
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      Estado:
                    </label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-500 font-medium">
                      <option value="">Selecione o Estado</option>
                      <option>Rio de Janeiro</option>
                      <option>São Paulo</option>
                      <option>Minas Gerais</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      Município:
                    </label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-500 font-medium">
                      <option value="">Selecione o município</option>
                      <option>Guapimirim</option>
                      <option>Rio de Janeiro</option>
                    </select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-4">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 w-4 h-4 text-guapi-green border-gray-300 rounded focus:ring-guapi-green"
                    />
                    <span className="text-xs text-gray-600">
                      AUTORIZO o envio de informações do Governo Federal sobre
                      vagas para castração na minha cidade, campanhas de
                      vacinação e outras informações importantes sobre programas
                      e ações voltadas para os animais.
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 w-4 h-4 text-guapi-green border-gray-300 rounded focus:ring-guapi-green"
                    />
                    <span className="text-xs text-gray-600">
                      DECLARO, sob as penalidades da lei, que as informações
                      fornecidas e inseridas por mim neste sistema são
                      verdadeiras, precisas e atualizadas, e assumo total
                      responsabilidade pela exatidão dos dados fornecidos.
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 w-4 h-4 text-guapi-green border-gray-300 rounded focus:ring-guapi-green"
                    />
                    <span className="text-xs text-gray-600">
                      Declaro que li o{" "}
                      <a href="#" className="font-semibold text-blue-600 hover:underline">
                        Termo de Uso e Política de Privacidade
                      </a>
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(true)}
                  className="border border-guapi-green text-guapi-green px-8 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-guapi-green text-white px-8 py-2 rounded-full font-medium hover:bg-guapi-green/90 transition-colors text-sm"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Confirmar Cancelamento */}
        {isCancelModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-[400px] overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-lg font-bold text-gray-800">Cancelar</h3>
                  <button 
                    onClick={() => setIsCancelModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors bg-white hover:bg-gray-100 p-1 rounded-md"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <p className="text-gray-600 text-sm">Deseja realmente Cancelar?</p>
                </div>

                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setIsCancelModalOpen(false)}
                    className="px-8 py-2 border border-guapi-green text-guapi-green rounded-full font-medium hover:bg-gray-50 transition-colors text-sm"
                  >
                    Não
                  </button>
                  <button 
                    onClick={() => navigate("/painel")}
                    className="px-8 py-2 bg-guapi-green text-white rounded-full font-medium hover:bg-guapi-green/90 transition-colors text-sm"
                  >
                    Sim
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CadastroJuridica;
