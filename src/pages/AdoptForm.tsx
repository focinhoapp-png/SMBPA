import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { mockPets } from "../data/pets";

export default function AdoptForm() {
  const { id } = useParams();
  const pet = mockPets.find((p) => p.id === id);

  const [form, setForm] = useState({
    cpf: "101.555.517-50", // Mocking existing user data based on image
    nome: "RUAN ENNES GOMES",
    telefone: "+55 (21) 9 8885-3407",
    email: "programadorennes@gmail.com",
    cep: "50080-103",
    logradouro: "RUA A",
    numero: "13",
    complemento: "",
    bairro: "ILHA JOANA BEZERRA",
    cidade: "RECIFE",
    mudouEndereco: "Não",
    moradia: "",
    outrosAnimais: "",
    todosDeAcordo: "",
    tipoInteracao: "",
    declaracao: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    alert("Solicitação enviada com sucesso!");
    window.location.href = "/meus-pets";
  };

  if (!pet) {
    return (
      <div className="font-sans bg-gray-50 min-h-screen flex flex-col pt-[80px]">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8">
          <p className="text-xl text-gray-500">Pet não encontrado.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col pt-[80px]">
      <Header />

      {/* Banner */}
      <div className="bg-guapi-green w-full py-12 flex items-center justify-center shadow-sm">
        <h1 className="text-white text-2xl font-bold">Adote um pet</h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Breadcrumb */}
        <div className="text-xs text-guapi-green font-medium mb-6 flex gap-1">
          <Link to="/" className="hover:underline">
            Início
          </Link>
          <span className="text-gray-400">&gt;</span>
          <Link to="/adotar" className="hover:underline">
            Adote um pet
          </Link>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-800 mb-8 border-b border-gray-100 pb-2">
            Massa! Vamos organizar tudo pra você me conhecer. Agora só
            precisamos saber algumas informações. É rapidinho!
          </p>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Informações pessoais */}
            <section>
              <h2 className="text-lg font-bold text-guapi-green mb-6">
                Informações pessoais
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    CPF: *
                  </label>
                  <input
                    readOnly
                    type="text"
                    name="cpf"
                    value={form.cpf}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nome: *
                  </label>
                  <input
                    readOnly
                    type="text"
                    name="nome"
                    value={form.nome}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Telefone: *
                  </label>
                  <input
                    readOnly
                    type="text"
                    name="telefone"
                    value={form.telefone}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    E-mail: *
                  </label>
                  <input
                    readOnly
                    type="email"
                    name="email"
                    value={form.email}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    CEP: *
                  </label>
                  <input
                    readOnly
                    type="text"
                    name="cep"
                    value={form.cep}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Logradouro: *
                  </label>
                  <input
                    readOnly
                    type="text"
                    name="logradouro"
                    value={form.logradouro}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Número: *
                  </label>
                  <input
                    readOnly
                    type="text"
                    name="numero"
                    value={form.numero}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Complemento: *
                  </label>
                  <input
                    readOnly
                    type="text"
                    name="complemento"
                    value={form.complemento}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Bairro: *
                  </label>
                  <input
                    readOnly
                    type="text"
                    name="bairro"
                    value={form.bairro}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Cidade: *
                  </label>
                  <input
                    readOnly
                    type="text"
                    name="cidade"
                    value={form.cidade}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Você mudou de endereço?
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative inline-block w-8 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input
                      type="checkbox"
                      name="toggle"
                      id="toggle"
                      className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer scale-150 top-0 left-0 transition-transform peer translate-x-0"
                      style={{ border: "4px solid #fff" }}
                    />
                    <label
                      htmlFor="toggle"
                      className="toggle-label block overflow-hidden h-4 rounded-full bg-gray-300 cursor-pointer peer-checked:bg-guapi-green"
                    ></label>
                  </div>
                  <span className="text-xs font-medium text-gray-600">Sim</span>
                </div>
              </div>
            </section>

            {/* Informações do animal */}
            <section>
              <h2 className="text-lg font-bold text-guapi-green mb-4">
                Informações do animal
              </h2>
              <div className="mb-2">
                <span className="text-sm font-bold text-guapi-green">
                  {pet.name} - {pet.species}
                </span>
              </div>
              <p className="text-xs text-gray-600 font-medium">
                {pet.gender} •{" "}
                {pet.size === "Pequeno"
                  ? "Pequeno"
                  : pet.size === "Médio"
                    ? "Médio"
                    : pet.size === "Grande"
                      ? "Grande"
                      : "Sem Raça Definida"}{" "}
                • {pet.age} • Branca • {pet.size}
              </p>
            </section>

            {/* Preenchimento Obrigatório */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-wider">
                PREENCHIMENTO OBRIGATÓRIO
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    O animalzinho irá morar em casa ou apartamento? *
                  </label>
                  <select
                    required
                    name="moradia"
                    value={form.moradia}
                    onChange={handleChange}
                    className="w-full md:w-[48%] border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                  >
                    <option value="">Selecione um tipo de moradia</option>
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Existem outros animais na residência? *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-xs text-gray-700 font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="outrosAnimais"
                        value="Sim"
                        checked={form.outrosAnimais === "Sim"}
                        onChange={handleChange}
                        required
                        className="w-3 h-3 text-guapi-green border-gray-300 focus:ring-guapi-green"
                      />
                      Sim
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-gray-700 font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="outrosAnimais"
                        value="Não"
                        checked={form.outrosAnimais === "Não"}
                        onChange={handleChange}
                        required
                        className="w-3 h-3 text-guapi-green border-gray-300 focus:ring-guapi-green"
                      />
                      Não
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Caso você more com outras pessoas, todos estão cientes e de
                    acordo em receber um novo animalzinho em casa? *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-xs text-gray-700 font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="todosDeAcordo"
                        value="Sim"
                        checked={form.todosDeAcordo === "Sim"}
                        onChange={handleChange}
                        required
                        className="w-3 h-3 text-guapi-green border-gray-300 focus:ring-guapi-green"
                      />
                      Sim
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-gray-700 font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="todosDeAcordo"
                        value="Não"
                        checked={form.todosDeAcordo === "Não"}
                        onChange={handleChange}
                        required
                        className="w-3 h-3 text-guapi-green border-gray-300 focus:ring-guapi-green"
                      />
                      Não
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Você deseja conhecer o animalzinho de qual forma? *
                  </label>
                  <select
                    required
                    name="tipoInteracao"
                    value={form.tipoInteracao}
                    onChange={handleChange}
                    className="w-full md:w-[48%] border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                  >
                    <option value="">Selecione um tipo de interação</option>
                    <option value="presencial">Presencialmente</option>
                    <option value="online">Online (Videochamada)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Responsabilidades */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Responsabilidades do tutor
              </h2>
              <div className="space-y-4 text-xs font-medium text-gray-600 leading-relaxed mb-6">
                <p>
                  Ao adotar um animal, declaro-me apto para assumir a guarda e a
                  responsabilidade sobre ele.
                </p>
                <p>
                  Responsabilizo-me por preservar sua saúde e integridade e a
                  submetê-lo aos cuidados médico veterinários sempre que
                  necessário.
                </p>
                <p>
                  Declaro ainda estar ciente de todos os cuidados que este
                  animal exige além de conhecer os riscos inerentes à espécie no
                  convívio com humanos, estando apto a guardá-lo e vigiá-lo,
                  comprometendo-me a proporcionar boas condições de alojamento e
                  alimentação.
                </p>
                <p>
                  Estou ciente e de acordo com a realização de telefonemas e/ou
                  visitas de servidores da Prefeitura do Guapimirim ou do doador
                  do pet, para verificação de como ele está se adaptando.
                </p>
              </div>

              <label className="flex items-start gap-2 cursor-pointer mt-4 group">
                <input
                  type="checkbox"
                  required
                  name="declaracao"
                  checked={form.declaracao}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 mt-0.5 text-guapi-green border-gray-300 rounded focus:ring-guapi-green"
                />
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wide group-hover:text-guapi-green-dark transition-colors">
                  DECLARO ESTAR CIENTE E DE ACORDO DO DESCRITO ACIMA*
                </span>
              </label>
            </section>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-10 text-sm rounded shadow-sm transition-colors uppercase tracking-wide"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
