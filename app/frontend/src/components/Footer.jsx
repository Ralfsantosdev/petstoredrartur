import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, Mail, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300" data-testid="footer">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">🐾</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white leading-tight">Petstore</h3>
                <p className="text-sm text-teal-400 font-medium -mt-1">Dr. Artur Teixeira</p>
              </div>
            </div>
            <p className="text-stone-400 mb-6">
              Cuidando do seu pet com amor e excelência há mais de 10 anos em Jacobina.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors"
                data-testid="footer-facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors"
                data-testid="footer-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors" data-testid="footer-link-home">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="hover:text-teal-400 transition-colors" data-testid="footer-link-catalogo">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/agendamento" className="hover:text-teal-400 transition-colors" data-testid="footer-link-agendamento">
                  Agendar Consulta
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-teal-400 transition-colors" data-testid="footer-link-contato">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6">Serviços</h4>
            <ul className="space-y-3">
              <li>Consulta Veterinária</li>
              <li>Vacinação</li>
              <li>Banho e Tosa</li>
              <li>Exames Laboratoriais</li>
              <li>Cirurgias</li>
              <li>Emergência</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>R. Margem Rio do Ouro, 59 – Leader, Jacobina – BA, 44700-000</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <a href="tel:7436214487" className="hover:text-teal-400 transition-colors">
                  (74) 3621-4487
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <a href="mailto:contato@petstore.com.br" className="hover:text-teal-400 transition-colors">
                  contato@petstore.com.br
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p>Segunda a Sexta</p>
                  <p className="text-white">08:00 - 18:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
          <p>© 2024 Petstore Dr. Artur Teixeira. Todos os direitos reservados.</p>
          <p>
            Desenvolvido com ❤️ em Jacobina-BA
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
