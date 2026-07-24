import React, { useState, useEffect } from 'react';
import { User, X, PlusCircle, Building, HeartPulse } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileSelect() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfileType, setSelectedProfileType] = useState('fisica');
  const navigate = useNavigate();
  const { user, perfil } = useAuth();

  useEffect(() => {
    if (perfil?.avatar_url) {
      setProfileImage(perfil.avatar_url);
    }
  }, [perfil]);

  const handleAdvance = () => {
    setIsModalOpen(false);
    if (selectedProfileType === 'fisica') {
        navigate('/editar-perfil');
    } else if (selectedProfileType === 'juridica') {
        navigate('/cadastro-juridica');
    } else if (selectedProfileType === 'protetor') {
        navigate('/cadastro-protetor');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow pt-[100px] pb-16 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
          
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Bem-vindo(a)! 👋</h2>
          <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto">
            Por qual perfil você deseja acessar o painel hoje?
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {perfil && (
              <Link 
                to="/meus-pets" 
                className="group flex flex-col items-center bg-gray-50 hover:bg-green-50 outline outline-2 outline-transparent hover:outline-guapi-green p-6 rounded-2xl transition-all w-64 shadow-sm hover:shadow-md cursor-pointer"
              >
                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center mb-4 transition-colors overflow-hidden shadow-sm">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div className="text-center">
                  <span className="inline-block bg-white text-guapi-green text-[11px] font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide border border-green-100">
                    Pessoa Física
                  </span>
                  <h3 className="text-gray-800 font-bold text-lg mb-1 leading-tight">
                    {perfil.nome_completo || user?.user_metadata?.nome_completo || "Usuário"}
                  </h3>
                  <p className="text-gray-500 text-sm">Acessar perfil</p>
                </div>
              </Link>
            )}
            {/* Adicionar Perfil Card */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 hover:border-guapi-green hover:bg-green-50 p-6 rounded-2xl transition-all w-64 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-guapi-green/10 flex items-center justify-center mb-4 transition-colors">
                <PlusCircle className="w-8 h-8 text-gray-400 group-hover:text-guapi-green" />
              </div>
              <h3 className="text-gray-600 group-hover:text-guapi-green font-bold text-lg mb-1">Cadastrar outro perfil</h3>
              <p className="text-gray-500 text-sm">Clique aqui para adicionar</p>
            </button>
          </div>
        </div>
      </main>

      {/* Modal Profile Creation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">Escolha o tipo de perfil</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-white hover:bg-gray-100 p-2 rounded-full shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <label 
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedProfileType === 'fisica' ? 'border-guapi-green bg-green-50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
              >
                <input 
                  type="radio" 
                  name="profileType" 
                  value="fisica"
                  checked={selectedProfileType === 'fisica'}
                  onChange={(e) => setSelectedProfileType(e.target.value)}
                  className="w-5 h-5 text-guapi-green border-gray-300 focus:ring-guapi-green hidden" 
                />
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedProfileType === 'fisica' ? 'border-guapi-green' : 'border-gray-300'}`}>
                    <div className={`w-3 h-3 rounded-full bg-guapi-green transition-transform ${selectedProfileType === 'fisica' ? 'scale-100' : 'scale-0'}`}></div>
                </div>
                <div>
                  <span className="block font-bold text-gray-800 text-base">Pessoa Física</span>
                  <span className="block text-sm text-gray-500">Para tutores e donos de pets</span>
                </div>
              </label>

              <label 
                 className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedProfileType === 'juridica' ? 'border-guapi-green bg-green-50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
              >
                <input 
                  type="radio" 
                  name="profileType" 
                  value="juridica"
                  checked={selectedProfileType === 'juridica'}
                  onChange={(e) => setSelectedProfileType(e.target.value)}
                  className="w-5 h-5 text-guapi-green border-gray-300 focus:ring-guapi-green hidden" 
                />
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedProfileType === 'juridica' ? 'border-guapi-green' : 'border-gray-300'}`}>
                    <div className={`w-3 h-3 rounded-full bg-guapi-green transition-transform ${selectedProfileType === 'juridica' ? 'scale-100' : 'scale-0'}`}></div>
                </div>
                <div>
                  <span className="block font-bold text-gray-800 text-base">Pessoa Jurídica</span>
                  <span className="block text-sm text-gray-500">Para ONGs e instituições</span>
                </div>
              </label>

              <label 
                 className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedProfileType === 'protetor' ? 'border-guapi-green bg-green-50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
              >
                <input 
                  type="radio" 
                  name="profileType" 
                  value="protetor"
                  checked={selectedProfileType === 'protetor'}
                  onChange={(e) => setSelectedProfileType(e.target.value)}
                  className="w-5 h-5 text-guapi-green border-gray-300 focus:ring-guapi-green hidden" 
                />
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedProfileType === 'protetor' ? 'border-guapi-green' : 'border-gray-300'}`}>
                    <div className={`w-3 h-3 rounded-full bg-guapi-green transition-transform ${selectedProfileType === 'protetor' ? 'scale-100' : 'scale-0'}`}></div>
                </div>
                <div>
                  <span className="block font-bold text-gray-800 text-base">Protetores Independentes</span>
                  <span className="block text-sm text-gray-500">Para resgatadores e protetores de pets</span>
                </div>
              </label>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAdvance}
                className="px-8 py-2.5 bg-guapi-green text-white rounded-xl font-bold hover:bg-guapi-green-dark transition-colors shadow-sm"
              >
                Avançar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
