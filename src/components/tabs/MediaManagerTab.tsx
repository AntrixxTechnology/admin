import React, { useState } from 'react';
import { ImageIcon, UploadCloud, CheckCircle2 } from 'lucide-react';
import { HeroContent, SolutionItem, IndustryItem, ClientLogoItem, uploadImage, getImageUrl } from '../../api/client';

interface MediaManagerTabProps {
  hero: HeroContent | null;
  solutions: SolutionItem[];
  industries: IndustryItem[];
  clientLogos: ClientLogoItem[];
  onRefreshData: () => void;
}

export const MediaManagerTab: React.FC<MediaManagerTabProps> = ({ hero, solutions, industries, clientLogos, onRefreshData }) => {
  const [activeSubTab, setActiveSubTab] = useState<'home' | 'solutions' | 'industries'>('home');
  const [uploading, setUploading] = useState<string | null>(null);

  const handleImageUpload = async (key: string, file: File, entityType: string, id: string) => {
    try {
      setUploading(key);
      const url = await uploadImage(file, 'general');
      
      const token = localStorage.getItem('antrixx_admin_token') || '';
      const { updateAdminSingleton, updateSolution, saveAdminEntity } = await import('../../api/client');

      if (entityType === 'hero') {
        await updateAdminSingleton('/admin/hero', token, { [key]: url });
      } else if (entityType === 'solution') {
        await updateSolution(token, id, { hero_image_url: url });
      } else if (entityType === 'industry') {
        const item = industries.find(i => i.id === id);
        if (item) await saveAdminEntity('/admin/industries', token, { ...item, image_url: url });
      }

      onRefreshData();
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(null);
    }
  };

  const renderUploadBox = (key: string, currentUrl: string | undefined, label: string, entityType: string, id: string = '1') => {
    return (
      <div className="border border-gray200 rounded-xl p-4 flex flex-col gap-3 bg-white shadow-sm hover:border-amberAccent transition-colors">
        <div className="flex justify-between items-center">
          <span className="font-bold text-inkBlack truncate">{label}</span>
          {uploading === key ? <span className="text-xs text-amberAccent shrink-0">Uploading...</span> : null}
        </div>
        <div className="relative group bg-offWhite rounded-lg aspect-video flex items-center justify-center overflow-hidden border border-dashed border-gray300">
          {currentUrl ? (
            <img src={getImageUrl(currentUrl)} alt={label} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-400" />
          )}
          
          <div className="absolute inset-0 bg-inkBlack/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="cursor-pointer flex flex-col items-center text-white">
              <UploadCloud className="w-6 h-6 mb-2" />
              <span className="text-xs font-bold uppercase tracking-wider">Change Image</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files?.[0]) handleImageUpload(key, e.target.files[0], entityType, id);
                }}
              />
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-extrabold text-inkBlack">Media & Thumbnails</h2>
        <p className="text-gray-500 mt-1">Manage and preview all images used across the main website.</p>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-4 border-b border-gray200 mb-6">
        {['home', 'solutions', 'industries'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab as any)}
            className={`pb-3 px-1 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeSubTab === tab ? 'border-amberAccent text-inkBlack' : 'border-transparent text-gray-400 hover:text-inkBlack'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-offWhite p-6 rounded-2xl border border-gray200">
        
        {activeSubTab === 'home' && (
          <div className="space-y-6">
            <h3 className="font-display font-bold text-lg border-b border-gray200 pb-2">Hero Banners</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-full">
                {renderUploadBox('hero_image_1', hero?.hero_image_1, 'Main Left Banner', 'hero')}
              </div>
              <div className="flex flex-col gap-6">
                {renderUploadBox('hero_image_2', hero?.hero_image_2, 'Top Right Banner', 'hero')}
                {renderUploadBox('hero_image_3', hero?.hero_image_3, 'Bottom Right Banner', 'hero')}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'solutions' && (
          <div className="space-y-6">
            <h3 className="font-display font-bold text-lg border-b border-gray200 pb-2">Core Applications Thumbnails</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {solutions.map(sol => (
                <div key={sol.id}>
                  {renderUploadBox(`sol-${sol.id}`, sol.hero_image_url, sol.title, 'solution', sol.id)}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'industries' && (
          <div className="space-y-6">
            <h3 className="font-display font-bold text-lg border-b border-gray200 pb-2">Industries Thumbnails</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {industries.map(ind => (
                <div key={ind.id}>
                  {renderUploadBox(`ind-${ind.id}`, ind.image_url, ind.title, 'industry', ind.id)}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
