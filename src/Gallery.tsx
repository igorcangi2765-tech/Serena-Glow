import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';

export const Gallery: React.FC = () => {
  const { t } = useLanguage();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const categories = t.galleryPage.categories;
  const images = t.galleryPage.images;

  const filteredImages = activeCategoryIndex === 0 
    ? images 
    : images.filter(img => img.category === categories[activeCategoryIndex]);

  return (
    <div className="pt-24 w-full bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-gray-800 mb-6 tracking-wide">{t.gallery.title}</h1>
          <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full mb-12" />
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategoryIndex(idx)}
                className={`px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wider transition-colors ${
                  activeCategoryIndex === idx 
                    ? 'bg-pink-500 text-white shadow-md' 
                    : 'bg-pink-50 text-gray-600 hover:bg-pink-100 border border-pink-100'
                }`}
              >
                {idx === 0 ? t.gallery.all : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map(img => (
            <div key={img.id} className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300">
              <img 
                src={img.url} 
                alt={`Gallery ${img.category}`} 
                className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
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
