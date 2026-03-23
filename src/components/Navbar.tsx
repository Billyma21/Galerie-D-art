import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, X, Instagram, Linkedin, Twitter, Facebook, Youtube, Share2 } from 'lucide-react';
import { cn } from '../utils';
import { useApp } from '../context/AppContext';

const IconMap: Record<string, any> = {
  Instagram, Linkedin, Twitter, Facebook, Youtube
};

export const Navbar = () => {
  const { socialLinks, settings } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: settings.navWorks, path: '/gallery' },
    { name: settings.navExhibitions, path: '/exhibitions' },
    { name: settings.navAbout, path: '/about' },
    { name: settings.navContact, path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif tracking-widest uppercase">
          {settings.siteTitle}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-xs uppercase tracking-[0.2em] transition-colors hover:text-ink/60",
                location.pathname === link.path ? "text-ink" : "text-muted"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-black/5 px-6 py-8 flex flex-col space-y-6"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-lg font-serif tracking-widest uppercase"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-8 border-t border-ink/5 flex gap-6">
            {socialLinks.map(link => {
              const Icon = IconMap[link.icon] || Share2;
              return (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink transition-colors">
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </motion.div>
      )}
    </nav>
  );
};
