import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { mockPets, getPetSubTitle } from '../data/pets';

export default function Adopt() {
  const [filterSpecies, setFilterSpecies] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterAge, setFilterAge] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [filterColor, setFilterColor] = useState('');

  const filteredPets = mockPets.filter(pet => {
    if (filterSpecies && pet.species !== filterSpecies) return false;
    if (filterGender && pet.gender !== filterGender) return false;
    
    if (filterAge) {
      const ageStr = pet.age.toLowerCase();
      // Only "meses" alone or exactly "1 ano" count as under 1. 
      // If it contains "anos" (plural) or "1 ano e" or "1 ano," it's > 1 year.
      let isUnder1 = false;
      if (ageStr === '1 ano' || (!ageStr.includes('ano') && ageStr.includes('mes'))) {
        isUnder1 = true;
      }
      if (filterAge === '0 a 1 ano' && !isUnder1) return false;
      if (filterAge === 'Mais de 1 ano' && isUnder1) return false;
    }

    if (filterSize && pet.size !== filterSize) return false;
    
    if (filterColor) {
      let petColor = pet.color || 'Caramelo';
      if (!pet.color) {
        if (pet.id === '2' || pet.id === '5' || pet.id === '7') petColor = 'Branca';
        if (pet.id === '6' || pet.id === '8') petColor = 'Preta';
      }
      if (petColor.toLowerCase() !== filterColor.toLowerCase()) return false;
    }

    return true;
  });
  
  const finalFilteredPets = [...filteredPets.filter(pet => pet.status !== 'adotado')]
    .sort((a, b) => parseInt(b.id) - parseInt(a.id))
    .sort((a, b) => {
      if (a.status === 'em_processo' && b.status !== 'em_processo') return 1;
      if (a.status !== 'em_processo' && b.status === 'em_processo') return -1;
      return 0;
    });

  return (
    <div className="font-sans bg-white pt-[80px]">
      <Header />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        {/* Breadcrumb */}
        <div className="py-6 text-sm text-gray-500 flex gap-2">
           <Link to="/" className="hover:text-guapi-green transition-colors">Início</Link>
           <span>&gt;</span>
           <span className="text-guapi-green font-medium">Adote um pet</span>
        </div>

        {/* Banner */}
        <div className="w-full mt-4">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-guapi-green/10 mb-12">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200" 
                alt="Cão esperando adoção" 
                className="w-full h-full object-cover object-center"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-guapi-green/95 via-guapi-green/80 to-transparent backdrop-blur-[2px]"></div>
            </div>
            
            <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-4 backdrop-blur-md border border-white/20">
                 <PawPrint className="w-4 h-4 fill-white text-white" />
                 Encontre seu amigo
               </div>
               <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-sm">
                 Adote um <span className="text-[#fae284]">Pet</span>
               </h1>
               <p className="text-white/90 text-lg sm:text-xl font-medium max-w-lg drop-shadow-sm leading-relaxed mx-auto md:mx-0">
                 O amor não tem raça, mas faz o coração bater mais forte. Encontre seu novo companheiro de vida hoje mesmo.
               </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Animal:</label>
            <select
              value={filterSpecies}
              onChange={e => setFilterSpecies(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-guapi-green"
            >
              <option value="">Selecione</option>
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Sexo:</label>
            <select
              value={filterGender}
              onChange={e => setFilterGender(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-guapi-green"
            >
              <option value="">Selecione</option>
              <option value="Macho">Macho</option>
              <option value="Fêmea">Fêmea</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Idade:</label>
            <select
              value={filterAge}
              onChange={e => setFilterAge(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-guapi-green"
            >
              <option value="">Selecione</option>
              <option value="0 a 1 ano">0 a 1 ano</option>
              <option value="Mais de 1 ano">Mais de 1 ano</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Porte:</label>
            <select
              value={filterSize}
              onChange={e => setFilterSize(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-guapi-green"
            >
              <option value="">Selecione</option>
              <option value="Pequeno">Pequeno</option>
              <option value="Médio">Médio</option>
              <option value="Grande">Grande</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Cor predominante da pelagem:</label>
            <select
              value={filterColor}
              onChange={e => setFilterColor(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-guapi-green"
            >
              <option value="">Selecione</option>
              <option value="Preta">Preta</option>
              <option value="Branca">Branca</option>
              <option value="Caramelo">Caramelo</option>
              <option value="Amarela">Amarela</option>
              <option value="Marrom">Marrom</option>
              <option value="Tigrada">Tigrada</option>
              <option value="Cinza">Cinza</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {finalFilteredPets.map(pet => (
            <div key={pet.id} className="border-2 border-guapi-green rounded-2xl overflow-hidden flex flex-col bg-white">
              <Link to={`/descricao-pet/${pet.id}`} className="h-52 w-full relative block">
                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
              </Link>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-guapi-green mb-1">{pet.name}</h3>
                <p className="text-[11px] text-gray-500 mb-3 font-medium">
                  {getPetSubTitle(pet)}
                </p>
                <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed mb-6">
                  {pet.description} Resgatado das ruas com muito amor, este lindo animal de porte {pet.size.toLowerCase()} está ansioso por uma nova família.
                </p>
                
                <div className="mt-auto">
                  {pet.status === 'em_processo' ? (
                    <div className="block w-full text-center bg-[#ff5a4f] text-white font-semibold py-2.5 rounded-lg text-sm cursor-default">
                      Em processo de adoção
                    </div>
                  ) : (
                    <Link
                      to={`/descricao-pet/${pet.id}`}
                      className="block w-full text-center bg-guapi-green hover:bg-guapi-green-dark text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                    >
                      Disponível para adoção
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
