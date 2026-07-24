import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../lib/api/admin';
import {
  PawPrint, Heart, Users, MessageSquare, Scissors,
  Home, ShieldAlert, TrendingUp, Calendar, Activity,
  AlertCircle, CheckCircle, Clock, UserCheck, Building2,
} from 'lucide-react';

// ─── Radial Spoke Chart Component ─────────────────────────────────────────────
interface SpokeItem {
  label: string;
  value: number;
  color: string;
  angle: number;
  icon: React.ReactNode;
}

function RadialSpokeChart({
  total,
  subtitle,
  items,
  accentColor,
}: {
  total: number;
  subtitle: string;
  items: SpokeItem[];
  accentColor: string;
}) {
  const cx = 120;
  const cy = 120;
  const innerR = 62;
  const spokeStart = innerR + 6;
  const spokeEnd = innerR + 36;

  return (
    <div className="relative flex flex-col items-center">
      <svg width="240" height="240" viewBox="0 0 240 240" className="drop-shadow-sm">
        {/* Outer decorative ring */}
        <circle cx={cx} cy={cy} r={innerR + 44} fill="none" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="4 6" />

        {/* Inner circle */}
        <circle cx={cx} cy={cy} r={innerR} fill="white" stroke="#e2e8f0" strokeWidth="2" />

        {/* Colored arc segments */}
        {items.map((item, i) => {
          const prev = items[i - 1];
          const startAngle = i === 0 ? -90 : prev.angle - 90;
          const endAngle = item.angle - 90;
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          const r = innerR - 4;
          const x1 = cx + r * Math.cos(startRad);
          const y1 = cy + r * Math.sin(startRad);
          const x2 = cx + r * Math.cos(endRad);
          const y2 = cy + r * Math.sin(endRad);
          const large = endAngle - startAngle > 180 ? 1 : 0;
          return (
            <path
              key={i}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
              fill={item.color}
              opacity="0.12"
            />
          );
        })}

        {/* Spokes */}
        {items.map((item, i) => {
          const midAngle = i === 0
            ? item.angle / 2 - 90
            : (items[i - 1].angle + item.angle) / 2 - 90;
          const rad = (midAngle * Math.PI) / 180;
          const x1 = cx + spokeStart * Math.cos(rad);
          const y1 = cy + spokeStart * Math.sin(rad);
          const x2 = cx + spokeEnd * Math.cos(rad);
          const y2 = cy + spokeEnd * Math.sin(rad);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={item.color} strokeWidth="3" strokeLinecap="round" />
          );
        })}

        {/* Center text */}
        <text x={cx} y={cy - 10} textAnchor="middle" fontSize="28" fontWeight="800" fill={accentColor}>
          {total}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#64748b">
          {subtitle}
        </text>
      </svg>

      {/* Legend items placed around visually */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1 w-full max-w-[240px]">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
            <span className="text-[11px] text-gray-600 font-medium truncate">{item.label}</span>
            <span className="text-[11px] font-bold ml-auto shrink-0" style={{ color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
  trend,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
  bg: string;
  trend?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`${bg} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
        <p className="text-2xl font-extrabold text-gray-800 leading-none">{value}</p>
      </div>
      {trend && (
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full shrink-0">
          {trend}
        </span>
      )}
    </div>
  );
}

// ─── Alert Card ───────────────────────────────────────────────────────────────
function AlertCard({
  icon: Icon,
  label,
  value,
  type,
}: {
  icon: any;
  label: string;
  value: number;
  type: 'warning' | 'info' | 'success';
}) {
  const styles = {
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', iconBg: 'bg-amber-100' },
    info:    { bg: 'bg-blue-50',  border: 'border-blue-200',  text: 'text-blue-700',  iconBg: 'bg-blue-100' },
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', iconBg: 'bg-emerald-100' },
  }[type];

  return (
    <div className={`${styles.bg} border ${styles.border} rounded-xl p-4 flex items-center gap-3`}>
      <div className={`${styles.iconBg} w-9 h-9 rounded-lg flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${styles.text}`} />
      </div>
      <div>
        <p className={`text-xs font-medium ${styles.text} opacity-80`}>{label}</p>
        <p className={`text-xl font-extrabold ${styles.text}`}>{value}</p>
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-guapi-green border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  // Build spoke items for pets
  const totalPets = stats?.totalPets ?? 0;
  const buildAngles = (values: number[]) => {
    const total = values.reduce((a, b) => a + b, 0) || 1;
    const angles: number[] = [];
    let acc = 0;
    for (const v of values) {
      acc += (v / total) * 360;
      angles.push(Math.round(acc));
    }
    // ensure last is exactly 360
    angles[angles.length - 1] = 360;
    return angles;
  };

  const petValues = [
    stats?.petsMachos ?? 0,
    stats?.petsFemeas ?? 0,
    stats?.petsCastrados ?? 0,
    stats?.petsParaAdocao ?? 0,
    stats?.petsAdotados ?? 0,
    stats?.petsComunitarios ?? 0,
  ];
  const petAngles = buildAngles(petValues);

  const petItems: SpokeItem[] = [
    { label: 'Machos',      value: stats?.petsMachos ?? 0,      color: '#3b82f6', angle: petAngles[0], icon: null },
    { label: 'Fêmeas',      value: stats?.petsFemeas ?? 0,      color: '#ec4899', angle: petAngles[1], icon: null },
    { label: 'Castrados',   value: stats?.petsCastrados ?? 0,   color: '#a855f7', angle: petAngles[2], icon: null },
    { label: 'Para Adoção', value: stats?.petsParaAdocao ?? 0,  color: '#f59e0b', angle: petAngles[3], icon: null },
    { label: 'Adotados',    value: stats?.petsAdotados ?? 0,    color: '#10b981', angle: petAngles[4], icon: null },
    { label: 'Comunitários',value: stats?.petsComunitarios ?? 0,color: '#ef4444', angle: petAngles[5], icon: null },
  ];

  const userValues = [
    stats?.usuariosProprietarios ?? 0,
    stats?.usuariosVeterinarios ?? 0,
    stats?.usuariosProtetores ?? 0,
    stats?.usuariosEstabelecimento ?? 0,
    stats?.usuariosJuridica ?? 0,
  ];
  const userAngles = buildAngles(userValues);

  const userItems: SpokeItem[] = [
    { label: 'Pessoa Física',     value: stats?.usuariosProprietarios ?? 0,  color: '#3b82f6', angle: userAngles[0], icon: null },
    { label: 'Veterinários',      value: stats?.usuariosVeterinarios ?? 0,   color: '#10b981', angle: userAngles[1], icon: null },
    { label: 'Protetores',        value: stats?.usuariosProtetores ?? 0,     color: '#f59e0b', angle: userAngles[2], icon: null },
    { label: 'Estabelecimentos',  value: stats?.usuariosEstabelecimento ?? 0,color: '#a855f7', angle: userAngles[3], icon: null },
    { label: 'Pessoa Jurídica',   value: stats?.usuariosJuridica ?? 0,       color: '#ef4444', angle: userAngles[4], icon: null },
  ];

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-400 font-medium capitalize mt-0.5">{dateStr}</p>
        </div>
        <div className="flex items-center gap-2 bg-guapi-green/10 text-guapi-green text-xs font-bold px-3 py-2 rounded-full">
          <Activity className="w-3.5 h-3.5" />
          Sistema Online
        </div>
      </div>

      {/* Alertas de atenção */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AlertCard icon={Clock}         label="Denúncias Pendentes"  value={stats?.contatosPendentes ?? 0}  type="warning" />
        <AlertCard icon={AlertCircle}   label="Adoções Pendentes"    value={stats?.adocoesPendentes ?? 0}   type="info" />
        <AlertCard icon={CheckCircle}   label="Pets Disponíveis"     value={stats?.petsDisponiveis ?? 0}    type="success" />
      </div>

      {/* Introdução */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="bg-guapi-green/20 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-guapi-green" />
          </div>
          <div>
            <h2 className="text-lg font-bold mb-1">Visão Geral do Sistema</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Acompanhe em tempo real a distribuição dos animais cadastrados e o perfil dos usuários da plataforma Adota Pet Guapimirim. Use estas informações para planejar campanhas de adoção, vacinação e castração.
            </p>
          </div>
        </div>
      </div>

      {/* Radial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pets */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center">
              <PawPrint className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base">Distribuição de Animais</h3>
              <p className="text-xs text-gray-500">Todos os pets cadastrados no sistema</p>
            </div>
          </div>
          <div className="flex justify-center">
            <RadialSpokeChart
              total={totalPets}
              subtitle="Animais cadastrados"
              items={petItems}
              accentColor="#3b82f6"
            />
          </div>
        </div>

        {/* Usuários */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-50 w-10 h-10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base">Distribuição de Usuários</h3>
              <p className="text-xs text-gray-500">Perfis cadastrados na plataforma</p>
            </div>
          </div>
          <div className="flex justify-center">
            <RadialSpokeChart
              total={stats?.totalUsuarios ?? 0}
              subtitle="Usuários cadastrados"
              items={userItems}
              accentColor="#a855f7"
            />
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Métricas Gerais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <MetricCard icon={PawPrint}     label="Total de Pets Cadastrados" value={stats?.totalPets ?? 0}          color="text-blue-600"    bg="bg-blue-50" />
          <MetricCard icon={Heart}        label="Adoções Concluídas"         value={stats?.petsAdotados ?? 0}       color="text-emerald-600" bg="bg-emerald-50" />
          <MetricCard icon={Users}        label="Usuários na Plataforma"     value={stats?.totalUsuarios ?? 0}      color="text-purple-600"  bg="bg-purple-50" />
          <MetricCard icon={Scissors}     label="Pets Castrados"             value={stats?.petsCastrados ?? 0}      color="text-pink-600"    bg="bg-pink-50" />
          <MetricCard icon={Home}         label="Pets Comunitários"          value={stats?.petsComunitarios ?? 0}   color="text-amber-600"   bg="bg-amber-50" />
          <MetricCard icon={MessageSquare}label="Denúncias Recebidas"        value={stats?.contatosPendentes ?? 0}  color="text-red-600"     bg="bg-red-50" />
        </div>
      </div>
    </div>
  );
}
