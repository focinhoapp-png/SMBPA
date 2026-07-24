import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { buscarPet, type Pet } from "../lib/api/pets";

export default function PetDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isAdopted = searchParams.get("status") === "adopted";
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      buscarPet(id)
        .then(setPet)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="font-sans bg-white pt-[80px] min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-500">Carregando informações do pet...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="font-sans bg-white pt-[80px] min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-500">Pet não encontrado.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sans bg-white selection:bg-guapi-orange selection:text-white pt-[80px]">
      <Header />

      <div className="bg-guapi-green w-full py-16 flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Adote um pet</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="py-6 text-sm text-gray-500 flex gap-2">
          <Link to="/" className="hover:text-guapi-green transition-colors">
            Início
          </Link>
          <span>&gt;</span>
          <Link
            to={isAdopted || pet.status === 'adotado' ? "/adotados" : "/adotar"}
            className="hover:text-guapi-green transition-colors"
          >
            {isAdopted || pet.status === 'adotado' ? "Adotados" : "Adote um pet"}
          </Link>
          <span>&gt;</span>
          <span className="text-guapi-green font-medium">{pet.nome}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">
          <div className="flex flex-col items-center">
            {(() => {
              // Fotos públicas: apenas imagens com ordem >= 1 (excluindo foto do RG)
              const publicImages = (pet.pet_imagens || [])
                .filter(img => img.ordem !== 0)
                .sort((a, b) => a.ordem - b.ordem);
              const displaySrc = publicImages[0]?.url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200";
              return (
                <>
                  <img
                    src={displaySrc}
                    alt={pet.nome}
                    className="w-full aspect-[4/3] object-cover rounded shadow-sm bg-gray-100"
                  />
                  {publicImages.length > 1 && (
                    <div className="flex gap-2 mt-4">
                      {publicImages.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? "bg-guapi-green" : "bg-gray-200"}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-guapi-green mb-6">
              {pet.nome}
            </h2>

            <ul className="space-y-4 text-sm text-gray-800">
              <li>
                <span className="font-bold">Raça:</span> {pet.raca || "Sem Raça Definida"}
              </li>
              <li>
                <span className="font-bold">Sexo:</span> <span className="capitalize">{pet.sexo}</span>
              </li>
              <li>
                <span className="font-bold">Animal:</span> <span className="capitalize">{pet.especie}</span>
              </li>
              <li>
                <span className="font-bold">Porte:</span> <span className="capitalize">{pet.porte || "Não informado"}</span>
              </li>
              <li>
                <span className="font-bold">Cor predominante da pelagem:</span>{" "}
                {pet.cor || "Não informado"}
              </li>
              <li>
                <span className="font-bold">Idade aproximada (meses):</span> {pet.idade_meses || "Não informada"}
              </li>
              <li>
                <span className="font-bold">Castrado:</span> {pet.castrado ? "Sim" : "Não"}
              </li>
              <li>
                <span className="font-bold">Microchipado:</span> {pet.microchipado ? "Sim" : "Não"}
              </li>
              <li>
                <span className="font-bold">Sociável com outros animais?</span>{" "}
                {pet.sociavel_animais ? "Sim" : "Não"}
              </li>
              <li>
                <span className="font-bold">Sociável com pessoas?:</span>{" "}
                {pet.sociavel_pessoas ? "Sim" : "Não"}
              </li>
              <li>
                <span className="font-bold">Responsável pelo PET:</span>{" "}
                {pet.tutor_id ? "Tutor Particular" : "Secretaria de Bem-Estar Animal"}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 max-w-4xl">
          <h3 className="text-xl font-bold text-guapi-green mb-4">
            Sobre o pet
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
            {pet.descricao || `Apresentamos ${pet.nome}, um lindo animalzinho ansioso por uma nova família e muito amor.`}
          </p>

          {(!isAdopted && pet.status !== "em_processo" && pet.status !== "adotado" && pet.para_adocao) && (
            <>
              <p className="text-gray-700 text-sm">
                Clique abaixo para adotar!
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  to={`/adocao/${pet.id}`}
                  className="bg-guapi-orange hover:bg-guapi-orange-dark text-white font-bold py-3 px-16 rounded transition-colors inline-block"
                >
                  Quero adotar
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
