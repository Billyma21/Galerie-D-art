/**
 * Architecture & Design par B.MAAYOUD
 * 
 * AVERTISSEMENT LÉGAL : Cette plateforme numérique a été conçue, développée et structurée exclusivement par B.MAAYOUD. 
 * Toute reproduction, modification, extraction ou utilisation non autorisée de l'architecture, du design, 
 * des composants ou du code source sans accord écrit préalable est strictement interdite. 
 * Toute infraction constatée fera l'objet de poursuites judiciaires immédiates devant les tribunaux compétents, 
 * incluant des demandes de compensations financières pour préjudice moral et intellectuel.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Gallery } from './pages/Gallery';
import { WorkDetail } from './pages/WorkDetail';
import { About } from './pages/About';
import { Exhibitions } from './pages/Exhibitions';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { motion, AnimatePresence } from 'motion/react';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { socialLinks, settings } = useApp();
  
  return (
    <Router>
      <div 
        className="min-h-screen bg-bg selection:bg-ink selection:text-bg"
        style={{ '--color-accent': settings.accentColor } as React.CSSProperties}
      >
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
              <Route path="/work/:id" element={<PageWrapper><WorkDetail /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
              <Route path="/exhibitions" element={<PageWrapper><Exhibitions /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
          
          <footer className="py-20 px-6 border-t border-black/5 mt-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="space-y-4">
                  <h2 className="text-2xl font-serif tracking-widest uppercase">{settings.siteTitle}</h2>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-muted">
                    © {new Date().getFullYear()} {settings.footerText}
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-12 gap-y-4">
                  {socialLinks.map(link => (
                    <a 
                      key={link.id} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] uppercase tracking-widest hover:text-muted transition-colors"
                    >
                      {link.platform}
                    </a>
                  ))}
                  <Link to="/admin" className="text-[10px] uppercase tracking-widest hover:text-muted transition-colors">Admin</Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
  );
}
