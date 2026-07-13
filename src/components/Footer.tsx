import {
  PawPrint,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contato"
      className="bg-guapi-green-dark pt-16 pb-8 text-gray-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="col-span-1 lg:col-span-2">
            <h4 className="font-bold text-white text-lg mb-6">Informações</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-guapi-orange shrink-0 mt-1" />
                <span>
                  <strong>Secretaria de Bem-Estar e Proteção Animal</strong>
                  <br />
                  Endereço: Avenida Dedo de Deus, 1162 – Centro – Guapimirim –
                  RJ.
                  <br />
                  CEP: 25945-412
                  <br />
                  Horário de Atendimento: Das 08 às 17h.
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-guapi-orange shrink-0" />
                <span>(21) 96644-4257</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-guapi-orange shrink-0" />
                <span>protecaoanimal@guapimirim.rj.gov.br</span>
              </li>
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-1 flex flex-col justify-center items-start gap-8">
            <a href="https://www.instagram.com/caiopietrelli?igsh=d3JsbHZiNXJrbXc3" target="_blank" rel="noopener noreferrer">
              <img
                src="/logocaio.png"
                alt="Caio"
                className="h-24 sm:h-28 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </a>
            <a href="https://www.instagram.com/cidadedeguapimirim?igsh=MThxOWg0dXFob2Ftbg==" target="_blank" rel="noopener noreferrer">
              <img
                src="/logoguapi.png"
                alt="Guapimirim"
                className="h-20 sm:h-24 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </a>
          </div>

          <div className="col-span-1 lg:col-span-2 flex flex-col items-center text-center lg:-ml-4 xl:-ml-8">
            <div className="mb-6">
              <img
                src="/logobranca.PNG"
                alt="Bem-Estar Animal"
                className="h-20 sm:h-24 w-auto object-contain scale-[1.2]"
              />
            </div>
            <p className="text-gray-400 mb-6 line-clamp-3 text-sm">
              Secretaria Municipal de Bem-Estar e Proteção Animal. Resgatando,
              cuidando e amando os animais do nosso município.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/protecaoanimalguapimirim"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-guapi-orange transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-guapi-orange transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Prefeitura de Guapimirim. Todos os
            direitos reservados.
          </p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <span>Desenvolvido por Orbizia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
