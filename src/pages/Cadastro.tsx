import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { signUp } from '../lib/api/auth';

export default function Cadastro() {
  const [formData, setFormData] = useState({
    cpfCnpj: '',
    nomeCompleto: '',
    nomeSocial: '',
    isPcd: '',
    dataNascimento: '',
    genero: '',
    email: '',
    telefone: '',
    cep: '',
    senha: '',
    confirmarSenha: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpfCnpj') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 11) {
        formattedValue = digits
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1');
      } else {
        formattedValue = digits
          .replace(/(\d{2})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1/$2')
          .replace(/(\d{4})(\d)/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1');
      }
    } else if (name === 'telefone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 10) {
        formattedValue = digits
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2')
          .replace(/(-\d{4})\d+?$/, '$1');
      } else {
        formattedValue = digits
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .replace(/(-\d{4})\d+?$/, '$1');
      }
    } else if (name === 'cep') {
      const digits = value.replace(/\D/g, '');
      formattedValue = digits
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
    } else if (name === 'dataNascimento') {
      const digits = value.replace(/\D/g, '');
      formattedValue = digits
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\/\d{4})\d+?$/, '$1');
    } else if (name === 'email') {
      formattedValue = value.toLowerCase();
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      let dataIso = '';
      if (formData.dataNascimento) {
        const [dia, mes, ano] = formData.dataNascimento.split('/');
        if (dia && mes && ano) dataIso = `${ano}-${mes}-${dia}`;
      }

      await signUp({
        email: formData.email,
        password: formData.senha,
        nome_completo: formData.nomeCompleto,
        cpf_cnpj: formData.cpfCnpj.replace(/\D/g, ''),
        telefone: formData.telefone,
        genero: formData.genero,
        is_pcd: formData.isPcd === 'sim',
        ...(dataIso && { data_nascimento: dataIso })
      });
      
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      const msg = err?.message ?? '';
      if (msg.includes('User already registered')) {
        setError('Este e-mail já está cadastrado.');
      } else {
        setError('Erro ao realizar o cadastro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans bg-white min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, #115d40 2px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>
      
      <div className="relative z-10 w-full max-w-[500px] min-h-screen bg-white md:border-x px-6 py-12 md:px-12 flex flex-col justify-center" style={{ borderColor: 'var(--color-guapi-green)' }}>
        
        <div className="text-center mb-8 flex flex-col items-center">
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative flex items-center justify-center mb-3">
                <div className="bg-guapi-green p-4 rounded-full shadow-md">
                   <PawPrint className="text-white w-10 h-10" />
                </div>
                <div className="absolute -top-1 -right-1 bg-guapi-orange rounded-full w-4 h-4 border-2 border-white"></div>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-extrabold text-2xl text-guapi-green leading-none uppercase text-center mb-1">Bem-Estar e<br/>Proteção Animal</span>
                <div className="w-full h-0.5 bg-guapi-green my-1"></div>
                <span className="text-sm text-guapi-green uppercase font-semibold tracking-wider">Cidade de Guapimirim</span>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">Registrar</h1>
            <p className="text-gray-600 pl-1 text-[13px]">
              Cadastre-se no Conecta ou <Link to="/login" className="text-guapi-green hover:underline">faça login</Link>.
            </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <h3 className="text-green-800 font-bold mb-2">Cadastro realizado com sucesso!</h3>
            <p className="text-sm text-green-700">Verifique seu e-mail para confirmar a conta.<br/>Redirecionando para o login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">CPF ou CNPJ*</label>
                <input type="text" name="cpfCnpj" required value={formData.cpfCnpj} onChange={handleChange} maxLength={18}
                  disabled={loading}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors disabled:bg-gray-100"
                  style={{ borderColor: 'var(--color-guapi-green)' }}
                  placeholder="___.___.___-__" />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Nome completo*</label>
                <input type="text" name="nomeCompleto" required value={formData.nomeCompleto} onChange={handleChange}
                  disabled={loading}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors disabled:bg-gray-100"
                  style={{ borderColor: 'var(--color-guapi-green)' }} />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Nome social</label>
                <input type="text" name="nomeSocial" value={formData.nomeSocial} onChange={handleChange}
                  disabled={loading}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors disabled:bg-gray-100"
                  style={{ borderColor: 'var(--color-guapi-green)' }} />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">É pessoa com deficiência (PCD)?*</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setFormData({ ...formData, isPcd: 'sim' })}
                    className={`flex-1 py-2 border rounded text-sm font-medium transition-colors ${formData.isPcd === 'sim' ? 'bg-white text-guapi-green ring-1 ring-guapi-green' : 'bg-white text-guapi-green disabled:opacity-50'}`}
                    style={{ borderColor: 'var(--color-guapi-green)' }}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setFormData({ ...formData, isPcd: 'nao' })}
                    className={`flex-1 py-2 border rounded text-sm font-medium transition-colors ${formData.isPcd === 'nao' ? 'bg-white text-guapi-green ring-1 ring-guapi-green' : 'bg-white text-guapi-green disabled:opacity-50'}`}
                    style={{ borderColor: 'var(--color-guapi-green)' }}
                  >
                    Não
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Data de Nascimento</label>
                <input type="text" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} maxLength={10}
                  disabled={loading}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors disabled:bg-gray-100"
                  style={{ borderColor: 'var(--color-guapi-green)' }}
                  placeholder="XX/XX/XXXX" />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Gênero</label>
                <select name="genero" value={formData.genero} onChange={handleChange}
                  disabled={loading}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors bg-white text-gray-700 disabled:bg-gray-100"
                  style={{ borderColor: 'var(--color-guapi-green)' }}>
                  <option value="">--Selecione um gênero--</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Prefiro não dizer">Prefiro não dizer</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">E-mail*</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange}
                  disabled={loading}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors disabled:bg-gray-100"
                  style={{ borderColor: 'var(--color-guapi-green)' }} />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Telefone*</label>
                <input type="tel" name="telefone" required value={formData.telefone} onChange={handleChange} maxLength={15}
                  disabled={loading}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors disabled:bg-gray-100"
                  style={{ borderColor: 'var(--color-guapi-green)' }}
                  placeholder="(XX) XXXXX-XXXX" />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">CEP</label>
                <input type="text" name="cep" value={formData.cep} onChange={handleChange} maxLength={9}
                  disabled={loading}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors disabled:bg-gray-100"
                  style={{ borderColor: 'var(--color-guapi-green)' }}
                  placeholder="XXXXX-XXX" />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Senha*</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="senha" required value={formData.senha} onChange={handleChange}
                    disabled={loading}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors pr-10 disabled:bg-gray-100"
                    style={{ borderColor: 'var(--color-guapi-green)' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-guapi-green hover:opacity-80">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Confirme a senha*</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmarSenha" required value={formData.confirmarSenha} onChange={handleChange}
                    disabled={loading}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors pr-10 disabled:bg-gray-100"
                    style={{ borderColor: 'var(--color-guapi-green)' }} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-guapi-green hover:opacity-80">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-4">
                <Link to="/login" className="flex-1 text-center py-2 px-4 border text-guapi-green rounded font-medium hover:bg-guapi-green/5 transition-colors text-sm"
                  style={{ borderColor: 'var(--color-guapi-green)' }}>
                  Voltar
                </Link>
                <button type="submit" disabled={loading} className="flex-1 text-center py-2 px-4 bg-guapi-green text-white rounded font-medium hover:bg-guapi-green-dark transition-colors text-sm border disabled:opacity-70 flex justify-center items-center"
                  style={{ borderColor: 'var(--color-guapi-green)' }}>
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                  ) : (
                    "Cadastre-se"
                  )}
                </button>
              </div>
          </form>
        )}
      </div>
    </div>
  );
}
