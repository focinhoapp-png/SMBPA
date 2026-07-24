import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../lib/api/admin';
import { PawPrint, Heart, Users, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Carregando dashboard...</p>;
  }

  const statCards = [
    { name: 'Total de Pets', value: stats?.totalPets, icon: PawPrint, color: 'bg-blue-500' },
    { name: 'Pets Disponíveis', value: stats?.petsDisponiveis, icon: PawPrint, color: 'bg-guapi-green' },
    { name: 'Pets Adotados', value: stats?.petsAdotados, icon: Heart, color: 'bg-purple-500' },
    { name: 'Adoções Pendentes', value: stats?.adocoesPendentes, icon: Heart, color: 'bg-yellow-500' },
    { name: 'Contatos Pendentes', value: stats?.contatosPendentes, icon: MessageSquare, color: 'bg-red-500' },
    { name: 'Usuários Cadastrados', value: stats?.totalUsuarios, icon: Users, color: 'bg-gray-700' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`${stat.color} w-14 h-14 rounded-full flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
