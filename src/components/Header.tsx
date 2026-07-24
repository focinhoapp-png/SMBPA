import { PawPrint, Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a
            href="/"
            className="flex items-center space-x-3 group outline-none focus-visible:ring-2 focus-visible:ring-guapi-orange rounded-md"
          >
            <img
              src="/icon.PNG"
              alt="Bem-Estar Animal"
              className="h-20 sm:h-28 w-auto object-contain scale-[2.2] sm:scale-[2.6] origin-left"
            />
          </a>

          <nav className="hidden md:flex space-x-6 items-center">
            <a
              href="/adotar"
              className="text-gray-700 hover:text-guapi-orange font-semibold transition-colors"
            >
              Adotar
            </a>
            <Link
              to="/doe-um-pet"
              className="text-gray-700 hover:text-guapi-orange font-semibold transition-colors"
            >
              Doar
            </Link>
            <a
              href="/adotados"
              className="text-gray-700 hover:text-guapi-orange font-semibold transition-colors"
            >
              Adotados
            </a>
            <a
              href="/eventos"
              className="text-gray-700 hover:text-guapi-orange font-semibold transition-colors"
            >
              Eventos
            </a>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-guapi-orange font-semibold transition-colors focus:outline-none"
              >
                <span>Menu</span>
                <ChevronDown className="w-4 h-4 text-guapi-green" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50 flex flex-col">
                  {user && (
                    <>
                      <a
                        href="/painel"
                        className="block px-4 py-2.5 text-sm font-medium text-guapi-green hover:bg-gray-50"
                      >
                        Painel
                      </a>
                      <a
                        href="/meus-pets"
                        className="block px-4 py-2.5 text-sm font-medium text-guapi-green hover:bg-gray-50"
                      >
                        Meus pets
                      </a>
                    </>
                  )}
                  <a
                    href="/meus-pets-dos-sonhos"
                    className="block px-4 py-2.5 text-sm font-medium text-guapi-green hover:bg-gray-50"
                  >
                    Pet dos sonhos
                  </a>

                  {user && (
                    <a
                      href="#"
                      className="block px-4 py-2.5 text-sm font-medium text-guapi-green hover:bg-gray-50"
                    >
                      Modelo de Termo de Adoção
                    </a>
                  )}
                  <a
                    href="/transparencia"
                    className="block px-4 py-2.5 text-sm font-medium text-guapi-green hover:bg-gray-50"
                  >
                    Transparência Pets
                  </a>
                  <a
                    href="/castracao"
                    className="block px-4 py-2.5 text-sm font-medium text-guapi-green hover:bg-gray-50"
                  >
                    Castração
                  </a>
                  <a
                    href="/smbepa-responde"
                    className="block px-4 py-2.5 text-sm font-medium text-guapi-green hover:bg-gray-50"
                  >
                    SMBEPA Responde
                  </a>
                </div>
              )}
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-guapi-orange font-semibold transition-colors"
              >
                Sair
              </button>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-guapi-orange font-semibold transition-colors"
              >
                Entrar
              </Link>
            )}
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/adotar"
              className="block px-3 py-2 text-base font-semibold text-gray-700 hover:text-guapi-orange hover:bg-guapi-orange/10 rounded-md"
            >
              Adotar
            </a>
            <Link
              to="/doe-um-pet"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-base font-semibold text-gray-700 hover:text-guapi-orange hover:bg-guapi-orange/10 rounded-md"
            >
              Doar
            </Link>
            <a
              href="/adotados"
              className="block px-3 py-2 text-base font-semibold text-gray-700 hover:text-guapi-orange hover:bg-guapi-orange/10 rounded-md"
            >
              Adotados
            </a>
            <a
              href="/eventos"
              className="block px-3 py-2 text-base font-semibold text-gray-700 hover:text-guapi-orange hover:bg-guapi-orange/10 rounded-md"
            >
              Eventos
            </a>

            <div className="pt-2 pb-1 border-t border-gray-100 mt-2">
              <span className="block px-3 py-2 text-base font-bold text-gray-800">
                Menu
              </span>
              <div className="pl-4 space-y-1">
                {user && (
                  <>
                    <a
                      href="/painel"
                      className="block px-3 py-2 text-sm font-medium text-guapi-green hover:text-guapi-orange hover:bg-gray-50 rounded-md"
                    >
                      Painel
                    </a>
                    <a
                      href="/meus-pets"
                      className="block px-3 py-2 text-sm font-medium text-guapi-green hover:text-guapi-orange hover:bg-gray-50 rounded-md"
                    >
                      Meus pets
                    </a>
                  </>
                )}
                <a
                  href="/meus-pets-dos-sonhos"
                  className="block px-3 py-2 text-sm font-medium text-guapi-green hover:text-guapi-orange hover:bg-gray-50 rounded-md"
                >
                  Pet dos sonhos
                </a>

                {user && (
                  <a
                    href="#"
                    className="block px-3 py-2 text-sm font-medium text-guapi-green hover:text-guapi-orange hover:bg-gray-50 rounded-md"
                  >
                    Modelo de Termo de Adoção
                  </a>
                )}
                <a
                  href="/transparencia"
                  className="block px-3 py-2 text-sm font-medium text-guapi-green hover:text-guapi-orange hover:bg-gray-50 rounded-md"
                >
                  Transparência Pets
                </a>
                <a
                  href="/castracao"
                  className="block px-3 py-2 text-sm font-medium text-guapi-green hover:text-guapi-orange hover:bg-gray-50 rounded-md"
                >
                  Castração
                </a>
                <a
                  href="/smbepa-responde"
                  className="block px-3 py-2 text-sm font-medium text-guapi-green hover:text-guapi-orange hover:bg-gray-50 rounded-md"
                >
                  SMBEPA Responde
                </a>
              </div>
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-semibold text-gray-700 hover:text-guapi-orange hover:bg-guapi-orange/10 rounded-md mt-2"
              >
                Sair
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-base font-semibold text-gray-700 hover:text-guapi-orange hover:bg-guapi-orange/10 rounded-md mt-2"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
