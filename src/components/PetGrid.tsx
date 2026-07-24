import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { useState, useEffect } from 'react';
import { listarPetsDisponiveis, Pet } from '../lib/api/pets';

export default function PetGrid() {
  const [recentPets, setRecentPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const { pets } = await listarPetsDisponiveis({ limit: 4 });
        setRecentPets(pets);
      } catch (error) {
        console.error("Erro ao buscar pets recém-chegados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const getPetSubTitle = (pet: Pet) => {
    const parts = [];
    if (pet.sexo) parts.push(pet.sexo.charAt(0).toUpperCase() + pet.sexo.slice(1));
    if (pet.idade_meses) {
      if (pet.idade_meses < 12) {
        parts.push(`${pet.idade_meses} meses`);
      } else {
        const anos = Math.floor(pet.idade_meses / 12);
        const meses = pet.idade_meses % 12;
        let idadeStr = `${anos} ano${anos > 1 ? 's' : ''}`;
        if (meses > 0) idadeStr += ` e ${meses} m.`;
        parts.push(idadeStr);
      }
    }
    if (pet.cor) parts.push(`Cor predominante ${pet.cor}`);
    if (pet.porte) parts.push(pet.porte.charAt(0).toUpperCase() + pet.porte.slice(1));
    return parts.join(' • ');
  };

  return (
    <section id="animais" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-guapi-green mb-4">Recém-Chegados</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-guapi-green"></div>
          </div>
        ) : recentPets.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Nenhum pet recém-chegado no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentPets.map((pet, index) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 flex flex-col"
              >
                <Link to={`/descricao-pet/${pet.id}`} className="h-52 w-full overflow-hidden relative block bg-gray-100">
                  <img
                    src={pet.imagem_principal_url || '/placeholder-pet.jpg'}
                    alt={pet.nome}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-guapi-green">{pet.nome}</h3>
                  </div>
                  <p className="text-[14px] text-slate-500 mb-4 font-medium capitalize leading-relaxed">
                    {getPetSubTitle(pet)}
                  </p>
                  <p className="text-[15px] text-slate-700 mb-6 line-clamp-4 leading-relaxed">
                    {pet.descricao}
                  </p>
                  
                  <div className="mt-auto">
                    {pet.status === 'em_processo' ? (
                      <div className="block w-full text-center bg-[#ff5a4f] text-white font-semibold py-2.5 rounded-sm text-sm cursor-default">
                        Em processo de adoção
                      </div>
                    ) : (
                      <Link
                        to={`/descricao-pet/${pet.id}`}
                        className="block w-full text-center bg-guapi-green hover:bg-guapi-green-dark text-white font-semibold py-2.5 rounded-sm text-sm transition-colors"
                      >
                        Disponível para adoção
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center text-sm">
          <Link
            to="/adotar"
            className="inline-block border border-[#ff2000] text-[#ff2000] hover:bg-[#ff2000] hover:text-white font-semibold py-3 px-12 rounded-sm text-lg transition-colors"
          >
            Ver todos
          </Link>
        </div>

        <div className="mt-20 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#dce9e7] to-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-guapi-green/10 flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-guapi-green/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="flex-1 relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="shrink-0 text-guapi-green group-hover:scale-110 transition-transform duration-300 mt-1">
               <PawPrint className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-guapi-green transition-colors">Ainda não encontrou o pet ideal para adotar?</h3>
              <p className="text-gray-600 font-medium text-base leading-relaxed max-w-3xl">
                Você pode nos contar quais características procura no seu futuro companheiro. Assim, quando surgir um amiguinho com o perfil desejado, entraremos em contato com você. Vamos encontrar o pet dos sonhos?
              </p>
            </div>
          </div>
          <div className="relative z-10 shrink-0">
            <Link to="/meus-pets-dos-sonhos" className="inline-flex items-center justify-center px-8 py-3.5 bg-guapi-green text-white rounded-xl font-semibold hover:bg-guapi-green/90 transition-all duration-300 gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap">
              Começar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
