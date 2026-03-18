import React, { useState } from 'react';
import { useLanguage } from '@/LanguageContext';

export const Gallery: React.FC = () => {
  const { t } = useLanguage();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const categories = Array.isArray(t('galleryPage.categories')) ? t('galleryPage.categories') : [];
  const images = Array.isArray(t('galleryPage.images')) ? t('galleryPage.images') : [];

  const filteredImages = (activeCategoryIndex === 0 
    ? images 
    : images.filter((img: any) => img.category === categories[activeCategoryIndex])).slice(0, 6);

  return (
    <div className="pt-24 w-full bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-gray-800 mb-4 tracking-wide">{t('gallery.title')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6 text-lg">{t('gallery.intro')}</p>
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveCategoryIndex(idx)}
                className={`px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wider transition-colors ${
                  activeCategoryIndex === idx 
                    ? 'bg-pink-500 text-white shadow-md' 
                    : 'bg-pink-50 text-gray-600 hover:bg-pink-100 border border-pink-100'
                }`}
              >
                {idx === 0 ? t('gallery.all') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Uniform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img: any) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300">
              <img 
                src={img.url} 
                alt={`Gallery ${img.category}`} 
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-pink-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-serif text-2xl tracking-wider">{img.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
