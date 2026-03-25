import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2 } from 'lucide-react';
import { ImagePreview } from '../components/common/ImagePreview';
import { api } from '../lib/api';

export const Gallery: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const data = await api.get('/gallery');
      setImages(data.map((img: any) => ({
        url: img.image_url,
        category: img.category || 'All'
      })) || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const openPreview = (index: number) => {
    setSelectedImageIndex(index);
    setIsPreviewOpen(true);
  };

  const categories = Array.isArray(t('galleryPage.categories')) ? t('galleryPage.categories') : [];

  const filteredImages = activeCategoryIndex === 0
    ? images
    : images.filter((img: any) => img.category === categories[activeCategoryIndex]);

  return (
    <div className="pt-24 w-full bg-white dark:bg-[#121212] min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full" style={{ maxWidth: '1280px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA] mb-4 tracking-wide">{t('gallery.title')}</h1>
          <p className="text-gray-600 dark:text-[#A0A0A0] max-w-2xl mx-auto mb-6 text-lg">{t('gallery.intro')}</p>
 
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat: string, idx: number) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategoryIndex(idx)}
                className={`px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wider transition-colors ${
                  activeCategoryIndex === idx
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-pink-50 dark:bg-[#1E1E1E] text-gray-600 dark:text-[#A0A0A0] hover:bg-pink-100 dark:hover:bg-pink-900/20 border border-pink-100 dark:border-[#2E2E2E]'
                }`}
              >
                {idx === 0 ? t('gallery.all') : cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-0"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img: any, idx: number) => (
              <motion.div
                key={img.url}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.4, delay: idx % 12 * 0.05 }}
                onClick={() => openPreview(idx)}
                className="relative aspect-square overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer rounded-2xl border border-pink-50 dark:border-pink-900/10"
              >
                <img
                  src={img.url}
                  alt={t('gallery.title')}
                  className="w-full h-full object-cover transition-transform duration-700"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white/20 backdrop-blur-md border border-white/30 px-5 py-2 rounded-full shadow-lg flex items-center gap-2 group/btn transition-all duration-300"
                  >
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white drop-shadow-md">
                      {t('gallery.preview') || 'Visualizar'}
                    </span>
                    <Maximize2 className="text-white w-3 h-3 drop-shadow-md" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <ImagePreview 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        images={filteredImages.map((img: any) => img.url)} 
        initialIndex={selectedImageIndex}
      />
    </div>
  );
};
