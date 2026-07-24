import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminObterDadosGraficos } from '../../lib/api/admin';
import { PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#1e90ff', '#718096', '#ff7300', '#10b981', '#8b5cf6', '#ec4899', '#f43f5e', '#6366f1'];

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

  // Helper to get Custom Label for Pie Chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="#000" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="500">
        <tspan x={x} dy="-0.5em">{name}</tspan>
        <tspan x={x} dy="1.2em">({value})</tspan>
        <tspan x={x} dy="1.2em" fill="#000">{(percent * 100).toFixed(1)}%</tspan>
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
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded text-sm">
          <p className="font-semibold text-gray-700">{payload[0].name}</p>
          <p className="text-gray-600">Quantidade: {payload[0].value}</p>
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
    <div>
      <div className="flex items-center gap-3 mb-6">
        <PieChartIcon className="w-8 h-8 text-guapi-green" />
        <h1 className="text-2xl font-light text-gray-800">Gráficos</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200">
          {TABS.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 min-w-[200px] text-center py-4 text-sm font-medium border-b-4 transition-colors ${
                activeTab === idx 
                  ? 'border-yellow-400 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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
              <label className="block text-sm font-bold text-gray-800 mb-2">Espécie</label>
              <select 
                value={selectedEspecie} 
                onChange={(e) => setSelectedEspecie(e.target.value)}
                className="w-48 border-b-2 border-gray-300 pb-1 focus:border-gray-800 outline-none text-gray-700 bg-transparent"
              >
                <option value="cachorro">Canino</option>
                <option value="gato">Felino</option>
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
                      cy="50%"
                      innerRadius={65}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="value"
                      label={renderCustomizedLabel}
                      labelLine={true}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="h-[400px] w-full pr-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: activeTab === 2 ? 100 : 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#000', fontSize: 12, fontWeight: 500 }}
                      angle={activeTab === 2 ? -45 : 0}
                      textAnchor={activeTab === 2 ? "end" : "middle"}
                      height={activeTab === 2 ? 120 : 40}
                      tickFormatter={(value) => `${value} (${barData.find(d => d.name === value)?.value || 0})`}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#000', fontSize: 12, fontWeight: 500 }}
                      label={{ value: 'Quantidade', angle: -90, position: 'insideLeft', offset: -10, style: { textAnchor: 'middle', fill: '#000', fontSize: 12, fontWeight: 500 } }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" barSize={80} radius={[2, 2, 0, 0]}>
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
