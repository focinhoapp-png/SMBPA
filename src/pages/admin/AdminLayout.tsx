import { Link, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { clearAdminSession, getAdminUser, temPermissao, PAPEL_LABEL, type AdminPapel } from '../../lib/api/admin';
import {
  LayoutDashboard, Users, PawPrint, Heart, MessageSquare,
  LogOut, UserCircle, Image, Calendar, BookOpen, Activity,
  Stethoscope, HandHeart, PieChart, ClipboardList, ShieldAlert,
  ArrowLeftRight, Building2,
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
  { name: 'Lista de Animais',      path: '/admin/lista-animais',   icon: PawPrint,        permissao: 'pets' },
  { name: 'Transferências',          path: '/admin/transferencia',icon: ArrowLeftRight,  permissao: 'pets' },
  { name: 'Agendamentos',          path: '/admin/agendamentos',    icon: Calendar,        permissao: 'agendamentos' },
  { name: 'Logs',                  path: '/admin/logs',            icon: Activity,        permissao: 'logs' },
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
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <aside className="w-[220px] bg-[#041B15] text-gray-300 flex flex-col shadow-xl z-20 shrink-0">
        <div className="h-20 flex items-center bg-transparent border-0 px-6">
          <div className="flex items-center gap-3">
            <PawPrint className="w-6 h-6 text-white shrink-0" />
            <span className="text-white font-bold text-lg uppercase tracking-wider truncate">SMBPA ADMIN</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-guapi-green/30 hover:[&::-webkit-scrollbar-thumb]:bg-guapi-green/80 [&::-webkit-scrollbar-thumb]:rounded-full">
          <nav className="space-y-0.5 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 mx-1.5 py-1.5 rounded-lg transition-all duration-200 text-[13px] ${
                    isActive 
                      ? 'bg-guapi-green/10 text-guapi-green font-medium' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-[16px] h-[16px] shrink-0 ${isActive ? 'text-guapi-green' : 'text-gray-400'}`} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
