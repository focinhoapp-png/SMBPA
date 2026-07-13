import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const petsData = [
  { id: 292, doador: 'Juliana Costa', instituicao: 'Não', nome: 'Belle', tipo: 'Gato', status: 'Disponível para adoção', data: '07/05/2026 13:07:31' },
  { id: 291, doador: 'Clínica Veterinária Vida Animal', instituicao: 'Sim', nome: 'R U', tipo: 'Gato', status: 'Disponível para adoção', data: '05/05/2026 17:47:09' },
  { id: 290, doador: 'Clínica Veterinária Vida Animal', instituicao: 'Sim', nome: 'Angélica', tipo: 'Gato', status: 'Disponível para adoção', data: '05/05/2026 17:35:54' },
  { id: 289, doador: 'Clínica Veterinária Vida Animal', instituicao: 'Sim', nome: 'Athena', tipo: 'Gato', status: 'Disponível para adoção', data: '05/05/2026 17:34:25' },
  { id: 203, doador: 'Instituto Amor de Gato', instituicao: 'Sim', nome: 'Mimi', tipo: 'Gato', status: 'Adotado', data: '02/06/2025 16:24:11' },
  { id: 202, doador: 'Instituto Amor de Gato', instituicao: 'Sim', nome: 'Luke', tipo: 'Gato', status: 'Adotado', data: '02/06/2025 16:15:50' },
  { id: 196, doador: 'Associação Amigos dos Pets', instituicao: 'Sim', nome: 'Ennya', tipo: 'Cachorro', status: 'Adotado', data: '28/05/2025 02:50:24' },
  { id: 195, doador: 'Associação Amigos dos Pets', instituicao: 'Sim', nome: 'Eloá', tipo: 'Cachorro', status: 'Adotado', data: '28/05/2025 02:47:37' },
  { id: 194, doador: 'Marília Santos', instituicao: 'Não', nome: 'Vakinha', tipo: 'Cachorro', status: 'Cadastrado', data: '10/05/2025 14:09:36' },
  { id: 193, doador: 'Marília Santos', instituicao: 'Não', nome: 'Doralice', tipo: 'Cachorro', status: 'Disponível para adoção', data: '10/05/2025 13:16:10' }
];

export default function Transparency() {
  return (
    <div className="font-sans bg-white pt-[80px] min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col">
        {/* Banner */}
        <section className="bg-guapi-green py-14 px-4 shadow-sm relative">
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center tracking-wide">
              Transparência Pets
            </h1>
          </div>
        </section>

        <section className="py-8 px-4 flex-grow bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="text-sm mb-8 font-medium">
              <span className="text-gray-500 font-medium">Início</span>
              <span className="mx-2 text-gray-400">&gt;</span>
              <span className="text-[#00ba88] font-medium text-sm">Transparência Pets</span>
            </div>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left text-sm text-gray-700">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 px-4 font-bold">ID</th>
                    <th className="py-3 px-4 font-bold">Nome</th>
                    <th className="py-3 px-4 font-bold whitespace-nowrap">Instituição/<br/>Órgão</th>
                    <th className="py-3 px-4 font-bold">Nome do Pet</th>
                    <th className="py-3 px-4 font-bold">Tipo do<br/>Pet</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold whitespace-nowrap">Data e hora do<br/>cadastro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {petsData.map((pet) => (
                    <tr key={pet.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 align-top">{pet.id}</td>
                      <td className="py-4 px-4 align-top max-w-xs truncate" title={pet.doador}>{pet.doador}</td>
                      <td className="py-4 px-4 align-top">{pet.instituicao}</td>
                      <td className="py-4 px-4 align-top">{pet.nome}</td>
                      <td className="py-4 px-4 align-top">{pet.tipo}</td>
                      <td className="py-4 px-4 align-top">{pet.status}</td>
                      <td className="py-4 px-4 align-top whitespace-nowrap">{pet.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-8 mb-4">
              <div className="flex border border-gray-200 rounded-md overflow-hidden">
                <button className="px-4 py-2 bg-white text-[#0d6efd] font-medium hover:bg-gray-50 flex items-center">
                   « Anterior
                </button>
                <div className="w-[1px] bg-gray-200"></div>
                <button className="px-4 py-2 bg-white text-[#0d6efd] font-medium hover:bg-gray-50 flex items-center">
                   Próxima »
                </button>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
