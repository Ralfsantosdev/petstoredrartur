import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MapPin, Clock } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/catalogo", label: "Produtos" },
    { href: "/agendamento", label: "Agendar" },
    { href: "/contato", label: "Contato" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top bar */}
      <div className="bg-teal-600 text-white py-2 hidden md:block">
        <div className="container-custom flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              (74) 3621-4487
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Seg-Sex: 08:00 - 18:00
            </span>
          </div>
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            R. Margem Rio do Ouro, 59 - Leader, Jacobina - BA
          </span>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
        data-testid="main-header"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
              <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">🐾</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-stone-800 leading-tight">
                  Petstore
                </h1>
                <p className="text-sm text-teal-600 font-medium -mt-1">
                  Dr. Artur Teixeira
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                  className={`font-medium transition-colors duration-200 relative py-2 ${
                    isActive(link.href)
                      ? "text-teal-600"
                      : "text-stone-600 hover:text-teal-600"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-teal-600"
              data-testid="mobile-menu-btn"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-stone-100 py-4" data-testid="mobile-menu">
            <div className="container-custom flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-teal-50 text-teal-600"
                      : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
