import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PawPrint, Edit2, Camera, Home, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ViewEditPet() {
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    nome: 'Jhow',
    dataNascimento: '06/07/2010',
    cor: 'Marrom',
    especie: 'Canina',
    sexo: 'Macho',
    castrado: 'Não',
    comunitario: 'Não',
    microchipado: 'Não',
    numeroMicrochip: '',
    confirmeMicrochip: '',
    estado: 'Rio de Janeiro',
    municipio: 'Guapimirim'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-[100px] pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-6 flex justify-between items-end">
          <div className="flex items-center gap-2 font-medium text-guapi-green">
            <Link to="/" className="hover:underline flex items-center gap-1">
              Início
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/meus-pets" className="hover:underline transition-colors">Responsável Pessoa Física</Link>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Nascimento:
              </label>
              <input 
                type="text" 
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
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
                  <input type="radio" name="especie" value="Canina" checked={formData.especie === 'Canina'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" />
                  Canina
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="especie" value="Felina" checked={formData.especie === 'Felina'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" />
                  Felina
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Sexo:</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="sexo" value="Macho" checked={formData.sexo === 'Macho'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" />
                  Macho
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="sexo" value="Fêmea" checked={formData.sexo === 'Fêmea'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" />
                  Fêmea
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Castrado:</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="castrado" value="Sim" checked={formData.castrado === 'Sim'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" />
                  Sim
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="castrado" value="Não" checked={formData.castrado === 'Não'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" />
                  Não
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Comunitário:</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="comunitario" value="Sim" checked={formData.comunitario === 'Sim'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" />
                  Sim
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="comunitario" value="Não" checked={formData.comunitario === 'Não'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" />
                  Não
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Microchipado:</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="microchipado" value="Sim" checked={formData.microchipado === 'Sim'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" />
                  Sim
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="microchipado" value="Não" checked={formData.microchipado === 'Não'} onChange={handleChange} className="text-guapi-green focus:ring-guapi-green" />
                  Não
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número Microchip:
              </label>
              <input 
                type="text" 
                name="numeroMicrochip"
                value={formData.numeroMicrochip}
                onChange={handleChange}
                disabled={formData.microchipado === 'Não'}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-guapi-green text-gray-600 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirme o Número Microchip:
              </label>
              <input 
                type="text" 
                name="confirmeMicrochip"
                value={formData.confirmeMicrochip}
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
               <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado:
              </label>
              <select 
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-guapi-green text-gray-600 bg-white"
              >
                <option value="Rio de Janeiro">Rio de Janeiro</option>
                <option value="São Paulo">São Paulo</option>
              </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                Município:
              </label>
              <select 
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-guapi-green text-gray-600 bg-white"
              >
                <option value="Guapimirim">Guapimirim</option>
                <option value="Magé">Magé</option>
                <option value="Teresópolis">Teresópolis</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                Foto do Animal <Edit2 className="w-3 h-3 text-gray-400" />
             </label>
             <div className="w-48 h-48 bg-gray-200 rounded-lg overflow-hidden relative cursor-pointer group">
               <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200&h=200" alt="Jhow" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Camera className="w-8 h-8 text-white" />
               </div>
             </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <Link 
              to="/meus-pets"
              className="border-2 border-guapi-green text-guapi-green font-medium px-8 py-2 rounded-full hover:bg-green-50 transition-colors"
            >
              Voltar
            </Link>
            <button className="bg-guapi-green text-white font-medium px-8 py-2 rounded-full hover:bg-guapi-green-dark transition-colors">
              Salvar
            </button>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
