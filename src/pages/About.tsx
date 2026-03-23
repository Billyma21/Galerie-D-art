import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const About = () => {
  const { settings } = useApp();
  
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-serif mb-12">{settings.aboutTitle}</h1>
          <div className="prose prose-lg prose-neutral">
            <p className="text-xl font-serif italic mb-8 leading-relaxed">
              "{settings.aboutQuote}"
            </p>
            <div className="text-muted mb-6 whitespace-pre-wrap">
              {settings.aboutText}
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-12">
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-muted mb-4">Expositions Clés</h3>
              <ul className="text-sm space-y-2 whitespace-pre-line">
                {settings.aboutExhibitions.split('\n').map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-muted mb-4">Distinctions</h3>
              <ul className="text-sm space-y-2 whitespace-pre-line">
                {settings.aboutAwards.split('\n').map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.5 }}
          className="aspect-[4/5] bg-accent overflow-hidden"
        >
          <img 
            src={settings.aboutImageUrl} 
            alt={settings.aboutTitle} 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>
    </div>
  );
};
