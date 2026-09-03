import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Save, Trash2, Printer, PlusCircle, X } from 'lucide-react';
import { adminObterPetDetalhes } from '../../lib/api/admin';

const TABS = [
  'Dados do animal',
  'Dados do proprietário',
  'Vacinas'
];

export default function AdminAnimalDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVacinaOpen, setIsModalVacinaOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      adminObterPetDetalhes(id)
        .then(setPet)
        .catch(err => {
          console.error(err);
          alert('Erro ao carregar os dados do pet.');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Carregando dados do animal...</div>;
  }

  if (!pet) {
    return <div className="text-center py-20 text-red-500">Animal não encontrado.</div>;
  }

  const owner = pet.usuarios || {};

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-light text-gray-800">Dados do animal: {pet?.nome || 'Carregando...'}</h1>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-guapi-orange hover:bg-guapi-orange-dark text-white px-6 py-2 rounded text-sm transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
      </div>

      <div className="bg-white shadow-sm border border-gray-200">
        {/* Abas */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-guapi-green" />
              )}
            </button>
          ))}
        </div>

        {/* Conteúdo da Aba Ativa */}
        <div className="p-6">
          {activeTab === 'Dados do animal' && (
            <div className="space-y-6">
              
              {/* Seção 1: Dados do animal */}
              <div className="border border-gray-200">
                <div className="bg-guapi-green px-4 py-2 font-medium text-white">
                  Dados do animal
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Nome */}
                  <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Nome <span className="text-red-500">*</span></label>
                      <input type="text" defaultValue={pet.nome} className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Apelido</label>
                      <input type="text" defaultValue={pet.apelido || ''} placeholder="Apelido" className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent" />
                    </div>
                  </div>

                  {/* Foto e Sexo/Data Nascimento */}
                  <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Foto</label>
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-32 bg-[#e6a8a8] rounded-2xl flex items-center justify-center text-white relative overflow-hidden">
                           {(pet.pet_imagens?.find((img: any) => img.ordem === 0)?.url || pet.imagem_principal_url || (pet.pet_imagens && pet.pet_imagens.length > 0)) ? (
                             <img src={pet.pet_imagens?.find((img: any) => img.ordem === 0)?.url || pet.imagem_principal_url || pet.pet_imagens[0].url} alt={pet.nome} className="w-full h-full object-cover" />
                           ) : (
                             <div className="absolute inset-0 flex items-center justify-center opacity-80">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                </svg>
                             </div>
                           )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6">
                      <label className="block text-xs text-gray-500 mb-2">Sexo</label>
                      <div className="flex items-center gap-4 text-sm text-gray-700">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" name="sexo" value="macho" defaultChecked={pet.sexo === 'macho'} className="text-blue-500 focus:ring-blue-500" />
                          Macho
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" name="sexo" value="femea" defaultChecked={pet.sexo === 'femea'} className="text-blue-500 focus:ring-blue-500" />
                          Fêmea
                        </label>
                      </div>
                    </div>

                    <div className="pt-6">
                      <label className="block text-xs text-gray-500 mb-1">Data de Nascimento / Estimada <span className="text-red-500">*</span></label>
                      <input type="date" defaultValue={pet.data_nascimento || ''} className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent text-gray-700" />
                    </div>
                  </div>

                  {/* Espécie, Raça, Cor */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Espécie <span className="text-red-500">*</span></label>
                    <select value={pet.especie === 'gato' ? 'Felino' : 'Canino'} readOnly className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent">
                      <option>Felino</option>
                      <option>Canino</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Raça <span className="text-red-500">*</span></label>
                    <input type="text" defaultValue={pet.raca || 'Sem raça definida (SRD)'} className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent" />
                  </div>
                  <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Cor predominante</label>
                      <input type="text" defaultValue={pet.cor || ''} className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent" />
                    </div>
                  </div>

                  {/* Peso, Porte, Pelagem */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Peso Aproximado (kg)</label>
                    <input type="text" defaultValue={pet.peso_aproximado || ''} placeholder="Não informado" className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Porte</label>
                    <select value={pet.porte?.charAt(0).toUpperCase() + pet.porte?.slice(1) || 'Médio'} readOnly className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent">
                      <option>Pequeno</option>
                      <option>Médio</option>
                      <option>Grande</option>
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div>
                      <label className="block text-xs text-gray-500 mb-1">Pelagem</label>
                      <input type="text" defaultValue={pet.pelagem || ''} placeholder="Curta, Longa, etc." className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 2: Identificação do Animal */}
              <div className="border border-gray-200">
                <div className="bg-guapi-green px-4 py-2 font-medium text-white">
                  Identificação do Animal <span className="text-white/80">*</span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Número do Microchip</label>
                    <input type="text" defaultValue={pet.numero_microchip || ''} className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Local de implantação</label>
                    <select className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent">
                      <option>Na linha média dorso-cranial, entre as escápulas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Data de implantação</label>
                    <input type="date" className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent text-gray-500" />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Número da Medalha</label>
                    <input type="text" placeholder="Número da Medalha" className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Documento do Animal (RGA)</label>
                    <input type="text" placeholder="Documento do Animal (RGA)" className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Número do passaporte</label>
                    <input type="text" placeholder="Número do passaporte" className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent" />
                  </div>
                </div>
              </div>

              {/* Seção 3: Dados de emergência */}
              <div className="border border-gray-200">
                <div className="bg-guapi-green px-4 py-2 font-medium text-white">
                  Dados de emergência
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="col-span-1 md:col-span-2 max-w-xl">
                    <label className="block text-xs text-gray-500 mb-1">Veterinário responsável</label>
                    <div className="flex">
                      <input type="text" placeholder="Buscar veterinário" className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent" />
                      <button className="bg-guapi-green hover:bg-guapi-green-dark p-2 ml-4">
                        <Search className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Doenças crônicas</label>
                    <select className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent text-gray-500">
                      <option>Selecione uma opção</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Alergias</label>
                    <select className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent text-gray-500">
                      <option>Selecione uma opção</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Seção 4: Informações adicionais */}
              <div className="border border-gray-200">
                <div className="bg-guapi-green px-4 py-2 font-medium text-white">
                  Informações adicionais
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Pet fujão</label>
                    <select className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent">
                      <option>Não</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Adestrado</label>
                    <select className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent">
                      <option>Não</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Status</label>
                    <select className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent">
                      <option>Seguro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Plano de saúde</label>
                    <select className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent text-gray-500">
                      <option>Selecione uma opção</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Ração de preferência</label>
                    <select className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent text-gray-500">
                      <option>Selecione uma opção</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Pet Shop de preferência</label>
                    <select className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent text-gray-500">
                      <option>Selecione uma opção</option>
                    </select>
                  </div>

                  <div className="col-span-1 md:col-span-3">
                    <label className="block text-xs text-gray-500 mb-1">Descrição</label>
                    <textarea rows={4} defaultValue={pet.descricao || ''} className="w-full border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-sm p-2" />
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'Dados do proprietário' && (
            <div className="space-y-6">
              
              {/* Seção 1: Dados da Conta */}
              <div className="border border-gray-200">
                <div className="bg-guapi-green px-4 py-2 font-medium text-white">
                  Dados da Conta
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                  <div className="col-span-1 md:col-span-3">
                    <label className="block text-xs text-gray-500 mb-1">Nome Fantasia / Razão Social / Nome Completo <span className="text-red-500">*</span></label>
                    <input type="text" value={owner.nome_completo || 'Sem proprietário'} readOnly className="w-full border-0 border-b border-gray-300 bg-gray-50 pb-1 px-2 text-sm text-gray-700 focus:ring-0 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tipo de Usuário</label>
                    <select disabled className="w-full border-0 border-b border-gray-300 bg-gray-50 pb-1 px-2 text-sm text-gray-700 focus:ring-0 focus:border-transparent outline-none">
                      <option>Proprietário</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tipo de Pessoa</label>
                    <input type="text" value={owner.tipo_perfil === 'juridica' ? 'Jurídica' : 'Física'} readOnly className="w-full border-0 border-b border-gray-300 bg-gray-50 pb-1 px-2 text-sm text-gray-700 focus:ring-0 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">CNPJ / CPF</label>
                    <input type="text" value={owner.cpf_cnpj || ''} readOnly className="w-full border-0 border-b border-gray-300 bg-gray-50 pb-1 px-2 text-sm text-gray-700 focus:ring-0 focus:border-transparent outline-none" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs text-gray-500 mb-1">E-mail</label>
                    <input type="email" value={owner.email || ''} readOnly className="w-full border-0 border-b border-gray-300 bg-gray-50 pb-1 px-2 text-sm text-gray-700 focus:ring-0 focus:border-transparent outline-none" />
                  </div>
                </div>
              </div>

              {/* Seção 2: Endereço */}
              <div className="border border-gray-200">
                <div className="bg-guapi-green px-4 py-2 font-medium text-white">
                  Endereço
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6">
                  <div className="col-span-1 md:col-span-8">
                    <label className="block text-xs text-gray-500 mb-1">Logradouro</label>
                    <input type="text" value={owner.logradouro || ''} readOnly className="w-full border-0 border-b border-gray-300 bg-gray-50 pb-1 px-2 text-sm text-gray-700 focus:ring-0 focus:border-transparent outline-none" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Número</label>
                    <input type="text" value={owner.numero || ''} readOnly className="w-full border-0 border-b border-gray-300 bg-gray-50 pb-1 px-2 text-sm text-gray-700 focus:ring-0 focus:border-transparent outline-none" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">CEP</label>
                    <input type="text" value={owner.cep || ''} readOnly className="w-full border-0 border-b border-gray-300 bg-gray-50 pb-1 px-2 text-sm text-gray-700 focus:ring-0 focus:border-transparent outline-none" />
                  </div>

                  <div className="col-span-1 md:col-span-6">
                    <label className="block text-xs text-gray-500 mb-1">Bairro</label>
                    <input type="text" value={owner.bairro || ''} readOnly className="w-full border-0 border-b border-gray-300 bg-gray-50 pb-1 px-2 text-sm text-gray-700 focus:ring-0 focus:border-transparent outline-none" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">DDI <span className="text-red-500">*</span></label>
                    <input type="text" value="55" readOnly className="w-full border-0 border-b border-gray-300 bg-gray-50 pb-1 px-2 text-sm text-gray-700 focus:ring-0 focus:border-transparent outline-none" />
                  </div>
                  <div className="col-span-1 md:col-span-4">
                    <label className="block text-xs text-gray-500 mb-1">Telefone / Celular <span className="text-red-500">*</span></label>
                    <input type="text" value={owner.telefone || ''} readOnly className="w-full border-0 border-b border-gray-300 bg-gray-50 pb-1 px-2 text-sm text-gray-700 focus:ring-0 focus:border-transparent outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Vacinas' && (
            <div>
              {/* Botão Vacinas (Adicionar) */}
              <div className="flex justify-end mb-6">
                <button 
                  onClick={() => setIsModalVacinaOpen(true)}
                  className="flex items-center gap-2 bg-guapi-orange hover:bg-guapi-orange-dark text-white font-medium px-6 py-2 rounded text-sm transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" /> Vacinas
                </button>
              </div>

              {/* Tabela Vacinas */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">Data</th>
                      <th className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">Vacina</th>
                      <th className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">Dose</th>
                      <th className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">Próxima Aplicação</th>
                      <th className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">Veterinário</th>
                      <th className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">Cadastrado por</th>
                    </tr>
                    <tr className="border-b border-gray-100 bg-white">
                      <th className="px-4 pb-3 font-normal">
                        <input type="text" placeholder="Buscar" className="w-full text-sm border-0 border-b border-gray-300 bg-transparent focus:ring-0 focus:border-gray-500 pb-1 px-0 placeholder-gray-400" />
                      </th>
                      <th className="px-4 pb-3 font-normal">
                        <select className="w-full text-sm border-0 border-b border-gray-300 bg-transparent focus:ring-0 focus:border-gray-500 pb-1 px-0 text-gray-600">
                          <option>Todos</option>
                        </select>
                      </th>
                      <th className="px-4 pb-3 font-normal">
                        <input type="text" placeholder="Buscar" className="w-full text-sm border-0 border-b border-gray-300 bg-transparent focus:ring-0 focus:border-gray-500 pb-1 px-0 placeholder-gray-400" />
                      </th>
                      <th className="px-4 pb-3 font-normal">
                        <input type="text" placeholder="Buscar" className="w-full text-sm border-0 border-b border-gray-300 bg-transparent focus:ring-0 focus:border-gray-500 pb-1 px-0 placeholder-gray-400" />
                      </th>
                      <th className="px-4 pb-3 font-normal">
                        <select className="w-full text-sm border-0 border-b border-gray-300 bg-transparent focus:ring-0 focus:border-gray-500 pb-1 px-0 text-gray-600">
                          <option>Todos</option>
                        </select>
                      </th>
                      <th className="px-4 pb-3 font-normal">
                        <select className="w-full text-sm border-0 border-b border-gray-300 bg-transparent focus:ring-0 focus:border-gray-500 pb-1 px-0 text-gray-600">
                          <option>Todos</option>
                        </select>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400 bg-gray-50">Nenhuma vacina registrada.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab !== 'Dados do animal' && activeTab !== 'Dados do proprietário' && activeTab !== 'Vacinas' && (
            <div className="py-12 text-center text-gray-500">
              Conteúdo de {activeTab} ainda não implementado.
            </div>
          )}
        </div>
      </div>

      {/* Botões do Rodapé */}
      <div className="flex items-center justify-between mt-6">
        <button className="flex items-center gap-2 bg-guapi-orange hover:bg-guapi-orange-dark text-white px-6 py-2.5 rounded text-sm transition-colors shadow-sm">
          <Printer className="w-4 h-4" /> Ficha de cadastro
        </button>

        <div className="flex gap-4">
          <button className="bg-guapi-green hover:bg-guapi-green-dark text-white font-medium px-8 py-2.5 rounded text-sm shadow-sm transition-colors">
            Gravar
          </button>
          <button className="bg-[#f44336] hover:bg-red-600 text-white font-medium px-8 py-2.5 rounded text-sm shadow-sm transition-colors">
            Excluir
          </button>
        </div>
      </div>

      {/* Modal de Adicionar Vacina */}
      {isModalVacinaOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-3xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#ffe066] px-6 py-4 flex items-center justify-between">
              <h2 className="text-gray-800 text-lg font-medium">Vacinas</h2>
              <button onClick={() => setIsModalVacinaOpen(false)} className="text-gray-800 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Data</label>
                <input type="date" defaultValue="2026-08-12" className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent text-gray-700" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Próxima Aplicação</label>
                <input type="date" className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent text-gray-400" />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Vacina</label>
                <select className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent text-gray-700">
                  <option>Selecione uma opção</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Dose</label>
                <select className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500 pb-1 px-0 text-sm bg-transparent text-gray-400">
                  <option>Selecione uma vacina</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Veterinário</label>
                <input type="text" value="Secretaria de Bem-Estar e Proteção Animal" readOnly className="w-full border-0 border-b border-gray-300 bg-gray-50 pb-1 px-2 text-sm text-gray-700" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Anotações</label>
                <textarea rows={4} className="w-full border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-sm p-2" />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white p-6 pt-0 flex items-center justify-center gap-4">
              <button className="bg-[#ffe066] hover:bg-yellow-400 text-gray-800 font-medium px-8 py-2.5 rounded text-sm shadow-sm transition-colors">
                Gravar e novo
              </button>
              <button className="bg-[#ffe066] hover:bg-yellow-400 text-gray-800 font-medium px-8 py-2.5 rounded text-sm shadow-sm transition-colors">
                Gravar
              </button>
              <button onClick={() => setIsModalVacinaOpen(false)} className="bg-[#f44336] hover:bg-red-600 text-white font-medium px-8 py-2.5 rounded text-sm shadow-sm transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
