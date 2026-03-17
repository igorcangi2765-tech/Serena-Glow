import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { Clock, ArrowRight, Sparkles, Scissors, Hand, Flower2, Brush, Feather } from 'lucide-react';
=======
import { Clock, ArrowRight, ScanFace, Scissors, Hand, HandHeart, Brush, Sparkles } from 'lucide-react';
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e

export const Services: React.FC = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { id: 'All', label: t.services.categories.all },
    { id: 'Facial', label: t.services.categories.facial },
<<<<<<< HEAD
=======
    { id: 'Cabelo', label: t.services.categories.hair },
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
    { id: 'Unhas', label: t.services.categories.nails },
    { id: 'Massagem', label: t.services.categories.massage },
    { id: 'Maquilhagem', label: t.services.categories.makeup },
    { id: 'Depilação', label: t.services.categories.waxing },
  ];

  const servicesList = t.services.list;

  const getIconForCategory = (category: string) => {
    switch (category) {
<<<<<<< HEAD
      case 'Facial': return <Sparkles className="w-7 h-7 text-pink-500 mb-4" />;
      case 'Cabelo': return <Scissors className="w-7 h-7 text-pink-500 mb-4" />;
      case 'Unhas': return <Hand className="w-7 h-7 text-pink-500 mb-4" />;
      case 'Massagem': return <Flower2 className="w-7 h-7 text-pink-500 mb-4" />;
      case 'Maquilhagem': return <Brush className="w-7 h-7 text-pink-500 mb-4" />;
      case 'Depilação': return <Feather className="w-7 h-7 text-pink-500 mb-4" />;
=======
      case 'Facial': return <ScanFace className="w-7 h-7 text-pink-500 mb-4" />;
      case 'Cabelo': return <Scissors className="w-7 h-7 text-pink-500 mb-4" />;
      case 'Unhas': return <Hand className="w-7 h-7 text-pink-500 mb-4" />;
      case 'Massagem': return <HandHeart className="w-7 h-7 text-pink-500 mb-4" />;
      case 'Maquilhagem': return <Brush className="w-7 h-7 text-pink-500 mb-4" />;
      case 'Depilação': return <Sparkles className="w-7 h-7 text-pink-500 mb-4" />;
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
      default: return null;
    }
  };

  const filteredServices = activeCategory === 'All' 
    ? servicesList 
    : servicesList.filter(s => s.category === activeCategory);

  return (
    <div className="pt-24 w-full bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
<<<<<<< HEAD
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-gray-800 mb-4 tracking-wide">{t.services.title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6 text-lg">{t.services.intro}</p>
=======
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-gray-800 mb-6 tracking-wide">{t.services.title}</h1>
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
          <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full mb-12" />
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wider transition-colors ${
                  activeCategory === cat.id 
                    ? 'bg-pink-500 text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-pink-50 border border-pink-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map(service => (
            <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col border border-pink-50">
              <div className="h-64 overflow-hidden">
                <img 
                  src={service.img} 
                  alt={service.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex flex-col items-center text-center mb-4">
                  {getIconForCategory(service.category)}
                  <h3 className="text-2xl font-serif text-gray-800">{service.name}</h3>
                  <span className="text-xl font-semibold text-pink-600 mt-2">{service.price}</span>
                </div>
                <p className="text-gray-600 font-sans mb-6 flex-grow leading-relaxed text-center">{service.desc}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-pink-400 mb-8 uppercase tracking-wider font-medium">
                  <Clock className="w-4 h-4" />
                  {service.duration}
                </div>
                <Link 
                  to={`/booking?service=${encodeURIComponent(service.name)}`}
                  className="w-full inline-flex justify-center items-center bg-pink-50 text-pink-600 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-pink-500 hover:text-white transition-colors group border border-pink-100"
                >
                  {t.services.book}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
