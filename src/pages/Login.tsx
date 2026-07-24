import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { signIn } from '../lib/api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/painel');
    } catch (err: any) {
      const msg = err?.message ?? '';
      if (msg.includes('Invalid login credentials')) {
        setError('E-mail ou senha inválidos. Verifique seus dados e tente novamente.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada.');
      } else {
        setError('Ocorreu um erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans bg-white pt-[80px] min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-guapi-green mb-2">Entrar</h1>
            <p className="text-gray-500 text-sm">Acesse sua conta para continuar</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-guapi-orange focus:border-guapi-orange transition-colors"
                  placeholder="Seu endereço de e-mail"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-guapi-orange focus:border-guapi-orange transition-colors"
                  placeholder="Sua senha"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-guapi-orange focus:ring-guapi-orange border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Manter conectado
                </label>
              </div>

              <div className="text-sm">
                <Link to="/esqueceu-a-senha" className="font-medium text-guapi-orange hover:text-[#e01c00]">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#ff2000] hover:bg-[#e01c00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2000] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Entrar
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Ainda não tem uma conta?{' '}
              <Link to="/cadastro" className="font-medium text-guapi-green hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
