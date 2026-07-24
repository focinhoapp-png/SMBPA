import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { salvarPetSonho } from '../lib/api/conteudo';

export default function DreamPet() {
  const { user, perfil } = useAuth();
  
  const [especie, setEspecie] = useState('');
  const [sexo, setSexo] = useState('');
  const [faixaEtaria, setFaixaEtaria] = useState('');
  const [porte, setPorte] = useState('');
  const [cor, setCor] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Você precisa estar logado para cadastrar o pet dos sonhos.');
      return;
    }

    if (!especie || !sexo || !faixaEtaria || !porte) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      await salvarPetSonho({
        especie,
        sexo,
        faixa_etaria: faixaEtaria,
        porte,
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar preferência. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans bg-white pt-[80px] min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col">
        <section className="bg-guapi-green py-14 px-4 shadow-sm relative">
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white text-center tracking-tight">
              Pet dos sonhos
            </h1>
          </div>
        </section>

        <section className="py-8 px-4 flex-grow bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-sm mb-6 font-medium">
              <span className="text-gray-400 font-semibold">Início</span>
              <span className="mx-2 text-gray-400">&gt;</span>
              <span className="text-guapi-green font-semibold text-sm">Pet dos sonhos</span>
            </div>

            <p className="text-gray-800 text-sm mb-8 leading-relaxed font-medium">
              Lamentamos que você não tenha encontrado um companheiro com as características que desejava. Selecione o perfil do seu próximo amiguinho nos campos abaixo e te avisaremos quando tivermos um disponível.
            </p>

            {success ? (
              <div className="mt-8 bg-green-100 text-green-800 p-4 rounded text-sm font-semibold text-center">
                Sua preferência foi salva! Avisaremos você assim que um pet com esse perfil estiver disponível.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Animal: *</label>
                    <select 
                      value={especie}
                      onChange={(e) => setEspecie(e.target.value)}
                      disabled={loading}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-guapi-orange focus:ring-1 focus:ring-guapi-orange text-gray-600 bg-white cursor-pointer"
                    >
                      <option value="">Selecione</option>
                      <option value="cachorro">Cachorro</option>
                      <option value="gato">Gato</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Sexo: *</label>
                    <select 
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value)}
                      disabled={loading}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-guapi-orange focus:ring-1 focus:ring-guapi-orange text-gray-600 bg-white cursor-pointer"
                    >
                      <option value="">Selecione</option>
                      <option value="femea">Fêmea</option>
                      <option value="macho">Macho</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Idade: *</label>
                    <select 
                      value={faixaEtaria}
                      onChange={(e) => setFaixaEtaria(e.target.value)}
                      disabled={loading}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-guapi-orange focus:ring-1 focus:ring-guapi-orange text-gray-600 bg-white cursor-pointer"
                    >
                      <option value="">Selecione</option>
                      <option value="0 a 1 ano">0 a 1 ano</option>
                      <option value="Mais de 1 ano">Mais de 1 ano</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Porte: *</label>
                    <select 
                      value={porte}
                      onChange={(e) => setPorte(e.target.value)}
                      disabled={loading}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-guapi-orange focus:ring-1 focus:ring-guapi-orange text-gray-600 bg-white cursor-pointer"
                    >
                      <option value="">Selecione</option>
                      <option value="pequeno">Pequeno</option>
                      <option value="medio">Médio</option>
                      <option value="grande">Grande</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Cor predominante:</label>
                    <select 
                      value={cor}
                      onChange={(e) => setCor(e.target.value)}
                      disabled={loading}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-guapi-orange focus:ring-1 focus:ring-guapi-orange text-gray-600 bg-white cursor-pointer"
                    >
                      <option value="">Selecione</option>
                      <option value="amarelo">Amarelo</option>
                      <option value="branco">Branco</option>
                      <option value="preto">Preto</option>
                      <option value="marrom">Marrom</option>
                    </select>
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
                        value={perfil?.nome_completo ?? 'Não logado'} 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">Telefone: *</label>
                      <input 
                        type="text" 
                        disabled 
                        value={perfil?.telefone ?? 'Não logado'} 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">E-mail: *</label>
                      <input 
                        type="email" 
                        disabled 
                        value={user?.email ?? 'Não logado'} 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <button 
                    type="submit" 
                    disabled={loading || !user}
                    className="bg-[#ff2000] hover:bg-red-600 text-white font-bold py-2 px-10 rounded text-sm flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
