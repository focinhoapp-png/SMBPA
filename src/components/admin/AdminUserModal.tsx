import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { adminAdicionarUsuario } from '../../lib/api/admin';

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipoPerfil: 'fisica' | 'juridica' | 'protetor';
  onSuccess: () => void;
}

export default function AdminUserModal({ isOpen, onClose, tipoPerfil, onSuccess }: AdminUserModalProps) {
  const [formData, setFormData] = useState({
    cpf_cnpj: '',
    nome_completo: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf_cnpj') {
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
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminAdicionarUsuario({
        ...formData,
        cpf_cnpj: formData.cpf_cnpj.replace(/\D/g, ''),
        tipo_perfil: tipoPerfil
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao adicionar usuário. Pode ser que o e-mail ou documento já estejam cadastrados.');
    } finally {
      setLoading(false);
    }
  };

  const title = tipoPerfil === 'fisica' ? 'Adicionar Proprietário (Pessoa Física)'
              : tipoPerfil === 'juridica' ? 'Adicionar Veterinário / Instituição (Pessoa Jurídica)'
              : 'Adicionar Protetor Independente';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-medium text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form id="admin-user-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Nome Completo / Razão Social *</label>
              <input type="text" name="nome_completo" required value={formData.nome_completo} onChange={handleChange}
                disabled={loading}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-guapi-green border-gray-300 transition-colors" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">CPF / CNPJ *</label>
              <input type="text" name="cpf_cnpj" required value={formData.cpf_cnpj} onChange={handleChange}
                disabled={loading}
                maxLength={18}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-guapi-green border-gray-300 transition-colors" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">E-mail *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange}
                disabled={loading}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-guapi-green border-gray-300 transition-colors" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Telefone *</label>
              <input type="text" name="telefone" required value={formData.telefone} onChange={handleChange}
                disabled={loading}
                maxLength={15}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-guapi-green border-gray-300 transition-colors" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">CEP</label>
              <input type="text" name="cep" value={formData.cep} onChange={handleChange}
                disabled={loading}
                maxLength={9}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-guapi-green border-gray-300 transition-colors" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Logradouro</label>
              <input type="text" name="logradouro" value={formData.logradouro} onChange={handleChange}
                disabled={loading}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-guapi-green border-gray-300 transition-colors" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Número</label>
              <input type="text" name="numero" value={formData.numero} onChange={handleChange}
                disabled={loading}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-guapi-green border-gray-300 transition-colors" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Bairro</label>
              <input type="text" name="bairro" value={formData.bairro} onChange={handleChange}
                disabled={loading}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-guapi-green border-gray-300 transition-colors" />
            </div>
            
          </form>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
          <button type="button" onClick={onClose} disabled={loading}
            className="px-6 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
            Cancelar
          </button>
          <button type="submit" form="admin-user-form" disabled={loading}
            className="px-6 py-2 flex items-center gap-2 text-sm font-medium text-white bg-guapi-green rounded-md hover:bg-guapi-green-dark transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" /> {loading ? 'Salvando...' : 'Salvar Usuário'}
          </button>
        </div>
      </div>
    </div>
  );
}
