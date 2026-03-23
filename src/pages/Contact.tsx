import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Instagram, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Youtube } from 'lucide-react';
import { useApp } from '../context/AppContext';

const IconMap: Record<string, any> = {
  Instagram, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Youtube
};

export const Contact = () => {
  const { settings, socialLinks, addMessage } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: "Demande d'acquisition",
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMessage(formData);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: "Demande d'acquisition",
      content: ''
    });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-serif mb-8">{settings.contactTitle}</h1>
          <p className="text-muted text-lg mb-12 leading-relaxed max-w-md">
            {settings.contactSubtitle}
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Email</p>
                <p className="text-sm">{settings.contactEmail}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Téléphone</p>
                <p className="text-sm">{settings.contactPhone}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Adresse</p>
                <p className="text-sm">{settings.contactAddress}</p>
              </div>
            </div>

            <div className="pt-8 border-t border-ink/5">
              <p className="text-[10px] uppercase tracking-widest text-muted mb-6">Suivre l'artiste</p>
              <div className="flex gap-4">
                {socialLinks.map(link => {
                  const Icon = IconMap[link.icon] || Instagram;
                  return (
                    <a 
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center hover:bg-ink hover:text-bg transition-all"
                      title={link.platform}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="bg-accent p-12"
        >
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-ink text-bg flex items-center justify-center mb-6">
                <Send size={24} />
              </div>
              <h2 className="text-2xl font-serif mb-4">Message envoyé</h2>
              <p className="text-muted text-sm">Merci pour votre intérêt. Je vous répondrai dans les plus brefs délais.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-8 text-[10px] uppercase tracking-widest border-b border-ink pb-1"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Nom</label>
                  <input 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-transparent border-b border-ink/20 py-2 focus:border-ink outline-none transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Email</label>
                  <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-transparent border-b border-ink/20 py-2 focus:border-ink outline-none transition-colors" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Sujet</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full bg-transparent border-b border-ink/20 py-2 focus:border-ink outline-none transition-colors"
                >
                  <option>Demande d'acquisition</option>
                  <option>Collaboration</option>
                  <option>Presse</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Message</label>
                <textarea 
                  required 
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full bg-transparent border border-ink/20 p-4 focus:border-ink outline-none transition-colors min-h-[150px]" 
                />
              </div>
              <button className="w-full bg-ink text-bg py-4 uppercase tracking-widest text-[10px] hover:opacity-90 transition-opacity">
                Envoyer le message
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};
