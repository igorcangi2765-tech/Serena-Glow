import React from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { useLanguage } from '../LanguageContext';
=======
import { useLanguage } from '@/LanguageContext';
>>>>>>> 332da6d68128f8c278108ab8b74d0d402204cecc
import { FileText, ArrowLeft, ArrowRight } from 'lucide-react';

export const TermsOfService = () => {
  const { t } = useLanguage();

  return (
<<<<<<< HEAD
    <div className="pt-32 pb-20 bg-neutral-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-pink-600 mb-6">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            {t('termsOfService.title')}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
=======
    <div className="pt-32 pb-20 bg-neutral-50 dark:bg-[#121212] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 mb-6">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-[#EAEAEA] mb-6">
            {t('termsOfService.title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-[#A0A0A0] leading-relaxed max-w-2xl mx-auto">
>>>>>>> 332da6d68128f8c278108ab8b74d0d402204cecc
            {t('termsOfService.intro')}
          </p>
        </div>

<<<<<<< HEAD
        {/* Content */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-pink-100/50 space-y-12">
          {t('termsOfService.sections').map((section: any, index: number) => (
            <div key={index} className="space-y-4">
              <h2 className="text-2xl font-serif font-semibold text-gray-900">
                {section.title}
              </h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
=======
        <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-8 md:p-12 shadow-sm border border-pink-100/50 dark:border-[#2E2E2E] space-y-12">
          {t('termsOfService.sections').map((section: any, index: number) => (
            <div key={index} className="space-y-4">
              <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-[#EAEAEA]">
                {section.title}
              </h2>
              <div className="text-gray-600 dark:text-[#A0A0A0] leading-relaxed whitespace-pre-line text-lg">
>>>>>>> 332da6d68128f8c278108ab8b74d0d402204cecc
                {section.content}
              </div>
            </div>
          ))}
        </div>

<<<<<<< HEAD
        {/* Navigation */}
        <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-6">
          <Link
            to="/privacy"
            className="flex items-center gap-2 text-pink-500 hover:text-pink-600 hover:underline transition-all font-medium group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {t('termsOfService.nav.back')}
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-pink-500 hover:text-pink-600 hover:underline transition-all font-medium group"
          >
=======
        <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-6">
          <Link to="/privacy" className="flex items-center gap-2 text-pink-500 hover:text-pink-600 hover:underline transition-all font-medium group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {t('termsOfService.nav.back')}
          </Link>
          <Link to="/" className="flex items-center gap-2 text-pink-500 hover:text-pink-600 hover:underline transition-all font-medium group">
>>>>>>> 332da6d68128f8c278108ab8b74d0d402204cecc
            {t('termsOfService.nav.next')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
