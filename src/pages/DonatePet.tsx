import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { LogIn, KeyRound, HeartHandshake } from 'lucide-react';

export default function DonatePet() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCadastrarClick = () => {
    // Check if user is logged in (mocking with localStorage)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      setShowAuthModal(true);
    } else {
      navigate('/cadastrar-animal');
    }
  };

  return (
    <div className="font-sans bg-white selection:bg-guapi-orange selection:text-white pt-[80px] min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        {/* Breadcrumb */}
        <div className="pt-6 pb-2 text-sm text-gray-500 flex gap-2">
           <Link to="/" className="hover:text-guapi-green transition-colors">Início</Link>
           <span>&gt;</span>
           <span className="text-guapi-green font-medium">Doe um pet</span>
        </div>

        {/* Banner */}
        <div className="w-full mt-4">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-red-500/10 mb-12">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1200" 
                alt="Cães adoráveis" 
                className="w-full h-full object-cover object-center"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/95 via-red-500/80 to-transparent backdrop-blur-[2px]"></div>
            </div>
            
            <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-4 backdrop-blur-md border border-white/20">
                 <HeartHandshake className="w-4 h-4 fill-white text-white" />
                 Ato de amor
               </div>
               <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-sm">
                 Doe um <span className="text-[#fae284]">Pet</span>
               </h1>
               <p className="text-white/90 text-lg sm:text-xl font-medium max-w-lg drop-shadow-sm leading-relaxed mx-auto md:mx-0">
                 Não pode mais cuidar do seu bichinho ou resgatou um animal? Ajude-o a encontrar uma nova família que o ame.
               </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-800 mb-8">
            Passo a passo para disponibilizar um pet para adoção
          </h2>

          <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
            <p>
              <strong>1) Cadastro</strong> - Para doar um bichinho basta cadastrar o pet, colocar quatro fotos bem legais e os documentos solicitados. Se o animal for um filhote de até 06 meses, é necessário ser vacinado e vermifugado (a prefeitura garante a castração gratuita entre os 6 e 12 meses de idade). Já para os animais acima de seis meses, a lei exige que eles estejam castrados, vacinados e vermifugados. Então não esqueça de anexar os comprovantes, tá?
            </p>
            
            <p>
              <strong>2) Validação</strong> - Após o cadastro, conferimos as informações. Se estiver tudo OK, o pet já fica disponível para adoção! Se não, te explicamos como fazer as correções necessárias.
            </p>

            <p>
              <strong>3) Chamada de vídeo</strong> - Quando alguém se interessar pelo pet você receberá um aviso por WhatsApp e e-mail, com o link para realizar a chamada de vídeo para apresentação do pet e entrevista com quem pretende adotar. No dia e horário marcados, basta acessar o link. A pontualidade é muito importante, mas, se surgir algum imprevisto, lembre-se de avisar a pessoa para que vocês possam remarcar o encontro.
            </p>

            <p>
              <strong>4) Delivery pet</strong> - Deu tudo certo na entrevista? Acesse o Adota Pet e altere o status para "Adotado". Isso oficializa a adoção e libera o voucher do Uber Pet para o transporte do animal até sua nova família.
            </p>
          </div>

          <div className="mt-16 flex justify-center">
            <button 
              onClick={handleCadastrarClick}
              className="bg-white hover:bg-red-50 text-red-500 font-medium py-3 px-16 border border-red-500 rounded transition-colors"
            >
              Cadastrar Pet
            </button>
          </div>
        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center justify-center text-center space-y-4 pt-4">
              <div className="bg-red-100 p-4 rounded-full">
                <KeyRound className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Acesso Restrito</h2>
              <p className="text-gray-600 text-sm">
                Para cadastrar um novo pet para adoção, você precisa estar logado na sua conta.
              </p>
            </div>
            
            <div className="mt-8 flex flex-col gap-3">
              <Link 
                to="/cadastro" 
                className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-guapi-green hover:bg-guapi-green-dark transition-colors"
              >
                Criar uma conta
              </Link>
              <Link 
                to="/login"
                className="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-gray-50 border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-guapi-orange transition-colors"
              >
                Já tenho conta (Entrar)
              </Link>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-gray-800 underline transition-colors"
              >
                Agora não, voltar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
