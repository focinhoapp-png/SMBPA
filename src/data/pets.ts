export type Species = 'Cachorro' | 'Gato';
export type Gender = 'Macho' | 'Fêmea';
export type Size = 'Pequeno' | 'Médio' | 'Grande';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  gender: Gender;
  size: Size;
  age: string;
  color?: string;
  status?: 'disponivel' | 'em_processo' | 'adotado';
  image: string;
  images?: string[];
  description: string;
}

export function getPetSubTitle(pet: Pet) {
  let color = pet.color || 'Caramelo';
  if (!pet.color) {
    if (pet.id === '2' || pet.id === '5' || pet.id === '7') color = 'Branca';
    if (pet.id === '6' || pet.id === '8') color = 'Preta';
  }
  
  return `${pet.gender} • ${pet.age} • Cor predominante ${color} • ${pet.size}`;
}

export const mockPets: Pet[] = [
  {
    id: '1',
    name: 'Rex',
    species: 'Cachorro',
    gender: 'Macho',
    size: 'Médio',
    age: '2 anos',
    color: 'Caramelo',
    status: 'adotado',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
    description: 'Um cãozinho muito alegre e cheio de energia para brincar.'
  },
  {
    id: '2',
    name: 'Nina',
    species: 'Gato',
    gender: 'Fêmea',
    size: 'Pequeno',
    age: '1 ano',
    color: 'Branca',
    status: 'adotado',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
    description: 'Muito carinhosa, adora colo e um cafuné.'
  },
  {
    id: '3',
    name: 'Thor',
    species: 'Cachorro',
    gender: 'Macho',
    size: 'Grande',
    age: '3 anos',
    color: 'Caramelo',
    status: 'adotado',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800',
    description: 'Protetor e leal, ótimo para casas com um bom quintal.'
  },
  {
    id: '4',
    name: 'Luna',
    species: 'Cachorro',
    gender: 'Fêmea',
    size: 'Médio',
    age: '8 meses',
    color: 'Caramelo',
    status: 'adotado',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800',
    description: 'Uma filhote dócil que está conhecendo o mundo e adora aprender truques.'
  },
  {
    id: '5',
    name: 'Bolinha',
    species: 'Gato',
    gender: 'Macho',
    size: 'Pequeno',
    age: '3 meses',
    color: 'Branca',
    status: 'adotado',
    image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=800',
    description: 'Um gatinho bem pequenininho e super sapeca.'
  },
  {
    id: '6',
    name: 'Belinha',
    species: 'Cachorro',
    gender: 'Fêmea',
    size: 'Pequeno',
    age: '4 anos',
    color: 'Preta',
    status: 'adotado',
    image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&q=80&w=800',
    description: 'Calma e companheira. Perfeita para apartamento.'
  },
  {
    id: '7',
    name: 'Simba',
    species: 'Gato',
    gender: 'Macho',
    size: 'Médio',
    age: '2 anos',
    color: 'Amarelo',
    status: 'adotado',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=800',
    description: 'Um gato majestoso com muito amor para dar.'
  },
  {
    id: '8',
    name: 'Max',
    species: 'Cachorro',
    gender: 'Macho',
    size: 'Médio',
    age: '1 ano, 5 meses',
    color: 'Caramelo',
    status: 'adotado',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800',
    description: 'Brincalhão, ótimo com crianças e socializa bem.'
  },
  {
    id: '9',
    name: 'Juliet',
    species: 'Gato',
    gender: 'Fêmea',
    size: 'Pequeno',
    age: '4 anos e 5 meses',
    color: 'Preta',
    status: 'disponivel',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
    description: 'Juliet está pronta para encontrar uma família que respeite seu jeitinho calmo e encantador. Ela só precisa de um lar cheio de amor, carinho e paciência para florescer. 💛 Quer ser o novo...'
  },
  {
    id: '10',
    name: 'Balança',
    species: 'Cachorro',
    gender: 'Fêmea',
    size: 'Médio',
    age: '6 anos e 1 mês',
    color: 'Caramelo',
    status: 'disponivel',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
    description: 'Ela balança, mas não cai... no desânimo! 😅🎵 Nem ela nem quem ter a sorte de conviver com essa menina linda! Balança já sentiu a dor do abandono mas foi resgatada pela GEVACZ e hoje...'
  },
  {
    id: '11',
    name: 'Beybe',
    species: 'Cachorro',
    gender: 'Fêmea',
    size: 'Médio',
    age: '2 anos e 7 meses',
    color: 'Preta',
    status: 'em_processo',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800',
    description: '🐕 BEYBE: uma fofura em busca de um lar! 🐕 Com 1 ano e 2 meses de idade, a Beybe é uma mocinha cheia de energia, carinho e aquele jeitinho brincalhão que derrete corações. ❤️ Ela adora...'
  },
  {
    id: '12',
    name: 'Caramela',
    species: 'Cachorro',
    gender: 'Fêmea',
    size: 'Grande',
    age: '4 anos e 8 meses',
    color: 'Caramelo',
    status: 'em_processo',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800',
    description: 'Caramela é uma cadelinha encantadora e cheia de qualidades. Muito dócil e tranquila com pessoas — inclusive crianças — ela é a companheira perfeita para quem busca amor, lealdade...'
  },
  {
    id: '13',
    name: 'Tom',
    species: 'Gato',
    gender: 'Macho',
    size: 'Médio',
    age: '3 anos',
    color: 'Cinza',
    status: 'disponivel',
    image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=800',
    description: 'Um gato muito esperto e brincalhão, que adora explorar a casa. Adotando Tom, você terá diversão garantida.'
  },
  {
    id: '14',
    name: 'Bob',
    species: 'Cachorro',
    gender: 'Macho',
    size: 'Pequeno',
    age: '1 ano e 2 meses',
    color: 'Branca',
    status: 'disponivel',
    image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&q=80&w=800',
    description: 'Cãozinho de olhar doce e um coração gigante, que só precisa de uma chance para te mostrar o quanto pode ser fiel e carinhoso.'
  },
  {
    id: '15',
    name: 'Princesa',
    species: 'Cachorro',
    gender: 'Fêmea',
    size: 'Pequeno',
    age: '5 anos',
    color: 'Preta',
    status: 'em_processo',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800',
    description: 'Cheia de personalidade marcante, a Princesa já fez história. Uma verdadeira dama de gostos refinados, conquistou a todos com seu jeito...'
  },
  {
    id: '16',
    name: 'Garfield',
    species: 'Gato',
    gender: 'Macho',
    size: 'Grande',
    age: '6 anos',
    color: 'Laranja',
    status: 'em_processo',
    image: 'https://images.unsplash.com/photo-1529778456102-14022b7c6c40?auto=format&fit=crop&q=80&w=800',
    description: 'Esse fofura tem cerca de seis anos e já enfrentou momentos difíceis, mas nunca perdeu sua doçura. Ama um bom sachê e longas sonecas...'
  },
  {
    id: '17',
    name: 'Marley',
    species: 'Cachorro',
    gender: 'Macho',
    size: 'Grande',
    age: '2 anos',
    color: 'Amarelo',
    status: 'disponivel',
    image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=800',
    description: 'Super brincalhão e cheio de energia. Ideal para quem gosta de atividades ao ar livre.'
  },
  {
    id: '18',
    name: 'Amora',
    species: 'Cachorro',
    gender: 'Fêmea',
    size: 'Pequeno',
    age: '1 ano',
    color: 'Preta e Branca',
    status: 'disponivel',
    image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&q=80&w=800',
    description: 'Uma doçura em forma de cachorrinha. Muito carinhosa e ótima companhia para todas as horas.'
  },
  {
    id: '19',
    name: 'Felix',
    species: 'Gato',
    gender: 'Macho',
    size: 'Médio',
    age: '4 meses',
    color: 'Tigrado',
    status: 'disponivel',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&q=80&w=800',
    description: 'Muito curioso e esperto. Adora explorar cada cantinho da casa e brincar com bolinhas.'
  },
  {
    id: '20',
    name: 'Mel',
    species: 'Cachorro',
    gender: 'Fêmea',
    size: 'Médio',
    age: '3 anos',
    color: 'Caramelo',
    status: 'disponivel',
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=800',
    description: 'Uma cadelinha super amigável que se dá bem com outros animais e crianças. Procura um lar cheio de amor.'
  }
];
