import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ChevronRight, Info } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const EditProfile = () => {
  const navigate = useNavigate();

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to update user info would go here
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
            Editar Responsável Pessoa Física
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h1 className="text-[22px] font-light text-gray-800 mb-8 border-b border-gray-200 pb-2">
              Editar Responsável Pessoa Física
            </h1>

            <form onSubmit={handleUpdate}>
              <div className="space-y-6">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[13px] text-gray-500 mb-1">
                      Nome:
                    </label>
                    <input
                      type="text"
                      value="RUAN ENNES GOMES"
                      readOnly
                      disabled
                      className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 text-gray-400 font-medium cursor-not-allowed outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] text-gray-500 mb-1">
                      CPF do Responsável:
                    </label>
                    <input
                      type="text"
                      value="161.656.666-66"
                      readOnly
                      disabled
                      className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 text-gray-400 font-medium cursor-not-allowed outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="flex items-center gap-1 block text-[13px] font-medium text-gray-700 mb-1">
                      E-mail:
                      <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                    </label>
                    <input
                      type="email"
                      defaultValue="ennesruan@gmail.com"
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      Data de Nascimento:
                    </label>
                    <input
                      type="text"
                      defaultValue="06/07/1993"
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      Celular:
                    </label>
                    <input
                      type="text"
                      defaultValue="(21) 98428-2215"
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-700 font-medium"
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      CEP:
                    </label>
                    <input
                      type="text"
                      defaultValue="25949-035"
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      Estado:
                    </label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-700 font-medium">
                      <option>Rio de Janeiro</option>
                      <option>São Paulo</option>
                      <option>Minas Gerais</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      Município:
                    </label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-700 font-medium">
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
                      defaultChecked
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                      defaultChecked
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                      defaultChecked
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">
                      Declaro que li o{" "}
                      <a href="#" className="font-semibold hover:underline">
                        Termo de Uso e Política de Privacidade
                      </a>
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
                <Link
                  to="/painel"
                  className="border border-gray-800 text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  className="bg-guapi-green text-white px-6 py-2 rounded-full font-medium hover:bg-guapi-green/90 transition-colors text-sm"
                >
                  Atualizar Dados Pessoais
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditProfile;
