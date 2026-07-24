import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function SmbepaResponde() {
  return (
    <div className="font-sans bg-white pt-[80px] min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col">
        {/* Banner */}
        <section className="bg-[#ff2000] py-16 px-4 shadow-sm relative">
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center tracking-wide">
              Tire suas dúvidas com a SMBEPA
            </h1>
          </div>
        </section>

        <section className="py-8 px-4 flex-grow bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="text-sm mb-10 font-medium">
              <Link to="/" className="text-gray-500 hover:underline">Início</Link>
              <span className="mx-2 text-gray-400">&gt;</span>
              <span className="text-[#00ba88] font-medium text-sm">Contactar</span>
            </div>

            <div className="text-gray-700 leading-relaxed font-medium max-w-5xl text-sm space-y-6">
              <p>
                Que bom ter você por aqui! 
              </p>
              <p>
                A Secretaria Municipal de Bem-Estar e Proteção Animal está pronta para ouvir você e ajudar no que for necessário para melhorar a vida dos animais da nossa cidade.
              </p>
              
              <p>
                Agora, pelo nosso site, você pode entrar em contato diretamente com a Secretaria para enviar:
              </p>

              <ul className="list-disc pl-5 space-y-1">
                <li>Denúncias de maus-tratos a animais domésticos</li>
                <li>Reclamações</li>
                <li>Solicitações</li>
                <li>Pedidos de castração</li>
                <li>Informações sobre feiras de adoção e eventos</li>
                <li>Informações sobre horário de funcionamento</li>
                <li>Informações de localização</li>
                <li>Sugestões e elogios</li>
              </ul>

              <p>
                Funciona assim: você envia sua solicitação diretamente pelo site da Secretaria, e a equipe responsável fará o atendimento e retorno pelos canais informados no cadastro.
              </p>

              <p>
                É importante lembrar que cada solicitação será analisada pela equipe responsável, e o prazo de resposta pode variar conforme o tipo de atendimento.
              </p>

              <p>
                Então, como podemos ajudar você e os animais hoje?
              </p>
            </div>

            <div className="mt-12 flex justify-center">
              <Link 
                to="/form-smbepa-responde" 
                className="inline-block border border-[#ff2000] text-[#ff2000] hover:bg-[#ff2000] hover:text-white font-medium py-3 px-8 rounded-sm transition-colors"
              >
                Contactar
              </Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
