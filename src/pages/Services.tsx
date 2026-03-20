import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ArrowRight, Sparkles, Scissors, Hand, HeartHandshake, Brush, Feather, Eye, Footprints, Smile, Palette, Coffee, Flower2, Droplet } from 'lucide-react';

export const Services: React.FC = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) {
      setActiveCategory(cat);
      setTimeout(() => {
        const grid = document.getElementById('services-grid');
        if (grid) {
          window.scrollTo({ top: grid.offsetTop - 100, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.search]);

  const categories = [
    { id: 'All', label: t('services.categories.all') },
    { id: 'Facial', label: t('services.categories.facial') },
    { id: 'Unhas', label: t('services.categories.nails') },
    { id: 'Massagem', label: t('services.categories.massage') },
    { id: 'Maquilhagem', label: t('services.categories.makeup') },
    { id: 'Depilação', label: t('services.categories.waxing') },
    { id: 'Sobrancelhas', label: t('services.categories.eyebrows') },
  ];

  const servicesList = Array.isArray(t('services.list')) ? t('services.list') : [];

  const getIconForCategory = (category: string, serviceName?: string) => {
    const name = serviceName ? serviceName.toLowerCase() : '';
    if (name.includes('pedicure')) return <Footprints className="w-5 h-5 text-pink-500 mb-4" />;
    if (name.includes('manicure')) return <Hand className="w-5 h-5 text-pink-500 mb-4" />;
    if (name.includes('limpeza')) return <Sparkles className="w-5 h-5 text-pink-500 mb-4" />;
    if (name.includes('tratamento')) return <Smile className="w-5 h-5 text-pink-500 mb-4" />;

    switch (category) {
      case 'Facial': return <Smile className="w-5 h-5 text-pink-500 mb-4" />;
      case 'Unhas': return <Hand className="w-5 h-5 text-pink-500 mb-4" />;
      case 'Massagem': return <Flower2 className="w-5 h-5 text-pink-500 mb-4" />;
      case 'Maquilhagem': return <Palette className="w-5 h-5 text-pink-500 mb-4" />;
      case 'Depilação': return <Droplet className="w-5 h-5 text-pink-500 mb-4" />;
      case 'Sobrancelhas': return <Eye className="w-5 h-5 text-pink-500 mb-4" />;
      default: return <Sparkles className="w-5 h-5 text-pink-500 mb-4" />;
    }
  };

  const filteredServices = activeCategory === 'All'
    ? servicesList
    : servicesList.filter((s: any) => s.category === activeCategory);

  return (
    <div className="pt-24 w-full bg-neutral-50 dark:bg-[#121212] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-gray-800 dark:text-[#EAEAEA] mb-4 tracking-wide">{t('services.title')}</h1>
          <p className="text-gray-600 dark:text-[#A0A0A0] max-w-2xl mx-auto mb-6 text-lg">{t('services.intro')}</p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat: any) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wider transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-white dark:bg-[#1E1E1E] text-gray-600 dark:text-[#A0A0A0] hover:bg-pink-50 dark:hover:bg-pink-900/20 border border-pink-100 dark:border-[#2E2E2E]'
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          layout
          id="services-grid" 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service: any, idx: number) => (
              <motion.div 
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02, translateY: -5 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white dark:bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 flex flex-col border border-pink-50 dark:border-[#2E2E2E]"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.img}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-col items-center text-center mb-4">
                    {getIconForCategory(service.category, service.name)}
                    <h3 className="text-2xl font-serif text-gray-800 dark:text-[#EAEAEA]">{service.name}</h3>
                    <span className="text-xl font-semibold text-pink-600 dark:text-pink-400 mt-2">{service.price}</span>
                  </div>
                  <p className="text-gray-600 dark:text-[#A0A0A0] font-sans mb-6 flex-grow leading-relaxed text-center">{service.desc}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-pink-400 mb-8 uppercase tracking-wider font-medium">
                    <Clock className="w-4 h-4" />
                    {service.duration}
                  </div>
                  <Link
                    to={`/booking?service=${encodeURIComponent(service.name)}`}
                    className="w-full inline-flex justify-center items-center bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-pink-500 hover:text-white transition-colors group border border-pink-100 dark:border-pink-800/40"
                  >
                    {t('services.book')}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
