import { useEffect, useState } from 'react';
import { adminGetConfiguracoes, adminSalvarConfiguracao } from '../../lib/api/admin';
import { Save } from 'lucide-react';

export default function AdminConfiguracoes() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    adminGetConfiguracoes()
      .then(data => {
        setConfigs(data || []);
        const vals: Record<string, string> = {};
        (data || []).forEach((c: any) => { vals[c.chave] = c.valor; });
        setEditValues(vals);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (chave: string) => {
    setSaving(chave);
    try {
      await adminSalvarConfiguracao(chave, editValues[chave] || '');
      alert(`Configuração "${chave}" salva!`);
    } catch {
      alert('Erro ao salvar configuração.');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Configurações do Sistema</h1>

      {loading ? (
        <p className="text-gray-400">Carregando...</p>
      ) : configs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          Nenhuma configuração encontrada na tabela <code>configuracoes</code>.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y divide-gray-100">
          {configs.map((config: any) => (
            <div key={config.chave} className="p-5 flex items-start gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700 mb-0.5">{config.chave}</p>
                <input
                  type="text"
                  value={editValues[config.chave] ?? ''}
                  onChange={e => setEditValues(prev => ({ ...prev, [config.chave]: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-guapi-green mt-1"
                />
              </div>
              <button
                disabled={saving === config.chave}
                onClick={() => handleSave(config.chave)}
                className="mt-7 flex items-center gap-2 bg-guapi-green text-white px-4 py-2 rounded text-sm hover:bg-guapi-green-dark transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving === config.chave ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
