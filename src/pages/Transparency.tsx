import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { listarTransparencia } from '../lib/api/pets';

const LIMIT = 10;

function formatarData(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export default function Transparency() {
  const [dados, setDados] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listarTransparencia(page, LIMIT)
      .then(({ pets, total }) => {
        setDados(pets ?? []);
        setTotal(total);
      })
      .catch(() => setDados([]))
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / LIMIT);

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
                    <th className="py-3 px-4 font-bold">#</th>
                    <th className="py-3 px-4 font-bold">Nome do Pet</th>
                    <th className="py-3 px-4 font-bold">Espécie</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold whitespace-nowrap">Data e hora do<br/>cadastro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: LIMIT }).map((_, i) => (
                      <tr key={i}>
                        {[1,2,3,4,5].map((j) => (
                          <td key={j} className="py-4 px-4">
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : dados.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                        Nenhum registro encontrado.
                      </td>
                    </tr>
                  ) : (
                    dados.map((pet, idx) => {
                      const statusMap: Record<string, string> = {
                        disponivel: 'Disponível para adoção',
                        em_processo: 'Em processo de adoção',
                        adotado: 'Adotado',
                        cadastrado: 'Cadastrado',
                      };
                      return (
                        <tr key={pet.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 align-top text-gray-400 text-xs">
                            {(page - 1) * LIMIT + idx + 1}
                          </td>
                          <td className="py-4 px-4 align-top font-medium">{pet.nome}</td>
                          <td className="py-4 px-4 align-top capitalize">{pet.especie}</td>
                          <td className="py-4 px-4 align-top">{statusMap[pet.status] ?? pet.status}</td>
                          <td className="py-4 px-4 align-top whitespace-nowrap text-xs text-gray-500">
                            {formatarData(pet.created_at)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 mb-4 gap-2">
                <div className="flex border border-gray-200 rounded-md overflow-hidden">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white text-[#0d6efd] font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
                  >
                    « Anterior
                  </button>
                  <div className="w-[1px] bg-gray-200"></div>
                  <span className="px-4 py-2 text-gray-600 text-sm font-medium flex items-center">
                    {page} / {totalPages}
                  </span>
                  <div className="w-[1px] bg-gray-200"></div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-white text-[#0d6efd] font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
                  >
                    Próxima »
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
