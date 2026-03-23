import React, { createContext, useContext, useState, useEffect } from 'react';
import { Work, Exhibition, SiteSettings, SocialLink, Analytics, AppContextType, Message } from '../types';
import { MOCK_WORKS, MOCK_EXHIBITIONS } from '../constants';

export const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: "Elena Vidal",
  navWorks: "Œuvres",
  navExhibitions: "Expositions",
  navAbout: "À Propos",
  navContact: "Contact",
  footerText: "Elena Vidal — Musée Digital",
  // Hero
  heroTitle: "L'Art de l'Essentiel",
  heroSubtitle: "Peinture Contemporaine & Abstraction Lyrique",
  heroImageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=2000",
  // Gallery
  galleryTitle: "Galerie d'Œuvres",
  gallerySubtitle: "Une immersion dans l'abstraction lyrique et le mouvement.",
  // Exhibitions
  exhibitionsTitle: "Expositions",
  exhibitionsSubtitle: "Retrouvez les événements passés et à venir.",
  // About
  aboutTitle: "Elena Vidal",
  aboutText: "Née à Barcelone et installée à Paris depuis dix ans, Elena Vidal explore les frontières de l'abstraction lyrique. Son processus créatif est une méditation physique, où chaque couche de peinture superposée raconte une histoire de temps et de mémoire.\n\nDiplômée des Beaux-Arts, elle a développé une technique unique mêlant huiles traditionnelles et pigments naturels récoltés lors de ses voyages. Ses œuvres sont présentes dans de nombreuses collections privées à travers l'Europe et l'Asie.\n\nÀ travers ses séries comme \"Murmures\" ou \"Espaces\", elle invite le spectateur à un voyage intérieur, offrant un refuge visuel dans un monde saturé d'images.",
  aboutExhibitions: "2024 — Galerie Vivienne, Paris\n2023 — MAM, Lyon\n2022 — Art Basel, Suisse\n2021 — Venice Biennale (Pavillon Espagnol)",
  aboutAwards: "Prix de la Création Contemporaine 2023\nRésidence d'Artiste — Villa Médicis 2022",
  aboutQuote: "Mon travail est une quête de l'équilibre entre le chaos de la matière et la sérénité de l'esprit.",
  aboutImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1000",
  // Contact
  contactTitle: "Contactez l'Artiste",
  contactSubtitle: "Pour toute demande de collaboration ou d'acquisition.",
  contactEmail: "contact@elenavidal.art",
  contactPhone: "+33 (0) 6 12 34 56 78",
  contactAddress: "Atelier 12, Rue des Artistes, 75011 Paris",
  // Theme
  accentColor: "#F5F5F0",
};

const DEFAULT_SOCIALS: SocialLink[] = [
  { id: 's1', platform: 'Instagram', url: 'https://instagram.com', icon: 'Instagram' },
  { id: 's2', platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [works, setWorks] = useState<Work[]>(() => {
    const saved = localStorage.getItem('museum_works');
    return saved ? JSON.parse(saved) : MOCK_WORKS;
  });

  const [exhibitions, setExhibitions] = useState<Exhibition[]>(() => {
    const saved = localStorage.getItem('museum_exhibitions');
    return saved ? JSON.parse(saved) : MOCK_EXHIBITIONS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('museum_categories');
    return saved ? JSON.parse(saved) : ['Abstrait', 'Paysage', 'Portrait', 'Sculpture'];
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('museum_settings');
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
    return DEFAULT_SETTINGS;
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
    const saved = localStorage.getItem('museum_socials');
    return saved ? JSON.parse(saved) : DEFAULT_SOCIALS;
  });

  const [analytics, setAnalytics] = useState<Analytics>(() => {
    const saved = localStorage.getItem('museum_analytics');
    if (saved) return JSON.parse(saved);
    return { totalVisits: 0, workViews: {} };
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('museum_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('museum_auth') === 'true';
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('museum_works', JSON.stringify(works));
    localStorage.setItem('museum_exhibitions', JSON.stringify(exhibitions));
    localStorage.setItem('museum_categories', JSON.stringify(categories));
    localStorage.setItem('museum_settings', JSON.stringify(settings));
    localStorage.setItem('museum_socials', JSON.stringify(socialLinks));
    localStorage.setItem('museum_analytics', JSON.stringify(analytics));
    localStorage.setItem('museum_messages', JSON.stringify(messages));
  }, [works, exhibitions, categories, settings, socialLinks, analytics, messages]);

  // Initial visit tracking
  useEffect(() => {
    setAnalytics(prev => ({ ...prev, totalVisits: prev.totalVisits + 1 }));
  }, []);

  const addWork = (workData: Omit<Work, 'id' | 'createdAt'>) => {
    const newWork: Work = {
      ...workData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setWorks(prev => [newWork, ...prev]);
  };

  const updateWork = (id: string, workData: Partial<Work>) => {
    setWorks(prev => prev.map(w => w.id === id ? { ...w, ...workData } : w));
  };

  const deleteWork = (id: string) => {
    setWorks(prev => prev.filter(w => w.id !== id));
  };

  const addExhibition = (exData: Omit<Exhibition, 'id'>) => {
    const newEx: Exhibition = { ...exData, id: Math.random().toString(36).substr(2, 9) };
    setExhibitions(prev => [newEx, ...prev]);
  };

  const updateExhibition = (id: string, exData: Partial<Exhibition>) => {
    setExhibitions(prev => prev.map(e => e.id === id ? { ...e, ...exData } : e));
  };

  const deleteExhibition = (id: string) => {
    setExhibitions(prev => prev.filter(e => e.id !== id));
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addSocialLink = (linkData: Omit<SocialLink, 'id'>) => {
    const newLink: SocialLink = { ...linkData, id: Math.random().toString(36).substr(2, 9) };
    setSocialLinks(prev => [...prev, newLink]);
  };

  const updateSocialLink = (id: string, linkData: Partial<SocialLink>) => {
    setSocialLinks(prev => prev.map(l => l.id === id ? { ...l, ...linkData } : l));
  };

  const deleteSocialLink = (id: string) => {
    setSocialLinks(prev => prev.filter(l => l.id !== id));
  };

  const addCategory = (cat: string) => {
    if (!categories.includes(cat)) setCategories(prev => [...prev, cat]);
  };

  const deleteCategory = (cat: string) => {
    setCategories(prev => prev.filter(c => c !== cat));
  };

  const addMessage = (msgData: Omit<Message, 'id' | 'createdAt' | 'isRead'>) => {
    const newMessage: Message = {
      ...msgData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const markMessageAsRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  const trackWorkView = (id: string) => {
    setAnalytics(prev => ({
      ...prev,
      workViews: {
        ...prev.workViews,
        [id]: (prev.workViews[id] || 0) + 1
      }
    }));
  };

  const login = (password: string) => {
    if (password === 'art2024') {
      setIsAuthenticated(true);
      localStorage.setItem('museum_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('museum_auth');
  };

  return (
    <AppContext.Provider value={{ 
      works, 
      exhibitions, 
      categories,
      settings,
      socialLinks,
      analytics,
      messages,
      addWork, 
      updateWork, 
      deleteWork, 
      addExhibition,
      updateExhibition,
      deleteExhibition,
      updateSettings,
      addSocialLink,
      updateSocialLink,
      deleteSocialLink,
      addCategory,
      deleteCategory,
      addMessage,
      deleteMessage,
      markMessageAsRead,
      trackWorkView,
      isAuthenticated, 
      login, 
      logout 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
