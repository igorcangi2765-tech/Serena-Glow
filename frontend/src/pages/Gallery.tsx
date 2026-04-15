import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, Sparkles } from 'lucide-react';
import { ImagePreview } from '../components/common/ImagePreview';
import { SafeImage } from '../components/common/SafeImage';
import { api } from '../lib/api';

const DEFAULT_GALLERY_IMAGES = [
  { image_url: '/images/gallery_ai_interior.png', category: 'Estúdio' },
  { image_url: '/images/gallery_ai_nails.png', category: 'Unhas' },
  { image_url: '/images/gallery_ai_makeup.png', category: 'Maquilhagem' },
  { image_url: '/images/gallery_ai_facial.png', category: 'Facial' },
  { image_url: '/images/gallery_ai_hair.png', category: 'Cabelo' },
  { image_url: '/images/gallery_ai_pedicure.png', category: 'Unhas' },
  { image_url: '/images/gallery_ai_skincare.png', category: 'Facial' },
  { image_url: '/images/gallery_ai_eyelashes.png', category: 'Sobrancelhas' }
];

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
      const galleryData = Array.isArray(data) && data.length > 0 ? data : DEFAULT_GALLERY_IMAGES;
      setImages(galleryData.map((img: any) => ({
        url: img.image_url,
        category: img.category || 'All'
      })));
    } catch (error) {
      console.error('Error loading gallery, using fallback:', error);
      setImages(DEFAULT_GALLERY_IMAGES.map((img: any) => ({
        url: img.image_url,
        category: img.category || 'All'
      })));
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

        {/* Gallery Grid */}
        <div id="gallery-grid" className="min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredImages.length > 0 ? (
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
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.4, delay: idx % 12 * 0.05 }}
                    onClick={() => openPreview(idx)}
                    className="relative aspect-square overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-2xl border border-pink-50 dark:border-pink-900/10"
                  >
                    <SafeImage
                      src={img.url}
                      alt={t('gallery.title')}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                        className="bg-white/10 backdrop-blur-xl border border-white/30 px-8 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 pointer-events-none"
                      >
                        <span className="text-sm tracking-[0.1em] font-medium text-white drop-shadow-md">
                          Preview
                        </span>
                        <Maximize2 className="text-white w-4 h-4 opacity-80" />
                      </motion.div>
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
              <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA] mb-2">A galeria está vazia</h3>
              <p className="text-gray-500 dark:text-[#A0A0A0]">Estamos a preparar novas fotos para si. Por favor, volte mais tarde.</p>
            </motion.div>
          )}
        </div>
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
