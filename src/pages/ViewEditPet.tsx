import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Edit2, Camera, ChevronRight, Lock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { buscarPet, atualizarPet, type Pet } from '../lib/api/pets';
import { supabase } from '../lib/supabase';

const BAIRROS_GUAPIMIRIM = [
  'Bananal', 'Barreira', 'Caneca Fina', 'Centro', 'Cotia',
  'Garrafão', 'Iconha', 'Limoeiro', 'Orindi', 'Parada Ideal',
  'Parada Modelo', 'Parque Flechal', 'Parque Santa Eugênia',
  'Sapê', 'Segredo', 'Vale das Pedrinhas', 'Várzea', 'Vila Olímpia'
];

export default function ViewEditPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    cor: '',
    especie: '',
    sexo: '',
    castrado: 'Não',
    comunitario: 'Não',
    microchipado: 'Não',
    numeroMicrochip: '',
    confirmeMicrochip: '',
    bairro: ''
  });

  const [petImagens, setPetImagens] = useState<{ id: string; url: string; ordem: number }[]>([]);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    if (id) {
      buscarPet(id).then(p => {
        setPet(p);
        let dataNasc = '';
        if (p.data_nascimento) {
          const [ano, mes, dia] = p.data_nascimento.split('-');
          dataNasc = `${dia}/${mes}/${ano}`;
        }
        setFormData({
          nome: p.nome || '',
          dataNascimento: dataNasc,
          cor: p.cor || '',
          especie: p.especie ? p.especie.charAt(0).toUpperCase() + p.especie.slice(1) : '',
          sexo: p.sexo ? p.sexo.charAt(0).toUpperCase() + p.sexo.slice(1) : '',
          castrado: p.castrado ? 'Sim' : 'Não',
          comunitario: p.comunitario ? 'Sim' : 'Não',
          microchipado: p.microchipado ? 'Sim' : 'Não',
          numeroMicrochip: p.numero_microchip || '',
          confirmeMicrochip: p.numero_microchip || '',
          bairro: p.bairro || ''
        });
        // Carregar imagens do pet (até 5 slots)
        const imgs = (p.pet_imagens || []).sort((a: any, b: any) => a.ordem - b.ordem);
        
        setPetImagens(imgs);
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const isDataIso = formData.dataNascimento ? formData.dataNascimento.split('/').reverse().join('-') : undefined;

      await atualizarPet(id, {
        nome: formData.nome,
        data_nascimento: isDataIso,
        cor: formData.cor,
        especie: formData.especie.toLowerCase() as 'cachorro' | 'gato',
        sexo: formData.sexo.toLowerCase() as 'macho' | 'femea',
        castrado: formData.castrado === 'Sim',
        comunitario: formData.comunitario === 'Sim',
        microchipado: formData.microchipado === 'Sim',
        numero_microchip: formData.numeroMicrochip,
        bairro: formData.bairro,
      });

      alert('Dados do animal atualizados com sucesso!');
      navigate('/meus-pets');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar os dados.');
    } finally {
      setSaving(false);
    }
  };

  const handleSlotUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const file = e.target.files?.[0];
    if (!file || !pet) return;

    // Bloqueia remoção: não permite ficar sem foto no slot 0 (principal)
    setUploadingSlot(slotIndex);
    try {
      const ext = file.name.split('.').pop();
      const path = `${pet.id}/foto_${slotIndex}_${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage.from('pets').upload(path, file, { upsert: true });
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('pets').getPublicUrl(path);

      // Verifica se já existe imagem nesse slot (ordem = slotIndex)
      const existing = petImagens.find(img => img.ordem === slotIndex);

      if (existing) {
        // Remove a imagem antiga para contornar possíveis bloqueios de RLS no UPDATE
        await supabase.from('pet_imagens').delete().eq('id', existing.id);
      }
      
      const { data: inserted } = await supabase.from('pet_imagens')
        .insert({ pet_id: pet.id, url: publicUrl, ordem: slotIndex })
        .select()
        .single();
        
      if (inserted) {
        setPetImagens(prev => {
          const filtrado = prev.filter(img => img.ordem !== slotIndex);
          return [...filtrado, inserted].sort((a, b) => a.ordem - b.ordem);
        });
      }

      // Atualiza imagem_principal_url se for o slot 1 (foto de adoção)
      if (slotIndex === 1) {
        await supabase.from('pets').update({ imagem_principal_url: publicUrl }).eq('id', pet.id);
        setPet({ ...pet, imagem_principal_url: publicUrl });
      }
    } catch (err: any) {
      console.error('Erro no upload da imagem:', err);
      const msg = err?.message || err?.error || JSON.stringify(err);
      alert(`Erro ao enviar a foto: ${msg}`);
    } finally {
      setUploadingSlot(null);
      // Limpa o input para permitir re-upload do mesmo arquivo
      if (fileInputRefs[slotIndex]?.current) fileInputRefs[slotIndex].current!.value = '';
    }
  };

  if (loading) {
    return (
      <div className="font-sans bg-gray-50 min-h-screen flex flex-col pt-[80px]">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Carregando dados...</p>
        </main>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="font-sans bg-gray-50 min-h-screen flex flex-col pt-[80px]">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Animal não encontrado.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-[100px] pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-sm text-gray-500 mb-6 flex justify-between items-end">
          <div className="flex items-center gap-2 font-medium text-guapi-green">
            <Link to="/" className="hover:underline flex items-center gap-1">Início</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/meus-pets" className="hover:underline transition-colors">Meus Pets</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Dados do Animal</span>
          </div>
        </div>

        <h1 className="text-3xl font-light text-gray-800 mb-8">Visualizar/Editar</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Dados do Animal</h2>
              <p className="text-sm text-gray-500 mt-1">Edite e Visualize os dados do seu cachorro ou gato</p>
            </div>
            <button className="border-2 border-guapi-green text-guapi-green font-medium px-6 py-2 rounded-full hover:bg-green-50 transition-colors">
              Informar Óbito
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                Nome do Animal: <Edit2 className="w-3 h-3 text-gray-400" />
              </label>
              <input 
                type="text" 
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-guapi-green text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento:</label>
              <input 
                type="text" 
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                placeholder="DD/MM/AAAA"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-guapi-green text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                Cor: <Edit2 className="w-3 h-3 text-gray-400" />
              </label>
              <select 
                name="cor"
                value={formData.cor}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-guapi-green text-gray-600 bg-white"
              >
                <option value="">Selecione</option>
                <option value="Preta">Preta</option>
                <option value="Branca">Branca</option>
                <option value="Caramelo">Caramelo</option>
                <option value="Amarela">Amarela</option>
                <option value="Marrom">Marrom</option>
                <option value="Tigrada">Tigrada</option>
                <option value="Cinza">Cinza</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Espécie:</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="especie" value="Cachorro" checked={formData.especie === 'Cachorro'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" /> Canina
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="especie" value="Gato" checked={formData.especie === 'Gato'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" /> Felina
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Sexo:</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="sexo" value="Macho" checked={formData.sexo === 'Macho'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" /> Macho
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="sexo" value="Fêmea" checked={formData.sexo === 'Fêmea'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" /> Fêmea
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Castrado:</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="castrado" value="Sim" checked={formData.castrado === 'Sim'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" /> Sim
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="castrado" value="Não" checked={formData.castrado === 'Não'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" /> Não
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Comunitário:</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="comunitario" value="Sim" checked={formData.comunitario === 'Sim'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" /> Sim
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="comunitario" value="Não" checked={formData.comunitario === 'Não'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" /> Não
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Microchipado:</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="microchipado" value="Sim" checked={formData.microchipado === 'Sim'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" /> Sim
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="microchipado" value="Não" checked={formData.microchipado === 'Não'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" /> Não
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número Microchip:</label>
              <input 
                type="text" 
                name="numeroMicrochip"
                value={formData.numeroMicrochip}
                onChange={handleChange}
                disabled={formData.microchipado === 'Não'}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-guapi-green text-gray-600 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="mb-4 border-b border-gray-200 pb-4">
            <h2 className="text-lg font-bold text-gray-800">Local de Nascimento do Animal</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Município:</label>
              <input
                type="text"
                value="Guapimirim"
                readOnly
                disabled
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed outline-none"
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Bairro:</label>
              <select 
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-guapi-green text-gray-600 bg-white"
              >
                <option value="">-- Selecione o Bairro --</option>
                {BAIRROS_GUAPIMIRIM.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                Fotos do Animal <Edit2 className="w-3 h-3 text-gray-400" />
             </label>
             <div className="flex flex-wrap gap-4">
               {[0, 1, 2, 3, 4].map(slotIndex => {
                 const img = petImagens.find(i => i.ordem === slotIndex);
                 const isUploading = uploadingSlot === slotIndex;
                 return (
                   <div key={slotIndex} className="relative">
                     <div className={`w-48 h-48 bg-gray-200 rounded-lg overflow-hidden relative ${slotIndex === 0 ? 'opacity-75 grayscale-[20%]' : ''}`}>
                       {img?.url ? (
                         <img src={img.url} alt={`Foto ${slotIndex + 1}`} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-sm gap-1">
                           <Camera className="w-8 h-8 opacity-40" />
                           <span className="text-center px-2 text-xs">
                             {slotIndex === 0 ? "RG do Animal" : slotIndex === 1 ? "Foto Principal (Adoção)" : `Foto ${slotIndex + 1}`}
                           </span>
                         </div>
                       )}
                       {isUploading && (
                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                           <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
                         </div>
                       )}
                     </div>
                     {/* Botão editar ou Cadeado */}
                     {slotIndex === 0 ? (
                       <div className="absolute top-2 right-2 bg-white/80 text-gray-400 rounded-full p-1.5 shadow" title="A foto do RG não pode ser alterada">
                         <Lock className="w-4 h-4" />
                       </div>
                     ) : (
                       <>
                         <button
                           type="button"
                           onClick={() => fileInputRefs[slotIndex]?.current?.click()}
                           disabled={isUploading}
                           className="absolute top-2 right-2 bg-white/90 hover:bg-white text-guapi-green border border-guapi-green rounded-full p-1.5 shadow transition-colors disabled:opacity-50"
                           title={`Editar foto ${slotIndex}`}
                         >
                           <Camera className="w-4 h-4" />
                         </button>
                         <input
                           ref={fileInputRefs[slotIndex]}
                           type="file"
                           className="hidden"
                           accept="image/png, image/jpeg, image/webp"
                           onChange={e => handleSlotUpload(e, slotIndex)}
                         />
                       </>
                     )}
                     <div className="mt-3 text-center text-sm font-medium text-gray-700">
                       {slotIndex === 0 ? "Foto do RG" : `Foto ${slotIndex}`}
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <Link 
              to="/meus-pets"
              className="border-2 border-guapi-green text-guapi-green font-medium px-8 py-2 rounded-full hover:bg-green-50 transition-colors"
            >
              Voltar
            </Link>
            <button onClick={handleSave} disabled={saving} className="bg-guapi-green text-white font-medium px-8 py-2 rounded-full hover:bg-guapi-green-dark transition-colors disabled:opacity-50">
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}
