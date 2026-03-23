import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Plus, Trash2, Edit2, LogOut, Image as ImageIcon, X, 
  Settings, Layout, Share2, BarChart3, Palette, 
  Mail, Phone, MapPin, Instagram, Linkedin, Twitter, Facebook, Youtube,
  Calendar, Eye, TrendingUp, Users, Download, Upload as UploadIcon, CheckCircle, AlertCircle,
  Search, Check, MailOpen, MessageSquare
} from 'lucide-react';
import { useApp, DEFAULT_SETTINGS } from '../context/AppContext';
import { Work, Exhibition, SocialLink, SiteSettings } from '../types';
import { cn } from '../utils';
import { ImageUpload } from '../components/ImageUpload';

const CharacterCounter = ({ current, max }: { current: number; max: number }) => (
  <span className={cn(
    "text-[9px] font-mono",
    current > max ? "text-red-500" : "text-muted"
  )}>
    {current}/{max}
  </span>
);

const IconMap: Record<string, any> = {
  Instagram, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Youtube
};

export const Admin = () => {
  const { 
    works, exhibitions, categories, settings, socialLinks, analytics, messages,
    addWork, updateWork, deleteWork, 
    addExhibition, updateExhibition, deleteExhibition,
    updateSettings, addSocialLink, updateSocialLink, deleteSocialLink,
    addCategory, deleteCategory,
    deleteMessage, markMessageAsRead,
    isAuthenticated, login, logout 
  } = useApp();

  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'works' | 'exhibitions' | 'content' | 'socials' | 'stats' | 'system' | 'messages'>('dashboard');
  const [contentSubTab, setContentSubTab] = useState<'identity' | 'home' | 'gallery' | 'about' | 'contact' | 'exhibitions'>('identity');
  
  // Modals
  const [isAddingWork, setIsAddingWork] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [isAddingEx, setIsAddingEx] = useState(false);
  const [editingExId, setEditingExId] = useState<string | null>(null);

  // Notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExportData = () => {
    const data = {
      works, exhibitions, categories, settings, socialLinks, analytics
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `museum-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Données exportées avec succès');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.works && data.settings) {
            localStorage.setItem('museum_works', JSON.stringify(data.works));
            localStorage.setItem('museum_exhibitions', JSON.stringify(data.exhibitions));
            localStorage.setItem('museum_categories', JSON.stringify(data.categories));
            localStorage.setItem('museum_settings', JSON.stringify(data.settings));
            localStorage.setItem('museum_social_links', JSON.stringify(data.socialLinks));
            localStorage.setItem('museum_analytics', JSON.stringify(data.analytics));
            window.location.reload();
          }
        } catch (err) {
          showToast('Erreur lors de l\'importation', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  // Forms
  const [workForm, setWorkForm] = useState<Omit<Work, 'id' | 'createdAt'>>({
    title: '', year: new Date().getFullYear(), collection: '', technique: '',
    dimensions: '', description: '', imageUrl: '', status: 'available', category: '',
  });

  const [exForm, setExForm] = useState<Omit<Exhibition, 'id'>>({
    title: '', date: '', location: '', description: '', imageUrl: '', isPast: false
  });

  const [siteForm, setSiteForm] = useState<SiteSettings>(settings);
  const [newCategory, setNewCategory] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(password)) alert('Mot de passe incorrect');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [exSearchQuery, setExSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredWorks = works.filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          work.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          work.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || work.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleWorkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWorkId) {
      updateWork(editingWorkId, workForm);
      showToast('Œuvre mise à jour');
    } else {
      addWork(workForm);
      showToast('Œuvre ajoutée');
    }
    setIsAddingWork(false);
    setEditingWorkId(null);
  };

  const handleExSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExId) {
      updateExhibition(editingExId, exForm);
      showToast('Exposition mise à jour');
    } else {
      addExhibition(exForm);
      showToast('Exposition ajoutée');
    }
    setIsAddingEx(false);
    setEditingExId(null);
  };

  const handleSiteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(siteForm);
    showToast('Paramètres enregistrés');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 shadow-2xl max-w-md w-full">
          <h1 className="text-3xl font-serif mb-8 text-center">Accès Administration</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-b border-ink/20 py-2 focus:border-ink outline-none" placeholder="Mot de passe" />
            <button className="w-full bg-ink text-bg py-4 uppercase tracking-widest text-[10px]">Se connecter</button>
          </form>
        </motion.div>
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h1 className="text-4xl font-serif mb-2">Musée Digital</h1>
          <p className="text-muted text-[10px] uppercase tracking-widest">Gestionnaire de contenu premium</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center gap-2 px-6 py-3 border border-ink/10 text-[10px] uppercase tracking-widest hover:bg-accent transition-colors">
            <Share2 size={14} /> Voir le site
          </Link>
          <button onClick={logout} className="p-3 bg-accent hover:bg-ink hover:text-bg transition-all rounded-full" title="Déconnexion">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={cn(
            "fixed bottom-8 right-8 z-[200] px-6 py-3 flex items-center gap-3 shadow-2xl backdrop-blur-md",
            toast.type === 'success' ? "bg-ink text-bg" : "bg-red-500 text-white"
          )}
        >
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span className="text-[10px] uppercase tracking-widest">{toast.message}</span>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-8 border-b border-ink/5 mb-12">
        {[
          { id: 'dashboard', label: 'Tableau de bord', icon: Layout },
          { id: 'works', label: 'Œuvres', icon: Palette },
          { id: 'exhibitions', label: 'Expositions', icon: Calendar },
          { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadCount },
          { id: 'content', label: 'Contenu Site', icon: Settings },
          { id: 'socials', label: 'Réseaux', icon: Share2 },
          { id: 'stats', label: 'Statistiques', icon: BarChart3 },
          { id: 'system', label: 'Système', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 pb-4 text-[10px] uppercase tracking-widest transition-all border-b-2",
              activeTab === tab.id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[8px] rounded-full font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[60vh]">
        {activeTab === 'dashboard' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Visites', value: analytics.totalVisits, icon: Users, color: 'text-blue-600' },
                { label: 'Œuvres', value: works.length, icon: Palette, color: 'text-purple-600' },
                { label: 'Expositions', value: exhibitions.length, icon: Calendar, color: 'text-orange-600' },
                { label: 'Catégories', value: categories.length, icon: Layout, color: 'text-emerald-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-accent p-8 rounded-3xl border border-ink/5 hover:border-ink/10 transition-all group">
                  <stat.icon className={cn("mb-4 opacity-50 group-hover:opacity-100 transition-opacity", stat.color)} size={24} />
                  <p className="text-[10px] uppercase tracking-widest text-muted mb-1">{stat.label}</p>
                  <p className="text-4xl font-serif">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div className="flex justify-between items-end">
                  <h3 className="text-2xl font-serif">Actions Rapides</h3>
                  <p className="text-[10px] uppercase tracking-widest text-muted">Gestionnaire Premium</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button onClick={() => { setEditingWorkId(null); setWorkForm({ title: '', year: new Date().getFullYear(), collection: '', technique: '', dimensions: '', description: '', imageUrl: '', status: 'available', category: '' }); setIsAddingWork(true); }} className="p-8 bg-ink text-bg rounded-3xl hover:scale-[1.02] transition-all flex flex-col items-center gap-4 shadow-xl">
                    <Plus size={24} />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-center">Nouvelle Œuvre</span>
                  </button>
                  <button onClick={() => { setEditingExId(null); setExForm({ title: '', date: '', location: '', description: '', imageUrl: '', isPast: false }); setIsAddingEx(true); }} className="p-8 bg-accent text-ink rounded-3xl hover:bg-ink/5 transition-all flex flex-col items-center gap-4 border border-ink/5">
                    <Calendar size={24} />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-center">Nouvelle Expo</span>
                  </button>
                  <button onClick={() => setActiveTab('content')} className="p-8 bg-accent text-ink rounded-3xl hover:bg-ink/5 transition-all flex flex-col items-center gap-4 border border-ink/5">
                    <Settings size={24} />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-center">Contenu Site</span>
                  </button>
                  <button onClick={() => setActiveTab('stats')} className="p-8 bg-accent text-ink rounded-3xl hover:bg-ink/5 transition-all flex flex-col items-center gap-4 border border-ink/5">
                    <BarChart3 size={24} />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-center">Statistiques</span>
                  </button>
                  <button onClick={() => setActiveTab('messages')} className="p-8 bg-accent text-ink rounded-3xl hover:bg-ink/5 transition-all flex flex-col items-center gap-4 border border-ink/5 relative">
                    <MessageSquare size={24} />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-center">Messages</span>
                    {unreadCount > 0 && (
                      <span className="absolute top-4 right-4 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-lg">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-2xl font-serif">Dernières Œuvres</h3>
                <div className="space-y-4">
                  {works.slice(0, 4).map(work => (
                    <div key={work.id} className="flex items-center gap-4 p-4 bg-accent rounded-2xl hover:bg-ink/5 transition-colors group cursor-pointer" onClick={() => { setWorkForm(work); setEditingWorkId(work.id); setIsAddingWork(true); }}>
                      <div className="relative overflow-hidden rounded-xl w-16 h-16">
                        <img src={work.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{work.title}</p>
                        <p className="text-[9px] text-muted uppercase tracking-widest">{work.category || 'Non classé'}</p>
                      </div>
                      <Edit2 size={14} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'works' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <h2 className="text-2xl font-serif">Gestion des Œuvres</h2>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input 
                    type="text" 
                    placeholder="Rechercher une œuvre..." 
                    className="w-full bg-accent pl-10 pr-4 py-2 text-xs rounded-full outline-none focus:ring-1 ring-ink/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-accent px-4 py-2 text-[10px] uppercase tracking-widest outline-none rounded-full"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="available">Disponible</option>
                  <option value="sold">Vendu</option>
                  <option value="exhibited">Exposé</option>
                  <option value="archive">Archive</option>
                </select>
                <button onClick={() => { setWorkForm({title:'', year:2024, collection:'', technique:'', dimensions:'', description:'', imageUrl:'', status:'available', category: categories[0] || 'Abstrait'}); setIsAddingWork(true); }} className="bg-ink text-bg px-6 py-3 text-[10px] uppercase tracking-widest flex items-center gap-2 whitespace-nowrap rounded-full"><Plus size={14} /> Ajouter</button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredWorks.map(work => (
                <div key={work.id} className="group bg-accent rounded-3xl overflow-hidden border border-ink/5 hover:border-ink/10 hover:shadow-2xl transition-all duration-500 flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={work.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setWorkForm(work); setEditingWorkId(work.id); setIsAddingWork(true); }} className="p-3 bg-white/90 backdrop-blur-md rounded-full hover:bg-ink hover:text-bg transition-all shadow-lg">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteWork(work.id)} className="p-3 bg-white/90 backdrop-blur-md rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold backdrop-blur-md border",
                        work.status === 'available' ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" :
                        work.status === 'sold' ? "bg-red-500/10 text-red-700 border-red-500/20" :
                        "bg-blue-500/10 text-blue-700 border-blue-500/20"
                      )}>
                        {work.status === 'available' ? 'Disponible' : work.status === 'sold' ? 'Vendu' : work.status === 'exhibited' ? 'Exposé' : 'Archive'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-xl">{work.title}</h3>
                      <span className="text-[10px] font-mono text-muted">{work.year}</span>
                    </div>
                    <p className="text-[10px] text-muted uppercase tracking-[0.2em]">{work.category || 'Non classé'}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-12 border-t border-ink/5">
              <h3 className="text-lg font-serif mb-6">Catégories</h3>
              <div className="flex flex-wrap gap-4 mb-6">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center gap-2 bg-accent px-4 py-2 rounded-full text-xs uppercase tracking-widest">
                    {cat}
                    <button onClick={() => deleteCategory(cat)} className="text-muted hover:text-red-500"><X size={12} /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 max-w-sm">
                <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Nouvelle catégorie..." className="flex-1 border-b border-ink/20 py-2 outline-none focus:border-ink" />
                <button onClick={() => { if(newCategory) { addCategory(newCategory); setNewCategory(''); } }} className="bg-ink text-bg px-4 py-2 text-[10px] uppercase tracking-widest">Ajouter</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exhibitions' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <h2 className="text-2xl font-serif">Gestion des Expositions</h2>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input 
                    type="text" 
                    placeholder="Rechercher une expo..." 
                    className="w-full bg-accent pl-10 pr-4 py-2 text-xs rounded-full outline-none focus:ring-1 ring-ink/10"
                    value={exSearchQuery}
                    onChange={(e) => setExSearchQuery(e.target.value)}
                  />
                </div>
                <button onClick={() => { setExForm({title:'', date:'', location:'', description:'', imageUrl:'', isPast:false}); setIsAddingEx(true); }} className="bg-ink text-bg px-6 py-3 text-[10px] uppercase tracking-widest flex items-center gap-2 whitespace-nowrap rounded-full"><Plus size={14} /> Ajouter</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exhibitions.filter(ex => ex.title.toLowerCase().includes(exSearchQuery.toLowerCase()) || ex.location.toLowerCase().includes(exSearchQuery.toLowerCase())).map(ex => (
                <div key={ex.id} className="group bg-accent rounded-3xl overflow-hidden border border-ink/5 hover:border-ink/10 hover:shadow-2xl transition-all duration-500 flex flex-col">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={ex.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setExForm(ex); setEditingExId(ex.id); setIsAddingEx(true); }} className="p-3 bg-white/90 backdrop-blur-md rounded-full hover:bg-ink hover:text-bg transition-all shadow-lg">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteExhibition(ex.id)} className="p-3 bg-white/90 backdrop-blur-md rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold backdrop-blur-md border",
                        ex.isPast ? "bg-ink/10 text-ink/60 border-ink/10" : "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                      )}>
                        {ex.isPast ? 'Passée' : 'En cours / À venir'}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-serif text-2xl">{ex.title}</h3>
                      <div className="flex items-center gap-4 text-muted">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          <span className="text-[10px] uppercase tracking-widest">{ex.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span className="text-[10px] uppercase tracking-widest">{ex.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted line-clamp-2 leading-relaxed">{ex.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex overflow-x-auto pb-4 gap-12 border-b border-ink/5 no-scrollbar">
              {[
                { id: 'identity', label: 'Identité & Thème', icon: Palette },
                { id: 'home', label: 'Accueil (Hero)', icon: Layout },
                { id: 'gallery', label: 'Galerie', icon: ImageIcon },
                { id: 'about', label: 'À Propos', icon: Users },
                { id: 'contact', label: 'Contact', icon: Mail },
                { id: 'exhibitions', label: 'Expositions', icon: Calendar },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setContentSubTab(sub.id as any)}
                  className={cn(
                    "flex items-center gap-3 py-4 text-[11px] uppercase tracking-[0.2em] font-bold transition-all whitespace-nowrap border-b-2",
                    contentSubTab === sub.id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
                  )}
                >
                  <sub.icon size={16} />
                  {sub.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSiteSubmit} className="max-w-4xl space-y-16">
              {contentSubTab === 'identity' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-10">
                    <h3 className="text-2xl font-serif">Identité Visuelle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="md:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                          <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">Nom du Site (Logo)</label>
                          <CharacterCounter current={siteForm.siteTitle?.length || 0} max={50} />
                        </div>
                        <input value={siteForm.siteTitle || ''} onChange={e => setSiteForm({...siteForm, siteTitle: e.target.value})} className="w-full border-b border-ink/20 py-3 outline-none focus:border-ink text-2xl font-serif bg-transparent" />
                      </div>
                      <div className="bg-accent p-8 rounded-3xl space-y-6">
                        <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">Couleur d'Accent (Hex)</label>
                        <div className="flex gap-6 items-center">
                          <div className="relative">
                            <input type="color" value={siteForm.accentColor || '#F5F5F0'} onChange={e => setSiteForm({...siteForm, accentColor: e.target.value})} className="w-16 h-16 rounded-full overflow-hidden border-none cursor-pointer shadow-lg" />
                            <div className="absolute inset-0 rounded-full border-4 border-white pointer-events-none"></div>
                          </div>
                          <input value={siteForm.accentColor || ''} onChange={e => setSiteForm({...siteForm, accentColor: e.target.value})} className="flex-1 bg-white/50 border-b border-ink/20 py-2 px-4 outline-none focus:border-ink font-mono text-sm rounded-lg" />
                        </div>
                      </div>
                      <div className="bg-accent p-8 rounded-3xl space-y-6">
                        <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">Texte Copyright Footer</label>
                        <input value={siteForm.footerText || ''} onChange={e => setSiteForm({...siteForm, footerText: e.target.value})} className="w-full bg-white/50 border-b border-ink/20 py-2 px-4 outline-none focus:border-ink text-sm rounded-lg" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-10">
                    <h3 className="text-2xl font-serif">Navigation (Labels)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {[
                        { id: 'navWorks', label: 'Œuvres' },
                        { id: 'navExhibitions', label: 'Expositions' },
                        { id: 'navAbout', label: 'À Propos' },
                        { id: 'navContact', label: 'Contact' }
                      ].map(field => (
                        <div key={field.id} className="space-y-4">
                          <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">{field.label}</label>
                          <input 
                            value={(siteForm as any)[field.id] || ''} 
                            onChange={e => setSiteForm({...siteForm, [field.id]: e.target.value})} 
                            className="w-full border-b border-ink/20 py-2 outline-none focus:border-ink text-sm bg-transparent" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {contentSubTab === 'home' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-10">
                    <h3 className="text-2xl font-serif">Accueil (Hero)</h3>
                    <div className="space-y-10">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">Titre Hero</label>
                          <CharacterCounter current={siteForm.heroTitle?.length || 0} max={60} />
                        </div>
                        <input value={siteForm.heroTitle || ''} onChange={e => setSiteForm({...siteForm, heroTitle: e.target.value})} className="w-full border-b border-ink/20 py-3 outline-none focus:border-ink text-4xl font-serif bg-transparent" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">Sous-titre Hero</label>
                          <CharacterCounter current={siteForm.heroSubtitle?.length || 0} max={120} />
                        </div>
                        <input value={siteForm.heroSubtitle || ''} onChange={e => setSiteForm({...siteForm, heroSubtitle: e.target.value})} className="w-full border-b border-ink/20 py-3 outline-none focus:border-ink text-lg bg-transparent" />
                      </div>
                      <div className="bg-accent p-10 rounded-3xl">
                        <ImageUpload label="Image Hero" value={siteForm.heroImageUrl || ''} onChange={val => setSiteForm({...siteForm, heroImageUrl: val})} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {contentSubTab === 'gallery' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-10">
                    <h3 className="text-2xl font-serif">Page Galerie</h3>
                    <div className="space-y-10">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-muted font-bold mb-4">Titre Galerie</label>
                        <input value={siteForm.galleryTitle || ''} onChange={e => setSiteForm({...siteForm, galleryTitle: e.target.value})} className="w-full border-b border-ink/20 py-3 outline-none focus:border-ink text-3xl font-serif bg-transparent" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-muted font-bold mb-4">Sous-titre Galerie</label>
                        <textarea value={siteForm.gallerySubtitle || ''} onChange={e => setSiteForm({...siteForm, gallerySubtitle: e.target.value})} className="w-full border border-ink/10 p-6 min-h-[150px] outline-none focus:border-ink text-lg rounded-2xl bg-accent/30" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {contentSubTab === 'about' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-12">
                    <h3 className="text-2xl font-serif">Page À Propos</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                      <div className="space-y-10">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-muted font-bold mb-4">Titre Section</label>
                          <input value={siteForm.aboutTitle || ''} onChange={e => setSiteForm({...siteForm, aboutTitle: e.target.value})} className="w-full border-b border-ink/20 py-3 outline-none focus:border-ink text-2xl font-serif bg-transparent" />
                        </div>
                        <div className="bg-accent p-8 rounded-3xl">
                          <ImageUpload label="Image Artiste" value={siteForm.aboutImageUrl || ''} onChange={val => setSiteForm({...siteForm, aboutImageUrl: val})} />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">Citation</label>
                            <CharacterCounter current={siteForm.aboutQuote?.length || 0} max={200} />
                          </div>
                          <textarea value={siteForm.aboutQuote || ''} onChange={e => setSiteForm({...siteForm, aboutQuote: e.target.value})} className="w-full border border-ink/10 p-6 min-h-[120px] outline-none focus:border-ink italic text-lg rounded-2xl bg-accent/30" />
                        </div>
                      </div>
                      <div className="space-y-10">
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">Texte Biographie</label>
                            <CharacterCounter current={siteForm.aboutText?.length || 0} max={2000} />
                          </div>
                          <textarea value={siteForm.aboutText || ''} onChange={e => setSiteForm({...siteForm, aboutText: e.target.value})} className="w-full border border-ink/10 p-8 min-h-[500px] outline-none focus:border-ink text-base leading-relaxed rounded-3xl bg-accent/30" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="bg-accent p-8 rounded-3xl space-y-6">
                        <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">Expositions Clés (une par ligne)</label>
                        <textarea value={siteForm.aboutExhibitions || ''} onChange={e => setSiteForm({...siteForm, aboutExhibitions: e.target.value})} className="w-full bg-white/50 border border-ink/5 p-6 min-h-[200px] outline-none focus:border-ink text-sm font-mono rounded-xl" />
                      </div>
                      <div className="bg-accent p-8 rounded-3xl space-y-6">
                        <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">Distinctions (une par ligne)</label>
                        <textarea value={siteForm.aboutAwards || ''} onChange={e => setSiteForm({...siteForm, aboutAwards: e.target.value})} className="w-full bg-white/50 border border-ink/5 p-6 min-h-[200px] outline-none focus:border-ink text-sm font-mono rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {contentSubTab === 'contact' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-10">
                    <h3 className="text-2xl font-serif">Page Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-muted font-bold mb-4">Titre Page</label>
                        <input value={siteForm.contactTitle || ''} onChange={e => setSiteForm({...siteForm, contactTitle: e.target.value})} className="w-full border-b border-ink/20 py-3 outline-none focus:border-ink text-3xl font-serif bg-transparent" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-muted font-bold mb-4">Sous-titre</label>
                        <input value={siteForm.contactSubtitle || ''} onChange={e => setSiteForm({...siteForm, contactSubtitle: e.target.value})} className="w-full border-b border-ink/20 py-3 outline-none focus:border-ink text-lg bg-transparent" />
                      </div>
                      <div className="md:col-span-2 space-y-8 bg-accent p-10 rounded-3xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                          <div className="space-y-4">
                            <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">Email</label>
                            <input value={siteForm.contactEmail || ''} onChange={e => setSiteForm({...siteForm, contactEmail: e.target.value})} className="w-full bg-white/50 border-b border-ink/20 py-3 px-4 outline-none focus:border-ink text-sm rounded-lg" />
                          </div>
                          <div className="space-y-4">
                            <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">Téléphone</label>
                            <input value={siteForm.contactPhone || ''} onChange={e => setSiteForm({...siteForm, contactPhone: e.target.value})} className="w-full bg-white/50 border-b border-ink/20 py-3 px-4 outline-none focus:border-ink text-sm rounded-lg" />
                          </div>
                          <div className="space-y-4">
                            <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">Adresse</label>
                            <input value={siteForm.contactAddress || ''} onChange={e => setSiteForm({...siteForm, contactAddress: e.target.value})} className="w-full bg-white/50 border-b border-ink/20 py-3 px-4 outline-none focus:border-ink text-sm rounded-lg" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {contentSubTab === 'exhibitions' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-10">
                    <h3 className="text-2xl font-serif">Page Expositions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-muted font-bold mb-4">Titre Page</label>
                        <input value={siteForm.exhibitionsTitle || ''} onChange={e => setSiteForm({...siteForm, exhibitionsTitle: e.target.value})} className="w-full border-b border-ink/20 py-3 outline-none focus:border-ink text-3xl font-serif bg-transparent" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-muted font-bold mb-4">Sous-titre</label>
                        <input value={siteForm.exhibitionsSubtitle || ''} onChange={e => setSiteForm({...siteForm, exhibitionsSubtitle: e.target.value})} className="w-full border-b border-ink/20 py-3 outline-none focus:border-ink text-lg bg-transparent" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-12 border-t border-ink/10 flex justify-end">
                <button className="bg-ink text-bg px-16 py-5 rounded-full shadow-2xl hover:scale-105 transition-all uppercase tracking-[0.3em] text-[11px] font-bold">
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif">Messages Reçus</h2>
              <p className="text-[10px] uppercase tracking-widest text-muted">
                {messages.length} message(s) au total
              </p>
            </div>

            {messages.length === 0 ? (
              <div className="bg-accent p-20 rounded-3xl text-center border border-dashed border-ink/10">
                <MailOpen className="mx-auto mb-4 text-muted opacity-20" size={48} />
                <p className="text-muted text-sm italic">Aucun message pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "p-8 rounded-3xl border transition-all group relative",
                      msg.isRead 
                        ? "bg-white border-ink/5 opacity-70" 
                        : "bg-accent border-ink/10 shadow-lg scale-[1.01]"
                    )}
                  >
                    {!msg.isRead && (
                      <div className="absolute top-8 right-8 w-2 h-2 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
                    )}
                    
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-serif">{msg.name}</h3>
                          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-ink/5 rounded-full text-muted">
                            {msg.subject}
                          </span>
                        </div>
                        <p className="text-xs text-muted font-mono">{msg.email}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-[10px] uppercase tracking-widest text-muted">
                          {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <div className="flex gap-2">
                          {!msg.isRead && (
                            <button 
                              onClick={() => markMessageAsRead(msg.id)}
                              className="p-2 bg-ink text-bg rounded-full hover:scale-110 transition-all"
                              title="Marquer comme lu"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              if(confirm('Supprimer ce message ?')) deleteMessage(msg.id);
                            }}
                            className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-all"
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/50 p-6 rounded-2xl border border-ink/5">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink/80 italic">
                        "{msg.content}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'socials' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-serif">Réseaux Sociaux</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialLinks.map(link => {
                const Icon = IconMap[link.icon] || Share2;
                return (
                  <div key={link.id} className="p-6 bg-accent flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Icon size={20} />
                      <div>
                        <p className="font-medium">{link.platform}</p>
                        <p className="text-[10px] text-muted truncate max-w-[150px]">{link.url}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteSocialLink(link.id)} className="text-muted hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                );
              })}
              <button 
                onClick={() => {
                  const platform = prompt('Nom du réseau (ex: Instagram)');
                  const url = prompt('URL du profil');
                  const icon = prompt('Icône (Instagram, Linkedin, Twitter, Facebook, Youtube)');
                  if(platform && url && icon) addSocialLink({ platform, url, icon });
                }}
                className="p-6 border-2 border-dashed border-ink/10 flex flex-col items-center justify-center gap-2 text-muted hover:border-ink hover:text-ink transition-all"
              >
                <Plus size={24} />
                <span className="text-[10px] uppercase tracking-widest">Ajouter un réseau</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-accent p-8 text-center">
                <Users className="mx-auto mb-4 text-muted" size={32} />
                <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Visites Totales</p>
                <p className="text-4xl font-serif">{analytics.totalVisits}</p>
              </div>
              <div className="bg-accent p-8 text-center">
                <Eye className="mx-auto mb-4 text-muted" size={32} />
                <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Vues d'Œuvres</p>
                <p className="text-4xl font-serif">{(Object.values(analytics.workViews) as number[]).reduce((a, b) => a + b, 0)}</p>
              </div>
              <div className="bg-accent p-8 text-center">
                <TrendingUp className="mx-auto mb-4 text-muted" size={32} />
                <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Taux d'Engagement</p>
                <p className="text-4xl font-serif">{(((Object.values(analytics.workViews) as number[]).reduce((a, b) => a + b, 0) / (analytics.totalVisits || 1)) * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="bg-accent p-8">
              <h3 className="text-xl font-serif mb-8">Popularité des Œuvres</h3>
              <div className="space-y-6">
                {works.slice().sort((a, b) => (analytics.workViews[b.id] || 0) - (analytics.workViews[a.id] || 0)).map(work => {
                  const views = analytics.workViews[work.id] || 0;
                  const maxViews = Math.max(...(Object.values(analytics.workViews) as number[]), 1);
                  const percentage = (views / maxViews) * 100;
                  return (
                    <div key={work.id} className="space-y-2">
                      <div className="flex justify-between text-[10px] uppercase tracking-widest">
                        <span>{work.title}</span>
                        <span className="text-muted">{views} vues</span>
                      </div>
                      <div className="h-1 bg-ink/5 w-full">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${percentage}%` }} 
                          className="h-full bg-ink" 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="max-w-2xl space-y-12">
            <h2 className="text-2xl font-serif">Système & Sauvegarde</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-accent p-8 space-y-4">
                <Download className="text-muted" size={24} />
                <h3 className="font-serif text-lg">Exporter les données</h3>
                <p className="text-xs text-muted leading-relaxed">Téléchargez une sauvegarde complète de votre site (œuvres, réglages, statistiques) au format JSON.</p>
                <button 
                  onClick={handleExportData}
                  className="w-full bg-ink text-bg py-3 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Download size={14} /> Télécharger
                </button>
              </div>

              <div className="bg-accent p-8 space-y-4">
                <UploadIcon className="text-muted" size={24} />
                <h3 className="font-serif text-lg">Importer des données</h3>
                <p className="text-xs text-muted leading-relaxed">Restaurez votre site à partir d'un fichier de sauvegarde. Attention, cela écrasera les données actuelles.</p>
                <label className="w-full bg-white border border-ink/10 text-ink py-3 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer hover:bg-ink hover:text-bg transition-all">
                  <UploadIcon size={14} /> Choisir le fichier
                  <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                </label>
              </div>
            </div>

            <div className="p-8 border border-red-100 bg-red-50/30 space-y-4">
              <h3 className="font-serif text-lg text-red-900">Zone de Danger</h3>
              <p className="text-xs text-red-700 leading-relaxed">La réinitialisation supprimera toutes les données stockées localement. Cette action est irréversible.</p>
              <button 
                onClick={() => {
                  if(confirm('Êtes-vous sûr de vouloir tout réinitialiser ?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="text-[10px] uppercase tracking-widest text-red-600 hover:text-red-800 font-medium"
              >
                Réinitialiser le site
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals (Work & Exhibition) - Reusing logic from before but updated */}
      {isAddingWork && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setIsAddingWork(false)}></div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 shadow-2xl max-w-3xl w-full relative z-10 max-h-[90vh] overflow-y-auto rounded-[40px]">
            <button onClick={() => setIsAddingWork(false)} className="absolute top-8 right-8 text-muted hover:text-ink p-2 hover:bg-accent rounded-full transition-colors"><X size={24} /></button>
            <h2 className="text-3xl font-serif mb-10">{editingWorkId ? 'Modifier l\'œuvre' : 'Nouvelle Œuvre'}</h2>
            <form onSubmit={handleWorkSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">Titre</label>
                  <CharacterCounter current={workForm.title?.length || 0} max={60} />
                </div>
                <input required value={workForm.title || ''} onChange={(e) => setWorkForm({...workForm, title: e.target.value})} className="w-full border-b border-ink/20 py-3 focus:border-ink outline-none text-xl font-serif bg-transparent" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted font-bold mb-2">Année</label>
                <input type="number" required value={workForm.year || new Date().getFullYear()} onChange={(e) => setWorkForm({...workForm, year: parseInt(e.target.value) || new Date().getFullYear()})} className="w-full border-b border-ink/20 py-3 focus:border-ink outline-none bg-transparent" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted font-bold mb-2">Catégorie</label>
                <select value={workForm.category || ''} onChange={(e) => setWorkForm({...workForm, category: e.target.value})} className="w-full border-b border-ink/20 py-3 focus:border-ink outline-none bg-transparent appearance-none">
                  <option value="">Choisir...</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 bg-accent p-8 rounded-3xl">
                <ImageUpload 
                  label="Image de l'œuvre"
                  value={workForm.imageUrl || ''} 
                  onChange={(val) => setWorkForm({...workForm, imageUrl: val})} 
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">Description</label>
                  <CharacterCounter current={workForm.description?.length || 0} max={500} />
                </div>
                <textarea required value={workForm.description || ''} onChange={(e) => setWorkForm({...workForm, description: e.target.value})} className="w-full border border-ink/10 p-6 min-h-[150px] outline-none focus:border-ink rounded-2xl bg-accent/30" />
              </div>
              <button className="md:col-span-2 bg-ink text-bg py-5 rounded-full uppercase tracking-[0.3em] text-[11px] font-bold shadow-xl hover:scale-[1.02] transition-all">
                {editingWorkId ? 'Mettre à jour l\'œuvre' : 'Publier l\'œuvre'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {isAddingEx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setIsAddingEx(false)}></div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 shadow-2xl max-w-3xl w-full relative z-10 max-h-[90vh] overflow-y-auto rounded-[40px]">
            <button onClick={() => setIsAddingEx(false)} className="absolute top-8 right-8 text-muted hover:text-ink p-2 hover:bg-accent rounded-full transition-colors"><X size={24} /></button>
            <h2 className="text-3xl font-serif mb-10">{editingExId ? 'Modifier l\'exposition' : 'Nouvelle Exposition'}</h2>
            <form onSubmit={handleExSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">Titre</label>
                  <CharacterCounter current={exForm.title?.length || 0} max={100} />
                </div>
                <input required value={exForm.title || ''} onChange={(e) => setExForm({...exForm, title: e.target.value})} className="w-full border-b border-ink/20 py-3 focus:border-ink outline-none text-xl font-serif bg-transparent" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted font-bold mb-2">Date</label>
                <input required value={exForm.date || ''} onChange={(e) => setExForm({...exForm, date: e.target.value})} className="w-full border-b border-ink/20 py-3 focus:border-ink outline-none bg-transparent" placeholder="ex: Octobre 2024" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted font-bold mb-2">Lieu</label>
                <input required value={exForm.location || ''} onChange={(e) => setExForm({...exForm, location: e.target.value})} className="w-full border-b border-ink/20 py-3 focus:border-ink outline-none bg-transparent" placeholder="ex: Galerie Vivienne, Paris" />
              </div>
              <div className="md:col-span-2 bg-accent p-8 rounded-3xl">
                <ImageUpload 
                  label="Image de l'exposition"
                  value={exForm.imageUrl || ''} 
                  onChange={(val) => setExForm({...exForm, imageUrl: val})} 
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] uppercase tracking-widest text-muted font-bold">Description</label>
                  <CharacterCounter current={exForm.description?.length || 0} max={1000} />
                </div>
                <textarea required value={exForm.description || ''} onChange={(e) => setExForm({...exForm, description: e.target.value})} className="w-full border border-ink/10 p-6 min-h-[150px] outline-none focus:border-ink rounded-2xl bg-accent/30" />
              </div>
              <button className="md:col-span-2 bg-ink text-bg py-5 rounded-full uppercase tracking-[0.3em] text-[11px] font-bold shadow-xl hover:scale-[1.02] transition-all">
                {editingExId ? 'Mettre à jour l\'exposition' : 'Publier l\'exposition'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
