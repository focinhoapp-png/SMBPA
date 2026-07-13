import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ChevronRight, PawPrint, IdCard } from 'lucide-react';
import Cropper from 'react-easy-crop';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileUploadArea } from '../components/FileUploadArea';
import { dogBreeds, catBreeds, dogColors, catColors } from '../data/breedsAndColors';

// Helper function to create image and canvas for cropping
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return '';
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(URL.createObjectURL(file));
      } else {
        reject(new Error('Canvas is empty'));
      }
    }, 'image/jpeg');
  });
}

const RegisterPet = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMicrochipado, setIsMicrochipado] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    idadeMeses: '',
    cor: '',
    raca: '',
    especie: '',
    sexo: '',
    castrado: '',
    comunitario: '',
    adocao: '',
    numeroMicrochip: '',
    confirmeNumeroMicrochip: '',
    bairro: '',
    declaro: false,
    sociavelAnimais: '',
    sociavelPessoas: '',
    dataVacinacao: '',
    dataVermifugacao: '',
    descricao: '',
    castracaoFile: null as File | null,
    vacinacaoFile: null as File | null,
    vermifugacaoFile: null as File | null,
    imagem1File: null as File | null,
    imagem2File: null as File | null,
    imagem3File: null as File | null,
    imagem4File: null as File | null
  });

  const [showErrors, setShowErrors] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: string, value: string) => {
    let v = value.replace(/\D/g, '');
    if (v.length > 8) v = v.slice(0, 8);
    let formattedDate = v;
    if (v.length > 2) {
      formattedDate = v.slice(0, 2) + '/' + v.slice(2);
    }
    if (v.length > 4) {
      formattedDate = formattedDate.slice(0, 5) + '/' + v.slice(4);
    }
    
    setFormData(prev => {
      const newState = { ...prev, [field]: formattedDate };
      if (field === 'dataNascimento') {
        if (formattedDate.length === 10) {
          const parts = formattedDate.split('/');
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const birthDate = new Date(year, month, day);
            const currentDate = new Date();
            
            let months = (currentDate.getFullYear() - birthDate.getFullYear()) * 12;
            months -= birthDate.getMonth();
            months += currentDate.getMonth();
            
            if (currentDate.getDate() < birthDate.getDate()) {
               months--;
            }
            
            if (months >= 0) {
              newState.idadeMeses = months.toString();
            } else {
              newState.idadeMeses = '';
            }
          } else {
            newState.idadeMeses = '';
          }
        } else {
          newState.idadeMeses = '';
        }
      }
      return newState;
    });
  };

  const isFormValid = () => {
    const isAdocaoCard = formData.comunitario === 'Sim' || formData.adocao === 'Sim';

    const isBasicValid = formData.nome.trim() !== '' &&
      formData.dataNascimento.trim() !== '' &&
      formData.idadeMeses.trim() !== '' &&
      (!isAdocaoCard || formData.sociavelAnimais !== '') &&
      (!isAdocaoCard || formData.sociavelPessoas !== '') &&
      (!isAdocaoCard || formData.dataVacinacao.trim() !== '') &&
      (!isAdocaoCard || formData.dataVermifugacao.trim() !== '') &&
      (!isAdocaoCard || formData.descricao.trim() !== '') &&
      formData.cor !== '' && formData.cor !== 'Selecione' &&
      formData.raca.trim() !== '' &&
      formData.especie !== '' &&
      formData.sexo !== '' &&
      formData.castrado !== '' &&
      (formData.castrado === 'Não' || formData.castrado === 'Sim') &&
      formData.comunitario !== '' &&
      formData.adocao !== '' &&
      formData.bairro !== '' && formData.bairro !== 'Selecione o bairro' &&
      formData.declaro;
      
    const FilesValid = isAdocaoCard ? (!!formData.vacinacaoFile && !!formData.vermifugacaoFile && !!formData.imagem1File && !!formData.imagem2File && !!formData.imagem3File && !!formData.imagem4File) : true;

    if (isMicrochipado) {
      return isBasicValid && FilesValid && formData.numeroMicrochip.trim() !== '' && formData.confirmeNumeroMicrochip.trim() !== '' && (formData.castrado === 'Não' || (formData.castrado === 'Sim' && !!formData.castracaoFile));
    }
    return isBasicValid && FilesValid && (formData.castrado === 'Não' || (formData.castrado === 'Sim' && !!formData.castracaoFile));
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRgModal, setShowRgModal] = useState(false);
  const [showDeclaroModal, setShowDeclaroModal] = useState(false);
  const navigate = useNavigate();

  const handleFinalSubmit = () => {
    if (!isFormValid()) {
      setShowErrors(true);
      setCurrentStep(1);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    setShowRgModal(true);
  };

  const handleGoToRg = () => {
    setShowRgModal(false);
    navigate('/rg-animal/1'); // redirecting to a dummy id for the prototype
  };

  const ErrorMessage = ({ condition }: { condition: boolean }) => {
    if (showErrors && condition) {
      return (
        <div className="inline-flex items-center gap-1.5 mt-1.5 font-medium bg-[#da291c] text-white px-2 py-0.5 text-xs rounded-sm whitespace-nowrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="bg-white text-[#da291c] rounded-full p-[1px]">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          O campo é obrigatório
        </div>
      );
    }
    return null;
  };

  // Cropper states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl as string);
    }
  };

  const readFile = (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      if (imageSrc && croppedAreaPixels) {
        const croppedImageResult = await getCroppedImg(imageSrc, croppedAreaPixels);
        setCroppedImage(croppedImageResult);
      }
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  // Update cropped image preview automatically when crop changes
  // Usually it might be slow for real-time, but for small images it's okay.
  // We'll update it when the user stops dragging (onCropComplete is called).
  React.useEffect(() => {
    if (imageSrc && croppedAreaPixels) {
      showCroppedImage();
    }
  }, [croppedAreaPixels, imageSrc, showCroppedImage]);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow pt-24 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-guapi-green mb-6">
          <Link to="/" className="flex items-center hover:underline">
            Início
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <Link to="/meus-pets" className="hover:underline">Responsável Pessoa Física</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <span className="text-gray-500">Cadastrar Animal</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm w-full p-8 min-h-[600px] flex flex-col">
          <h1 className="text-2xl font-medium text-gray-800 mb-12">Cadastrar Animal</h1>

          {/* Stepper */}
          <div className="w-full max-w-3xl mx-auto mb-16 relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -z-10 translate-y-[-50%]"></div>
            {/* The active line connecting the steps could be added here if needed */}
            <div className="flex justify-between items-center z-10 relative">
              <div className="flex flex-col items-center cursor-pointer" onClick={() => setCurrentStep(1)}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-[3px] bg-white ${currentStep >= 1 ? 'border-yellow-500 text-guapi-green-dark' : 'border-gray-300 text-gray-400'}`}>
                  <PawPrint className="w-6 h-6" />
                </div>
                <span className={`mt-3 text-sm font-medium ${currentStep >= 1 ? 'text-guapi-green-dark' : 'text-gray-500'}`}>Dados Básicos</span>
              </div>

              <div className="flex flex-col items-center cursor-pointer" onClick={() => setCurrentStep(2)}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-[3px] bg-white ${currentStep >= 2 ? 'border-yellow-500 text-guapi-green-dark' : 'border-gray-300 text-gray-400'}`}>
                  <IdCard className="w-6 h-6" />
                </div>
                <span className={`mt-3 text-sm font-medium ${currentStep >= 2 ? 'text-guapi-green-dark' : 'text-gray-500'}`}>Foto do RG</span>
              </div>
            </div>
          </div>

          <form className="flex-1 flex flex-col">
            {currentStep === 1 && (
              <div className="flex-1 space-y-8">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-start">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Animal:</label>
                    <input type="text" value={formData.nome} onChange={(e) => handleChange('nome', e.target.value)} placeholder="Nome" className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-guapi-green outline-none text-sm" />
                    <ErrorMessage condition={formData.nome.trim() === ''} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-start">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Espécie:</label>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2"><input type="radio" name="especie" checked={formData.especie === 'Canina'} onChange={() => { handleChange('especie', 'Canina'); handleChange('cor', ''); handleChange('raca', ''); }} className="w-4 h-4 text-guapi-green border-gray-300 focus:ring-guapi-green" /> <span className="text-sm">Canina</span></label>
                        <label className="flex items-center gap-2"><input type="radio" name="especie" checked={formData.especie === 'Felina'} onChange={() => { handleChange('especie', 'Felina'); handleChange('cor', ''); handleChange('raca', ''); }} className="w-4 h-4 text-guapi-green border-gray-300 focus:ring-guapi-green" /> <span className="text-sm">Felina</span></label>
                      </div>
                      <ErrorMessage condition={formData.especie === ''} />
                    </div>
                    <div className="flex flex-col items-start">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sexo:</label>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2"><input type="radio" name="sexo" checked={formData.sexo === 'Macho'} onChange={() => handleChange('sexo', 'Macho')} className="w-4 h-4 text-guapi-green border-gray-300 focus:ring-guapi-green" /> <span className="text-sm">Macho</span></label>
                        <label className="flex items-center gap-2"><input type="radio" name="sexo" checked={formData.sexo === 'Fêmea'} onChange={() => handleChange('sexo', 'Fêmea')} className="w-4 h-4 text-guapi-green border-gray-300 focus:ring-guapi-green" /> <span className="text-sm">Fêmea</span></label>
                      </div>
                      <ErrorMessage condition={formData.sexo === ''} />
                    </div>
                  </div>
                </div>

                {/* Row 1.5 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="flex flex-col items-start">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cor:</label>
                    <select value={formData.cor} onChange={(e) => handleChange('cor', e.target.value)} disabled={formData.especie === ''} className={`w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm ${formData.especie === '' ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600'}`}>
                      <option value="">{formData.especie === '' ? 'Selecione a Espécie primeiro' : 'Selecione'}</option>
                      {formData.especie === 'Canina' && dogColors.map(color => <option key={color} value={color}>{color}</option>)}
                      {formData.especie === 'Felina' && catColors.map(color => <option key={color} value={color}>{color}</option>)}
                    </select>
                    <ErrorMessage condition={formData.cor === '' || formData.cor === 'Selecione' || formData.cor === 'Selecione a Espécie primeiro'} />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Raça:<span className="text-red-500">*</span></label>
                    <select value={formData.raca} onChange={(e) => handleChange('raca', e.target.value)} disabled={formData.especie === ''} className={`w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm ${formData.especie === '' ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600'}`}>
                      <option value="">{formData.especie === '' ? 'Selecione a Espécie primeiro' : 'Selecione a raça'}</option>
                      {formData.especie === 'Canina' && dogBreeds.map(breed => <option key={breed} value={breed}>{breed}</option>)}
                      {formData.especie === 'Felina' && catBreeds.map(breed => <option key={breed} value={breed}>{breed}</option>)}
                    </select>
                    <ErrorMessage condition={formData.raca.trim() === '' || formData.raca === 'Selecione a Espécie primeiro' || formData.raca === 'Selecione a raça'} />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mt-4">
                  <div className="col-span-1 flex flex-col items-start">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Castrado:<span className="text-red-500">*</span></label>
                    <div className="flex flex-col gap-2 mb-4">
                      <label className="flex items-center gap-2"><input type="radio" name="castrado" checked={formData.castrado === 'Sim'} onChange={() => handleChange('castrado', 'Sim')} className="w-4 h-4 text-guapi-green border-gray-300 focus:ring-guapi-green" /> <span className="text-sm">Sim</span></label>
                      <label className="flex items-center gap-2"><input type="radio" name="castrado" checked={formData.castrado === 'Não'} onChange={() => handleChange('castrado', 'Não')} className="w-4 h-4 text-guapi-green border-gray-300 focus:ring-guapi-green" /> <span className="text-sm">Não</span></label>
                    </div>
                    <ErrorMessage condition={formData.castrado === ''} />
                  </div>

                  <div className="col-span-1 flex flex-col items-start">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Microchipado:</label>
                    <div className="flex flex-col gap-2 mb-4">
                      <label className="flex items-center gap-2"><input type="radio" name="microchipado" checked={isMicrochipado} onChange={() => setIsMicrochipado(true)} className="w-4 h-4 text-guapi-green border-gray-300 focus:ring-guapi-green" /> <span className="text-sm">Sim</span></label>
                      <label className="flex items-center gap-2"><input type="radio" name="microchipado" checked={!isMicrochipado} onChange={() => { setIsMicrochipado(false); handleChange('numeroMicrochip', ''); handleChange('confirmeNumeroMicrochip', ''); }} className="w-4 h-4 text-guapi-green border-gray-300 focus:ring-guapi-green" /> <span className="text-sm">Não</span></label>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-3 grid grid-cols-2 gap-6">
                    <div className="flex flex-col items-start">
                      <label className={`block text-sm mb-2 ${isMicrochipado ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>Número Microchip:</label>
                      <input type="text" value={formData.numeroMicrochip} onChange={(e) => handleChange('numeroMicrochip', e.target.value)} className={`w-full border rounded px-3 py-2 outline-none text-sm ${isMicrochipado ? 'border-gray-300 focus:ring-2 focus:ring-guapi-green bg-white text-gray-700' : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'}`} readOnly={!isMicrochipado} disabled={!isMicrochipado}/>
                      {isMicrochipado && <ErrorMessage condition={formData.numeroMicrochip.trim() === ''} />}
                    </div>
                    <div className="flex flex-col items-start">
                      <label className={`block text-sm mb-2 ${isMicrochipado ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>Confirme o Número Microchip:</label>
                      <input type="text" value={formData.confirmeNumeroMicrochip} onChange={(e) => handleChange('confirmeNumeroMicrochip', e.target.value)} className={`w-full border rounded px-3 py-2 outline-none text-sm ${isMicrochipado ? 'border-gray-300 focus:ring-2 focus:ring-guapi-green bg-white text-gray-700' : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'}`} readOnly={!isMicrochipado} disabled={!isMicrochipado}/>
                      {isMicrochipado && <ErrorMessage condition={formData.confirmeNumeroMicrochip.trim() === ''} />}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Additional Medical and Social Info */}
                  <div className="flex flex-col items-start">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de nascimento aproximada:<span className="text-red-500">*</span></label>
                    <input type="text" value={formData.dataNascimento} onChange={(e) => handleDateChange('dataNascimento', e.target.value)} placeholder="dd/mm/aaaa" className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-guapi-green outline-none text-sm" />
                    <ErrorMessage condition={formData.dataNascimento.trim() === ''} />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Idade em meses:<span className="text-red-500">*</span></label>
                    <input type="number" value={formData.idadeMeses} onChange={(e) => handleChange('idadeMeses', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-guapi-green outline-none text-sm" />
                    <ErrorMessage condition={formData.idadeMeses.trim() === ''} />
                  </div>
                </div>

                {/* Local de Nascimento */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mt-4">
                  <div className="col-span-1 md:col-span-4 mt-2">
                     <h3 className="text-lg font-medium text-gray-800 mb-4">Local de Nascimento do Animal</h3>
                     <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col items-start">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Cidade:</label>
                          <input type="text" value="Guapimirim" readOnly disabled className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 text-gray-500 font-medium cursor-not-allowed outline-none text-sm" />
                        </div>
                        <div className="flex flex-col items-start">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bairro:</label>
                          <select value={formData.bairro} onChange={(e) => handleChange('bairro', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-guapi-green outline-none text-sm text-gray-600">
                            <option>Selecione o bairro</option>
                            <option>Centro</option>
                            <option>Parada Modelo</option>
                            <option>Bananal</option>
                            <option>Caneca Fina</option>
                            <option>Limoeiro</option>
                            <option>Iconha</option>
                            <option>Vale das Pedrinhas</option>
                            <option>Vila Olímpia</option>
                            <option>Segredo</option>
                            <option>Paraíso</option>
                            <option>Parada Ideal</option>
                            <option>Barreira</option>
                            <option>Sapé</option>
                            <option>Cotia</option>
                            <option>Gleba</option>
                          </select>
                          <ErrorMessage condition={formData.bairro === '' || formData.bairro === 'Selecione o bairro'} />
                        </div>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="flex flex-col items-start mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comunitário:<span className="text-red-500">*</span></label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2"><input type="radio" name="comunitarioNovo" checked={formData.comunitario === 'Sim'} onChange={() => handleChange('comunitario', 'Sim')} className="w-4 h-4 text-guapi-green border-gray-300 focus:ring-guapi-green" /> <span className="text-sm">Sim</span></label>
                      <label className="flex items-center gap-2"><input type="radio" name="comunitarioNovo" checked={formData.comunitario === 'Não'} onChange={() => handleChange('comunitario', 'Não')} className="w-4 h-4 text-guapi-green border-gray-300 focus:ring-guapi-green" /> <span className="text-sm">Não</span></label>
                    </div>
                    <ErrorMessage condition={formData.comunitario === ''} />
                  </div>
                  <div className="flex flex-col items-start mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adoção:<span className="text-red-500">*</span></label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2"><input type="radio" name="adocao" checked={formData.adocao === 'Sim'} onChange={() => handleChange('adocao', 'Sim')} className="w-4 h-4 text-guapi-green border-gray-300 focus:ring-guapi-green" /> <span className="text-sm">Sim</span></label>
                      <label className="flex items-center gap-2"><input type="radio" name="adocao" checked={formData.adocao === 'Não'} onChange={() => handleChange('adocao', 'Não')} className="w-4 h-4 text-guapi-green border-gray-300 focus:ring-guapi-green" /> <span className="text-sm">Não</span></label>
                    </div>
                    <ErrorMessage condition={formData.adocao === ''} />
                  </div>
                </div>

                {(formData.comunitario === 'Sim' || formData.adocao === 'Sim') && (
                  <>
                    <h3 className="text-lg font-medium text-gray-800 mt-8 mb-4 border-b pb-2">Informações Adicionais para o Card de Adoção</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col items-start">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sociável com outros animais?<span className="text-red-500">*</span></label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2"><input type="radio" name="sociavelAnimais" checked={formData.sociavelAnimais === 'Sim'} onChange={() => handleChange('sociavelAnimais', 'Sim')} className="w-4 h-4 text-guapi-green border-gray-300 focus:ring-guapi-green" /> <span className="text-sm">Sim</span></label>
                          <label className="flex items-center gap-2"><input type="radio" name="sociavelAnimais" checked={formData.sociavelAnimais === 'Não'} onChange={() => handleChange('sociavelAnimais', 'Não')} className="w-4 h-4 text-guapi-green border-gray-300 focus:ring-guapi-green" /> <span className="text-sm">Não</span></label>
                        </div>
                        <ErrorMessage condition={formData.sociavelAnimais === ''} />
                      </div>
                      <div className="flex flex-col items-start">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sociável com pessoas?<span className="text-red-500">*</span></label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2"><input type="radio" name="sociavelPessoas" checked={formData.sociavelPessoas === 'Sim'} onChange={() => handleChange('sociavelPessoas', 'Sim')} className="w-4 h-4 text-guapi-green border-gray-300 focus:ring-guapi-green" /> <span className="text-sm">Sim</span></label>
                          <label className="flex items-center gap-2"><input type="radio" name="sociavelPessoas" checked={formData.sociavelPessoas === 'Não'} onChange={() => handleChange('sociavelPessoas', 'Não')} className="w-4 h-4 text-guapi-green border-gray-300 focus:ring-guapi-green" /> <span className="text-sm">Não</span></label>
                        </div>
                        <ErrorMessage condition={formData.sociavelPessoas === ''} />
                      </div>

                      <div className="flex flex-col items-start">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data da vacinação:<span className="text-red-500">*</span></label>
                        <input type="text" value={formData.dataVacinacao} onChange={(e) => handleDateChange('dataVacinacao', e.target.value)} placeholder="dd/mm/aaaa" className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-guapi-green outline-none text-sm" />
                        <ErrorMessage condition={formData.dataVacinacao.trim() === ''} />
                      </div>
                      <div className="flex flex-col items-start">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data da vermifugação:<span className="text-red-500">*</span></label>
                        <input type="text" value={formData.dataVermifugacao} onChange={(e) => handleDateChange('dataVermifugacao', e.target.value)} placeholder="dd/mm/aaaa" className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-guapi-green outline-none text-sm" />
                        <ErrorMessage condition={formData.dataVermifugacao.trim() === ''} />
                      </div>
                    </div>

                    <div className="flex flex-col items-start mt-6">
                      <div className="w-full flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Chegou a hora de apresentar o animal. Faça um texto falando um pouco sobre ele 🐶:<span className="text-red-500">*</span></label>
                        <button type="button" className="text-guapi-orange text-sm font-medium flex items-center gap-1 hover:underline">
                          ✨ Gerar descrição com IA
                        </button>
                      </div>
                      <textarea rows={4} value={formData.descricao} onChange={(e) => handleChange('descricao', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-guapi-green outline-none text-sm"></textarea>
                      <ErrorMessage condition={formData.descricao.trim() === ''} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="flex flex-col items-start">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comprovante de vacinação:<span className="text-red-500">*</span></label>
                        <FileUploadArea 
                          onFileSelect={(file) => setFormData(prev => ({ ...prev, vacinacaoFile: file }))} 
                        />
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                          Anexe o comprovante de vacinação em um único arquivo PDF, com limite de 2 MB.
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-start">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comprovante de vermifugação:<span className="text-red-500">*</span></label>
                        <FileUploadArea 
                          onFileSelect={(file) => setFormData(prev => ({ ...prev, vermifugacaoFile: file }))} 
                        />
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                          Anexe o comprovante de vermifugação em um único arquivo PDF, com limite de 2 MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="flex flex-col items-start">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primeira imagem do animal:<span className="text-red-500">*</span></label>
                        <FileUploadArea 
                          accept="image/*"
                          onFileSelect={(file) => setFormData(prev => ({ ...prev, imagem1File: file }))} 
                        />
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                          * Limite máximo de 2 MB.
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-start">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Segunda imagem do animal:<span className="text-red-500">*</span></label>
                        <FileUploadArea 
                          accept="image/*"
                          onFileSelect={(file) => setFormData(prev => ({ ...prev, imagem2File: file }))} 
                        />
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                          * Limite máximo de 2 MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="flex flex-col items-start">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Terceira imagem do animal:<span className="text-red-500">*</span></label>
                        <FileUploadArea 
                          accept="image/*"
                          onFileSelect={(file) => setFormData(prev => ({ ...prev, imagem3File: file }))} 
                        />
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                          * Limite máximo de 2 MB.
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-start">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quarta imagem do animal:<span className="text-red-500">*</span></label>
                        <FileUploadArea 
                          accept="image/*"
                          onFileSelect={(file) => setFormData(prev => ({ ...prev, imagem4File: file }))} 
                        />
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                          * Limite máximo de 2 MB.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                  {formData.castrado === 'Sim' && (
                    <div className="grid grid-cols-1 gap-6 mt-6">
                      <div className="flex flex-col items-start w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comprovante de castração:<span className="text-red-500">*</span></label>
                        <FileUploadArea 
                          onFileSelect={(file) => setFormData(prev => ({ ...prev, castracaoFile: file }))} 
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Clique <a href="#" className="text-blue-600 font-medium hover:underline">aqui</a> para baixar o modelo de declaração de castração.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Anexe o comprovante de castração (para animais com mais de 6 meses) em um único arquivo PDF, com limite de 2 MB.
                        </p>
                      </div>
                    </div>
                  )}

                <div className="pt-8 flex flex-col items-start items-start">
                  <label className="block text-sm font-bold text-gray-800 mb-2">Declaração de Veracidade:<span className="text-red-500">*</span></label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.declaro} 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setShowDeclaroModal(true);
                        } else {
                          handleChange('declaro', false);
                        }
                      }} 
                      className="mt-1 w-5 h-5 text-guapi-green border-gray-300 rounded focus:ring-guapi-green shrink-0" 
                    />
                    <span className="text-sm text-gray-700 leading-relaxed text-justify">
                      DECLARO que todas as informações fornecidas são verdadeiras e exatas, DECLARO, ainda, estar ciente de que prestar declaração falsa caracteriza o crime de falsidade ideológica previsto no art. 299 do Código Penal Brasileiro, e que por tal crime serei responsabilizado, independentemente das sanções administrativas, caso se comprove a inveracidade do declarado neste documento. DECLARO, por fim, que tomo ciência, neste ato, de toda a legislação mencionada acima.
                    </span>
                  </label>
                  <ErrorMessage condition={!formData.declaro} />
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="flex-1 flex flex-col items-center pt-8">
                 <h2 className="text-sm font-medium text-gray-800 mb-6 text-center">Imagem para o RG Animal, tamanho real (3 cm x 4 cm)</h2>
                 
                 {/* Top Preview */}
                 <div className="w-[120px] h-[160px] border border-dashed border-gray-300 rounded-sm mb-6 flex items-center justify-center bg-white overflow-hidden relative shadow-sm">
                   {croppedImage ? (
                     <img src={croppedImage} alt="Cropped preview" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full p-6 flex flex-col items-center justify-center">
                       <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/dog.svg" alt="dog icon" className="w-full h-full opacity-30 mix-blend-multiply mb-2" />
                     </div>
                   )}
                 </div>

                 <div className="w-full max-w-md">
                   <h3 className="text-sm font-medium text-gray-800 mb-2">Instruções para subir a imagem para o RG Animal:</h3>
                   <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1 mb-8">
                     <li>Dê preferência para imagens com dimensões de 3 cm x 4 cm.</li>
                     <li>Nítida.</li>
                     <li>De frente.</li>
                     <li>Mostrando mais o rosto do que o corpo.</li>
                     <li>Formatos: JPG, PNG, WEBP.</li>
                     <li>Foto com fundo branco.</li>
                   </ul>

                   <div className="text-center mb-2 text-sm text-gray-800 font-medium">
                     Envio de arquivo:
                   </div>
                   
                   {/* Cropper Container */}
                   {imageSrc ? (
                     <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden mb-4 border border-gray-200">
                       <Cropper
                         image={imageSrc}
                         crop={crop}
                         zoom={zoom}
                         aspect={3 / 4}
                         onCropChange={setCrop}
                         onCropComplete={onCropComplete}
                         onZoomChange={setZoom}
                       />
                     </div>
                   ) : null}
                   
                   <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
                   <button type="button" onClick={handleFileSelectClick} className="w-full border border-dashed border-guapi-green rounded-md py-2.5 text-guapi-green text-sm font-medium flex justify-center items-center gap-2 hover:bg-guapi-green/10 transition-colors bg-white">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                     {imageSrc ? "Trocar imagem" : "Selecione o arquivo"}
                   </button>
                 </div>
              </div>
            )}

            <div className="mt-12 pt-6 border-t border-gray-100 flex justify-between items-center">
               <Link to="/meus-pets" className="text-guapi-green hover:underline font-medium px-4 py-2">
                 Cancelar
               </Link>
               
               <div className="flex gap-4">
                  {currentStep === 2 && (
                    <button 
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="border border-guapi-green text-guapi-green px-8 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors"
                    >
                      Voltar
                    </button>
                  )}
                  {currentStep === 1 && (
                    <button 
                      type="button"
                      onClick={() => {
                        if (!isFormValid()) {
                          setShowErrors(true);
                        } else {
                          setCurrentStep(2);
                        }
                      }}
                      className="bg-guapi-green text-white px-8 py-2 rounded-full font-medium hover:bg-guapi-green-dark transition-colors"
                    >
                      Avançar
                    </button>
                  )}
                  {currentStep === 2 && (
                    <button 
                      type="button"
                      onClick={handleFinalSubmit}
                      className="bg-guapi-green text-white px-8 py-2 rounded-full font-medium hover:bg-guapi-green-dark transition-colors"
                    >
                      Avançar
                    </button>
                  )}
               </div>
            </div>
          </form>

        </div>
      </main>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button onClick={() => setShowConfirmModal(false)} className="absolute top-4 right-4 text-guapi-green hover:text-guapi-green-dark">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            <h3 className="text-xl font-bold text-gray-800 mb-6">Confirmar</h3>
            
            <div className="text-gray-700 mb-6 font-medium">
              <p>Você está prestes a enviar seus dados.</p>
              <p className="font-bold mt-1">Após a confirmação, não será possível alterá-los.</p>
            </div>
            
            <div className="space-y-3 mb-8 text-sm text-gray-600">
              <p>Nome: {formData.nome}</p>
              <p>Espécie: {formData.especie}</p>
              <p>Sexo: {formData.sexo}</p>
              <p>Cor: {formData.cor}</p>
              <p>Raça: {formData.raca}</p>
              <p>Data de Nascimento: {formData.dataNascimento}</p>
              <p>Castrado: {formData.castrado}</p>
              <p>Microchipado: {isMicrochipado ? 'Sim' : 'Não'}</p>
            </div>
            
            <p className="font-bold text-gray-800 mb-6">Deseja continuar?</p>
            
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowConfirmModal(false)} className="px-6 py-2 border border-guapi-green text-guapi-green rounded-full font-medium hover:bg-guapi-green/10 transition-colors">
                Não
              </button>
              <button type="button" onClick={handleConfirmSubmit} className="px-6 py-2 bg-guapi-green text-white rounded-full font-medium hover:bg-guapi-green-dark transition-colors">
                Sim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RG Modal */}
      {showRgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-sm p-6 relative shadow-lg">
            <button onClick={() => setShowRgModal(false)} className="absolute top-4 right-4 text-guapi-green hover:text-guapi-green-dark">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            <h3 className="text-[17px] font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="text-guapi-green">RG Animal</span>
            </h3>
            
            <p className="text-gray-600 mb-8 mt-4 text-[15px]">Está pronto para gerar o RG do animal?</p>
            
            <div className="flex justify-center gap-3">
              <button type="button" onClick={() => { setShowRgModal(false); navigate('/meus-pets'); }} className="px-8 py-2 border border-guapi-green text-guapi-green rounded-full font-medium hover:bg-guapi-green/10 transition-colors bg-white">
                Não
              </button>
              <button type="button" onClick={handleGoToRg} className="px-8 py-2 bg-guapi-green text-white rounded-full font-medium hover:bg-guapi-green-dark transition-colors">
                Sim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Declaro Modal */}
      {showDeclaroModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative shadow-lg">
            <p className="text-gray-700 leading-relaxed text-sm mb-6 text-justify">
              DECLARO que todas as informações fornecidas são verdadeiras e exatas, DECLARO, ainda, estar ciente de que prestar declaração falsa caracteriza o crime de falsidade ideológica previsto no art. 299 do Código Penal Brasileiro, e que por tal crime serei responsabilizado, independentemente das sanções administrativas, caso se comprove a inveracidade do declarado neste documento. DECLARO, por fim, que tomo ciência, neste ato, de toda a legislação mencionada acima.
            </p>
            <p className="text-gray-800 font-medium mb-8 text-sm">
              Você confirma que todas as informações são verdadeiras?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setShowDeclaroModal(false)} 
                className="px-6 py-2 border border-guapi-green text-guapi-green rounded-full font-medium hover:bg-guapi-green/10 transition-colors bg-white"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={() => {
                  handleChange('declaro', true);
                  setShowDeclaroModal(false);
                }} 
                className="px-6 py-2 bg-guapi-green text-white rounded-full font-medium hover:bg-guapi-green-dark transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RegisterPet;
