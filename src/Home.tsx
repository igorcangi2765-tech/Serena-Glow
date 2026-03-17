import React from 'react';
import { useLanguage } from './LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
<<<<<<< HEAD
import { Star, Users, Sparkles, Award, ArrowRight, CheckCircle2, ChevronDown, Scissors, Hand, Flower2, Brush, Feather } from 'lucide-react';
=======
import { Star, Users, Sparkles, Award, ArrowRight, CheckCircle2, ChevronDown, Scissors, Hand, HandHeart, Brush, ScanFace } from 'lucide-react';
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e

export const Home: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "20+", label: t.stats.clients },
    { icon: <Sparkles className="w-6 h-6" />, value: "15+", label: t.stats.treatments },
    { icon: <Award className="w-6 h-6" />, value: "10+", label: t.stats.specialists },
    { icon: <Star className="w-6 h-6" />, value: "4.9", label: t.stats.rating },
  ];

  const services = [
<<<<<<< HEAD
    { title: t.services.facial.title, desc: t.services.facial.desc, icon: <Sparkles className="w-7 h-7 text-pink-500" /> },
    { title: t.services.nails.title, desc: t.services.nails.desc, icon: <Hand className="w-7 h-7 text-pink-500" /> },
    { title: t.services.massage.title, desc: t.services.massage.desc, icon: <Flower2 className="w-7 h-7 text-pink-500" /> },
    { title: t.services.makeup.title, desc: t.services.makeup.desc, icon: <Brush className="w-7 h-7 text-pink-500" /> },
    { title: t.services.waxing.title, desc: t.services.waxing.desc, icon: <Feather className="w-7 h-7 text-pink-500" /> },
=======
    { title: t.services.facial.title, desc: t.services.facial.desc, icon: <ScanFace className="w-7 h-7 text-pink-500" /> },
    { title: t.services.hair.title, desc: t.services.hair.desc, icon: <Scissors className="w-7 h-7 text-pink-500" /> },
    { title: t.services.nails.title, desc: t.services.nails.desc, icon: <Hand className="w-7 h-7 text-pink-500" /> },
    { title: t.services.massage.title, desc: t.services.massage.desc, icon: <HandHeart className="w-7 h-7 text-pink-500" /> },
    { title: t.services.makeup.title, desc: t.services.makeup.desc, icon: <Brush className="w-7 h-7 text-pink-500" /> },
    { title: t.services.waxing.title, desc: t.services.waxing.desc, icon: <Sparkles className="w-7 h-7 text-pink-500" /> },
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
  ];

  const team = t.team.members.map((member, index) => ({
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

<<<<<<< HEAD
  const testimonials = t.testimonials.list.map((testimonial, index) => ({
    ...testimonial,
    rating: 5,
    img: `https://picsum.photos/seed/client${index + 1}/100/100`
  }));
=======
  const testimonials = [
    { name: "Joana M.", text: "A melhor experiência de spa que já tive. O ambiente é incrivelmente relaxante.", rating: 5, img: "https://picsum.photos/seed/client1/100/100" },
    { name: "Catarina P.", text: "Profissionais de excelência. O meu cabelo nunca esteve tão bonito!", rating: 5, img: "https://picsum.photos/seed/client2/100/100" },
    { name: "Beatriz L.", text: "Recomendo vivamente a massagem de relaxamento. Saí de lá renovada.", rating: 5, img: "https://picsum.photos/seed/client3/100/100" },
  ];
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e

  const packages = t.pricing.packages;

  const faqs = t.faq.list;

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
          <div className="absolute inset-0 bg-gradient-to-t from-pink-50 via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-serif font-semibold text-white mb-6 leading-tight tracking-wide"
          >
            Realce a Sua <br className="hidden md:block" /> Beleza Natural
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-base md:text-lg text-white/90 mb-8 font-sans leading-relaxed text-center max-w-2xl mx-auto"
          >
            {t.hero.subheadline}
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
              {t.hero.primaryBtn}
            </Link>
            <Link 
              to="/services" 
              className="rounded-full border border-pink-400 text-white hover:bg-pink-50/20 px-8 py-4 transition font-medium tracking-wide w-full sm:w-auto text-center backdrop-blur-sm"
            >
              {t.hero.secondaryBtn}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-semibold text-gray-800 mb-2">{stat.value}</h3>
                <p className="text-sm text-gray-600 uppercase tracking-wider font-sans">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4 tracking-wide">{t.servicesPreview.title}</h2>
<<<<<<< HEAD
            <p className="text-gray-600 max-w-2xl mx-auto mb-6 text-sm md:text-base">{t.services.intro}</p>
=======
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
            <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 group cursor-pointer border border-pink-100">
                <div className="flex justify-start mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6 line-clamp-2 font-sans leading-relaxed">{service.desc}</p>
                <Link to="/services" className="inline-flex items-center text-pink-600 font-medium text-sm uppercase tracking-wider group-hover:text-pink-500 transition-colors">
                  {t.servicesPreview.learnMore} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4 tracking-wide">{t.team.title}</h2>
            <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="group text-center">
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/5] shadow-md border border-pink-100">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-800 mb-1">{member.name}</h3>
                <p className="text-pink-600 font-medium text-sm uppercase tracking-wider mb-2">{member.role}</p>
<<<<<<< HEAD
                <p className="text-gray-600 text-sm font-sans leading-relaxed">{member.desc}</p>
=======
                <div className="flex justify-center text-pink-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4 tracking-wide">{t.galleryPreview.title}</h2>
<<<<<<< HEAD
              <p className="text-gray-600 mb-6 text-sm md:text-base">{t.gallery.intro}</p>
=======
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
              <div className="w-24 h-1 bg-pink-400 rounded-full" />
            </div>
            <Link to="/gallery" className="inline-flex items-center text-gray-700 font-medium text-sm uppercase tracking-wider hover:text-pink-600 transition-colors">
              {t.galleryPreview.viewAll} <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.slice(0, 6).map((img, idx) => (
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4 tracking-wide">Resultados Visíveis</h2>
<<<<<<< HEAD
            <p className="text-gray-600 max-w-2xl mx-auto mb-6 text-sm md:text-base">{t.galleryPage.resultsDesc}</p>
=======
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
            <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
<<<<<<< HEAD
              { title: "Tratamento Facial", desc: "Antes e depois de cuidados de pele.", img: "https://picsum.photos/seed/beforeafter1/400/500" },
              { title: "Manicure com Gel", desc: "Unhas resistentes e bonitas.", img: "https://picsum.photos/seed/beforeafter2/400/500" },
              { title: "Pedicure Completo", desc: "Pés hidratados e relaxados.", img: "https://picsum.photos/seed/beforeafter3/400/500" },
=======
              { title: "Tratamento Facial Anti-Aging", img: "https://picsum.photos/seed/beforeafter1/400/500" },
              { title: "Coloração e Styling", img: "https://picsum.photos/seed/beforeafter2/400/500" },
              { title: "Design de Sobrancelhas", img: "https://picsum.photos/seed/beforeafter3/400/500" },
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-pink-50">
                <div className="relative h-64">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-800">
                    Antes / Depois
                  </div>
                </div>
                <div className="p-6 text-center">
<<<<<<< HEAD
                  <h3 className="text-lg font-serif font-medium text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm font-sans">{item.desc}</p>
=======
                  <h3 className="text-lg font-serif font-medium text-gray-800">{item.title}</h3>
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4 tracking-wide">{t.testimonials.title}</h2>
            <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-pink-50 p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 relative border border-pink-100">
                <div className="absolute -top-6 left-8">
                  <img 
                    src={testimonial.img} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-md"
                    referrerPolicy="no-referrer"
                  />
                </div>
<<<<<<< HEAD
                <div className="flex text-pink-400 mb-4 mt-8">
                  {/* Rating removed as per request */}
=======
                <div className="flex text-pink-400 mb-4 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
                </div>
                <p className="text-gray-700 italic mb-6 font-sans leading-relaxed">"{testimonial.text}"</p>
                <p className="font-serif font-medium text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-24 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4 tracking-wide">{t.pricing.title}</h2>
            <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full" />
          </div>
          
<<<<<<< HEAD
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
=======
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
            {packages.map((pkg, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-2xl p-8 relative transition duration-300 hover:-translate-y-1 flex flex-col justify-between h-full ${
                  pkg.popular 
                    ? 'shadow-xl border-2 border-pink-400 md:-translate-y-4 z-10' 
                    : 'shadow-md border border-pink-100'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    Mais Popular
                  </div>
                )}
<<<<<<< HEAD
                <div>
                  <h3 className="text-2xl font-serif font-medium text-gray-800 mb-2 text-center">{pkg.name}</h3>
                  <div className="text-center mb-8">
                    <span className="text-4xl font-bold text-gray-900 font-serif">{pkg.price}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 font-sans">
                        <CheckCircle2 className="w-5 h-5 text-pink-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
=======
                <h3 className="text-2xl font-serif font-medium text-gray-800 mb-2 text-center">{pkg.name}</h3>
                <div className="text-center mb-8">
                  <span className="text-4xl font-bold text-gray-900 font-serif">{pkg.price}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600 font-sans">
                      <CheckCircle2 className="w-5 h-5 text-pink-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
                <Link 
                  to="/booking" 
                  className={`block w-full text-center px-6 py-3 rounded-full font-medium tracking-wide transition shadow-md hover:shadow-lg ${
                    pkg.popular 
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white' 
                      : 'border border-pink-400 text-pink-600 hover:bg-pink-50'
                  }`}
                >
                  {t.pricing.book}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4 tracking-wide">{t.faq.title}</h2>
            <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full" />
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-pink-50 rounded-2xl overflow-hidden border border-pink-100">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-gray-800 font-sans">
                  <span>{faq.q}</span>
                  <span className="transition group-open:rotate-180">
                    <ChevronDown className="w-5 h-5 text-pink-500" />
                  </span>
                </summary>
                <div className="text-gray-600 px-6 pb-6 animate-fadeIn font-sans leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-50 z-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-8 leading-tight tracking-wide">
            {t.cta.headline}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/booking" 
              className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 shadow-md hover:shadow-lg transition font-medium tracking-wide w-full sm:w-auto text-center"
            >
              {t.cta.book}
            </Link>
            <Link 
              to="/contact" 
              className="rounded-full border border-pink-400 text-pink-600 hover:bg-pink-50 px-8 py-4 transition font-medium tracking-wide w-full sm:w-auto text-center bg-white"
            >
              {t.cta.contact}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
