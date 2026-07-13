import { useParams, Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { mockPets } from "../data/pets";

export default function PetDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isAdopted = searchParams.get("status") === "adopted";
  const pet = mockPets.find((p) => p.id === id);

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

  // Helper for mocked colors
  let color = "Caramelo";
  if (pet.id === "2" || pet.id === "5" || pet.id === "7") color = "Branca";
  if (pet.id === "6" || pet.id === "8") color = "Preta";

  return (
    <div className="font-sans bg-white selection:bg-guapi-orange selection:text-white pt-[80px]">
      <Header />

      {/* Banner */}
      <div className="bg-guapi-green w-full py-16 flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Adote um pet</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Breadcrumb */}
        <div className="py-6 text-sm text-gray-500 flex gap-2">
          <Link to="/" className="hover:text-guapi-green transition-colors">
            Início
          </Link>
          <span>&gt;</span>
          <Link
            to={isAdopted ? "/adotados" : "/adotar"}
            className="hover:text-guapi-green transition-colors"
          >
            {isAdopted ? "Adotados" : "Adote um pet"}
          </Link>
          <span>&gt;</span>
          <span className="text-guapi-green font-medium">{pet.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">
          {/* Image */}
          <div className="flex flex-col items-center">
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full aspect-[4/3] object-cover rounded shadow-sm"
            />
            {/* Dots */}
            {pet.images && pet.images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {pet.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? "bg-blue-500" : "bg-gray-200"}`}
                  ></div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h2 className="text-2xl font-bold text-guapi-green mb-6">
              {pet.name}
            </h2>

            <ul className="space-y-4 text-sm text-gray-800">
              <li>
                <span className="font-bold">Raça:</span> Sem Raça Definida
              </li>
              <li>
                <span className="font-bold">Sexo:</span> {pet.gender}
              </li>
              <li>
                <span className="font-bold">Animal:</span> {pet.species}
              </li>
              <li>
                <span className="font-bold">Porte:</span> {pet.size}
              </li>
              <li>
                <span className="font-bold">Cor predominante da pelagem:</span>{" "}
                {color}
              </li>
              <li>
                <span className="font-bold">Idade aproximada:</span> {pet.age}
              </li>
              <li>
                <span className="font-bold">
                  Data de nascimento aproximada:
                </span>{" "}
                01/12/2023
              </li>
              <li>
                <span className="font-bold">
                  Data da vacinação antirrábica:
                </span>{" "}
                16/02/2024
              </li>
              <li>
                <span className="font-bold">Data da vermifugação:</span>{" "}
                16/03/2024
              </li>
              <li>
                <span className="font-bold">Castrado:</span> Sim
              </li>
              <li>
                <span className="font-bold">Sociável com outros animais?</span>{" "}
                Sim
              </li>
              <li>
                <span className="font-bold">Sociável com pessoas?:</span> Sim
              </li>
              <li>
                <span className="font-bold">Responsável pelo PET:</span>{" "}
                Secretaria de Bem-Estar Animal
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 max-w-4xl">
          <h3 className="text-xl font-bold text-guapi-green mb-4">
            Sobre o pet
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            Prepare-se para se derreter! 😍 Apresentamos o {pet.name}, um{" "}
            {pet.species.toLowerCase()} de {pet.age} que é pura doçura. Com sua
            pelagem linda e porte {pet.size.toLowerCase()}, este{" "}
            {pet.species.toLowerCase()} sem raça definida é um verdadeiro
            encanto.
            {pet.description} Ele mal pode esperar para encontrar sua família e
            espalhar amor por aí! 🐾❤️
          </p>

          {!isAdopted && pet.status !== "em_processo" && (
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
