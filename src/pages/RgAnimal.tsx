import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PawPrint, Printer } from 'lucide-react';

const PawPatternBorder = ({ className = "" }) => (
  <div className={`absolute inset-0 pointer-events-none z-50 border-[16px] border-guapi-green ${className}`}>
    <div className="absolute top-[-16px] left-[-16px] right-[-16px] h-[16px] flex justify-evenly items-center overflow-hidden">
      {Array.from({ length: 32 }).map((_, i) => (
        <PawPrint key={`top-${i}`} className="w-3.5 h-3.5 text-white fill-current shrink-0 mx-1" />
      ))}
    </div>
    <div className="absolute bottom-[-16px] left-[-16px] right-[-16px] h-[16px] flex justify-evenly items-center overflow-hidden">
      {Array.from({ length: 32 }).map((_, i) => (
        <PawPrint key={`btm-${i}`} className="w-3.5 h-3.5 text-white fill-current shrink-0 mx-1" />
      ))}
    </div>
    <div className="absolute left-[-16px] top-0 bottom-0 w-[16px] flex flex-col justify-evenly items-center overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <PawPrint key={`lft-${i}`} className="w-3.5 h-3.5 text-white fill-current shrink-0 my-1" />
      ))}
    </div>
    <div className="absolute right-[-16px] top-0 bottom-0 w-[16px] flex flex-col justify-evenly items-center overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <PawPrint key={`rgt-${i}`} className="w-3.5 h-3.5 text-white fill-current shrink-0 my-1" />
      ))}
    </div>
  </div>
);

export default function RgAnimal() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center font-sans">
      <div className="mb-8 print:hidden flex gap-4">
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-guapi-green text-white px-6 py-2 rounded-full font-medium hover:bg-guapi-green-dark transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Imprimir RG
        </button>
      </div>

      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-card { box-shadow: none !important; margin: 0 !important; page-break-inside: avoid; border: none !important; overflow: hidden !important; }
          .no-print { display: none !important; }
        }
      `}</style>
      
      <div className="w-full flex justify-center pb-12 overflow-x-auto bg-gray-50 pt-8 print:p-0 print:bg-white print:overflow-hidden print:-mt-8">
        <div className="shadow-2xl overflow-hidden relative print:shadow-none print:w-[1123px] print:h-[794px]" style={{ 
          width: '1123px', 
          height: '794px',
          backgroundColor: '#eff9f3',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 10h10v10H10V10zM0 10h10v10H0V10z' fill='%23e0f0e6' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}>
          
          <div className="flex flex-col items-center origin-top-left" style={{ transform: 'scale(1)', width: '100%', height: '100%' }}>
            <div className="flex flex-row items-center justify-center pt-16 origin-top" style={{ transform: 'scale(0.68)' }}>
              
              {/* FRENTE */}
              <div className="bg-white relative overflow-hidden border border-gray-200 border-r-0" style={{ width: '800px', height: '500px' }}>
                <PawPatternBorder className="" />

          {/* Top Right Logo Placeholder */}
          <div className="absolute top-[90px] right-10 w-48 h-48 flex flex-col items-center justify-center z-40 opacity-90">
             <img src="/logo.PNG" alt="Logo" className="w-full h-full object-contain" />
          </div>

          <div className="px-10 pt-8 pb-[70px] h-full flex flex-col relative z-20">
            
            {/* Header */}
            <div className="flex items-center gap-6 mb-4">
              {/* Brasao placeholder */}
              <div className="w-32 h-32 flex flex-col items-center justify-center shrink-0 relative">
                 <img src="/guapirg.PNG" alt="Brasão Guapimirim" className="w-full h-full object-contain" />
              </div>

              <div className="pt-2">
                <h1 className="text-[22px] font-black text-guapi-green leading-tight max-w-[450px]">PREFEITURA MUNICIPAL DE GUAPIMIRIM</h1>
                <h2 className="text-[16px] font-medium text-guapi-green leading-tight mt-1">ESTADO DO RIO DE JANEIRO</h2>
                <h3 className="text-[14px] font-medium text-guapi-green leading-tight mt-0.5">SECRETARIA MUNICIPAL DE BEM-ESTAR<br/>E PROTEÇÃO ANIMAL</h3>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex gap-8 flex-1 pr-16 relative z-10 pb-12">
              
              {/* Photo */}
              <div className="flex flex-col items-center w-[180px] shrink-0 z-20 mt-4">
                <div className="w-full h-[220px] bg-gray-200 overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Foto do Animal" />
                </div>
              </div>

              {/* Info Grid */}
              <div className="flex-1 grid grid-cols-2 gap-y-2 gap-x-2 content-start pt-1 z-10 relative bg-white/80 print:bg-transparent rounded px-1 -mx-1 py-1 -my-1">
                  <div>
                    <h4 className="text-[15px] font-bold text-guapi-green leading-none">Nome do Animal</h4>
                    <p className="text-[18px] font-medium text-gray-900 mt-1 leading-none">Caramelo</p>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-guapi-green leading-none">Sexo</h4>
                    <p className="text-[18px] font-medium text-gray-900 mt-1 leading-none">M</p>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-guapi-green leading-none">Registro Geral do Animal</h4>
                    <p className="text-[18px] font-medium text-gray-900 mt-1 leading-none">RGA 123456789</p>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-guapi-green leading-none">Cor</h4>
                    <p className="text-[18px] font-medium text-gray-900 mt-1 leading-none">Caramelo</p>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-guapi-green leading-none">Microchip</h4>
                    <p className="text-[18px] font-medium text-gray-900 mt-1 leading-none">Não</p>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-guapi-green leading-none">Raça</h4>
                    <p className="text-[18px] font-medium text-gray-900 mt-1 leading-none">SRD</p>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-guapi-green leading-none">Castrado</h4>
                    <p className="text-[18px] font-medium text-gray-900 mt-1 leading-none">Sim</p>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-guapi-green leading-none">Naturalidade</h4>
                    <p className="text-[18px] font-medium text-gray-900 mt-1 leading-none">Guapimirim</p>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-guapi-green leading-none">Data de Nascimento</h4>
                    <p className="text-[18px] font-medium text-gray-900 mt-1 leading-none">12/12/2020</p>
                  </div>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 w-full h-[65px] pb-[16px] bg-guapi-green flex items-center justify-center z-30">
              <h1 className="text-white text-[28px] font-black uppercase tracking-wide">CARTEIRA DE IDENTIDADE ANIMAL</h1>
            </div>

          </div>
        </div>

        {/* DIVISÓRIA BRANCA */}
        <div className="h-[500px] w-[2px] bg-white z-50 opacity-90 mx-[-1px]"></div>

        {/* VERSO */}
        <div className="bg-white relative overflow-hidden border border-gray-200 border-l-0 border-dashed border-gray-300" style={{ width: '800px', height: '500px' }}>
          
          {/* Top Holes */}
          <div className="absolute top-2.5 left-24 w-7 h-7 rounded-full bg-white z-10 shadow-inner"></div>
          <div className="absolute top-2.5 right-24 w-7 h-7 rounded-full bg-white z-10 shadow-inner"></div>

          {/* Right partial shape (paw) */}


          {/* Bottom Mountains / Silhouette */}
          <div className="absolute bottom-11 left-0 w-full h-[220px] z-0 flex items-end">
          </div>

          <div className="absolute inset-0 px-12 pt-[48px] flex z-10 h-full pb-20 pointer-events-none">
            
            {/* Left QR Area */}
            <div className="w-[280px] pt-2 pointer-events-auto flex flex-col items-center">
               <div className="border-[6px] border-guapi-green p-3 bg-white inline-block shadow-sm w-full relative">
                 <div className="w-full aspect-square bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://guapimirim.rj.gov.br')] bg-contain bg-no-repeat bg-center opacity-80"></div>
                 
                 {/* MODELO banner overlay */}
                 <div className="absolute top-1/2 left-0 w-full -translate-y-[120%] bg-guapi-green text-white text-center py-1.5 px-2">
                   <span className="text-4xl font-black tracking-wider block leading-none">MODELO</span>
                 </div>
               </div>
            </div>

            {/* Right Info Area */}
            <div className="flex-1 pl-12 pt-2 gap-y-4 flex flex-col items-start pointer-events-auto relative z-20">
               <div>
                  <h4 className="text-[19px] font-bold text-guapi-green leading-none">Responsável Legal / Cuidador(a)</h4>
                  <p className="text-[22px] font-medium text-gray-900 mt-1 leading-none">Carbone Cartoes</p>
               </div>
               
               <div>
                  <h4 className="text-[19px] font-bold text-guapi-green leading-none">CPF/CNPJ</h4>
                  <p className="text-[22px] font-medium text-gray-900 mt-1 leading-none">45659479000173</p>
               </div>

               <div>
                  <h4 className="text-[19px] font-bold text-guapi-green leading-none">Contato</h4>
                  <p className="text-[22px] font-medium text-gray-900 mt-1 leading-none">(35) 9 9999-9999</p>
               </div>

               <div className="grid grid-cols-2 gap-4 mt-2 pr-20 w-full">
                 <div>
                    <h4 className="text-[19px] font-bold text-guapi-green leading-none">Local</h4>
                    <p className="text-[22px] font-medium text-gray-900 mt-1 leading-tight">Três Corações - MG</p>
                 </div>
                 <div>
                    <h4 className="text-[19px] font-bold text-guapi-green leading-none">Data de Emissão</h4>
                    <p className="text-[22px] font-medium text-gray-900 mt-1 leading-tight">12/04/2025</p>
                 </div>
               </div>
            </div>

          </div>

          {/* Footer Text Layer */}
          <div className="absolute bottom-[65px] left-0 w-full text-center z-10 pt-2 pb-3">
             <h3 className="text-[18px] font-bold text-guapi-green tracking-wider uppercase inline-block">VÁLIDO NO MUNICÍPIO DE GUAPIMIRIM/RJ</h3>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-[65px] pb-[16px] bg-guapi-green flex items-center justify-center z-20">
            <h2 className="text-white text-[19px] font-bold uppercase tracking-widest">LEI Nº15.046, DE 17 DE DEZEMBRO DE 2024</h2>
          </div>
          
          <PawPatternBorder className="!z-[100]" />
          </div>
          </div>
          
        {/* PINGENTES */}
        <div className="absolute bottom-2 left-0 w-full flex flex-col items-center justify-center">
           <div className="flex flex-row gap-16 justify-center">
              
              {/* PINGENTE GRANDE E MÉDIO */}
              <div className="flex flex-col items-center gap-0">
                 <div className="flex flex-row gap-8">
                    <div className="relative flex flex-col items-center">
                       {/* Dashed tab */}
                       <div className="absolute -top-[14px] w-7 h-7 rounded-full border-2 border-dashed border-gray-400 bg-white"></div>
                       
                       {/* Dashed main body */}
                       <div className="w-[150px] h-[150px] rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center relative bg-white z-10 pointer-events-none">
                           
                           {/* Green solid tab */}
                           <div className="absolute -top-[10px] w-5 h-5 rounded-full border-2 border-guapi-green bg-white z-10 pointer-events-auto"></div>
                           
                           {/* Green main body */}
                           <div className="w-[140px] h-[140px] rounded-full border-2 border-guapi-green flex items-center justify-center relative bg-white z-20 pointer-events-auto">
                                <img src="/logo.PNG" alt="Logo" className="w-[85%] h-[85%] object-contain relative z-30" />
                           </div>
                           
                       </div>
                       <span className="text-xs font-bold uppercase mt-2">FRENTE</span>
                    </div>

                    <div className="relative flex flex-col items-center">
                       {/* Dashed tab */}
                       <div className="absolute -top-[14px] w-7 h-7 rounded-full border-2 border-dashed border-gray-400 bg-white"></div>
                       
                       {/* Dashed main body */}
                       <div className="w-[150px] h-[150px] rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center relative bg-white z-10 pointer-events-none">
                           
                           {/* Green solid tab */}
                           <div className="absolute -top-[10px] w-5 h-5 rounded-full border-2 border-guapi-green bg-white z-10 pointer-events-auto"></div>
                           
                           {/* Green main body */}
                           <div className="w-[140px] h-[140px] rounded-full border-2 border-guapi-green flex items-center justify-center relative bg-white z-20 pointer-events-auto p-2">
                                <div className="w-[70%] h-[70%] bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://guapimirim.rj.gov.br')] bg-contain bg-no-repeat bg-center"></div>
                           </div>
                           
                       </div>
                       <span className="text-xs font-bold uppercase mt-2">VERSO</span>
                    </div>
                 </div>
              </div>

              {/* PINGENTE PEQUENO E GATOS */}
              <div className="flex flex-col items-center gap-0">
                 <div className="flex flex-row gap-6">
                    <div className="relative flex flex-col items-center">
                       {/* Dashed tab */}
                       <div className="absolute -top-[12px] w-6 h-6 rounded-full border-2 border-dashed border-gray-400 bg-white"></div>
                       
                       {/* Dashed main body */}
                       <div className="w-[110px] h-[110px] rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center relative bg-white z-10 pointer-events-none">
                           
                           {/* Green solid tab */}
                           <div className="absolute -top-[8px] w-4 h-4 rounded-full border-2 border-guapi-green bg-white z-10 pointer-events-auto"></div>
                           
                           {/* Green main body */}
                           <div className="w-[102px] h-[102px] rounded-full border-2 border-guapi-green flex items-center justify-center relative bg-white z-20 pointer-events-auto">
                                <img src="/logo.PNG" alt="Logo" className="w-[85%] h-[85%] object-contain relative z-30" />
                           </div>
                           
                       </div>
                       <span className="text-xs font-bold uppercase mt-2">FRENTE</span>
                    </div>

                    <div className="relative flex flex-col items-center">
                       {/* Dashed tab */}
                       <div className="absolute -top-[12px] w-6 h-6 rounded-full border-2 border-dashed border-gray-400 bg-white"></div>
                       
                       {/* Dashed main body */}
                       <div className="w-[110px] h-[110px] rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center relative bg-white z-10 pointer-events-none">
                           
                           {/* Green solid tab */}
                           <div className="absolute -top-[8px] w-4 h-4 rounded-full border-2 border-guapi-green bg-white z-10 pointer-events-auto"></div>
                           
                           {/* Green main body */}
                           <div className="w-[102px] h-[102px] rounded-full border-2 border-guapi-green flex items-center justify-center relative bg-white z-20 pointer-events-auto p-1.5">
                                <div className="w-[70%] h-[70%] bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://guapimirim.rj.gov.br')] bg-contain bg-no-repeat bg-center"></div>
                           </div>
                           
                       </div>
                       <span className="text-xs font-bold uppercase mt-2">VERSO</span>
                    </div>
                 </div>
              </div>
              
           </div>

           <div className="text-center mt-6 max-w-4xl text-gray-800 z-10 relative">
               <p className="text-[17px] font-semibold leading-relaxed">
                  Recorte o pingente no tamanho mais adequado para o seu animal seguindo a linha tracejada externa.<br/>
                  Em seguida, plastifique e prenda na coleira do pet.<br/>
                  Se ele se perder, o responsável poderá ser localizado através do QR Code.
               </p>
           </div>
        </div>

      </div>
      </div>
      
    </div>
    </div>
  );
}

