import { Link, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { clearAdminSession, getAdminUser, temPermissao, PAPEL_LABEL, type AdminPapel } from '../../lib/api/admin';
import {
  LayoutDashboard, Users, PawPrint, Heart, MessageSquare,
  LogOut, UserCircle, Image, Calendar, BookOpen, Activity,
  Stethoscope, HandHeart, PieChart, ClipboardList, ShieldAlert,
} from 'lucide-react';

// Map cada rota a uma permissão
const NAV_ITEMS = [
  { name: 'Dashboard',             path: '/admin/dashboard',       icon: LayoutDashboard, permissao: 'dashboard' },
  { name: 'Solicitações',          path: '/admin/solicitacoes',    icon: ClipboardList,   permissao: 'solicitacoes' },
  { name: 'Gráficos',              path: '/admin/graficos',        icon: PieChart,        permissao: 'graficos' },
  { name: 'Pets',                  path: '/admin/pets',            icon: PawPrint,        permissao: 'pets' },
  { name: 'Adoções',               path: '/admin/adocoes',         icon: Heart,           permissao: 'adocoes' },
  { name: 'Eventos',               path: '/admin/eventos',         icon: Calendar,        permissao: 'eventos' },
  { name: 'Banners',               path: '/admin/banners',         icon: Image,           permissao: 'banners' },
  { name: 'Histórias',             path: '/admin/historias',       icon: BookOpen,        permissao: 'historias' },
  { name: 'Denúncias',             path: '/admin/contatos',        icon: MessageSquare,   permissao: 'contatos' },
  { name: 'Lista de Proprietários',path: '/admin/usuarios',        icon: Users,           permissao: 'usuarios' },
  { name: 'Lista de Veterinários', path: '/admin/veterinarios',    icon: Stethoscope,     permissao: 'veterinarios' },
  { name: 'Lista de Protetores',   path: '/admin/protetores',      icon: HandHeart,       permissao: 'protetores' },
  { name: 'Logs',                  path: '/admin/logs',            icon: Activity,        permissao: 'logs' },
  { name: 'Meus Dados',            path: '/admin/configuracoes',   icon: UserCircle,      permissao: 'meus_dados' },
];

// Badge color per role
const ROLE_BADGE: Record<string, string> = {
  admin:       'bg-guapi-green text-white',
  veterinario: 'bg-blue-600 text-white',
  protetor:    'bg-amber-500 text-white',
  proprietario:'bg-purple-600 text-white',
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = getAdminUser();

  const papel = (admin?.papel ?? 'proprietario') as AdminPapel;

  // Filter nav items by permission
  const navItems = NAV_ITEMS.filter(item => temPermissao(papel, item.permissao));

  // Route guard: if current path is not in allowed items → redirect to dashboard
  const currentAllowed = navItems.some(item => location.pathname.startsWith(item.path));
  const isDashboard = location.pathname === '/admin/dashboard' || location.pathname === '/admin';
  if (!currentAllowed && !isDashboard) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogout = () => {
    clearAdminSession();
    navigate('/admin/login');
  };

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
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 uppercase tracking-wider ${ROLE_BADGE[papel] ?? 'bg-gray-700 text-white'}`}>
              {PAPEL_LABEL[papel] ?? papel}
            </span>
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
