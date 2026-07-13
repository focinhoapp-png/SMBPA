import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  PawPrint,
  Edit,
  Search,
  ArrowLeftRight,
  Download,
  FileText,
  Trash2,
  ArrowLeft,
  X,
  Users,
  Camera,
  Image as ImageIcon,
  Upload,
  User,
  Check,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MyPets() {
  const [activeTab, setActiveTab] = useState("meusAnimais");
  const [profileImage, setProfileImage] = useState<string | null>(() =>
    localStorage.getItem("profileImage"),
  );
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem("profileImage", base64String);
      };
      reader.readAsDataURL(file);
    }
    setIsPhotoMenuOpen(false);
  };

  const removePhoto = () => {
    setProfileImage(null);
    localStorage.removeItem("profileImage");
    setIsPhotoMenuOpen(false);
  };

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [petToTransfer, setPetToTransfer] = useState<{
    nome: string;
    especie: string;
    sexo: string;
  } | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<any>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const openTransferModal = (pet: any) => {
    setPetToTransfer(pet);
    setIsTransferModalOpen(true);
  };

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
    setPetToTransfer(null);
  };

  const openDeleteModal = (pet: any) => {
    setPetToDelete(pet);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPetToDelete(null);
  };

  const [pets, setPets] = useState([
    {
      id: "1",
      nome: "Jhow",
      especie: "Canina",
      sexo: "Macho",
      dataNascimento: "06/07/2010",
      comunitario: "Não",
      castrado: "Não",
      microchipado: "Não",
      criadoEm: "12/05/2026 10:30",
      atualizadoEm: "14/05/2026 15:45",
    },
  ]);

  const confirmDelete = () => {
    if (petToDelete) {
      setPets(pets.filter((p) => p.id !== petToDelete.id));
    }
    setIsDeleteModalOpen(false);
    setPetToDelete(null);
    setShowSuccessMessage(true);

    // Optional: Hide success message after a few seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-[100px] pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-50 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50 pointer-events-none"></div>

          <div className="relative shrink-0 z-10">
            <div className="w-28 h-28 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-md relative group">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-300" />
              )}
              <div
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => setIsPhotoMenuOpen(!isPhotoMenuOpen)}
              >
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>

            {isPhotoMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsPhotoMenuOpen(false)}
                ></div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden transform origin-top transition-all">
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setIsPhotoMenuOpen(false);
                    }}
                    className="w-full text-left px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-guapi-green flex items-center gap-3 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Carregar nova foto
                  </button>
                  {profileImage && (
                    <button
                      onClick={removePhoto}
                      className="w-full text-left px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remover foto
                    </button>
                  )}
                </div>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="z-10 text-center md:text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">
              RUAN ENNES GOMES
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <span className="bg-green-100 text-guapi-green text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-green-200 shadow-sm">
                <User className="w-3.5 h-3.5" />
                Responsável Pessoa Física
              </span>
              <Link
                to="/editar-perfil"
                className="text-gray-400 hover:text-guapi-green flex items-center gap-1.5 text-sm font-medium transition-colors bg-white px-3 py-1.5 rounded-full border border-gray-200 hover:border-guapi-green hover:shadow-sm"
              >
                <Edit className="w-3.5 h-3.5" />
                Editar perfil
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm w-fit">
          <button
            onClick={() => setActiveTab("meusAnimais")}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2.5 transition-all whitespace-nowrap ${activeTab === "meusAnimais" ? "bg-guapi-green text-white shadow-md" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
          >
            <PawPrint className="w-4 h-4" />
            Meus Animais
          </button>
          <button
            onClick={() => setActiveTab("pretendentes")}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2.5 transition-all whitespace-nowrap ${activeTab === "pretendentes" ? "bg-guapi-green text-white shadow-md" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
          >
            <Users className="w-4 h-4" />
            Pretendentes
          </button>
          <button
            onClick={() => setActiveTab("receberTutela")}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2.5 transition-all whitespace-nowrap ${activeTab === "receberTutela" ? "bg-guapi-green text-white shadow-md" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            Receber Tutela
          </button>
          <button
            onClick={() => setActiveTab("historico")}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2.5 transition-all whitespace-nowrap ${activeTab === "historico" ? "bg-guapi-green text-white shadow-md" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
          >
            <FileText className="w-4 h-4" />
            Histórico
          </button>
        </div>

        {activeTab === "meusAnimais" && (
          <div className="space-y-6">
            {showSuccessMessage && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6 flex items-start justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  <span className="text-sm">
                    <strong className="font-bold">Sucesso!</strong> Cadastro
                    excluído com sucesso.
                  </span>
                </div>
                <button
                  onClick={() => setShowSuccessMessage(false)}
                  className="text-green-600 hover:text-green-800 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <Link
                to="/cadastrar-animal"
                className="bg-guapi-green text-white font-bold py-2.5 px-6 rounded-xl hover:bg-guapi-green-dark transition-colors border border-transparent hover:shadow-md w-full sm:w-auto text-center flex items-center justify-center gap-2"
              >
                Cadastrar Novo Animal
              </Link>

              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-guapi-green focus:ring-1 focus:ring-guapi-green transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Pet Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-lg transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-guapi-green opacity-80"></div>

                  <div className="absolute top-4 right-4 flex gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openTransferModal(pet)}
                      className="text-gray-400 hover:text-guapi-green hover:bg-green-50 p-2 rounded-full transition-colors bg-white shadow-sm border border-gray-100"
                      title="Transferir Tutela"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(pet)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors bg-white shadow-sm border border-gray-100"
                      title="Excluir Animal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-6 mt-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center text-guapi-green shadow-sm border border-green-200 shrink-0">
                      <PawPrint className="w-8 h-8 opacity-80" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-gray-800 leading-tight">
                        {pet.nome}
                      </h3>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-1">
                        ID: #{pet.id}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium flex items-center gap-2">
                        Espécie
                      </span>
                      <span className="font-bold text-gray-800">
                        {pet.especie}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium flex items-center gap-2">
                        Sexo
                      </span>
                      <span className="font-bold text-gray-800">
                        {pet.sexo}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium flex items-center gap-2">
                        Nascimento
                      </span>
                      <span className="font-bold text-gray-800">
                        {pet.dataNascimento}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-1 gap-2">
                    <Link
                      to={`/meus-pets/${pet.id}`}
                      className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold text-center hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Edit className="w-4 h-4" /> Visualizar e Editar
                    </Link>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Link
                        to={`/rg-animal/${pet.id}`}
                        target="_blank"
                        className="py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl text-xs font-bold text-center hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5 text-guapi-green" /> RG
                        Animal
                      </Link>
                      <Link
                        to={`/cartao-vacina/${pet.id}`}
                        target="_blank"
                        className="py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl text-xs font-bold text-center hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5 text-guapi-green" />{" "}
                        Vacinas
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {pets.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center shadow-sm">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <PawPrint className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Nenhum animal cadastrado
                  </h3>
                  <p className="text-gray-500 text-sm max-w-sm">
                    Cadastre seu primeiro animal para começar a gerenciar
                    vacinas, RGA e adoções.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "pretendentes" && (
          <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Nenhum pretendente no momento
            </h3>
            <p className="text-gray-500 text-sm max-w-sm">
              Quando alguém demonstrar interesse em adotar um de seus animais,
              as solicitações aparecerão aqui.
            </p>
          </div>
        )}

        {/* Empty states for other tabs */}
        {activeTab === "receberTutela" && (
          <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <ArrowLeftRight className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Nenhuma solicitação de tutela
            </h3>
            <p className="text-gray-500 text-sm max-w-sm">
              Você não possui solicitações pendentes para receber a tutela de
              novos animais.
            </p>
          </div>
        )}

        {activeTab === "historico" && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center sm:w-80">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar no histórico..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-guapi-green focus:ring-1 focus:ring-guapi-green transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Histórico vazio
              </h3>
              <p className="text-gray-500 text-sm max-w-sm">
                Não há registros de transferência de titularidade para serem
                exibidos.
              </p>
            </div>
          </div>
        )}

        {/* Transfer Modal */}
        {isTransferModalOpen && petToTransfer && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-[480px] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-6 pb-4">
                <h2 className="text-[15px] font-bold text-gray-800">
                  Mudar Titularidade do Animal
                </h2>
                <button
                  onClick={closeTransferModal}
                  className="text-guapi-green hover:bg-green-50 p-1.5 rounded transition-colors -mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-6 py-2">
                <div className="flex gap-4 mb-8 items-center border border-gray-200 rounded p-1">
                  <input
                    type="text"
                    placeholder="Informe CPF ou CNPJ"
                    className="flex-grow px-3 py-1.5 text-sm focus:outline-none bg-transparent"
                  />
                  <button className="flex items-center gap-2 text-guapi-green font-medium text-sm hover:bg-green-50 px-3 py-1.5 rounded transition-colors mr-1 shrink-0">
                    <Search className="w-4 h-4" />
                    Buscar
                  </button>
                </div>

                <div className="border border-gray-100 rounded-lg p-6 mb-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]">
                  <h3 className="text-[13px] font-medium text-gray-700 mb-4 text-center sm:text-left">
                    Animal a ser Transferido
                  </h3>
                  <table className="w-full text-sm text-center sm:text-left">
                    <thead>
                      <tr className="text-guapi-green border-b border-gray-100">
                        <th className="font-medium pb-2 text-center sm:text-left">
                          Nome
                        </th>
                        <th className="font-medium pb-2 text-center sm:text-left">
                          Espécie
                        </th>
                        <th className="font-medium pb-2 text-center sm:text-left">
                          Sexo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="pt-4 text-gray-600 font-medium">
                          {petToTransfer.nome}
                        </td>
                        <td className="pt-4 text-gray-600 font-medium">
                          {petToTransfer.especie}
                        </td>
                        <td className="pt-4 text-gray-600 font-medium">
                          {petToTransfer.sexo}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="px-6 py-5 flex mt-2">
                <button
                  onClick={closeTransferModal}
                  className="border-2 border-guapi-green text-guapi-green font-medium text-sm px-6 py-1.5 rounded-full hover:bg-green-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && petToDelete && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-[600px] overflow-hidden flex flex-col pt-8 p-6 relative">
              <button
                onClick={closeDeleteModal}
                className="absolute top-4 right-4 text-guapi-green hover:text-guapi-green-dark"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="px-2 pt-2">
                <h3 className="text-base font-bold text-gray-800 mb-8 border-b border-gray-100 pb-4">
                  Tem certeza que deseja excluir este cadastro de animal?
                </h3>
                <p className="text-gray-500 italic text-[15px] leading-relaxed mb-6">
                  Uma vez excluído, o cadastro não poderá ser reativado,
                  tampouco serão permitidas novas inserções de procedimentos ou
                  ocorrências vinculadas ao mesmo.
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeDeleteModal}
                  className="px-6 py-2 border border-guapi-green text-guapi-green rounded-full font-medium hover:bg-guapi-green/10 transition-colors bg-white text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-guapi-green text-white rounded-full font-medium hover:bg-guapi-green-dark transition-colors text-sm"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
