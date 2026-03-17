import React from 'react';
import { useLanguage } from './LanguageContext';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart } from 'lucide-react';

export const About: React.FC = () => {
  const { t } = useLanguage();

  const values = [
    { icon: <Target className="w-8 h-8 text-pink-500" />, title: t.about.values.list[0].title, desc: t.about.values.list[0].desc },
    { icon: <Eye className="w-8 h-8 text-pink-500" />, title: t.about.values.list[1].title, desc: t.about.values.list[1].desc },
    { icon: <Heart className="w-8 h-8 text-pink-500" />, title: t.about.values.list[2].title, desc: t.about.values.list[2].desc },
  ];

  const team = [
<<<<<<< HEAD
    { name: "Sofia Silva", role: t.team.members[0].role, desc: t.team.members[0].desc, img: "https://picsum.photos/seed/stylist1/400/500" },
    { name: "Elena Costa", role: t.team.members[1].role, desc: t.team.members[1].desc, img: "https://picsum.photos/seed/stylist2/400/500" },
    { name: "Maria Santos", role: t.team.members[2].role, desc: t.team.members[2].desc, img: "https://picsum.photos/seed/stylist3/400/500" },
    { name: "Ana Oliveira", role: t.team.members[3].role, desc: t.team.members[3].desc, img: "https://picsum.photos/seed/stylist4/400/500" },
=======
    { name: "Sofia Silva", role: "Fundadora e Master Stylist", img: "https://picsum.photos/seed/stylist1/400/500" },
    { name: "Elena Costa", role: "Especialista em Pele", img: "https://picsum.photos/seed/stylist2/400/500" },
    { name: "Maria Santos", role: "Terapeuta de Spa", img: "https://picsum.photos/seed/stylist3/400/500" },
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
  ];

  return (
    <div className="pt-24 w-full bg-neutral-50 min-h-screen">
      {/* Hero Banner */}
      <section className="relative py-32 bg-pink-900 text-white text-center">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://picsum.photos/seed/about-hero/1920/600" 
            alt="Salon Interior" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-6 tracking-wide">{t.about.title}</h1>
          <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full" />
        </div>
      </section>

      {/* Story & Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-6 tracking-wide">A Nossa História</h2>
<<<<<<< HEAD
=======
              <p className="text-gray-600 leading-relaxed mb-6 text-base md:text-lg font-sans">
                Fundada em 2015, a Serena Glow Beauty Studio nasceu do sonho de criar um refúgio de paz e beleza no coração da cidade. Acreditamos que a verdadeira beleza vem de dentro e reflete-se quando nos sentimos bem connosco mesmas.
              </p>
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
              <p className="text-gray-600 leading-relaxed text-base md:text-lg font-sans">
                {t.about.mission}
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/salon-story/600/800" 
                alt="Salon Details" 
                className="rounded-xl shadow-lg w-full object-cover aspect-[3/4]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-pink-100 rounded-full -z-10" />
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-pink-200/40 rounded-full -z-10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
<<<<<<< HEAD
      <section className="py-16 bg-pink-50">
=======
      <section className="py-24 bg-pink-50">
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4 tracking-wide">{t.about.values.title}</h2>
            <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full" />
          </div>
<<<<<<< HEAD
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
=======
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
            {values.map((val, idx) => (
              <div key={idx} className="bg-white px-6 py-8 rounded-2xl text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-pink-100">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 mb-4">
                  {React.cloneElement(val.icon as React.ReactElement, { className: "w-8 h-8 text-pink-500" })}
                </div>
                <h3 className="text-2xl font-serif text-gray-800 mt-2 mb-3">{val.title}</h3>
<<<<<<< HEAD
                <p className="text-gray-600 font-sans leading-relaxed mt-2 max-w-sm mx-auto text-center">{val.desc}</p>
=======
                <p className="text-gray-600 font-sans leading-relaxed mt-2 max-w-xs mx-auto text-center">{val.desc}</p>
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4 tracking-wide">{t.team.title}</h2>
            <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full" />
          </div>
<<<<<<< HEAD
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
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
                <h3 className="text-2xl font-serif text-gray-800 mb-2">{member.name}</h3>
                <p className="text-pink-600 font-medium uppercase tracking-wider text-sm font-sans mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm font-sans leading-relaxed max-w-xs mx-auto">{member.desc}</p>
=======
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, idx) => (
              <div key={idx} className="group text-center">
                <div className="overflow-hidden rounded-full mb-6 mx-auto w-64 h-64 border-4 border-pink-100 shadow-lg">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-2xl font-serif text-gray-800 mb-2">{member.name}</h3>
                <p className="text-pink-600 font-medium uppercase tracking-wider text-sm font-sans">{member.role}</p>
>>>>>>> 4ae222133b02d32fdc17f51ecdaf46e99782fb2e
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-pink-100 to-pink-50 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8 leading-tight tracking-wide">{t.about.cta}</h2>
          <Link 
            to="/booking" 
            className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-10 py-4 shadow-md hover:shadow-lg transition font-medium tracking-wide inline-block"
          >
            {t.nav.bookNow}
          </Link>
        </div>
      </section>
    </div>
  );
};
