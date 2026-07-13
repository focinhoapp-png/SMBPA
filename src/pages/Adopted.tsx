import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { mockPets, getPetSubTitle } from '../data/pets';

export default function Adopted() {
  const adoptedPets = mockPets.filter(pet => pet.status === 'adotado');

  return (
    <div className="font-sans bg-white selection:bg-guapi-orange selection:text-white pt-[80px] min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        {/* Breadcrumb */}
        <div className="py-6 text-sm text-gray-500 flex gap-2">
           <Link to="/" className="hover:text-guapi-green transition-colors">Início</Link>
           <span>&gt;</span>
           <span className="text-guapi-green font-medium">Adotados</span>
        </div>

        {/* Banner Adotados e Counter */}
        <div className="w-full relative mt-4 rounded-3xl overflow-hidden shadow-xl border border-guapi-green/10 mb-12">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=1200" 
              alt="Cachorro feliz" 
              className="w-full h-full object-cover object-top"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-guapi-green/95 via-guapi-green/90 to-[#fae284]/80 backdrop-blur-[2px]"></div>
          </div>
          
          <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-24 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
             <div className="max-w-2xl px-4 md:px-0">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-6 backdrop-blur-md border border-white/20">
                  <Heart className="w-4 h-4 fill-white text-white" />
                  Mural da Adoção
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-sm">
                  Pets <br className="hidden md:block"/> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#fae284]">Adotados</span>
                </h1>
                <p className="text-white/90 text-lg sm:text-xl font-medium max-w-lg drop-shadow-sm">
                  Conheça nossas estrelas que já foram adotadas e começaram uma nova vida!
                </p>
             </div>
             
             {/* Counter Inside Banner */}
             <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group hover:bg-white/20 transition-all duration-300 w-full md:w-auto mx-4 md:mx-0">
               <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#fae284] rounded-full blur-2xl opacity-40 mix-blend-screen"></div>
               <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white rounded-full blur-2xl opacity-30 mix-blend-screen"></div>
               <span className="relative z-10 text-white/90 font-semibold mb-2 uppercase tracking-wider text-xs sm:text-sm">Vidas Transformadas</span>
               <div className="relative z-10 flex items-baseline gap-1">
                 <span className="text-6xl sm:text-7xl font-black text-white drop-shadow-md">
                   {adoptedPets.length}
                 </span>
                 <span className="text-[#fae284] font-black text-4xl sm:text-5xl drop-shadow-sm">+</span>
               </div>
             </div>
          </div>
        </div>

        {/* Grid de Adotados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {adoptedPets.map(pet => (
            <div key={pet.id} className="border border-guapi-green rounded-2xl overflow-hidden flex flex-col bg-white">
              <Link to={`/descricao-pet/${pet.id}?status=adopted`} className="h-52 w-full relative block">
                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
              </Link>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-guapi-green mb-1">{pet.name}</h3>
                <p className="text-[11px] text-gray-500 mb-3 font-medium">
                  {getPetSubTitle(pet)}
                </p>
                <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed mb-6">
                  {pet.description} Resgatado das ruas com muito amor, este lindo animal de porte {pet.size.toLowerCase()} encontrou uma nova família.
                </p>
                
                <div className="mt-auto">
                  <Link to={`/descricao-pet/${pet.id}?status=adopted`} className="block w-full text-center bg-[#ff5a4f] hover:bg-red-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer">
                    Adotado
                  </Link>
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
