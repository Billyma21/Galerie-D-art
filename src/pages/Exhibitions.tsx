import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin } from 'lucide-react';

export const Exhibitions = () => {
  const { exhibitions, settings } = useApp();

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <header className="mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-serif mb-4"
        >
          {settings.exhibitionsTitle}
        </motion.h1>
        <p className="text-muted uppercase tracking-[0.3em] text-xs">{settings.exhibitionsSubtitle}</p>
      </header>

      <div className="space-y-32">
        {exhibitions.map((exhibition, index) => (
          <motion.div 
            key={exhibition.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}
          >
            <div className="flex-1 w-full aspect-[16/9] bg-accent overflow-hidden">
              {exhibition.imageUrl && (
                <img 
                  src={exhibition.imageUrl} 
                  alt={exhibition.title} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            <div className="flex-1 max-w-xl">
              <div className="flex items-center gap-4 mb-6">
                <span className={`px-3 py-1 text-[10px] uppercase tracking-widest ${exhibition.isPast ? 'bg-ink/5 text-muted' : 'bg-ink text-bg'}`}>
                  {exhibition.isPast ? 'Passée' : 'À venir'}
                </span>
              </div>
              <h2 className="text-4xl font-serif mb-6">{exhibition.title}</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-muted">
                  <Calendar size={16} />
                  <span className="text-sm uppercase tracking-widest">{exhibition.date}</span>
                </div>
                <div className="flex items-center gap-3 text-muted">
                  <MapPin size={16} />
                  <span className="text-sm uppercase tracking-widest">{exhibition.location}</span>
                </div>
              </div>
              <p className="text-muted leading-relaxed mb-8">
                {exhibition.description}
              </p>
              {!exhibition.isPast && (
                <button className="border-b border-ink pb-1 text-[10px] uppercase tracking-widest hover:opacity-50 transition-opacity">
                  S'inscrire au vernissage
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
