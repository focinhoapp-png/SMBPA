import { useState } from 'react';
import { Search, CheckCircle2, ArrowRight, User, PawPrint } from 'lucide-react';
import { adminListarPets, adminListarUsuarios, adminTransferirPet } from '../../lib/api/admin';

export default function AdminTransferenciaAnimais() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Pet Search
  const [buscaPet, setBuscaPet] = useState('');
  const [petsBusca, setPetsBusca] = useState<any[]>([]);
  
  // Selected Data
  const [petSelecionado, setPetSelecionado] = useState<any | null>(null);
  
  // Step 3: Tutor Search
  const [buscaTutor, setBuscaTutor] = useState('');
  const [tutoresBusca, setTutoresBusca] = useState<any[]>([]);
  
  // Selected Tutor
  const [tutorSelecionado, setTutorSelecionado] = useState<any | null>(null);

  // Status
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Handlers ---

  const handleBuscarPet = async () => {
    if (!buscaPet.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await adminListarPets(1, 10, { search: buscaPet });
      setPetsBusca(res.pets || []);
      if (res.pets?.length === 0) setError('Nenhum animal encontrado com este termo.');
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar animal');
    } finally {
      setLoading(false);
    }
  };

  const handleSelecionarPet = (pet: any) => {
    setPetSelecionado(pet);
    setStep(2);
  };

  const handleBuscarTutor = async () => {
    if (!buscaTutor.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await adminListarUsuarios(1, 10, 'todas', buscaTutor);
      setTutoresBusca(res.usuarios || []);
      if (res.usuarios?.length === 0) setError('Nenhum tutor encontrado com este termo.');
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar tutor');
    } finally {
      setLoading(false);
    }
  };

  const handleSelecionarTutor = (tutor: any) => {
    setTutorSelecionado(tutor);
    setStep(4);
  };

  const handleTransferir = async () => {
    if (!petSelecionado || !tutorSelecionado) return;
    setLoading(true);
    setError('');
    try {
      await adminTransferirPet(petSelecionado.id, tutorSelecionado.id);
      setIsSuccess(true);
      setStep(5);
    } catch (err: any) {
      setError(err.message || 'Erro ao transferir animal');
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setBuscaPet('');
    setPetsBusca([]);
    setPetSelecionado(null);
    setBuscaTutor('');
    setTutoresBusca([]);
    setTutorSelecionado(null);
    setIsSuccess(false);
    setError('');
  };

  // --- UI Helpers ---

  const stepLabels = [
    'Buscar Animal',
    'Animal Selecionado',
    'Buscar Novo Tutor',
    'Tutor Selecionado',
    'Confirmar'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-light text-gray-800 mb-6">Transferência de Animais</h1>

      <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
        
        {/* Wizard Header (Passos) */}
        {!isSuccess && (
          <div className="flex flex-wrap md:flex-nowrap items-center mb-10 rounded-xl bg-gray-100 p-2 gap-2 overflow-hidden">
            {stepLabels.map((label, index) => {
              const currentStep = index + 1;
              const isActive = step === currentStep;
              const isPast = step > currentStep;
              
              if (isActive || isPast) {
                 return (
                  <div key={index} className={`flex items-center flex-1 py-2 px-3 relative rounded-lg ${isActive ? 'bg-guapi-green text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isActive ? 'bg-[#184638] text-white' : 'bg-gray-300'}`}>
                      {isPast ? <CheckCircle2 className="w-4 h-4" /> : currentStep}
                    </div>
                    <span className="ml-3 font-medium text-sm hidden md:block whitespace-nowrap">
                      {label}
                    </span>
                  </div>
                 )
              }
              
              return (
                <div key={index} className="flex justify-center flex-1 py-2 px-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm">
                    {currentStep}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- Content --- */}

        {/* Step 1: Search Pet */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-gray-800 font-semibold text-lg mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-guapi-green" /> Passo 1: Buscar o pet
            </h2>
            
            <div className="relative mb-6 flex gap-3">
              <input
                type="text"
                value={buscaPet}
                onChange={(e) => setBuscaPet(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscarPet()}
                placeholder="Nome / Microchip"
                className="flex-1 text-base p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guapi-green/20 focus:border-guapi-green outline-none transition-all bg-gray-50"
              />
              <button 
                onClick={handleBuscarPet}
                disabled={loading || !buscaPet.trim()}
                className="bg-guapi-orange hover:bg-guapi-orange-dark text-white font-bold px-6 py-3 rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            {error && <div className="text-red-500 mb-4 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

            {petsBusca.length > 0 && (
              <div className="mt-6 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
                    <tr>
                      <th className="p-4 font-medium">Nome</th>
                      <th className="p-4 font-medium">Espécie</th>
                      <th className="p-4 font-medium">Sexo</th>
                      <th className="p-4 font-medium text-center">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {petsBusca.map(pet => (
                      <tr key={pet.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-800">{pet.nome}</td>
                        <td className="p-4 text-gray-600 capitalize">{pet.especie}</td>
                        <td className="p-4 text-gray-600 capitalize">{pet.sexo}</td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleSelecionarPet(pet)}
                            className="bg-guapi-green hover:bg-guapi-green-dark text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                          >
                            Selecionar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Selected Pet Confirmation */}
        {step === 2 && petSelecionado && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-gray-800 font-semibold text-lg mb-6 flex items-center gap-2">
              <PawPrint className="w-5 h-5 text-guapi-green" /> Animal Selecionado
            </h2>
            
            <div className="bg-green-50 border border-green-100 p-6 rounded-xl flex items-center gap-6">
               <div className="w-20 h-20 rounded-full bg-white border-2 border-green-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                 {petSelecionado.imagem_principal_url ? (
                   <img src={petSelecionado.imagem_principal_url} alt={petSelecionado.nome} className="w-full h-full object-cover" />
                 ) : (
                   <PawPrint className="w-8 h-8 text-green-300" />
                 )}
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-gray-800">{petSelecionado.nome}</h3>
                 <p className="text-gray-600 mt-1 capitalize">{petSelecionado.especie} • {petSelecionado.sexo} {petSelecionado.raca && `• ${petSelecionado.raca}`}</p>
                 <p className="text-xs text-gray-400 mt-2">ID: {petSelecionado.id}</p>
               </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setStep(1)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors"
              >
                Voltar
              </button>
              <button 
                onClick={() => setStep(3)}
                className="bg-guapi-green hover:bg-guapi-green-dark text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Search New Tutor */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-gray-800 font-semibold text-lg mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-guapi-orange" /> Passo 3: Buscar Novo Tutor
            </h2>
            
            <div className="relative mb-6 flex gap-3">
              <input
                type="text"
                value={buscaTutor}
                onChange={(e) => setBuscaTutor(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscarTutor()}
                placeholder="Nome / Email / CPF"
                className="flex-1 text-base p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guapi-orange/20 focus:border-guapi-orange outline-none transition-all bg-gray-50"
              />
              <button 
                onClick={handleBuscarTutor}
                disabled={loading || !buscaTutor.trim()}
                className="bg-guapi-orange hover:bg-guapi-orange-dark text-white font-bold px-6 py-3 rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            {error && <div className="text-red-500 mb-4 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

            {tutoresBusca.length > 0 && (
              <div className="mt-6 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
                    <tr>
                      <th className="p-4 font-medium">Nome</th>
                      <th className="p-4 font-medium">Email / Contato</th>
                      <th className="p-4 font-medium text-center">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tutoresBusca.map(tutor => (
                      <tr key={tutor.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-800">{tutor.nome_completo || tutor.nome}</td>
                        <td className="p-4 text-gray-600">
                          <div>{tutor.email}</div>
                          <div className="text-xs text-gray-400 mt-1">{tutor.telefone}</div>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleSelecionarTutor(tutor)}
                            className="bg-guapi-orange hover:bg-guapi-orange-dark text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                          >
                            Selecionar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-start mt-6">
              <button 
                onClick={() => setStep(2)}
                className="text-gray-500 hover:text-gray-800 font-medium px-4 py-2 transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Selected Tutor Confirmation */}
        {step === 4 && tutorSelecionado && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-gray-800 font-semibold text-lg mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-guapi-orange" /> Novo Tutor Selecionado
            </h2>
            
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl flex items-center gap-6">
               <div className="w-16 h-16 rounded-full bg-white border-2 border-orange-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm text-guapi-orange font-bold text-xl">
                 {(tutorSelecionado.nome_completo || tutorSelecionado.nome)?.charAt(0).toUpperCase()}
               </div>
               <div>
                 <h3 className="text-xl font-bold text-gray-800">{tutorSelecionado.nome_completo || tutorSelecionado.nome}</h3>
                 <p className="text-gray-600 mt-1">{tutorSelecionado.email}</p>
                 <p className="text-sm text-gray-500 mt-1">{tutorSelecionado.telefone}</p>
                 <p className="text-xs text-gray-400 mt-2">ID: {tutorSelecionado.id}</p>
               </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setStep(3)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors"
              >
                Voltar
              </button>
              <button 
                onClick={() => setStep(5)}
                className="bg-guapi-green hover:bg-guapi-green-dark text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                Revisar Transferência <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Final Confirmation / Success */}
        {step === 5 && !isSuccess && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-gray-800 font-semibold text-xl mb-6">Confirme a Transferência</h2>
            
            <div className="bg-gray-50 border border-gray-200 p-8 rounded-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                {/* Pet Box */}
                <div className="flex-1 text-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
                  <div className="w-16 h-16 rounded-full bg-green-50 mx-auto mb-3 flex items-center justify-center text-guapi-green">
                    <PawPrint className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg">{petSelecionado?.nome}</h4>
                  <span className="text-sm text-gray-500">{petSelecionado?.especie}</span>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex shrink-0">
                  <div className="bg-guapi-orange/20 p-3 rounded-full">
                    <ArrowRight className="w-8 h-8 text-guapi-orange" />
                  </div>
                </div>

                {/* New Tutor Box */}
                <div className="flex-1 text-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
                  <div className="w-16 h-16 rounded-full bg-orange-50 mx-auto mb-3 flex items-center justify-center text-guapi-orange font-bold text-2xl">
                    {tutorSelecionado?.nome_completo?.charAt(0) || tutorSelecionado?.nome?.charAt(0)}
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg">{tutorSelecionado?.nome_completo || tutorSelecionado?.nome}</h4>
                  <span className="text-sm text-gray-500">Novo Tutor</span>
                </div>
              </div>
            </div>

            {error && <div className="text-red-500 mt-6 bg-red-50 p-3 rounded-lg border border-red-100 text-center">{error}</div>}

            <div className="flex justify-end gap-4 mt-10">
              <button 
                onClick={() => setStep(4)}
                disabled={loading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-8 py-3 rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >
                Voltar
              </button>
              <button 
                onClick={handleTransferir}
                disabled={loading}
                className="bg-guapi-green hover:bg-guapi-green-dark text-white font-bold px-8 py-3 rounded-lg shadow-sm transition-colors disabled:opacity-50 text-lg"
              >
                {loading ? 'Processando...' : 'Confirmar e Transferir'}
              </button>
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="text-center py-12 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-guapi-green" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Transferência Concluída!</h2>
            <p className="text-lg text-gray-600 max-w-lg mx-auto mb-10">
              O animal <strong className="text-gray-800">{petSelecionado?.nome}</strong> foi transferido com sucesso para o tutor <strong className="text-gray-800">{tutorSelecionado?.nome_completo || tutorSelecionado?.nome}</strong>.
            </p>
            <button 
              onClick={resetFlow}
              className="bg-guapi-green hover:bg-guapi-green-dark text-white font-bold px-8 py-3 rounded-full shadow-md transition-all transform hover:scale-105"
            >
              Fazer nova transferência
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
