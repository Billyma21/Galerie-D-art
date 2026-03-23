import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Work {
  id: string;
  title: string;
  year: number;
  collection: string;
  technique: string;
  dimensions: string;
  description: string;
  imageUrl: string;
  status: 'available' | 'sold' | 'exhibited' | 'archive';
  category: string;
  createdAt: string;
}

export interface Exhibition {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl?: string;
  isPast: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string; // Lucide icon name
}

export interface SiteSettings {
  siteTitle: string;
  navWorks: string;
  navExhibitions: string;
  navAbout: string;
  navContact: string;
  footerText: string;
  // Page Content
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  galleryTitle: string;
  gallerySubtitle: string;
  exhibitionsTitle: string;
  exhibitionsSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  aboutExhibitions: string;
  aboutAwards: string;
  aboutQuote: string;
  aboutImageUrl: string;
  contactTitle: string;
  contactSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  // Theme
  accentColor: string;
}

export interface Analytics {
  totalVisits: number;
  workViews: Record<string, number>;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface AppContextType {
  works: Work[];
  exhibitions: Exhibition[];
  categories: string[];
  settings: SiteSettings;
  socialLinks: SocialLink[];
  analytics: Analytics;
  messages: Message[];
  addWork: (work: Omit<Work, 'id' | 'createdAt'>) => void;
  updateWork: (id: string, work: Partial<Work>) => void;
  deleteWork: (id: string) => void;
  addExhibition: (exhibition: Omit<Exhibition, 'id'>) => void;
  updateExhibition: (id: string, exhibition: Partial<Exhibition>) => void;
  deleteExhibition: (id: string) => void;
  updateSettings: (settings: Partial<SiteSettings>) => void;
  addSocialLink: (link: Omit<SocialLink, 'id'>) => void;
  updateSocialLink: (id: string, link: Partial<SocialLink>) => void;
  deleteSocialLink: (id: string) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'isRead'>) => void;
  deleteMessage: (id: string) => void;
  markMessageAsRead: (id: string) => void;
  trackWorkView: (id: string) => void;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}
