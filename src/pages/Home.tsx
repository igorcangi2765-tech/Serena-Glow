import React from 'react';
import { useLanguage } from '@/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Users, Sparkles, Award, ArrowRight, CheckCircle2, ChevronDown, Scissors, Hand, HeartHandshake, Brush, Feather, Eye, UserCheck, Footprints, Smile, Palette, Coffee, Flower2, Droplet } from 'lucide-react';

export const Home: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "20+", label: t('stats.clients') },
    { icon: <Sparkles className="w-6 h-6" />, value: "15+", label: t('stats.treatments') },
    { icon: <UserCheck className="w-6 h-6" />, value: "3+", label: t('stats.specialists') },
    { icon: <Star className="w-6 h-6" />, value: "4.9", label: t('stats.rating') },
  ];

  const services = [
    { title: t('services.facial.title'), desc: t('services.facial.desc'), icon: <Smile className="w-5 h-5 text-pink-500" /> },
    { title: t('services.nails.title'), desc: t('services.nails.desc'), icon: <Hand className="w-5 h-5 text-pink-500" /> },
    { title: t('services.massage.title'), desc: t('services.massage.desc'), icon: <Flower2 className="w-5 h-5 text-pink-500" /> },
    { title: t('services.makeup.title'), desc: t('services.makeup.desc'), icon: <Palette className="w-5 h-5 text-pink-500" /> },
    { title: t('services.waxing.title'), desc: t('services.waxing.desc'), icon: <Droplet className="w-5 h-5 text-pink-500" /> },
    { title: t('services.eyebrows.title'), desc: t('services.eyebrows.desc'), icon: <Eye className="w-5 h-5 text-pink-500" /> },
  ];

  const team = t('team.members').map((member: any, index: number) => ({
    ...member,
    img: `https://picsum.photos/seed/stylist${index + 1}/400/500`
  }));

  const gallery = [
    "https://picsum.photos/seed/facial/600/800",
    "https://picsum.photos/seed/massage/800/600",
    "https://picsum.photos/seed/manicure/600/600",
    "https://picsum.photos/seed/hairstyle/800/800",
    "https://picsum.photos/seed/salon/600/400",
  ];

  const testimonials = t('testimonials.list').map((testimonial: any, index: number) => ({
    ...testimonial,
    rating: 5,
    img: `https://picsum.photos/seed/client${index + 1}/100/100`
  }));

  const packages = t('pricing.packages');
  const faqs = t('faq.list');

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/luxury-spa/1920/1080?blur=2"
            alt="Luxury Spa"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-pink-900/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-50 via-transparent to-transparent dark:from-[#121212]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-serif font-semibold text-white mb-6 leading-tight tracking-wide whitespace-pre-line"
          >
            {t('hero.headline')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-base md:text-lg text-white/90 mb-8 font-sans leading-relaxed text-center max-w-2xl mx-auto"
          >
            {t('hero.subheadline')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/booking"
              className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 shadow-md hover:shadow-lg transition font-medium tracking-wide w-full sm:w-auto text-center"
            >
              {t('hero.primaryBtn')}
            </Link>
            <Link
              to="/services"
              className="rounded-full border border-pink-400 text-white hover:bg-pink-50/20 px-8 py-4 transition font-medium tracking-wide w-full sm:w-auto text-center backdrop-blur-sm"
            >
              {t('hero.secondaryBtn')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-20 bg-white dark:bg-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat: any, idx: number) => (
              <div key={idx} className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-6 group-hover:bg-pink-200 dark:group-hover:bg-pink-900/60 transition-colors duration-300">
                  {stat.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-semibold text-gray-800 dark:text-[#EAEAEA] mb-2">{stat.value}</h3>
                <p className="text-gray-900 dark:text-[#A0A0A0] font-medium tracking-wide font-sans">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-12 md:py-24 bg-pink-50 dark:bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-[#EAEAEA] mb-4 tracking-wide">{t('servicesPreview.title')}</h2>
            <p className="text-gray-600 dark:text-[#A0A0A0] max-w-2xl mx-auto mb-6 text-sm md:text-base">{t('services.intro')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service: any, idx: number) => (
              <div key={idx} className="bg-white dark:bg-[#1E1E1E] p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 group cursor-pointer border border-pink-100 dark:border-[#2E2E2E]">
                <div className="flex justify-start mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-800 dark:text-[#EAEAEA] mb-3">{service.title}</h3>
                <p className="text-gray-600 dark:text-[#A0A0A0] mb-6 line-clamp-2 font-sans leading-relaxed">{service.desc}</p>
                <Link to="/services" className="inline-flex items-center text-pink-600 dark:text-pink-400 font-medium text-sm uppercase tracking-wider group-hover:text-pink-500 transition-colors">
                  {t('servicesPreview.learnMore')} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-24 bg-white dark:bg-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-[#EAEAEA] mb-4 tracking-wide">{t('team.title')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member: any, idx: number) => (
              <div key={idx} className="group text-center">
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-square sm:aspect-[4/5] shadow-md border border-pink-100 dark:border-[#2E2E2E]">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-800 dark:text-[#EAEAEA] mb-1">{member.name}</h3>
                <p className="text-pink-600 dark:text-pink-400 font-medium text-sm uppercase tracking-wider mb-2">{member.role}</p>
                <p className="text-gray-600 dark:text-[#A0A0A0] text-sm font-sans leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-12 md:py-24 bg-pink-50 dark:bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-[#EAEAEA] mb-4 tracking-wide">{t('galleryPreview.title')}</h2>
              <p className="text-gray-600 dark:text-[#A0A0A0] mb-6 text-sm md:text-base">{t('gallery.intro')}</p>
            </div>
            <Link to="/gallery" className="inline-flex items-center text-gray-700 dark:text-[#A0A0A0] font-medium text-sm uppercase tracking-wider hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
              {t('galleryPreview.viewAll')} <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.slice(0, 6).map((img: string, idx: number) => (
              <div
                key={idx}
                className="relative overflow-hidden group shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <img
                  src={img}
                  alt={`Gallery image ${idx + 1}`}
                  className="w-full h-64 object-cover rounded-xl group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After Results */}
      <section className="py-12 md:py-24 bg-white dark:bg-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-[#EAEAEA] mb-4 tracking-wide">{t('galleryPage.resultsTitle')}</h2>
            <p className="text-gray-600 dark:text-[#A0A0A0] max-w-2xl mx-auto mb-6 text-sm md:text-base">{t('galleryPage.resultsDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: t('services.facial.title'), desc: t('services.facial.desc'), img: "https://picsum.photos/seed/beforeafter1/400/500" },
              { title: t('services.nails.title'), desc: t('services.nails.desc'), img: "https://picsum.photos/seed/beforeafter2/400/500" },
              { title: t('services.nails.title'), desc: t('services.nails.desc'), img: "https://picsum.photos/seed/beforeafter3/400/500" },
            ].map((item: any, idx: number) => (
              <div key={idx} className="bg-white dark:bg-[#121212] rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-pink-50 dark:border-[#2E2E2E]">
                <div className="relative h-64">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#EAEAEA]">
                    Antes / Depois
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-serif font-medium text-gray-800 dark:text-[#EAEAEA] mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-[#A0A0A0] text-sm font-sans">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-24 bg-white dark:bg-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-[#EAEAEA] mb-4 tracking-wide">{t('testimonials.title')}</h2>
            <p className="text-gray-600 dark:text-[#A0A0A0] max-w-2xl mx-auto mb-6 text-base md:text-lg">{t('testimonials.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial: any, idx: number) => (
              <div key={idx} className="bg-white dark:bg-[#121212] p-8 rounded-2xl shadow-md hover:shadow-lg transition duration-300 border border-pink-50 dark:border-[#2E2E2E] flex flex-col h-full group">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.img}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-pink-500 object-cover shadow-sm transition-transform duration-300 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex text-pink-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 dark:text-[#A0A0A0] mb-6 font-sans leading-relaxed flex-grow">"{testimonial.text}"</p>
                <div className="w-full h-px bg-pink-500/30 mt-4 mb-3"></div>
                <div>
                  <p className="font-serif font-medium text-gray-900 dark:text-[#EAEAEA] tracking-wide text-lg">{testimonial.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-12 md:py-24 bg-pink-50 dark:bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-[#EAEAEA] mb-4 tracking-wide">{t('pricing.title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg: any, idx: number) => (
              <div
                key={idx}
                className={`bg-white dark:bg-[#1E1E1E] rounded-2xl p-8 relative transition duration-300 hover:-translate-y-1 flex flex-col justify-between h-full ${
                  pkg.popular
                    ? 'shadow-xl border-2 border-pink-400 md:-translate-y-4 z-10'
                    : 'shadow-md border border-pink-100 dark:border-[#2E2E2E]'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    Mais Popular
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-serif font-medium text-gray-800 dark:text-[#EAEAEA] mb-2 text-center">{pkg.name}</h3>
                  <div className="text-center mb-8">
                    <span className="text-4xl font-bold text-gray-900 dark:text-[#EAEAEA] font-serif">{pkg.price}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-[#A0A0A0] font-sans">
                        <CheckCircle2 className="w-5 h-5 text-pink-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to="/booking"
                  className={`block w-full text-center px-6 py-3 rounded-full font-medium tracking-wide transition shadow-md hover:shadow-lg ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                      : 'border border-pink-400 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20'
                  }`}
                >
                  {t('pricing.book')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-24 bg-white dark:bg-[#1E1E1E]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-[#EAEAEA] mb-4 tracking-wide">{t('faq.title')}</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq: any, idx: number) => (
              <details key={idx} className="group bg-pink-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-pink-100 dark:border-[#2E2E2E]">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-gray-800 dark:text-[#EAEAEA] font-sans">
                  <span>{faq.q}</span>
                  <span className="transition group-open:rotate-180">
                    <ChevronDown className="w-5 h-5 text-pink-500" />
                  </span>
                </summary>
                <div className="text-gray-600 dark:text-[#A0A0A0] px-6 pb-6 animate-fadeIn font-sans leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-50 dark:from-[#1a0a10] dark:to-[#121212] z-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900 dark:text-[#EAEAEA] mb-8 leading-tight tracking-wide">
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
              className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 shadow-md hover:shadow-lg transition font-medium tracking-wide w-full sm:w-auto text-center"
            >
              {t('cta.book')}
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-pink-400 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 px-8 py-4 transition font-medium tracking-wide w-full sm:w-auto text-center bg-white dark:bg-transparent"
            >
              {t('cta.contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
