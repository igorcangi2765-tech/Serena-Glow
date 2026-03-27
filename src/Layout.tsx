import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';
import { Menu, X, Sparkles, Instagram, Facebook, MapPin, Phone, Mail, Sun, Moon, Shield, FileText } from 'lucide-react';
import { BookingModal } from './components/BookingModal';
import { PolicyModal } from './components/common/PolicyModal';
import { SafeImage } from './components/common/SafeImage';
import { motion, AnimatePresence } from 'motion/react';
import { api } from './lib/api';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms'>('privacy');
  const [settings, setSettings] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.get('/settings');
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
    
    // Check for booking query parameter
    const params = new URLSearchParams(location.search);
    if (params.get('booking') === 'true') {
      setIsBookingModalOpen(true);
      // Optional: clear the param to avoid re-opening on manual refresh
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location.pathname, location.search]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.gallery'), path: '/gallery' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const isDark = theme === 'dark';
  const isTransparent = !isScrolled && (location.pathname === '/' || location.pathname === '/about');

  return (
    <div className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-300 ${isDark ? 'bg-[#121212] text-[#EAEAEA]' : 'bg-neutral-50 text-gray-800'}`}>
      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? isDark
              ? 'bg-[#1E1E1E]/95 backdrop-blur-sm shadow-sm py-4'
              : 'bg-white/95 backdrop-blur-sm shadow-sm py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className={`font-serif text-2xl font-semibold tracking-wide transition-colors ${
                isTransparent 
                  ? 'text-white' 
                  : (isDark ? 'text-[#EAEAEA]' : 'text-gray-900')
              }`}>
                Serena Glow
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <motion.div
                  key={link.path}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    to={link.path}
                    className={`text-sm tracking-wide font-medium transition-colors ${
                      location.pathname === link.path
                        ? (isTransparent ? (isDark ? 'text-pink-400' : 'text-pink-500') : 'text-pink-500')
                        : isTransparent
                        ? 'text-white/90 hover:text-white'
                        : isDark
                        ? 'text-[#A0A0A0] hover:text-pink-400'
                        : 'text-gray-600 hover:text-pink-500'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Side: Theme + Lang + CTA */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className={`rounded-full p-2 transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? 'bg-[#2E2E2E] text-yellow-400 hover:bg-[#3E3E3E]'
                    : 'bg-pink-50 text-gray-700 hover:bg-pink-100'
                }`}
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                className={`flex items-center gap-2 border rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-all duration-300 group ${
                  isDark
                    ? 'bg-[#2E2E2E] border-[#3E3E3E] hover:bg-[#3E3E3E]'
                    : 'bg-white/60 backdrop-blur-md border-pink-100/50 hover:bg-pink-50'
                }`}
              >
                <SafeImage
                  src={language === 'pt' ? '/icons/mz.png' : '/icons/en.png'}
                  alt={language === 'pt' ? 'Português' : 'English'}
                  className="w-5 h-5 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
                />
                <span className="text-xs font-bold tracking-widest text-pink-500 uppercase">
                  {language === 'pt' ? 'PT' : 'EN'}
                </span>
              </button>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(244, 63, 94, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsBookingModalOpen(true)}
                className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 shadow-md transition font-medium tracking-wide text-sm"
              >
                {t('nav.bookNow')}
              </motion.button>
            </div>

            {/* Mobile: Theme + Lang + Hamburger */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`rounded-full p-2 transition-all duration-300 ${
                  isDark
                    ? 'bg-[#2E2E2E] text-yellow-400'
                    : 'bg-pink-50 text-gray-700'
                }`}
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                className={`flex items-center gap-2 border rounded-full px-3 py-1.5 shadow-sm transition-colors ${
                  isDark ? 'bg-[#2E2E2E] border-[#3E3E3E]' : 'bg-white border-pink-100 active:bg-pink-50'
                }`}
              >
                <SafeImage
                  src={language === 'pt' ? '/icons/mz.png' : '/icons/en.png'}
                  alt={language === 'pt' ? 'Português' : 'English'}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="text-xs font-bold tracking-widest text-pink-500 uppercase">
                  {language === 'pt' ? 'PT' : 'EN'}
                </span>
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={isTransparent ? 'text-white hover:text-pink-400' : (isDark ? 'text-[#EAEAEA] hover:text-pink-400' : 'text-gray-800 hover:text-pink-500') + ' transition-colors'}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 w-full shadow-md transition-all duration-300 ease-in-out overflow-y-auto z-50 ${
            isDark ? 'bg-[#1E1E1E]' : 'bg-white'
          } ${
            isMobileMenuOpen ? 'max-h-[calc(100vh-80px)] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="px-4 py-6 flex flex-col">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-3 px-4 mb-1 rounded-lg transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'text-pink-500 font-medium bg-pink-50/80'
                      : isDark
                      ? 'text-[#A0A0A0] hover:text-pink-400 hover:bg-[#2E2E2E]'
                      : 'text-gray-800 hover:text-pink-500 hover:bg-gray-50/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className={`border-t my-3 ${isDark ? 'border-[#2E2E2E]' : 'border-gray-100'}`} />
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsBookingModalOpen(true);
              }}
              className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 shadow-md hover:shadow-lg transition font-medium tracking-wide text-sm text-center"
            >
              {t('nav.bookNow')}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className={`pt-20 pb-10 ${isDark ? 'bg-gradient-to-br from-[#1a0a10] to-[#0d0508]' : 'bg-gradient-to-br from-pink-900 to-rose-900'} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-wrap justify-between gap-12 mb-16">
            <div className="flex-1 flex flex-col items-start text-left min-w-[280px]">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <span className="font-serif text-2xl font-semibold tracking-wide">
                  Serena Glow
                </span>
              </Link>
              <div className="text-pink-100 w-full leading-relaxed mb-8 font-sans transition-all duration-300" style={{ minWidth: '300px', maxWidth: '448px' }}>
                <p className="text-base">
                  {t('footer.descriptionDesktop') || t('footer.description')}
                </p>
              </div>
              <div className="flex space-x-4">
                <motion.a 
                  whileHover={{ scale: 1.02, rotate: 5 }}
                  href={settings?.instagram ? `https://instagram.com/${settings.instagram.replace('@', '')}` : "#"} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-pink-300/30 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-pink-100" />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.02, rotate: -5 }}
                  href="#" 
                  className="w-10 h-10 rounded-full border border-pink-300/30 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 transition-colors"
                >
                  <Facebook className="w-5 h-5 text-pink-100" />
                </motion.a>
              </div>
            </div>

            <div className="flex flex-col items-start text-left min-w-[200px]">
                <h4 className="font-serif text-lg mb-6 text-pink-200">{t('footer.quickLinks')}</h4>
              <ul className="space-y-4 font-sans">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-pink-100 hover:text-pink-300 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-start text-left min-w-[200px]">
                <h4 className="font-serif text-lg mb-6 text-pink-200">{t('footer.services')}</h4>
              <ul className="space-y-4 font-sans">
                {t('footer.serviceLinks').map((service: string, idx: number) => {
                  let cat = 'All';
                  const s = service.toLowerCase();
                  if (s.includes('facia')) cat = 'Facial';
                  else if (s.includes('manicure') || s.includes('unha') || s.includes('pedicure') || s.includes('nail')) cat = 'Nails';
                  else if (s.includes('maqui') || s.includes('makeup')) cat = 'Makeup';
                  else if (s.includes('sobrancelha') || s.includes('eyebrow')) cat = 'Eyebrows';

                  return (
                    <li key={idx}>
                      <Link to={`/services?category=${encodeURIComponent(cat)}`} className="text-pink-100 hover:text-pink-300 transition-colors">
                        {service}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-col items-start text-left min-w-[250px]">
              <h4 className="font-serif text-lg mb-6 text-pink-200">{t('footer.contactInfo')}</h4>
              <ul className="space-y-4 text-pink-100 font-sans">
                <li className="flex items-start gap-3 group cursor-default">
                  <MapPin className="w-5 h-5 text-pink-300 shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-125 group-hover:text-pink-400" />
                  <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:text-pink-300">
                    {settings?.address || t('footer.address')}
                  </span>
                </li>
                <li className="flex items-center gap-3 group cursor-default">
                  <Phone className="w-5 h-5 text-pink-300 shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:text-pink-400" />
                  <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:text-pink-300">
                    {settings?.phone || t('footer.phone')}
                  </span>
                </li>
                <li className="flex items-center gap-3 group cursor-default">
                  <Mail className="w-5 h-5 text-pink-300 shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:text-pink-400" />
                  <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:text-pink-300">
                    {settings?.email || t('footer.email')}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-pink-800 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-sans">
            <p className="text-sm text-pink-200 whitespace-nowrap min-w-fit">
              {t('footer.copyright').replace('{year}', new Date().getFullYear().toString())}
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm text-pink-200">
              <button 
                onClick={() => {
                  setPolicyType('privacy');
                  setIsPolicyModalOpen(true);
                }} 
                className="hover:text-white transition-all duration-300"
              >
                {t('footer.privacy')}
              </button>
              <button 
                onClick={() => {
                  setPolicyType('terms');
                  setIsPolicyModalOpen(true);
                }} 
                className="hover:text-white transition-all duration-300"
              >
                {t('footer.terms')}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />

      {/* Policy Modal */}
      <PolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        type={policyType}
        onSwitch={() => setPolicyType(policyType === 'privacy' ? 'terms' : 'privacy')}
      />
    </div>
  );
};

export default Layout;
