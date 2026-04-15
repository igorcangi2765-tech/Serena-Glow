import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { useLocation } from 'react-router-dom';
import { BookingModal } from '../components/BookingModal';
import { api } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ArrowRight, Sparkles, Scissors, Hand, HeartHandshake, Brush, Feather, Eye, Footprints, Smile, Palette, Coffee, Flower2, Droplet, Maximize2 } from 'lucide-react';
import { ImagePreview } from '../components/common/ImagePreview';
import { SafeImage } from '../components/common/SafeImage';

const DEFAULT_SERVICES = [
  { id: '1', name_pt: 'Limpeza de Pele', name_en: 'Facial Cleansing', price: 1500, description_pt: 'Limpeza profunda da pele.', description_en: 'Deep skin cleansing.', category: { name_pt: 'Estética Facial', name_en: 'Facial' }, image_url: '/images/facial_cleansing.png' },
  { id: '2', name_pt: 'Manicure', name_en: 'Manicure', price: 300, description_pt: 'Cuidado completo das unhas das mãos.', description_en: 'Complete hand nail care.', category: { name_pt: 'Cuidados de Unhas', name_en: 'Nails' }, image_url: '/images/manicure.png' },
  { id: '3', name_pt: 'Manicure com Gel', name_en: 'Gel Manicure', price: 500, description_pt: 'Unhas impecáveis por semanas.', description_en: 'Flawless nails for weeks.', category: { name_pt: 'Cuidados de Unhas', name_en: 'Nails' }, image_url: '/images/gel_manicure.png' },
  { id: '4', name_pt: 'Maquilhagem', name_en: 'Makeup', price: 1200, description_pt: 'Para todas as ocasiões.', description_en: 'For all occasions.', category: { name_pt: 'Maquilhagem', name_en: 'Makeup' }, image_url: '/images/gallery_hair_1.png' },
  { id: '5', name_pt: 'Pedicure', name_en: 'Pedicure', price: 400, description_pt: 'Cuidado completo das unhas dos pés.', description_en: 'Complete foot nail care.', category: { name_pt: 'Cuidados de Unhas', name_en: 'Nails' }, image_url: '/images/pedicure.png' },
  { id: '6', name_pt: 'Pedicure Spa', name_en: 'Spa Pedicure', price: 800, description_pt: 'Relaxamento total para os seus pés.', description_en: 'Total relaxation for your feet.', category: { name_pt: 'Cuidados de Unhas', name_en: 'Nails' }, image_url: '/images/spa_pedicure.png' },
  { id: '7', name_pt: 'Sobrancelhas', name_en: 'Eyebrow Design', price: 300, description_pt: 'Design de sobrancelhas personalizado.', description_en: 'Custom eyebrow design.', category: { name_pt: 'Sobrancelhas', name_en: 'Eyebrows' }, image_url: '/images/eyebrows.png' },
  { id: '8', name_pt: 'Tratamento Facial', name_en: 'Facial Treatment', price: 2000, description_pt: 'Tratamentos específicos para o seu rosto.', description_en: 'Specific treatments for your face.', category: { name_pt: 'Estética Facial', name_en: 'Facial' }, image_url: '/images/facial_treatment.png' }
];

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
      setDbServices(Array.isArray(data) && data.length > 0 ? data : DEFAULT_SERVICES);
    } catch (err: any) {
      console.error('Error fetching services, using fallback:', err.message);
      setDbServices(DEFAULT_SERVICES);
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
    const catNameEn = (s.category?.name_en || '').toLowerCase();
    const catNamePt = (s.category?.name_pt || '').toLowerCase();
    
    // Improved mapping to handle both PT and EN names
    const category = 
      (catNameEn.includes('facial') || catNamePt.includes('facial')) ? 'Facial' : 
      (catNameEn.includes('nail') || catNamePt.includes('unha')) ? 'Nails' : 
      (catNameEn.includes('makeup') || catNamePt.includes('maquilhagem')) ? 'Makeup' : 
      (catNameEn.includes('eyebrow') || catNamePt.includes('sobrancelha')) ? 'Eyebrows' : 'All';

    return {
      id: s.id,
      name: language === 'pt' ? (s.name_pt || '') : (s.name_en || ''),
      price: `${priceValue.toLocaleString()} MZN`,
      desc: language === 'pt' ? (s.description_pt || s.name_pt || '') : (s.description_en || s.name_en || ''),
      category,
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
        <div id="services-grid" className="min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-sm border border-pink-50 dark:border-[#2E2E2E] animate-pulse">
                  <div className="h-64 bg-gray-200 dark:bg-gray-800" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mx-auto" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 mx-auto" />
                    </div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-full w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredServices.length > 0 ? (
            <motion.div 
              layout
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
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="bg-white dark:bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col border border-pink-50 dark:border-[#2E2E2E] group"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <SafeImage
                        src={service.img}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex flex-col items-center text-center mb-4">
                        <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA] group-hover:text-pink-600 transition-colors duration-300">{service.name}</h3>
                        <span className="text-xl font-bold text-pink-600 dark:text-pink-400 mt-2">{service.price}</span>
                      </div>
                      <p className="text-gray-600 dark:text-[#A0A0A0] font-sans mb-6 flex-grow leading-relaxed text-center opacity-80 group-hover:opacity-100 transition-opacity">{service.desc}</p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedService(service.id);
                            setIsModalOpen(true);
                          }}
                          className="w-full inline-flex justify-center items-center bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 px-6 py-4 rounded-full text-sm font-bold tracking-wider transition-all duration-300 group border border-pink-100 dark:border-pink-800/40 shadow-sm hover:bg-pink-500 hover:text-white hover:border-pink-500"
                        >
                          {t('services.book')}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white dark:bg-[#1E1E1E] rounded-3xl border border-dashed border-pink-200 dark:border-[#2E2E2E]"
            >
              <div className="w-20 h-20 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-pink-400" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA] mb-2">Nenhum serviço disponível</h3>
              <p className="text-gray-500 dark:text-[#A0A0A0]">Estamos a preparar novos serviços para si. Por favor, volte mais tarde.</p>
            </motion.div>
          )}
        </div>
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
