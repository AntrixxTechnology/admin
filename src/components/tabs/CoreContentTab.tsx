import React, { useState } from 'react';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { HeroContent, AboutContent, SiteSettings } from '../../api/client';
import { updateAdminSingleton } from '../../api/client';

interface CoreContentTabProps {
  hero: HeroContent | null;
  about: AboutContent | null;
  settings: SiteSettings | null;
  token: string | null;
  onRefresh: () => void;
}

export const CoreContentTab: React.FC<CoreContentTabProps> = ({ hero, about, settings, token, onRefresh }) => {
  const [heroForm, setHeroForm] = useState<Partial<HeroContent>>(hero || {});
  const [aboutForm, setAboutForm] = useState<Partial<AboutContent>>(about || {});
  const [settingsForm, setSettingsForm] = useState<Partial<SiteSettings>>(settings || {});
  
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleImageUpload = async (file: File, type: 'hero' | 'about') => {
    try {
      if (type === 'hero') setUploadingHero(true);
      else setUploadingAbout(true);
      setError('');
      
      const { uploadImage, getImageUrl } = await import('../../api/client');
      const url = await uploadImage(file, 'general');
      const fullUrl = getImageUrl(url);
      
      if (type === 'hero') {
        setHeroForm(prev => ({ ...prev, background_image_url: fullUrl }));
      } else {
        setAboutForm(prev => ({ ...prev, hero_image_url: fullUrl }));
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      if (type === 'hero') setUploadingHero(false);
      else setUploadingAbout(false);
    }
  };

  const handleSaveHero = async () => {
    if (!token) return;
    setSaving(true); setError(''); setMessage('');
    try {
      const ok = await updateAdminSingleton('/admin/hero', token, heroForm);
      if (ok) {
        setMessage('Hero content updated successfully!');
        onRefresh();
      } else setError('Failed to update hero content.');
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); setTimeout(() => setMessage(''), 3000); }
  };

  const handleSaveAbout = async () => {
    if (!token) return;
    setSaving(true); setError(''); setMessage('');
    try {
      const ok = await updateAdminSingleton('/admin/about', token, aboutForm);
      if (ok) {
        setMessage('About content updated successfully!');
        onRefresh();
      } else setError('Failed to update about content.');
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); setTimeout(() => setMessage(''), 3000); }
  };

  const handleSaveSettings = async () => {
    if (!token) return;
    setSaving(true); setError(''); setMessage('');
    try {
      const ok = await updateAdminSingleton('/admin/settings', token, settingsForm);
      if (ok) {
        setMessage('Settings updated successfully!');
        onRefresh();
      } else setError('Failed to update settings.');
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); setTimeout(() => setMessage(''), 3000); }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" /><span>{message}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" /><span>{error}</span>
        </div>
      )}

      {/* --- SITE SETTINGS --- */}
      <section className="bg-white p-6 rounded-2xl shadow-cardHover border border-gray200">
        <h2 className="text-lg font-display font-bold text-inkBlack mb-4 border-b border-gray200 pb-2">Site Settings (Contact Info)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Primary Phone</label>
            <input type="text" value={settingsForm.phone_primary || ''} onChange={(e) => setSettingsForm({...settingsForm, phone_primary: e.target.value})} className="w-full p-2 border border-gray200 rounded-md bg-offWhite" />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">Secondary Phone</label>
            <input type="text" value={settingsForm.phone_secondary || ''} onChange={(e) => setSettingsForm({...settingsForm, phone_secondary: e.target.value})} className="w-full p-2 border border-gray200 rounded-md bg-offWhite" />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">Email Address</label>
            <input type="email" value={settingsForm.email || ''} onChange={(e) => setSettingsForm({...settingsForm, email: e.target.value})} className="w-full p-2 border border-gray200 rounded-md bg-offWhite" />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">Business Hours</label>
            <input type="text" value={settingsForm.business_hours || ''} onChange={(e) => setSettingsForm({...settingsForm, business_hours: e.target.value})} className="w-full p-2 border border-gray200 rounded-md bg-offWhite" />
          </div>
          <div className="md:col-span-2">
            <label className="block font-bold text-gray-700 mb-1">Address</label>
            <input type="text" value={settingsForm.address || ''} onChange={(e) => setSettingsForm({...settingsForm, address: e.target.value})} className="w-full p-2 border border-gray200 rounded-md bg-offWhite" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={handleSaveSettings} disabled={saving} className="btn-primary flex items-center gap-2 px-4 py-2"><Save className="w-4 h-4"/> SAVE SETTINGS</button>
        </div>
      </section>

      {/* --- HERO CONTENT --- */}
      <section className="bg-white p-6 rounded-2xl shadow-cardHover border border-gray200">
        <h2 className="text-lg font-display font-bold text-inkBlack mb-4 border-b border-gray200 pb-2">Homepage Hero Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Badge Text</label>
            <input type="text" value={heroForm.badge || ''} onChange={(e) => setHeroForm({...heroForm, badge: e.target.value})} className="w-full p-2 border border-gray200 rounded-md bg-offWhite" />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">Background Image URL</label>
            <div className="space-y-2">
              {heroForm.background_image_url && (
                <img src={heroForm.background_image_url} alt="Hero bg" className="h-20 w-auto rounded border border-gray200 object-contain bg-offWhite" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'hero')}
                disabled={uploadingHero}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-amberAccent/10 file:text-amberAccent hover:file:bg-amberAccent/20 disabled:opacity-50"
              />
              {uploadingHero && <span className="text-xs text-amberAccent">Uploading...</span>}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block font-bold text-gray-700 mb-1">Headline</label>
            <input type="text" value={heroForm.headline || ''} onChange={(e) => setHeroForm({...heroForm, headline: e.target.value})} className="w-full p-2 border border-gray200 rounded-md bg-offWhite font-bold text-lg" />
          </div>
          <div className="md:col-span-2">
            <label className="block font-bold text-gray-700 mb-1">Accent Text (Gold)</label>
            <input type="text" value={heroForm.accent_text || ''} onChange={(e) => setHeroForm({...heroForm, accent_text: e.target.value})} className="w-full p-2 border border-gray200 rounded-md bg-offWhite font-bold text-lg text-amberAccent" />
          </div>
          <div className="md:col-span-2">
            <label className="block font-bold text-gray-700 mb-1">Description</label>
            <textarea rows={3} value={heroForm.description || ''} onChange={(e) => setHeroForm({...heroForm, description: e.target.value})} className="w-full p-2 border border-gray200 rounded-md bg-offWhite" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={handleSaveHero} disabled={saving} className="btn-primary flex items-center gap-2 px-4 py-2"><Save className="w-4 h-4"/> SAVE HERO</button>
        </div>
      </section>

      {/* --- ABOUT CONTENT --- */}
      <section className="bg-white p-6 rounded-2xl shadow-cardHover border border-gray200">
        <h2 className="text-lg font-display font-bold text-inkBlack mb-4 border-b border-gray200 pb-2">About Us Content</h2>
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Company Story</label>
            <textarea rows={4} value={aboutForm.company_story || ''} onChange={(e) => setAboutForm({...aboutForm, company_story: e.target.value})} className="w-full p-2 border border-gray200 rounded-md bg-offWhite" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Mission</label>
              <textarea rows={3} value={aboutForm.mission || ''} onChange={(e) => setAboutForm({...aboutForm, mission: e.target.value})} className="w-full p-2 border border-gray200 rounded-md bg-offWhite" />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Vision</label>
              <textarea rows={3} value={aboutForm.vision || ''} onChange={(e) => setAboutForm({...aboutForm, vision: e.target.value})} className="w-full p-2 border border-gray200 rounded-md bg-offWhite" />
            </div>
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">About Image</label>
            <div className="space-y-2">
              {aboutForm.hero_image_url && (
                <img src={aboutForm.hero_image_url} alt="About hero" className="h-20 w-auto rounded border border-gray200 object-contain bg-offWhite" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'about')}
                disabled={uploadingAbout}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-amberAccent/10 file:text-amberAccent hover:file:bg-amberAccent/20 disabled:opacity-50"
              />
              {uploadingAbout && <span className="text-xs text-amberAccent">Uploading...</span>}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={handleSaveAbout} disabled={saving} className="btn-primary flex items-center gap-2 px-4 py-2"><Save className="w-4 h-4"/> SAVE ABOUT</button>
        </div>
      </section>

    </div>
  );
};
