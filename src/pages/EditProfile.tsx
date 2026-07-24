import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ChevronRight, Info } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, perfil } = useAuth();

  const formatDate = (isoStr: string) => {
    if (!isoStr) return "";
    if (isoStr.includes('-')) {
      const parts = isoStr.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoStr;
  };

  const dataNascimentoFormatada = formatDate(user?.user_metadata?.data_nascimento || perfil?.data_nascimento);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const data_nascimento = formData.get('data_nascimento') as string;
    const telefone = formData.get('telefone') as string;
    const cep = formData.get('cep') as string;
    const bairro = formData.get('bairro') as string;

    let dataIso = '';
    if (data_nascimento) {
      const parts = data_nascimento.split('/');
      if (parts.length === 3) {
        dataIso = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          telefone,
          cep,
          bairro,
          cidade: 'Guapimirim',
          estado: 'RJ',
          ...(dataIso && { data_nascimento: dataIso }),
        })
        .eq('auth_id', user.id);

      if (error) {
        console.error("Supabase error:", JSON.stringify(error));
        throw error;
      }
      window.location.href = "/painel";
    } catch (err: any) {
      console.error("Erro ao atualizar perfil:", err);
      const msg = err?.message || err?.error_description || JSON.stringify(err);
      alert(`Erro: ${msg}`);
    }
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
                      value={user?.user_metadata?.nome_completo || perfil?.nome_completo || user?.user_metadata?.full_name || ""}
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
                      value={user?.user_metadata?.cpf_cnpj || perfil?.cpf_cnpj || ""}
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
                      name="email"
                      defaultValue={user?.email || ""}
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      Data de Nascimento:
                    </label>
                    <input
                      type="text"
                      name="data_nascimento"
                      defaultValue={dataNascimentoFormatada}
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      Celular:
                    </label>
                    <input
                      type="text"
                      name="telefone"
                      defaultValue={user?.user_metadata?.telefone || perfil?.telefone || ""}
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
                      name="cep"
                      defaultValue={user?.user_metadata?.cep || perfil?.cep || ""}
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] text-gray-500 mb-1">
                      Município:
                    </label>
                    <input
                      type="text"
                      value="Guapimirim"
                      readOnly
                      disabled
                      className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 text-gray-400 font-medium cursor-not-allowed outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      Bairro:
                    </label>
                    <select 
                      name="bairro"
                      defaultValue={user?.user_metadata?.bairro || perfil?.bairro || ""}
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-700 font-medium"
                    >
                      <option value="">-- Selecione o Bairro --</option>
                      <option value="Bananal">Bananal</option>
                      <option value="Barreira">Barreira</option>
                      <option value="Caneca Fina">Caneca Fina</option>
                      <option value="Centro">Centro</option>
                      <option value="Cotia">Cotia</option>
                      <option value="Garrafão">Garrafão</option>
                      <option value="Iconha">Iconha</option>
                      <option value="Limoeiro">Limoeiro</option>
                      <option value="Orindi">Orindi</option>
                      <option value="Parada Ideal">Parada Ideal</option>
                      <option value="Parada Modelo">Parada Modelo</option>
                      <option value="Parque Flechal">Parque Flechal</option>
                      <option value="Parque Santa Eugênia">Parque Santa Eugênia</option>
                      <option value="Sapê">Sapê</option>
                      <option value="Segredo">Segredo</option>
                      <option value="Vale das Pedrinhas">Vale das Pedrinhas</option>
                      <option value="Várzea">Várzea</option>
                      <option value="Vila Olímpia">Vila Olímpia</option>
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

    </div>
  );
};

export default EditProfile;
