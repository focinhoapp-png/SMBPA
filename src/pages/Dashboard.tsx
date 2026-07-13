import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Columns, X, Check, ChevronsRight, ChevronDown, LogOut, Sun, Moon, Monitor, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type TabType = 'pretendentes' | 'transparencia' | 'meus_animais' | 'local_animais' | 'minhas_vagas' | 'criar_animal';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('pretendentes');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (columnsRef.current && !columnsRef.current.contains(event.target as Node)) {
        setIsColumnsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderSidebarItem = (id: TabType, label: string) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
          isActive 
            ? 'text-orange-500 bg-orange-50/50 border-r-2 border-orange-500 rounded-r-none' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <ChevronsRight className={`w-4 h-4 mr-3 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />
        {label}
      </button>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'pretendentes':
        return (
          <>
            <div className="mb-6">
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <span>Pretendentes</span>
                <span className="mx-2">&gt;</span>
                <span>Listar</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Pretendentes</h1>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-end items-center space-x-2 relative">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Pesquisar" 
                    className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div className="relative" ref={columnsRef}>
                  <button 
                    onClick={() => setIsColumnsOpen(!isColumnsOpen)}
                    className="p-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                  >
                    <Columns className="w-4 h-4" />
                  </button>
                  {isColumnsOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10">
                      <div className="px-4 py-2 font-semibold text-sm text-gray-800">Colunas</div>
                      <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 mr-2" defaultChecked />
                        <span className="text-sm text-gray-700">Criado em</span>
                      </label>
                      <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 mr-2" />
                        <span className="text-sm text-gray-700">Atualizado em</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-16 flex flex-col items-center justify-center text-gray-500 bg-gray-50/30">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <X className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm font-semibold">Sem registros</p>
              </div>
            </div>
          </>
        );

      case 'transparencia':
        const mockTransparencia = [
          { id: 292, status: 'Disponível para adoção', nome: 'Belle', tipo: 'Gato', sexo: 'Fêmea', castrado: false, data: '07/05/2026' },
          { id: 291, status: 'Disponível para adoção', nome: 'R U', tipo: 'Gato', sexo: 'Fêmea', castrado: true, data: '05/05/2026' },
          { id: 290, status: 'Disponível para adoção', nome: 'Angélica', tipo: 'Gato', sexo: 'Fêmea', castrado: true, data: '05/05/2026' },
          { id: 289, status: 'Disponível para adoção', nome: 'Athena', tipo: 'Gato', sexo: 'Fêmea', castrado: true, data: '05/05/2026' },
          { id: 288, status: 'Disponível para adoção', nome: 'Polenguinho', tipo: 'Gato', sexo: 'Macho', castrado: true, data: '05/05/2026' },
          { id: 287, status: 'Disponível para adoção', nome: 'Pietra', tipo: 'Gato', sexo: 'Fêmea', castrado: true, data: '05/05/2026' },
          { id: 286, status: 'Disponível para adoção', nome: 'Temaki', tipo: 'Gato', sexo: 'Macho', castrado: true, data: '05/05/2026' },
          { id: 285, status: 'Disponível para adoção', nome: 'Luna.', tipo: 'Gato', sexo: 'Fêmea', castrado: true, data: '05/05/2026' },
        ];

        return (
          <>
            <div className="mb-6">
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <span>Transparência Pets (Dados Abertos)</span>
                <span className="mx-2">&gt;</span>
                <span>Listar</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Transparência Pets (Dados Abertos)</h1>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-end items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Pesquisar" 
                    className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <button className="p-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 flex items-center">
                  <Columns className="w-4 h-4" />
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">#</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Status</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Nome do Pet</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Tipo</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Sexo</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Castrado</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Data de cadastro</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Data de adoção</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTransparencia.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4">{item.id}</td>
                        <td className="px-6 py-4">{item.status}</td>
                        <td className="px-6 py-4">{item.nome}</td>
                        <td className="px-6 py-4">{item.tipo}</td>
                        <td className="px-6 py-4">{item.sexo}</td>
                        <td className="px-6 py-4">
                          {item.castrado ? (
                            <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-green-500" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-red-500 flex items-center justify-center">
                              <X className="w-3 h-3 text-red-500" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">{item.data}</td>
                        <td className="px-6 py-4"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                <div>Exibindo 1 a 8 de 274 resultados</div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="mr-2">por página</span>
                    <select className="border border-gray-300 rounded px-2 py-1 text-gray-700 bg-white">
                      <option>10</option>
                      <option>20</option>
                      <option>50</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-orange-500 bg-orange-50">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">3</button>
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">4</button>
                    <span className="px-2">...</span>
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">27</button>
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">28</button>
                    <button className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50">&gt;</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'meus_animais':
        return (
          <>
            <div className="mb-6 flex justify-between items-start">
              <div>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <span>Cadastro Dos Animais</span>
                  <span className="mx-2">&gt;</span>
                  <span>Listar</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Cadastro Dos Animais</h1>
              </div>
              <button 
                onClick={() => setActiveTab('criar_animal')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
              >
                Criar Cadastro do Animal
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-gray-200 flex justify-end items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Pesquisar" 
                    className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <button className="p-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
                  <Columns className="w-4 h-4" />
                </button>
              </div>
               <div className="p-16 flex flex-col items-center justify-center text-gray-500 bg-gray-50/30">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <X className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm font-semibold">Sem registros</p>
              </div>
            </div>
          </>
        );

      case 'local_animais':
        return (
          <>
            <div className="mb-6">
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <span>Cadastro Dos Locais</span>
                <span className="mx-2">&gt;</span>
                <span>Listar</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Cadastro Dos Locais</h1>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-end items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Pesquisar" 
                    className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <button className="p-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
                  <Columns className="w-4 h-4" />
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">#</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Presencial</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Remoto</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Nome do local</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Endereço</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">E-mail</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Criado em</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4">2446</td>
                        <td className="px-6 py-4">
                          <div className="w-5 h-5 rounded-full border border-red-500 flex items-center justify-center">
                            <X className="w-3 h-3 text-red-500" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-green-500" />
                          </div>
                        </td>
                        <td className="px-6 py-4">RUAN ***.656.617-** 6921A8BB42E6E</td>
                        <td className="px-6 py-4">RUA A, 12, ILHA JOANA BEZERRA, RECIFE - 50080103</td>
                        <td className="px-6 py-4">legendsruan@gmail.com</td>
                        <td className="px-6 py-4">22/11/2026 09:12</td>
                      </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                 <div>Exibindo 1 resultado</div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="mr-2">por página</span>
                    <select className="border border-gray-300 rounded px-2 py-1 text-gray-700 bg-white">
                      <option>10</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'criar_animal':
        return (
          <div className="max-w-5xl mx-auto pb-10">
            <div className="mb-6">
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <span className="cursor-pointer hover:underline" onClick={() => setActiveTab('meus_animais')}>Cadastro Dos Animais</span>
                <span className="mx-2">&gt;</span>
                <span>Criar</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Criar Cadastro Do Animal</h1>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 lg:p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                   {/* Row 1 */}
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Usuário:<span className="text-red-500">*</span></label>
                     <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                        <span className="flex-1 text-sm text-gray-700 truncate pr-2">RUAN ENNES GOMES</span>
                        <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                                             </div>
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Local:<span className="text-red-500">*</span></label>
                     <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                        <span className="flex-1 text-sm text-gray-700 truncate pr-2">RUAN ***.656.617-** 6921A8BB42E6E</span>
                        <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                                             </div>
                   </div>

                   {/* Row 2 */}
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Nome do animal:<span className="text-red-500">*</span></label>
                     <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" placeholder="Ex: Jhow" />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo:<span className="text-red-500">*</span></label>
                     <div className="relative">
                       <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-gray-500 bg-white transition-colors cursor-pointer">
                          <option>Selecione uma opção</option>
                          <option>Cachorro</option>
                          <option>Gato</option>
                       </select>
                                            </div>
                   </div>

                   {/* Row 3 */}
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Sexo:<span className="text-red-500">*</span></label>
                     <div className="relative">
                       <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-gray-500 bg-white transition-colors cursor-pointer">
                          <option>Selecione uma opção</option>
                          <option>Macho</option>
                          <option>Fêmea</option>
                       </select>
                                            </div>
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Raça:<span className="text-red-500">*</span></label>
                     <div className="relative">
                       <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-gray-500 bg-white transition-colors cursor-pointer">
                          <option>Selecione uma opção</option>
                          <option>Sem Raça Definida (SRD)</option>
                       </select>
                                            </div>
                   </div>

                   {/* Row 4 */}
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Cor predominante:<span className="text-red-500">*</span></label>
                     <div className="relative">
                       <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-gray-500 bg-white transition-colors cursor-pointer">
                          <option>Selecione uma opção</option>
                          <option>Preto</option>
                          <option>Branco</option>
                          <option>Caramelo</option>
                       </select>
                                            </div>
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Porte:<span className="text-red-500">*</span></label>
                     <div className="relative">
                       <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-gray-500 bg-white transition-colors cursor-pointer">
                          <option>Selecione uma opção</option>
                          <option>Pequeno</option>
                          <option>Médio</option>
                          <option>Grande</option>
                       </select>
                                            </div>
                   </div>

                   {/* Row 5 */}
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Data de nascimento aproximada:<span className="text-red-500">*</span></label>
                     <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-gray-500 transition-colors" />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Idade em meses:<span className="text-red-500">*</span></label>
                     <input type="number" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" />
                   </div>

                   {/* Row 6 */}
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Sociável com outros animais?<span className="text-red-500">*</span></label>
                     <div className="flex items-center space-x-6 mt-3 text-sm">
                       <label className="flex items-center text-gray-700 cursor-pointer">
                         <input type="radio" name="sociavel_animais" className="mr-2 w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300" /> Sim
                       </label>
                       <label className="flex items-center text-gray-700 cursor-pointer">
                         <input type="radio" name="sociavel_animais" className="mr-2 w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300" /> Não
                       </label>
                     </div>
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Sociável com pessoas?<span className="text-red-500">*</span></label>
                     <div className="flex items-center space-x-6 mt-3 text-sm">
                       <label className="flex items-center text-gray-700 cursor-pointer">
                         <input type="radio" name="sociavel_pessoas" className="mr-2 w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300" /> Sim
                       </label>
                       <label className="flex items-center text-gray-700 cursor-pointer">
                         <input type="radio" name="sociavel_pessoas" className="mr-2 w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300" /> Não
                       </label>
                     </div>
                   </div>

                   {/* Row 7 */}
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Data da vacinação:<span className="text-red-500">*</span></label>
                     <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-gray-500 transition-colors" />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Data da vermifugação:<span className="text-red-500">*</span></label>
                     <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-gray-500 transition-colors" />
                   </div>
                </div>

                <div className="mt-8 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-gray-700">Chegou a hora de apresentar o animal. Faça um texto falando um pouco sobre ele 🤩:<span className="text-red-500">*</span></label>
                    <button type="button" className="text-orange-500 text-xs font-bold flex items-center hover:underline bg-transparent border-none p-0 cursor-pointer">
                      <span className="mr-1">✨</span> Gerar descrição com IA
                    </button>
                  </div>
                  <textarea rows={4} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-y transition-colors"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-8 pt-4">
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Você confirma que o animal é castrado?<span className="text-red-500">*</span></label>
                     <div className="flex items-center space-x-6 mt-3 text-sm mb-6">
                       <label className="flex items-center text-gray-700 cursor-pointer">
                         <input type="radio" name="castrado" className="mr-2 w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300" defaultChecked /> Sim
                       </label>
                       <label className="flex items-center text-gray-700 cursor-pointer">
                         <input type="radio" name="castrado" className="mr-2 w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300" /> Não
                       </label>
                     </div>

                     <div className="mt-8">
                       <label className="block text-xs font-semibold text-gray-700 mb-1">Comprovante de vacinação:<span className="text-red-500">*</span></label>
                       <div className="border border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center text-sm text-gray-500 bg-white hover:bg-gray-50 cursor-pointer transition-colors mt-2 text-center h-32">
                         <span>Arraste e solte os arquivos ou <span className="text-orange-500 font-semibold cursor-pointer hover:underline">Clique aqui</span></span>
                       </div>
                       <p className="text-[11px] text-gray-400 mt-2">Anexe o comprovante de vacinação em um único arquivo PDF, com limite de 2 MB.</p>
                     </div>

                     <div className="mt-8">
                       <label className="block text-xs font-semibold text-gray-700 mb-1">Primeira imagem do animal:<span className="text-red-500">*</span></label>
                       <div className="border border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center text-sm text-gray-500 bg-white hover:bg-gray-50 cursor-pointer transition-colors mt-2 text-center h-32">
                         <span>Arraste e solte os arquivos ou <span className="text-orange-500 font-semibold cursor-pointer hover:underline">Clique aqui</span></span>
                       </div>
                       <p className="text-[11px] text-gray-400 mt-2">* Limite máximo de 2 MB.</p>
                     </div>

                     <div className="mt-8">
                       <label className="block text-xs font-semibold text-gray-700 mb-1">Terceira imagem do animal:<span className="text-red-500">*</span></label>
                       <div className="border border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center text-sm text-gray-500 bg-white hover:bg-gray-50 cursor-pointer transition-colors mt-2 text-center h-32">
                         <span>Arraste e solte os arquivos ou <span className="text-orange-500 font-semibold cursor-pointer hover:underline">Clique aqui</span></span>
                       </div>
                       <p className="text-[11px] text-gray-400 mt-2">* Limite máximo de 2 MB.</p>
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Comprovante de castração:<span className="text-red-500">*</span></label>
                     <div className="border border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center text-sm text-gray-500 bg-white hover:bg-gray-50 cursor-pointer transition-colors mt-2 text-center h-32">
                       <span>Arraste e solte os arquivos ou <span className="text-orange-500 font-semibold cursor-pointer hover:underline">Clique aqui</span></span>
                     </div>
                     <p className="text-[11px] text-gray-500 mt-3 font-medium">Clique <a href="#" className="text-blue-600 font-bold hover:underline">aqui</a> para baixar o modelo de declaração de castração.</p>
                     <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">Anexe o comprovante de castração (para animais com mais de 6 meses) em um único arquivo PDF, com limite de 2 MB.</p>

                     <div className="mt-8">
                       <label className="block text-xs font-semibold text-gray-700 mb-1">Comprovante de vermifugação:<span className="text-red-500">*</span></label>
                       <div className="border border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center text-sm text-gray-500 bg-white hover:bg-gray-50 cursor-pointer transition-colors mt-2 text-center h-32">
                         <span>Arraste e solte os arquivos ou <span className="text-orange-500 font-semibold cursor-pointer hover:underline">Clique aqui</span></span>
                       </div>
                       <p className="text-[11px] text-gray-400 mt-2">Anexe o comprovante de vermifugação em um único arquivo PDF, com limite de 2 MB.</p>
                     </div>

                     <div className="mt-8">
                       <label className="block text-xs font-semibold text-gray-700 mb-1">Segunda imagem do animal:<span className="text-red-500">*</span></label>
                       <div className="border border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center text-sm text-gray-500 bg-white hover:bg-gray-50 cursor-pointer transition-colors mt-2 text-center h-32">
                         <span>Arraste e solte os arquivos ou <span className="text-orange-500 font-semibold cursor-pointer hover:underline">Clique aqui</span></span>
                       </div>
                       <p className="text-[11px] text-gray-400 mt-2">* Limite máximo de 2 MB.</p>
                     </div>

                     <div className="mt-8">
                       <label className="block text-xs font-semibold text-gray-700 mb-1">Quarta imagem do animal:<span className="text-red-500">*</span></label>
                       <div className="border border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center text-sm text-gray-500 bg-white hover:bg-gray-50 cursor-pointer transition-colors mt-2 text-center h-32">
                         <span>Arraste e solte os arquivos ou <span className="text-orange-500 font-semibold cursor-pointer hover:underline">Clique aqui</span></span>
                       </div>
                       <p className="text-[11px] text-gray-400 mt-2">* Limite máximo de 2 MB.</p>
                     </div>
                   </div>
                </div>

                <div className="mt-12 border-t border-gray-200 pt-8">
                  <div className="flex items-start mb-8">
                    <input type="checkbox" className="mt-1 mr-3 w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300 cursor-pointer shrink-0" />
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Declaração de Veracidade:<span className="text-red-500">*</span></span>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-4xl text-justify">
                        DECLARO que todas as informações fornecidas são verdadeiras e exatas. DECLARO, ainda, estar ciente de que prestar declaração falsa caracteriza o crime de falsidade ideológica previsto no art. 299 do Código Penal Brasileiro, e que por tal crime serei responsabilizado, independentemente das sanções administrativas, caso se comprove a inveracidade do declarado neste documento. DECLARO, por fim, que tomo ciência, neste ato, de toda a legislação mencionada acima.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button type="button" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-colors shadow-sm">Criar</button>
                    <button type="button" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-md text-sm font-semibold transition-colors shadow-sm">Salvar e criar outro</button>
                    <button type="button" onClick={() => setActiveTab('meus_animais')} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-md text-sm font-semibold transition-colors shadow-sm">Cancelar</button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        );

      default:
        return <div>Página em construção</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-20">
        <div className="flex items-center space-x-4">
           <Link to="/" className="text-gray-500 hover:text-gray-800 transition-colors mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-bold text-gray-900 text-lg">Adota Pet - User</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="text-gray-400 hover:text-gray-600 relative"
          >
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold ml-2"
            >
              RG
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center space-x-3">
                  <div className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-gray-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">RUAN ENNES GOMES</p>
                  </div>
                </div>
                
                <div className="p-3 border-b border-gray-100 flex justify-center space-x-6">
                  <button className="text-orange-500"><Sun className="w-5 h-5" /></button>
                  <button className="text-gray-400 hover:text-gray-600"><Moon className="w-5 h-5" /></button>
                  <button className="text-gray-400 hover:text-gray-600"><Monitor className="w-5 h-5" /></button>
                </div>
                
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                  <LogOut className="w-4 h-4 mr-3 text-gray-400" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
          <div className="py-4">
            {renderSidebarItem('pretendentes', 'Pretendentes')}
            {renderSidebarItem('transparencia', 'Transparência Pets')}
            {renderSidebarItem('meus_animais', 'Meus Animais')}
            {renderSidebarItem('local_animais', 'Local dos Animais')}
            
            <div className="mt-8 px-4 mb-2">
               <button 
                onClick={() => setIsConfigOpen(!isConfigOpen)}
                className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600"
               >
                 <span>Configurações de Vagas</span>
                                </button>
            </div>
            
            {isConfigOpen && (
              <div className="bg-gray-50/50 py-1">
                 {renderSidebarItem('minhas_vagas', 'Minhas Vagas')}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-8 relative">
          {renderContent()}
        </main>
      </div>

      {/* Notifications Slide-over */}
      {isNotificationsOpen && (
        <div className="absolute inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20" onClick={() => setIsNotificationsOpen(false)}></div>
          <div className="w-80 bg-white h-full shadow-2xl relative flex flex-col pt-16">
            <button 
              onClick={() => setIsNotificationsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center justify-center flex-1 text-center p-6 pb-32">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                 <Bell className="w-5 h-5" />
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-gray-400 -rotate-45"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Sem notificações</h3>
              <p className="text-xs text-gray-500">Por favor, verifique mais tarde.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
