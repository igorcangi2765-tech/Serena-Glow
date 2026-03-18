import React from 'react';
import { useLanguage } from '@/LanguageContext';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart } from 'lucide-react';

export const About: React.FC = () => {
  const { t, language } = useLanguage();

  const teamMembers = Array.isArray(t('team.members')) ? t('team.members') : [];
  const valuesList = Array.isArray(t('about.values.list')) ? t('about.values.list') : [];

  const valueIcons = [
    <Target className="w-8 h-8 text-pink-500" />,
    <Eye className="w-8 h-8 text-pink-500" />,
    <Heart className="w-8 h-8 text-pink-500" />
  ];

  const teamImages = [
    "https://picsum.photos/seed/stylist1/400/500",
    "https://picsum.photos/seed/stylist2/400/500",
    "https://picsum.photos/seed/stylist3/400/500",
    "https://picsum.photos/seed/stylist4/400/500"
  ];

  return (
    <div className="pt-24 w-full bg-neutral-50 dark:bg-[#121212] min-h-screen">
      {/* Hero Banner */}
      <section className="relative py-20 md:py-32 bg-pink-900 text-white text-center">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://picsum.photos/seed/about-hero/1920/600"
            alt="Salon Interior"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-6 tracking-wide">
            {t('about.title') && t('about.title').includes('|') ? (
              <>
                {t('about.title').split('|')[0]}
                <span className="block mt-2">{t('about.title').split('|')[1]}</span>
              </>
            ) : (
              t('about.title')
            )}
          </h1>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="py-12 md:py-24 bg-white dark:bg-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-[#EAEAEA] mb-6 tracking-wide">
                {language === 'pt' ? 'A Nossa História' : 'Our Story'}
              </h2>
              <p className="text-gray-600 dark:text-[#A0A0A0] leading-relaxed text-base md:text-lg font-sans">
                {t('about.mission')}
              </p>
            </div>
            <div className="relative">
              <img
                src="https://picsum.photos/seed/salon-story/600/800"
                alt="Salon Details"
                className="rounded-xl shadow-lg w-full object-cover aspect-[3/4]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-pink-100 dark:bg-pink-900/20 rounded-full -z-10" />
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-pink-200/40 dark:bg-pink-900/10 rounded-full -z-10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-16 bg-pink-50 dark:bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-[#EAEAEA] mb-4 tracking-wide">{t('about.values.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valuesList.map((val: any, idx: number) => (
              <div key={idx} className="bg-white dark:bg-[#1E1E1E] px-6 py-8 rounded-2xl text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-pink-100 dark:border-[#2E2E2E]">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 dark:bg-pink-900/30 mb-4">
                  {valueIcons[idx] || <Target className="w-8 h-8 text-pink-500" />}
                </div>
                <h3 className="text-2xl font-serif text-gray-800 dark:text-[#EAEAEA] mt-2 mb-3">{val.title}</h3>
                <p className="text-gray-600 dark:text-[#A0A0A0] font-sans leading-relaxed mt-2 max-w-sm mx-auto text-center">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-12 md:py-24 bg-white dark:bg-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-[#EAEAEA] mb-4 tracking-wide">{t('team.title')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {teamMembers.map((member: any, idx: number) => (
              <div key={idx} className="group text-center">
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/5] shadow-md border border-pink-100 dark:border-[#2E2E2E]">
                  <img
                    src={teamImages[idx] || "https://picsum.photos/seed/staff/400/500"}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-2xl font-serif text-gray-800 dark:text-[#EAEAEA] mb-2">{member.name}</h3>
                <p className="text-pink-600 dark:text-pink-400 font-medium uppercase tracking-wider text-sm font-sans mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-[#A0A0A0] text-sm font-sans leading-relaxed max-w-xs mx-auto">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-24 bg-gradient-to-br from-pink-100 to-pink-50 dark:from-[#1a0a10] dark:to-[#121212] text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900 dark:text-[#EAEAEA] mb-8 leading-tight tracking-wide">
            {t('about.cta') && t('about.cta').includes('|') ? (
              <>
                {t('about.cta').split('|')[0]}
                <span className="block mt-2">{t('about.cta').split('|')[1]}</span>
              </>
            ) : (
              t('about.cta')
            )}
          </h2>
          <Link
            to="/booking"
            className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-10 py-4 shadow-md hover:shadow-lg transition font-medium tracking-wide inline-block w-full md:w-auto text-center"
          >
            {t('nav.bookNow')}
          </Link>
        </div>
      </section>
    </div>
  );
};
