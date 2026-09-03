import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { adminObterDadosGraficos } from '../../lib/api/admin';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const COLORS = ['#044F3F', '#10B981', '#0EA5E9', '#8B5CF6', '#F59E0B', '#F43F5E', '#84CC16', '#06B6D4'];

export default function AdminGraficos() {
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedEspecie, setSelectedEspecie] = useState('cachorro');

  useEffect(() => {
    adminObterDadosGraficos()
      .then((data) => {
        setPets(data);
      })
      .catch((err) => {
        console.error('Erro ao carregar dados dos gráficos', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const TABS = [
    'Distribuição de animais por espécies',
    'Distribuição de gêneros por espécie',
    'Distribuição de raças por espécie',
    'Distribuição de idades por espécie'
  ];

  const getEspecieNome = (especie: string) => {
    if (!especie) return 'Outro';
    if (especie.toLowerCase() === 'cachorro') return 'Canino';
    if (especie.toLowerCase() === 'gato') return 'Felino';
    return especie;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.35;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    if (percent < 0.05) return null; // hide small labels

    return (
      <text x={x} y={y} fill="#475569" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={13} fontWeight="700">
        {(percent * 100).toFixed(1)}%
      </text>
    );
  };

  // Prepara dados
  const prepareData = () => {
    let pieData: any[] = [];
    let barData: any[] = [];

    if (activeTab === 0) {
      // Distribuição de animais por espécies
      const caninos = pets.filter(p => p.especie === 'cachorro').length;
      const felinos = pets.filter(p => p.especie === 'gato').length;
      pieData = [
        { name: 'Canino', value: caninos },
        { name: 'Felino', value: felinos }
      ].filter(d => d.value > 0);
      barData = [...pieData];
    } else {
      // Outras tabs usam filtro de espécie
      const filteredPets = pets.filter(p => p.especie === selectedEspecie);
      
      if (activeTab === 1) {
        // Distribuição de gêneros
        const femea = filteredPets.filter(p => p.sexo === 'femea').length;
        const macho = filteredPets.filter(p => p.sexo === 'macho').length;
        pieData = [
          { name: 'Fêmea', value: femea },
          { name: 'Macho', value: macho }
        ].filter(d => d.value > 0);
        barData = [...pieData];
      } 
      else if (activeTab === 2) {
        // Distribuição de raças
        const racesCount: Record<string, number> = {};
        filteredPets.forEach(p => {
          let raca = p.raca || 'SRD';
          if (raca === 'Sem raça definida (SRD)' || raca === 'Sem raça definida') raca = 'SRD';
          racesCount[raca] = (racesCount[raca] || 0) + 1;
        });
        pieData = Object.entries(racesCount)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
        barData = [...pieData];
      }
      else if (activeTab === 3) {
        // Distribuição de idades
        let m1 = 0, e1a5 = 0, e5a9 = 0, m10 = 0;
        filteredPets.forEach(p => {
          const idade = p.idade_meses || 0;
          if (idade < 12) m1++;
          else if (idade <= 60) e1a5++;
          else if (idade <= 108) e5a9++;
          else m10++;
        });
        pieData = [
          { name: 'Menos de 1 ano', value: m1 },
          { name: 'Entre 1 e 5 anos', value: e1a5 },
          { name: 'Entre 5 e 9 anos', value: e5a9 },
          { name: 'Mais de 10 anos', value: m10 }
        ].filter(d => d.value > 0);
        barData = [...pieData];
      }
    }

    return { pieData, barData };
  };

  const { pieData, barData } = prepareData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-100 shadow-xl rounded-2xl text-sm min-w-[150px]">
          <p className="font-bold text-gray-800 mb-1">{payload[0].name}</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill || payload[0].color }}></div>
            <p className="text-gray-600 font-medium">Quantidade: <span className="text-gray-900 font-bold">{payload[0].value}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-guapi-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Gráficos e Estatísticas" 
        subtitle="Visualize a distribuição dos animais no sistema" 
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-100 bg-gray-50/50">
          {TABS.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 min-w-[200px] text-center py-4 text-sm font-bold border-b-4 transition-all ${
                activeTab === idx 
                  ? 'border-guapi-green text-guapi-green bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)]' 
                  : 'border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8">
          {/* Filters */}
          {activeTab !== 0 && (
            <div className="mb-12">
              <label className="block text-sm font-bold text-gray-700 mb-2">Selecione a Espécie</label>
              <select 
                value={selectedEspecie} 
                onChange={(e) => setSelectedEspecie(e.target.value)}
                className="w-48 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-guapi-green focus:ring-1 focus:ring-guapi-green outline-none text-gray-700 bg-gray-50 font-medium transition-all shadow-sm"
              >
                <option value="cachorro">Cachorro</option>
                <option value="gato">Gato</option>
              </select>
            </div>
          )}

          {pieData.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">Nenhum dado encontrado.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-8">
              
              {/* Pie Chart */}
              <div className="h-[400px] flex justify-center w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      label={renderCustomizedLabel}
                      labelLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="h-[400px] w-full pr-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: activeTab === 2 ? 100 : 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }}
                      angle={activeTab === 2 ? -45 : 0}
                      textAnchor={activeTab === 2 ? "end" : "middle"}
                      height={activeTab === 2 ? 120 : 40}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                      dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="value" barSize={48} radius={[6, 6, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
