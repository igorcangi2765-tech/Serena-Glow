import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SafeImage } from '../components/common/SafeImage';

export const About: React.FC = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const teamMembers = Array.isArray(t('team.members')) ? t('team.members') : [];
  const valuesList = Array.isArray(t('about.values.list')) ? t('about.values.list') : [];

  const valueIcons = [
    <Target className="w-8 h-8 text-pink-500" />,
    <Eye className="w-8 h-8 text-pink-500" />,
    <Heart className="w-8 h-8 text-pink-500" />
  ];



  return (
    <div className="w-full bg-neutral-50 dark:bg-[#121212] min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-white dark:bg-black">
          <SafeImage
            src="/images/about_hero.png"
            alt="Serena Glow About"
            className="w-full h-full object-cover opacity-100 dark:opacity-70"
            style={{ objectPosition: 'center center' }}
          />
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
        </div>

        <div className="relative z-10 mx-auto px-4 text-center" style={{ maxWidth: '896px' }}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6 tracking-wide drop-shadow-lg"
          >
            {t('about.title') && t('about.title').includes('|') ? (
              <>
                {t('about.title').split('|')[0]}
                <span className="block mt-2 text-white">{t('about.title').split('|')[1]}</span>
              </>
            ) : (
              t('about.title')
            )}
          </motion.h1>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="py-24 bg-white dark:bg-[#1E1E1E]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full" style={{ maxWidth: '1280px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="w-full" style={{ minWidth: '300px', flexShrink: 0 }}>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA] mb-6 tracking-wide">
                {language === 'pt' ? 'A Nossa História' : 'Our Story'}
              </h2>
              <p className="text-gray-600 dark:text-[#A0A0A0] leading-relaxed text-base md:text-lg font-sans leading-relaxed">
                {t('about.mission')}
              </p>
            </div>
            <div className="relative w-full" style={{ minWidth: '300px', flexShrink: 0 }}>
              <SafeImage
                src="/images/about_story.png"
                alt="Salon Details"
                className="rounded-xl shadow-lg w-full object-cover aspect-[3/4]"
              />
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-pink-100 dark:bg-pink-900/20 rounded-full -z-10" />
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-pink-200/40 dark:bg-pink-900/10 rounded-full -z-10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-pink-50 dark:bg-[#121212]">
        <div className="mx-auto px-6 w-full" style={{ maxWidth: '1200px' }}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA] mb-4 tracking-wide">{t('about.values.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {valuesList.map((val: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(244, 63, 94, 0.1)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="bg-white dark:bg-[#1E1E1E] px-8 py-7 rounded-2xl text-center shadow-md border border-pink-100 dark:border-[#2E2E2E] group transition-all duration-300 w-full"
                style={{ minWidth: '260px', maxWidth: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', flexShrink: 0, margin: '0 auto' }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 dark:bg-pink-900/30 mb-3 group-hover:bg-pink-500 transition-colors duration-300">
                  <div className="group-hover:text-white transition-colors duration-300">
                    {React.cloneElement(valueIcons[idx] as React.ReactElement, {
                      className: `${(valueIcons[idx] as React.ReactElement).props.className} group-hover:text-white`
                    })}
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA] mt-0 mb-2">{val.title}</h3>
                <p className="text-gray-600 dark:text-[#A0A0A0] font-sans leading-relaxed text-center text-base md:text-lg max-w-[310px] mx-auto">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-24 bg-white dark:bg-[#1E1E1E]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full" style={{ maxWidth: '1280px' }}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA] mb-4 tracking-wide">{t('team.title')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {teamMembers.map((member: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group text-center"
              >
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/5] shadow-md border border-pink-100 dark:border-[#2E2E2E]">
                  <SafeImage
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-in-out"
                  />
                  <div className="absolute inset-0 transition-opacity duration-300" />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA] mb-1">{member.name}</h3>
                <p className="text-pink-600 dark:text-pink-400 font-bold uppercase tracking-wider text-[10px] md:text-xs font-sans mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-[#A0A0A0] text-[15px] font-sans leading-relaxed max-w-[260px] mx-auto">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Standardized CTA Section */}
      <section className="py-12 md:py-24 relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-50 dark:from-[#1a0a10] dark:via-[#1a0a10] dark:to-[#121212] border-y border-pink-100 dark:border-pink-900/30">
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 dark:text-[#EAEAEA] mb-8 leading-tight tracking-wide">
            {t('cta.headline') && t('cta.headline').includes('|') ? (
              <>
                {t('cta.headline').split('|')[0]}
                <span className="block mt-2">{t('cta.headline').split('|')[1]}</span>
              </>
            ) : (
              t('cta.headline')
            )}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/booking"
              className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-10 py-4 shadow-md hover:shadow-lg transition-all duration-300 font-medium tracking-wide w-full sm:w-auto text-center"
            >
              {t('cta.book')}
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-pink-400 text-pink-600 dark:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-900/30 px-10 py-4 transition-all duration-300 font-medium tracking-wide w-full sm:w-auto text-center bg-white dark:bg-[#1E1E1E]/50 shadow-sm backdrop-blur-sm"
            >
              {t('cta.contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
