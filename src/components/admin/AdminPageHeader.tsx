import React, { useState } from 'react';
import { Bell, LogOut, ChevronDown, UserCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAdminUser, PAPEL_LABEL, clearAdminSession, type AdminPapel } from '../../lib/api/admin';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function AdminPageHeader({ title, subtitle, children }: AdminPageHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const admin = getAdminUser();
  const papel = (admin?.papel ?? 'proprietario') as AdminPapel;

  const isDashboard = location.pathname === '/admin/dashboard' || location.pathname === '/admin';

  const handleLogout = () => {
    clearAdminSession();
    navigate('/admin');
  };
  
  const now = new Date();
  const dateStr = new Intl.DateTimeFormat('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(now);
  const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">{title}</h1>
        <p className="text-gray-500 text-sm mt-1">{subtitle || capitalizedDate}</p>
      </div>

      <div className="flex items-center gap-6">
        {children && <div className="flex items-center gap-3">{children}</div>}

        {isDashboard && (
          <div className="flex items-center gap-3 pl-6 border-l border-gray-200 relative">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800 leading-tight">{admin?.nome || 'Usuário'}</p>
                <p className="text-xs text-gray-500 font-medium">{PAPEL_LABEL[papel] || 'Administrador'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-guapi-green text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {(admin?.nome || 'U').charAt(0).toUpperCase()}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    navigate('/admin/configuracoes');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 font-medium transition-colors"
                >
                  <UserCircle className="w-4 h-4 text-gray-400" /> Meus Dados
                </button>
                <div className="h-px bg-gray-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" /> Sair
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
