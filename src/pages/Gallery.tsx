import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Filter } from 'lucide-react';
import { cn } from '../utils';

export const Gallery = () => {
  const { works, categories: appCategories, settings } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeYear, setActiveYear] = useState('All');

  const categories = useMemo(() => ['All', ...appCategories], [appCategories]);
  const years = useMemo(() => ['All', ...new Set(works.map(w => w.year.toString()))].sort((a, b) => (b as string).localeCompare(a as string)), [works]);

  const filteredWorks = works.filter(work => {
    const categoryMatch = activeCategory === 'All' || work.category === activeCategory;
    const yearMatch = activeYear === 'All' || work.year.toString() === activeYear;
    return categoryMatch && yearMatch;
  });

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <header className="mb-20">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl font-serif mb-4"
        >
          {settings.galleryTitle}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted uppercase tracking-widest text-xs mb-12"
        >
          {settings.gallerySubtitle}
        </motion.p>
        
        <div className="flex flex-wrap gap-12 items-start">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
              <Filter size={12} /> Catégories
            </p>
            <div className="flex flex-wrap gap-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "text-xs uppercase tracking-widest transition-all border-b pb-1",
                    activeCategory === cat ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
                  )}
                >
                  {cat === 'All' ? 'Toutes' : cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
              <Filter size={12} /> Années
            </p>
            <div className="flex flex-wrap gap-6">
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={cn(
                    "text-xs uppercase tracking-widest transition-all border-b pb-1",
                    activeYear === year ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
                  )}
                >
                  {year === 'All' ? 'Toutes' : year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <motion.div 
        layout
        className="museum-grid"
      >
        <AnimatePresence mode='popLayout'>
          {filteredWorks.map((work) => (
            <motion.div
              key={work.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="group"
            >
              <Link to={`/work/${work.id}`}>
                <div className="aspect-[4/5] overflow-hidden mb-6 bg-accent relative">
                  <img 
                    src={work.imageUrl} 
                    alt={work.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {work.status === 'sold' && (
                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 text-[10px] uppercase tracking-widest">
                      Vendu
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-serif">{work.title}</h3>
                    <p className="text-muted text-[10px] uppercase tracking-[0.2em]">{work.technique}</p>
                  </div>
                  <span className="text-muted text-[10px] font-light">{work.year}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredWorks.length === 0 && (
        <div className="py-40 text-center">
          <p className="text-muted font-serif italic text-xl">Aucune œuvre ne correspond à ces critères.</p>
        </div>
      )}
    </div>
  );
};
