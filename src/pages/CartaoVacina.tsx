import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CartaoVacina = () => {
  const { id } = useParams();
  const [pet, setPet] = useState<any>(null);
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Cartão de Saúde do Animal";

    async function loadData() {
      try {
        const { data: petData, error: petError } = await supabase
          .from('pets')
          .select('*, pet_imagens(id, url, ordem), pet_vacinas(*)')
          .eq('id', id)
          .single();

        if (petError) throw petError;
        setPet(petData);

        if (petData?.tutor_id) {
          const { data: tutorData } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', petData.tutor_id)
            .single();
          setTutor(tutorData);
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Carregando dados...</div>;
  }

  if (!pet) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Animal não encontrado.</div>;
  }

  const formatData = (dataStr: string) => {
    if (!dataStr) return '-';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const currentTutor = tutor || {
    nome_completo: 'Não informado',
    cpf_cnpj: 'Não informado'
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${window.location.origin}/descricao-pet/${pet.id}`)}`;

  const vacinas = pet.pet_vacinas || [];
  const desparasitacao = vacinas.filter((v: any) => v.tipo_vacina?.toLowerCase().includes('vermi') || v.tipo_vacina?.toLowerCase().includes('anti-pulga') || v.tipo_vacina?.toLowerCase().includes('desparasitação'));
  const outrasVacinas = vacinas.filter((v: any) => !v.tipo_vacina?.toLowerCase().includes('vermi') && !v.tipo_vacina?.toLowerCase().includes('anti-pulga') && !v.tipo_vacina?.toLowerCase().includes('desparasitação'));

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
              {(() => {
                const rgPhoto = pet.pet_imagens?.find((img: any) => img.ordem === 0)?.url || pet.imagem_principal_url;
                return rgPhoto ? (
                  <img src={rgPhoto} alt={pet.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold bg-gray-200">SEM FOTO</div>
                );
              })()}
            </div>

            <div className="flex-1 flex flex-col z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 text-center pr-12">
                  <h2 className="text-xl font-medium tracking-wide">{pet.nome}</h2>
                </div>
                <div className="font-bold text-[13px] tracking-wide mt-1 uppercase">
                  RG ANIMAL: {pet.id.substring(0,8)}-RJ
                </div>
              </div>

              <div className="grid grid-cols-4 gap-x-4 mb-5 items-end">
                <div>
                  <div className="text-[12px] mb-1 font-medium">Data de nascimento</div>
                  <div className="bg-white text-gray-900 px-3 py-1.5 font-medium text-[13px]">{formatData(pet.data_nascimento)}</div>
                </div>
                <div>
                  <div className="text-[12px] mb-1 font-medium">Cor</div>
                  <div className="bg-white text-gray-900 px-3 py-1.5 font-medium text-[13px] capitalize">{pet.cor || '-'}</div>
                </div>
                <div>
                  <div className="text-[12px] mb-1 font-medium">Espécie</div>
                  <div className="bg-white text-gray-900 px-3 py-1.5 font-medium text-[13px] capitalize">{pet.especie}</div>
                </div>
                <div>
                  <div className="text-[12px] mb-1 font-medium">Sexo</div>
                  <div className="bg-white text-gray-900 px-3 py-1.5 font-medium text-[13px] capitalize">{pet.sexo}</div>
                </div>
              </div>

              <div>
                <div className="text-[13px] mb-1 font-medium">Informações do Responsável</div>
                <div className="grid grid-cols-3 gap-x-4">
                  <div className="col-span-1">
                    <div className="text-[12px] mb-1 font-medium">CPF/CNPJ</div>
                    <div className="bg-white text-gray-900 px-3 py-1.5 font-medium text-[13px]">{currentTutor.cpf_cnpj}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[12px] mb-1 font-medium">Nome Responsável</div>
                    <div className="bg-white text-gray-900 px-3 py-1.5 font-medium text-[13px] uppercase">{currentTutor.nome_completo}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-2 mt-2">
            <h3 className="text-xl text-gray-900 mb-3 font-medium">Vacinação</h3>
            {outrasVacinas.length === 0 ? (
              <p className="text-gray-900 font-medium text-sm mb-8">Sem registros</p>
            ) : (
              <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 font-medium">
                    <tr>
                      <th className="px-4 py-2">Vacina</th>
                      <th className="px-4 py-2">Data</th>
                      <th className="px-4 py-2">Próxima</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {outrasVacinas.map((v: any) => (
                      <tr key={v.id}>
                        <td className="px-4 py-2">{v.tipo_vacina}</td>
                        <td className="px-4 py-2">{formatData(v.data_aplicacao)}</td>
                        <td className="px-4 py-2">{formatData(v.data_proxima)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <h3 className="text-xl text-gray-900 mb-3 font-medium">Desparasitação</h3>
            {desparasitacao.length === 0 ? (
              <p className="text-gray-900 font-medium text-sm mb-3">Sem registros</p>
            ) : (
              <div className="mb-3 overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 font-medium">
                    <tr>
                      <th className="px-4 py-2">Produto</th>
                      <th className="px-4 py-2">Data</th>
                      <th className="px-4 py-2">Próxima</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {desparasitacao.map((v: any) => (
                      <tr key={v.id}>
                        <td className="px-4 py-2">{v.tipo_vacina}</td>
                        <td className="px-4 py-2">{formatData(v.data_aplicacao)}</td>
                        <td className="px-4 py-2">{formatData(v.data_proxima)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <p className="text-[12px] text-gray-900 font-medium mb-4 mt-8">Para verificar sua autenticidade, escaneie o QR</p>
            <div className="mt-4">
              <div className="w-[130px] h-[130px] bg-contain bg-no-repeat bg-center" style={{ backgroundImage: `url("${qrCodeUrl}")` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartaoVacina;
