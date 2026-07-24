import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { enviarContato } from '../lib/api/conteudo';
import { useAuth } from '../contexts/AuthContext';

export default function FormSmbepaResponde() {
  const { perfil, user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [topico, setTopico] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [endereco, setEndereco] = useState('');
  const [pontoReferencia, setPontoReferencia] = useState('');
  const [atendente, setAtendente] = useState('');
  const [anonimo, setAnonimo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topico || !mensagem) {
      alert('Por favor, preencha o tópico e a mensagem.');
      return;
    }

    setLoading(true);
    try {
      await enviarContato({
        topico,
        mensagem: atendente ? `${mensagem}\n\nAtendido por: ${atendente}` : mensagem,
        endereco,
        ponto_referencia: pontoReferencia,
        nome_contato: anonimo ? 'Anônimo' : (perfil?.nome_completo ?? 'Não informado'),
        email_contato: anonimo ? '' : (user?.email ?? ''),
        arquivos: selectedFiles,
      });
      alert('Contato enviado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar o contato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans bg-white pt-[80px] min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col">
        <section className="bg-[#ff2000] py-16 px-4 shadow-sm relative">
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center tracking-wide">
              Tire suas dúvidas com a SMBEPA
            </h1>
          </div>
        </section>

        <section className="py-8 px-4 flex-grow bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-sm mb-10 font-medium">
              <Link to="/" className="text-gray-500 hover:underline">Início</Link>
              <span className="mx-2 text-gray-400">&gt;</span>
              <Link to="/smbepa-responde" className="text-gray-500 hover:underline">Contactar</Link>
              <span className="mx-2 text-gray-400">&gt;</span>
              <span className="text-[#00ba88] font-medium text-sm">Falar com a SMBEPA</span>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 max-w-5xl">
              <div className="mb-6 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Selecione um tópico*</label>
                <select 
                  value={topico}
                  onChange={(e) => setTopico(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full md:w-1/2 border border-gray-300 rounded-sm px-3 py-2 bg-white focus:outline-none focus:border-guapi-green"
                >
                  <option value="">Selecione...</option>
                  <option value="Denúncia">Denúncia</option>
                  <option value="Denúncia - Maus Tratos">Denúncia - Maus Tratos a Animais Domésticos</option>
                  <option value="Elogios">Elogios</option>
                  <option value="Reclamação">Reclamação</option>
                  <option value="Solicitação">Solicitação</option>
                  <option value="Solicitação - Castração">Solicitação - Castração</option>
                  <option value="Solicitação - Feira">Solicitação - Feira De Adoção E Eventos</option>
                  <option value="Solicitação - Horário">Solicitação - Informação Horário De Funcionamento</option>
                  <option value="Solicitação - Localização">Solicitação - Informação Localização</option>
                  <option value="Sugestão">Sugestão</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Como podemos ajudar?*</label>
                <textarea 
                  rows={6}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-guapi-green"
                ></textarea>
              </div>

              <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Endereço:</label>
                    <input 
                      type="text" 
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      disabled={loading}
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-guapi-green" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Ponto de Referência do Endereço:</label>
                    <input 
                      type="text" 
                      value={pontoReferencia}
                      onChange={(e) => setPontoReferencia(e.target.value)}
                      disabled={loading}
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-guapi-green" 
                    />
                  </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-1">Foi atendido por alguém da Secretaria? Informe o Nome!</label>
                <input 
                  type="text" 
                  value={atendente}
                  onChange={(e) => setAtendente(e.target.value)}
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-guapi-green" 
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-1">Anexar fotos/documentos</label>
                <input 
                  type="file" 
                  multiple
                  onChange={handleFileChange}
                  disabled={loading}
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
                          disabled={loading}
                          className="text-gray-400 hover:text-red-500 disabled:opacity-50"
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
                <input 
                  type="checkbox" 
                  checked={anonimo}
                  onChange={(e) => setAnonimo(e.target.checked)}
                  disabled={loading}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                />
              </div>

              {!anonimo && perfil && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Dados do solicitante</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">CPF/CNPJ</label>
                      <input 
                        type="text" 
                        value={perfil.cpf_cnpj || 'Não informado'}
                        readOnly
                        className="w-full bg-gray-100 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Nome completo</label>
                      <input 
                        type="text" 
                        value={perfil.nome_completo || 'Não informado'}
                        readOnly
                        className="w-full bg-gray-100 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Telefone</label>
                      <input 
                        type="text" 
                        value={perfil.telefone || 'Não informado'}
                        readOnly
                        className="w-full bg-gray-100 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
                      <input 
                        type="email" 
                        value={user?.email || 'Não informado'}
                        readOnly
                        className="w-full bg-gray-100 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-600 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="inline-flex justify-center items-center border border-[#ff2000] text-[#ff2000] hover:bg-[#ff2000] hover:text-white font-medium py-2.5 px-10 text-sm rounded-sm transition-colors disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Enviar'}
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate('/smbepa-responde')}
                  disabled={loading}
                  className="inline-block border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-10 text-sm rounded-sm transition-colors"
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
