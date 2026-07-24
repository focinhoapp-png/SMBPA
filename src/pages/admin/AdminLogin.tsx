import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin, saveAdminSession } from '../../lib/api/admin';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { admin, token } = await adminLogin(email, senha);
      saveAdminSession(admin, token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md border-t-4 border-guapi-green">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Painel Administrativo</h2>
        
        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
            <input 
              type="text" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              disabled={loading}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-guapi-green focus:ring-1 focus:ring-guapi-green transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input 
              type="password" 
              required 
              value={senha} 
              onChange={e => setSenha(e.target.value)} 
              disabled={loading}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-guapi-green focus:ring-1 focus:ring-guapi-green transition-colors"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-guapi-green hover:bg-guapi-green-dark text-white font-bold py-2 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
