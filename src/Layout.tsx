import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { Menu, X, Sparkles, Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.services, path: '/services' },
    { name: t.nav.gallery, path: '/gallery' },
    { name: t.nav.contact, path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-neutral-50">
      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <Sparkles className="w-6 h-6 text-pink-500 group-hover:rotate-12 transition-transform" />
              <span className="font-serif text-2xl font-semibold tracking-wide text-gray-900">
                Serena Glow
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm tracking-wide font-medium transition-colors ${
                    location.pathname === link.path ? 'text-pink-600' : 'text-gray-600 hover:text-pink-500'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Side: Lang + CTA */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                className="text-sm font-medium tracking-wide text-gray-600 hover:text-pink-500 transition-colors"
              >
                {language === 'pt' ? 'EN' : 'PT'}
              </button>
              <Link
                to="/booking"
                className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 shadow-md hover:shadow-lg transition font-medium tracking-wide text-sm"
              >
                {t.nav.bookNow}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                className="text-sm font-medium tracking-wide text-gray-600"
              >
                {language === 'pt' ? 'EN' : 'PT'}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-800 hover:text-pink-500 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 py-6 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-lg font-serif text-gray-800 hover:text-pink-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/booking"
              className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 shadow-md hover:shadow-lg transition font-medium tracking-wide text-sm text-center mt-4"
            >
              {t.nav.bookNow}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-pink-900 to-rose-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-pink-300" />
                <span className="font-serif text-2xl font-semibold tracking-wide">
                  Serena Glow
                </span>
              </Link>
              <p className="text-pink-100 max-w-sm leading-relaxed mb-8 font-sans">
                {t.footer.description}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full border border-pink-300/30 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 transition-colors">
                  <Instagram className="w-5 h-5 text-pink-100" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-pink-300/30 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 transition-colors">
                  <Facebook className="w-5 h-5 text-pink-100" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-6 text-pink-200">{t.footer.quickLinks}</h4>
              <ul className="space-y-4 font-sans">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-pink-100 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
<<<<<<< HEAD
=======
                <li>
                  <Link to="/admin" className="text-pink-100 hover:text-white transition-colors">
                    {t.nav.admin}
                  </Link>
                </li>
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-6 text-pink-200">{t.footer.services}</h4>
              <ul className="space-y-4 font-sans">
                {t.footer.serviceLinks.map((service, idx) => (
                  <li key={idx}><Link to="/services" className="text-pink-100 hover:text-white transition-colors">{service}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-6 text-pink-200">{t.footer.contactInfo}</h4>
              <ul className="space-y-4 text-pink-100 font-sans">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-pink-300 shrink-0 mt-0.5" />
                  <span>{t.footer.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-pink-300 shrink-0" />
                  <span>{t.footer.phone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-pink-300 shrink-0" />
                  <span>{t.footer.email}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-pink-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 font-sans">
            <p className="text-sm text-pink-200">
              {t.footer.copyright.replace('{year}', new Date().getFullYear().toString())}
            </p>
            <div className="flex space-x-6 text-sm text-pink-200">
              <a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a>
              <a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
