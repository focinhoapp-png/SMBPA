import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { clearAdminSession, getAdminUser } from '../../lib/api/admin';
import { LayoutDashboard, Users, PawPrint, Heart, MessageSquare, LogOut, UserCircle, Image, Calendar, BookOpen, Activity, Stethoscope, HandHeart, PieChart, ClipboardList } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = getAdminUser();

  const handleLogout = () => {
    clearAdminSession();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Solicitações', path: '/admin/solicitacoes', icon: ClipboardList },
    { name: 'Gráficos', path: '/admin/graficos', icon: PieChart },
    { name: 'Pets', path: '/admin/pets', icon: PawPrint },
    { name: 'Adoções', path: '/admin/adocoes', icon: Heart },
    { name: 'Eventos', path: '/admin/eventos', icon: Calendar },
    { name: 'Banners', path: '/admin/banners', icon: Image },
    { name: 'Histórias', path: '/admin/historias', icon: BookOpen },
    { name: 'Denúncias', path: '/admin/contatos', icon: MessageSquare },
    { name: 'Lista de Proprietários', path: '/admin/usuarios', icon: Users },
    { name: 'Lista de Veterinários', path: '/admin/veterinarios', icon: Stethoscope },
    { name: 'Lista de Protetores', path: '/admin/protetores', icon: HandHeart },
    { name: 'Logs', path: '/admin/logs', icon: Activity },
    { name: 'Meus Dados', path: '/admin/configuracoes', icon: UserCircle },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col">
        <div className="h-16 flex items-center px-6 bg-gray-950 border-b border-gray-800">
          <span className="text-white font-bold text-lg uppercase tracking-wider">SMBPA Admin</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive ? 'bg-guapi-green text-white' : 'hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 bg-gray-950 border-t border-gray-800 flex flex-col gap-2">
          <div className="text-sm">
            <p className="text-white font-bold truncate">{admin?.nome}</p>
            <p className="text-xs text-gray-500 uppercase">{admin?.papel}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 mt-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <Outlet />
      </main>
    </div>
  );
}
