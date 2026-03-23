import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Maximize2 } from 'lucide-react';

export const WorkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { works, trackWorkView } = useApp();
  const work = works.find(w => w.id === id);

  React.useEffect(() => {
    if (id) trackWorkView(id);
  }, [id]);

  if (!work) {
    return (
      <div className="pt-40 text-center">
        <p>Œuvre non trouvée.</p>
        <Link to="/gallery" className="underline">Retour à la galerie</Link>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-muted hover:text-ink transition-colors mb-12 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-widest">Retour</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Image Section */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="relative group bg-accent"
            >
              <img 
                src={work.imageUrl} 
                alt={work.title} 
                className="w-full h-auto shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <button className="absolute bottom-6 right-6 p-4 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={20} />
              </button>
            </motion.div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <p className="text-muted text-[10px] uppercase tracking-[0.3em] mb-4">
                {work.collection} — {work.year}
              </p>
              <h1 className="text-5xl font-serif mb-8 leading-tight">{work.title}</h1>
              
              <div className="space-y-8 mb-12">
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-muted mb-2">Technique</h3>
                  <p className="text-sm">{work.technique}</p>
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-muted mb-2">Dimensions</h3>
                  <p className="text-sm">{work.dimensions}</p>
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-muted mb-2">Statut</h3>
                  <p className="text-sm capitalize">{work.status === 'available' ? 'Disponible' : work.status === 'sold' ? 'Vendu' : work.status}</p>
                </div>
              </div>

              <div className="w-full h-px bg-ink/10 mb-8"></div>

              <div className="prose prose-sm prose-neutral">
                <p className="text-muted leading-relaxed italic">
                  {work.description}
                </p>
              </div>

              <div className="mt-12">
                <Link 
                  to="/contact" 
                  className="block w-full text-center border border-ink py-4 uppercase tracking-widest text-[10px] hover:bg-ink hover:text-bg transition-all"
                >
                  Demande d'information
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
