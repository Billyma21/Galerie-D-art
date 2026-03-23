import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import { cn } from '../utils';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label }) => {
  const [mode, setMode] = useState<'url' | 'file'>(value.startsWith('data:') ? 'file' : 'url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("L'image est trop volumineuse (max 2Mo pour le stockage local).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      {label && <label className="block text-[10px] uppercase tracking-widest text-muted">{label}</label>}
      
      <div className="flex gap-4 mb-2">
        <button 
          type="button"
          onClick={() => setMode('url')}
          className={cn(
            "text-[10px] uppercase tracking-widest pb-1 border-b transition-all",
            mode === 'url' ? "border-ink text-ink" : "border-transparent text-muted"
          )}
        >
          <LinkIcon size={12} className="inline mr-1" /> URL
        </button>
        <button 
          type="button"
          onClick={() => setMode('file')}
          className={cn(
            "text-[10px] uppercase tracking-widest pb-1 border-b transition-all",
            mode === 'file' ? "border-ink text-ink" : "border-transparent text-muted"
          )}
        >
          <Upload size={12} className="inline mr-1" /> Fichier
        </button>
      </div>

      <div className="relative group">
        {value ? (
          <div className="relative aspect-video bg-accent overflow-hidden border border-ink/5">
            <img src={value} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <button 
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm text-ink hover:bg-ink hover:text-bg transition-all"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => mode === 'file' && fileInputRef.current?.click()}
            className={cn(
              "aspect-video border-2 border-dashed border-ink/10 flex flex-col items-center justify-center gap-3 text-muted transition-all",
              mode === 'file' ? "cursor-pointer hover:border-ink/30 hover:bg-accent" : "cursor-default"
            )}
          >
            {mode === 'url' ? (
              <div className="w-full px-4">
                <input 
                  type="text"
                  placeholder="Coller l'URL de l'image ici..."
                  className="w-full bg-transparent border-b border-ink/20 py-2 text-center text-sm outline-none focus:border-ink"
                  onChange={(e) => onChange(e.target.value)}
                />
              </div>
            ) : (
              <>
                <Upload size={24} />
                <span className="text-[10px] uppercase tracking-widest">Choisir un fichier</span>
                <span className="text-[8px] text-muted italic">Max 2Mo</span>
              </>
            )}
          </div>
        )}
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
