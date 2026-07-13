import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { MapPin, X } from 'lucide-react';

export default function FormSmbepaResponde() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="font-sans bg-white pt-[80px] min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col">
        {/* Banner */}
        <section className="bg-[#ff2000] py-16 px-4 shadow-sm relative">
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center tracking-wide">
              Tire suas dúvidas com a SMBEPA
            </h1>
          </div>
        </section>

        <section className="py-8 px-4 flex-grow bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="text-sm mb-10 font-medium">
              <Link to="/" className="text-gray-500 hover:underline">Início</Link>
              <span className="mx-2 text-gray-400">&gt;</span>
              <Link to="/smbepa-responde" className="text-gray-500 hover:underline">Contactar</Link>
              <span className="mx-2 text-gray-400">&gt;</span>
              <span className="text-[#00ba88] font-medium text-sm">Falar com a SMBEPA</span>
            </div>

            <form className="mt-6 max-w-5xl">
              <div className="mb-6 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Selecione um tópico*</label>
                <select className="w-full md:w-1/2 border border-gray-300 rounded-sm px-3 py-2 bg-white focus:outline-none focus:border-guapi-green">
                  <option value="">Denúncia</option>
                  <option value="denuncia_maus_tratos">Denúncia - Maus Tratos a Animais Domésticos</option>
                  <option value="elogios">Elogios</option>
                  <option value="reclamacao">Reclamação</option>
                  <option value="solicitacao">Solicitação</option>
                  <option value="solicitacao_castracao">Solicitação - Castração</option>
                  <option value="solicitacao_feira">Solicitação - Feira De Adoção E Eventos</option>
                  <option value="solicitacao_horario">Solicitação - Informação Horário De Funcionamento</option>
                  <option value="solicitacao_localizacao">Solicitação - Informação Localização</option>
                  <option value="sugestao">Sugestão</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Como podemos ajudar?*</label>
                <textarea 
                  rows={6} 
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-guapi-green"
                ></textarea>
              </div>

              <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Endereço:</label>
                    <input type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-guapi-green" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Ponto de Referência do Endereço:</label>
                    <input type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-guapi-green" />
                  </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-1">Foi atendido por alguém da Secretaria? Informe o Nome!</label>
                <input type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-guapi-green" />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-1">Anexar fotos/documentos</label>
                <input 
                  type="file" 
                  multiple
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" 
                />
                
                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {file.type.startsWith('image/') ? (
                            <img src={URL.createObjectURL(file)} alt={file.name} className="w-10 h-10 object-cover rounded" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">DOC</div>
                          )}
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-8 flex items-center gap-2">
                <label className="text-sm font-medium text-gray-900">Solicitar Anonimato</label>
                <input type="checkbox" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-6">Dados do solicitante</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">CPF*</label>
                  <input 
                    type="text" 
                    value="161.656.617-50"
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nome completo*</label>
                  <input 
                    type="text" 
                    value="RUAN ENNES GOMES"
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Telefone*</label>
                  <input 
                    type="text" 
                    value="+55 (21) 98885-3407"
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">E-mail*</label>
                  <input 
                    type="email" 
                    value="legendsruan@gmail.com"
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-600 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button" 
                  className="inline-block border border-[#ff2000] text-[#ff2000] hover:bg-[#ff2000] hover:text-white font-medium py-2.5 px-10 text-sm rounded-sm transition-colors"
                >
                  Enviar
                </button>
                <button 
                  type="button" 
                  className="inline-block border border-[#ff2000] text-[#ff2000] hover:bg-[#ff2000] hover:text-white font-medium py-2.5 px-10 text-sm rounded-sm transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
