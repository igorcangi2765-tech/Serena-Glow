import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { useLocation } from 'react-router-dom';
import { BookingModal } from '../components/BookingModal';
import { api } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ArrowRight, Sparkles, Scissors, Hand, HeartHandshake, Brush, Feather, Eye, Footprints, Smile, Palette, Coffee, Flower2, Droplet, Maximize2 } from 'lucide-react';
import { ImagePreview } from '../components/common/ImagePreview';

export const Services: React.FC = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [dbServices, setDbServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const location = useLocation();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await api.get('/services');
      setDbServices(data || []);
    } catch (err: any) {
      console.error('Error fetching services:', err.message);
    } finally {
      setLoading(false);
    }
  };

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
    { id: 'Nails', label: t('services.categories.nails') },
    { id: 'Makeup', label: t('services.categories.makeup') },
    { id: 'Eyebrows', label: t('services.categories.eyebrows') },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const SERVICE_IMAGE_MAP: Record<string, string> = {
    'Limpeza de Pele': '/images/facial_cleansing.png',
    'Tratamento Facial': '/images/facial_treatment.png',
    'Manicure': '/images/manicure.png',
    'Manicure com Gel': '/images/gel_manicure.png',
    'Pedicure': '/images/pedicure.png',
    'Pedicure Spa': '/images/spa_pedicure.png',
    'Sobrancelhas': '/images/eyebrows.png',
    'Maquilhagem': '/images/gallery_hair_1.png',
    'Maquilhagem Profissional': '/images/gallery_hair_1.png',
    'Facial Cleansing': '/images/facial_cleansing.png',
    'Facial Treatment': '/images/facial_treatment.png',
    'Gel Manicure': '/images/gel_manicure.png',
    'Spa Pedicure': '/images/spa_pedicure.png',
    'Eyebrows': '/images/eyebrows.png',
    'Makeup': '/images/gallery_hair_1.png'
  };

  const CATEGORY_IMAGE_MAP: Record<string, string> = {
    'Facial': '/images/facial_treatment.png',
    'Nails': '/images/manicure.png',
    'Makeup': '/images/gallery_hair_1.png',
    'Eyebrows': '/images/eyebrows.png'
  };

  const getServiceImage = (service: any) => {
    if (service.image_url) return service.image_url;
    
    // Check by name (PT or EN)
    const nameMap = SERVICE_IMAGE_MAP[service.name_pt] || SERVICE_IMAGE_MAP[service.name_en];
    if (nameMap) return nameMap;
    
    // Check by category
    const catName = service.category?.name_en || service.category_id || '';
    const catMap = CATEGORY_IMAGE_MAP[catName];
    if (catMap) return catMap;
    
    return "/images/hero_serena_glow.png";
  };



  const services = dbServices.map(s => {
    const priceValue = s.price || 0;
    const catName = s.category?.name_en || '';
    
    return {
      id: s.id,
      name: language === 'pt' ? (s.name_pt || '') : (s.name_en || ''),
      price: `${priceValue.toLocaleString()} MZN`,
      desc: language === 'pt' ? (s.description_pt || s.name_pt || '') : (s.description_en || s.name_en || ''),
      category: catName.includes('Facial') ? 'Facial' : 
                catName.includes('Nail') ? 'Nails' : 
                catName.includes('Makeup') ? 'Makeup' : 
                catName.includes('Eyebrow') ? 'Eyebrows' : 'All',
      img: getServiceImage(s)
    };
  });



  const filteredServices = activeCategory === 'All'
    ? services
    : services.filter((s: any) => s.category === activeCategory);

  return (
    <div className="pt-24 w-full bg-neutral-50 dark:bg-[#121212] min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full" style={{ maxWidth: '1280px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA] mb-4 tracking-wide">{t('services.title')}</h1>
          <p className="text-gray-600 dark:text-[#A0A0A0] max-w-2xl mx-auto mb-6 text-lg">{t('services.intro')}</p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat: any) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02 }}
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-w-0"
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
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.img}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-col items-center text-center mb-4">
                    <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA]">{service.name}</h3>
                    <span className="text-xl font-bold text-pink-600 dark:text-pink-400 mt-2">{service.price}</span>
                  </div>
                  <p className="text-gray-600 dark:text-[#A0A0A0] font-sans mb-6 flex-grow leading-relaxed text-center">{service.desc}</p>
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: "var(--color-pink-500)", color: "white" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedService(service.id);
                        setIsModalOpen(true);
                      }}
                      className="w-full inline-flex justify-center items-center bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 px-6 py-3 rounded-full text-sm font-bold tracking-wider transition-all duration-300 group border border-pink-100 dark:border-pink-800/40 shadow-sm hover:shadow-md"
                    >
                      {t('services.book')}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>


      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialService={selectedService || t('contact.booking_button')}
      />
    </div>
  );
};

export default Services;
