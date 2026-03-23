import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Home = () => {
  const { works, settings } = useApp();
  const featuredWorks = works.slice(0, 3);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="h-[90vh] relative overflow-hidden flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={settings.heroImageUrl} 
            alt="Atelier" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="relative z-10 text-center max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-6xl md:text-8xl font-serif mb-8 leading-tight"
          >
            {settings.heroTitle.split(' ').map((word, i) => (
              <React.Fragment key={i}>
                {i === settings.heroTitle.split(' ').length - 1 ? <span className="italic">{word}</span> : word + ' '}
                {i === 1 && <br />}
              </React.Fragment>
            ))}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-muted tracking-[0.3em] uppercase text-sm mb-12"
          >
            {settings.heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <Link 
              to="/gallery" 
              className="inline-flex items-center space-x-4 border border-ink px-10 py-4 hover:bg-ink hover:text-bg transition-all duration-500 group"
            >
              <span className="uppercase tracking-widest text-xs">Explorer la Galerie</span>
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-20">
          <div>
            <h2 className="text-4xl font-serif mb-4">Sélection</h2>
            <p className="text-muted uppercase tracking-widest text-xs">Œuvres récentes</p>
          </div>
          <Link to="/gallery" className="text-xs uppercase tracking-widest border-b border-ink pb-1 hover:opacity-50 transition-opacity">
            Voir tout
          </Link>
        </div>

        <div className="museum-grid">
          {featuredWorks.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="group cursor-pointer"
            >
              <Link to={`/work/${work.id}`}>
                <div className="aspect-[3/4] overflow-hidden mb-6 bg-accent">
                  <img 
                    src={work.imageUrl} 
                    alt={work.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-xl font-serif mb-1">{work.title}</h3>
                <p className="text-muted text-xs uppercase tracking-widest">{work.year} — {work.technique}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Artist Quote */}
      <section className="py-40 bg-accent px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl md:text-4xl font-serif italic leading-relaxed mb-12"
          >
            "{settings.aboutQuote}"
          </motion.p>
          <div className="w-12 h-px bg-ink mx-auto mb-8"></div>
          <p className="uppercase tracking-[0.4em] text-xs">{settings.siteTitle}</p>
        </div>
      </section>
    </div>
  );
};
