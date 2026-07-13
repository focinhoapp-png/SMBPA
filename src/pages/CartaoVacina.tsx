import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';

const CartaoVacina = () => {
  const { id } = useParams();

  useEffect(() => {
    document.title = "Cartão de Saúde do Animal";
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex py-8 justify-center print:bg-white print:py-0 font-sans">
      
      <div className="mb-4 absolute top-4 right-8 z-50 print:hidden">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-guapi-green text-white px-6 py-2 rounded-full font-medium hover:bg-guapi-green-dark transition-colors shadow-sm"
        >
          <Printer size={18} />
          Imprimir Cartão
        </button>
      </div>

      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
      
      {/* Container principal - A4 Portrait */}
      <div className="bg-white shadow-xl relative overflow-hidden print:shadow-none mx-auto print:mx-0" 
           style={{ 
             width: '794px', // A4 Portrait width
             minHeight: '1123px', // A4 Portrait height
           }}>
        
        <div className="p-12 w-full h-full flex flex-col pt-16">
          <h1 className="text-2xl font-medium text-gray-900 mb-6">Cartão de Saúde do Animal</h1>

          <div className="bg-guapi-green rounded-[16px] text-white p-6 mb-10 flex gap-6 w-full shadow-sm relative overflow-hidden">
            {/* Imagem do pet */}
            <div className="w-[150px] h-[150px] shrink-0 rounded-full border-2 border-white/20 bg-gray-300 overflow-hidden relative z-10 self-center">
              <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300&auto=format&fit=crop" alt="Foto do animal" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 flex flex-col z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 text-center pr-12">
                  <h2 className="text-xl font-medium tracking-wide">Jhow</h2>
                </div>
                <div className="font-bold text-[13px] tracking-wide mt-1">
                  RG ANIMAL: JCP.0Y48.C-RJ
                </div>
              </div>

              <div className="grid grid-cols-4 gap-x-4 mb-5 items-end">
                <div>
                  <div className="text-[12px] mb-1 font-medium">Data de nascimento</div>
                  <div className="bg-white text-gray-900 px-3 py-1.5 font-medium text-[13px]">06/07/2010</div>
                </div>
                <div>
                  <div className="text-[12px] mb-1 font-medium">Cor</div>
                  <div className="bg-white text-gray-900 px-3 py-1.5 font-medium text-[13px]">Marrom</div>
                </div>
                <div>
                  <div className="text-[12px] mb-1 font-medium">Espécie</div>
                  <div className="bg-white text-gray-900 px-3 py-1.5 font-medium text-[13px]">Canina</div>
                </div>
                <div>
                  <div className="text-[12px] mb-1 font-medium">Sexo</div>
                  <div className="bg-white text-gray-900 px-3 py-1.5 font-medium text-[13px]">Macho</div>
                </div>
              </div>

              <div>
                <div className="text-[13px] mb-1 font-medium">Informações do Responsável</div>
                <div className="grid grid-cols-3 gap-x-4">
                  <div className="col-span-1">
                    <div className="text-[12px] mb-1 font-medium">CPF/CNPJ</div>
                    <div className="bg-white text-gray-900 px-3 py-1.5 font-medium text-[13px]">161.656.617-50</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[12px] mb-1 font-medium">Nome Responsável</div>
                    <div className="bg-white text-gray-900 px-3 py-1.5 font-medium text-[13px] uppercase">RUAN ENNES GOMES</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-2 mt-2">
            <h3 className="text-xl text-gray-900 mb-3 font-medium">Vacinação</h3>
            <p className="text-gray-900 font-medium text-sm mb-8">Sem registros</p>
            
            <h3 className="text-xl text-gray-900 mb-3 font-medium">Desparasitação</h3>
            <p className="text-gray-900 font-medium text-sm mb-3">Sem registros</p>
            
            <p className="text-[12px] text-gray-900 font-medium mb-4">Para verificar sua autenticidade, escaneie o QR</p>
            <div className="mt-4">
              <div className="w-[130px] h-[130px] bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://guapimirim.rj.gov.br')] bg-contain bg-no-repeat bg-center"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartaoVacina;
