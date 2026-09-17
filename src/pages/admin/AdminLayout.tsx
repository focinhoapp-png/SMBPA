import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { clearAdminSession, getAdminUser, temPermissao, PAPEL_LABEL, type AdminPapel } from '../../lib/api/admin';
import {
  LayoutDashboard, Users, PawPrint, Heart, MessageSquare,
  LogOut, UserCircle, Image, Calendar, BookOpen, Activity,
  Stethoscope, HandHeart, PieChart, ClipboardList, ShieldAlert,
  ArrowLeftRight, Building2, Menu, X
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
  { name: 'Transferências',        path: '/admin/transferencia',   icon: ArrowLeftRight,  permissao: 'pets' },
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // Close sidebar on location change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 w-[260px] bg-[#041B15] text-gray-300 flex flex-col shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-20 flex items-center justify-between bg-transparent border-b border-white/5 px-6">
          <div className="flex items-center gap-3">
            <PawPrint className="w-6 h-6 text-white shrink-0" />
            <span className="text-white font-bold text-lg uppercase tracking-wider truncate">SMBPA ADMIN</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-guapi-green/30 hover:[&::-webkit-scrollbar-thumb]:bg-guapi-green/80 [&::-webkit-scrollbar-thumb]:rounded-full">
          <nav className="space-y-0.5 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                    isActive 
                      ? 'bg-guapi-green/20 text-guapi-green font-bold shadow-sm' 
                      : 'text-gray-400 font-medium hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-guapi-green' : 'text-gray-400'}`} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* User profile / Logout at bottom */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 mb-4 px-2">
             <div className="w-10 h-10 bg-guapi-green rounded-full flex items-center justify-center shadow-md">
               <UserCircle className="w-6 h-6 text-white" />
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-bold text-white truncate">{admin?.nome || 'Administrador'}</p>
               <span className={`inline-block mt-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${ROLE_BADGE[papel]}`}>
                 {PAPEL_LABEL[papel]}
               </span>
             </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors font-bold text-sm shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#F8FAFC] relative flex flex-col">
        {/* Header Bar */}
        <div className="sticky top-0 z-30 flex items-center px-6 py-4 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-gray-100">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-600 hover:text-guapi-green hover:border-guapi-green transition-all focus:outline-none focus:ring-2 focus:ring-guapi-green/50"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
