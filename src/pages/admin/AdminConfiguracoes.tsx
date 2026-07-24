import { useEffect, useState } from 'react';
import { getAdminUser, adminSalvarConfiguracao, adminGetConfiguracoes } from '../../lib/api/admin';
import { Save, User, MapPin, Mail, KeyRound, Shield, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center gap-2 bg-guapi-green text-white px-4 py-2.5 rounded-t-lg">
    <Icon className="w-4 h-4" />
    <span className="text-sm font-semibold">{title}</span>
  </div>
);

const Field = ({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  'w-full border-0 border-b border-gray-200 bg-transparent py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-guapi-green transition-colors';

export default function AdminConfiguracoes() {
  const admin = getAdminUser();

  const [form, setForm] = useState({
    nome: admin?.nome ?? '',
    email: admin?.email ?? '',
    papel: admin?.papel ?? '',
    emailAlternativo: '',
    nomePublicacao: '',
    logradouro: '',
    numero: '',
    cep: '',
    bairro: '',
    telefone: '',
    receberEmails: true,
  });

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [saving, setSaving] = useState(false);
  const [savingSenha, setSavingSenha] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      // Save extra fields as system configs
      await Promise.all([
        adminSalvarConfiguracao('admin_email_alternativo', form.emailAlternativo),
        adminSalvarConfiguracao('admin_nome_publicacao', form.nomePublicacao),
        adminSalvarConfiguracao('admin_logradouro', form.logradouro),
        adminSalvarConfiguracao('admin_numero', form.numero),
        adminSalvarConfiguracao('admin_cep', form.cep),
        adminSalvarConfiguracao('admin_bairro', form.bairro),
        adminSalvarConfiguracao('admin_telefone', form.telefone),
        adminSalvarConfiguracao('admin_receber_emails', form.receberEmails ? 'true' : 'false'),
      ]);
      setMsg({ type: 'success', text: 'Dados salvos com sucesso!' });
    } catch {
      setMsg({ type: 'error', text: 'Erro ao salvar os dados.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTrocarSenha = async () => {
    if (!novaSenha || novaSenha !== confirmSenha) {
      setMsg({ type: 'error', text: 'As senhas não conferem.' });
      return;
    }
    setSavingSenha(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: novaSenha });
      if (error) throw error;
      setMsg({ type: 'success', text: 'Senha atualizada com sucesso!' });
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmSenha('');
    } catch {
      setMsg({ type: 'error', text: 'Erro ao trocar a senha. Verifique os dados.' });
    } finally {
      setSavingSenha(false);
    }
  };

  // Load saved configs on mount
  useEffect(() => {
    adminGetConfiguracoes().then(data => {
      const map: Record<string, string> = {};
      (data || []).forEach((c: any) => { map[c.chave] = c.valor; });
      setForm(prev => ({
        ...prev,
        emailAlternativo: map['admin_email_alternativo'] ?? '',
        nomePublicacao:   map['admin_nome_publicacao'] ?? '',
        logradouro:       map['admin_logradouro'] ?? '',
        numero:           map['admin_numero'] ?? '',
        cep:              map['admin_cep'] ?? '',
        bairro:           map['admin_bairro'] ?? '',
        telefone:         map['admin_telefone'] ?? '',
        receberEmails:    map['admin_receber_emails'] !== 'false',
      }));
    }).catch(() => {});
  }, []);

  const papelLabel: Record<string, string> = {
    master:    'Master / Superadmin',
    admin:     'Administrador',
    moderador: 'Moderador',
    operador:  'Operador',
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Meus Dados</h1>
      <p className="text-sm text-gray-500 mb-6">
        Os campos marcados com asterisco (<span className="text-red-400">*</span>) são de preenchimento obrigatório.
      </p>

      {msg && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
          msg.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {msg.text}
        </div>
      )}

      <div className="space-y-6">
        {/* ── Dados da Conta ───────────────────────────────── */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <SectionHeader icon={User} title="Dados da Conta" />
          <div className="bg-white p-6 space-y-6">
            {/* Nome completo */}
            <Field label="Nome Completo" required>
              <input
                type="text"
                value={form.nome}
                readOnly
                className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`}
              />
            </Field>

            {/* Tipo / Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Tipo de Usuário">
                <div className="border-b border-gray-200 py-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500">{papelLabel[form.papel] ?? form.papel}</span>
                  <Shield className="w-4 h-4 text-gray-300" />
                </div>
              </Field>
              <Field label="E-mail" required>
                <input
                  type="email"
                  value={form.email}
                  readOnly
                  className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`}
                />
              </Field>
            </div>

            {/* Nome publicação / E-mail alternativo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Nome para Publicação">
                <input
                  type="text"
                  placeholder="Nome para publicação"
                  value={form.nomePublicacao}
                  onChange={e => handleChange('nomePublicacao', e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="E-mail Alternativo">
                <input
                  type="email"
                  placeholder="E-mail alternativo"
                  value={form.emailAlternativo}
                  onChange={e => handleChange('emailAlternativo', e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* ── Endereço ─────────────────────────────────────── */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <SectionHeader icon={MapPin} title="Endereço" />
          <div className="bg-white p-6 space-y-6">
            {/* Logradouro / Número / CEP */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_140px] gap-6">
              <Field label="Logradouro">
                <input
                  type="text"
                  placeholder="Rua, Avenida..."
                  value={form.logradouro}
                  onChange={e => handleChange('logradouro', e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Número">
                <input
                  type="text"
                  placeholder="Nº"
                  value={form.numero}
                  onChange={e => handleChange('numero', e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="CEP">
                <input
                  type="text"
                  placeholder="00000-000"
                  value={form.cep}
                  onChange={e => handleChange('cep', e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Bairro / Telefone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Bairro">
                <input
                  type="text"
                  placeholder="Bairro"
                  value={form.bairro}
                  onChange={e => handleChange('bairro', e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Telefone">
                <div className="flex items-center gap-2 border-b border-gray-200 py-1">
                  <span className="text-lg">🇧🇷</span>
                  <span className="text-sm text-gray-400">+55</span>
                  <input
                    type="tel"
                    placeholder="(21) 99999-9999"
                    value={form.telefone}
                    onChange={e => handleChange('telefone', e.target.value)}
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-300 focus:outline-none"
                  />
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* ── Envio de E-mails ──────────────────────────────── */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <SectionHeader icon={Mail} title="Envio de e-mails automáticos" />
          <div className="bg-white p-6">
            <div className="bg-guapi-green/5 border border-guapi-green/20 rounded-lg p-4 mb-4 text-sm text-gray-700">
              <p className="font-semibold text-guapi-green mb-2 flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                Alguns e-mails com dados do sistema são enviados automaticamente:
              </p>
              <ul className="space-y-1 text-gray-600 text-xs pl-2">
                <li>· Boas-vindas ao sistema após completar o cadastro.</li>
                <li>· Notificação de novas denúncias ou solicitações recebidas.</li>
                <li>· Alertas de adoções pendentes de aprovação.</li>
                <li>· Avisos de novos usuários cadastrados na plataforma.</li>
                <li>· Alertas de atividade suspeita ou tentativas de acesso indevido.</li>
              </ul>
            </div>
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <div
                onClick={() => handleChange('receberEmails', !form.receberEmails)}
                className={`relative w-10 h-5 rounded-full transition-colors ${form.receberEmails ? 'bg-guapi-green' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.receberEmails ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm text-gray-600">
                {form.receberEmails
                  ? 'Estou recebendo e-mails automáticos do sistema.'
                  : 'Não autorizo o envio de e-mails automáticos do sistema.'}
              </span>
            </label>
          </div>
        </div>

        {/* ── Trocar Senha ──────────────────────────────────── */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <SectionHeader icon={KeyRound} title="Trocar a sua senha" />
          <div className="bg-white p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field label="Senha Atual">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={senhaAtual}
                  onChange={e => setSenhaAtual(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Nova Senha">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={novaSenha}
                  onChange={e => setNovaSenha(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Confirmar Nova Senha">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmSenha}
                  onChange={e => setConfirmSenha(e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleTrocarSenha}
                disabled={savingSenha}
                className="flex items-center gap-2 bg-guapi-green text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-guapi-green-dark transition-colors disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                {savingSenha ? 'Salvando...' : 'Trocar a sua senha'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Ações finais ──────────────────────────────────── */}
        <div className="flex justify-end gap-3 pt-2 pb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-guapi-green text-white text-sm font-semibold px-8 py-2.5 rounded-lg hover:bg-guapi-green-dark transition-colors disabled:opacity-50 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Gravando...' : 'Gravar'}
          </button>
        </div>
      </div>
    </div>
  );
}
