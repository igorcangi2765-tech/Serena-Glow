import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/LanguageContext';
import { Shield, ArrowLeft, ArrowRight } from 'lucide-react';

export const PrivacyPolicy = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-32 pb-20 bg-neutral-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-pink-600 mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            {t('privacyPolicy.title')}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {t('privacyPolicy.intro')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-pink-100/50 space-y-12">
          {t('privacyPolicy.sections').map((section: any, index: number) => (
            <div key={index} className="space-y-4">
              <h2 className="text-2xl font-serif font-semibold text-gray-900">
                {section.title}
              </h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-pink-500 hover:text-pink-600 hover:underline transition-all font-medium group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {t('privacyPolicy.nav.back')}
          </Link>
          <Link
            to="/terms"
            className="flex items-center gap-2 text-pink-500 hover:text-pink-600 hover:underline transition-all font-medium group"
          >
            {t('privacyPolicy.nav.next')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
