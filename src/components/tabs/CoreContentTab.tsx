import React, { useState, useEffect } from 'react';
import {
  Save,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Target,
  Eye,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Gauge,
  HelpCircle,
} from 'lucide-react';
import type { HeroContent, AboutContent, SiteSettings } from '../../api/client';
import { updateAdminSingleton, uploadImage, getImageUrl } from '../../api/client';

interface CoreContentTabProps {
  hero: HeroContent | null;
  about: AboutContent | null;
  settings: SiteSettings | null;
  token: string | null;
  onRefresh: () => void;
}

const DEFAULT_ABOUT: Partial<AboutContent> = {
  company_story: 'Antrixx Technology was established by veteran thermal and utility automation engineers dedicated to optimizing industrial energy efficiency across India. Operating extensively across process industries—including food processing, FMCG, rice & agro processing, textiles, beverages, and chemicals—our team specializes in the sales, engineering, installation, and balance-of-plant service for boilers, thermic fluid heaters, hot water generators, steam automation, and industrial water treatment facilities.',
  mission: 'To transform industrial thermal and utility house management by delivering smart automation, precision instrumentation, and turnkey engineering solutions that minimize fuel waste, maximize efficiency, and ensure environmental compliance.',
  vision: 'To be South Asia’s most trusted engineering partner for boiler house optimization, energy loss diagnostics, and sustainable industrial utilities.',
  hero_image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
};

export const CoreContentTab: React.FC<CoreContentTabProps> = ({
  hero,
  about,
  settings,
  token,
  onRefresh,
}) => {
  const [heroForm, setHeroForm] = useState<Partial<HeroContent>>(hero || {});
  const [aboutForm, setAboutForm] = useState<Partial<AboutContent>>({
    ...DEFAULT_ABOUT,
    ...(about || {}),
    company_story: about?.company_story || DEFAULT_ABOUT.company_story,
    mission: about?.mission || DEFAULT_ABOUT.mission,
    vision: about?.vision || DEFAULT_ABOUT.vision,
    hero_image_url: about?.hero_image_url || DEFAULT_ABOUT.hero_image_url,
  });
  const [settingsForm, setSettingsForm] = useState<Partial<SiteSettings>>(settings || {});

  // Sync state whenever async data arrives from backend
  useEffect(() => {
    if (hero) setHeroForm(hero);
  }, [hero]);

  useEffect(() => {
    if (about && Object.keys(about).length > 0) {
      setAboutForm({
        ...DEFAULT_ABOUT,
        ...about,
        company_story: about.company_story || DEFAULT_ABOUT.company_story,
        mission: about.mission || DEFAULT_ABOUT.mission,
        vision: about.vision || DEFAULT_ABOUT.vision,
        hero_image_url: about.hero_image_url || DEFAULT_ABOUT.hero_image_url,
      });
    } else {
      setAboutForm(DEFAULT_ABOUT);
    }
  }, [about]);

  useEffect(() => {
    if (settings) setSettingsForm(settings);
  }, [settings]);

  const [saving, setSaving] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleImageUpload = async (file: File, target: 'hero_1' | 'hero_2' | 'hero_3' | 'about_hero') => {
    try {
      setUploadingTarget(target);
      setError('');
      const uploadedUrl = await uploadImage(file, 'general');
      const fullUrl = getImageUrl(uploadedUrl);

      if (target === 'hero_1') setHeroForm(prev => ({ ...prev, hero_image_1: fullUrl, background_image_url: fullUrl }));
      else if (target === 'hero_2') setHeroForm(prev => ({ ...prev, hero_image_2: fullUrl }));
      else if (target === 'hero_3') setHeroForm(prev => ({ ...prev, hero_image_3: fullUrl }));
      else if (target === 'about_hero') setAboutForm(prev => ({ ...prev, hero_image_url: fullUrl }));
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleSaveHero = async () => {
    if (!token) return;
    setSaving(true); setError(''); setMessage('');
    try {
      const ok = await updateAdminSingleton('/admin/hero', token, heroForm);
      if (ok) {
        setMessage('Homepage Hero (All 3 Banners) updated successfully!');
        onRefresh();
      } else setError('Failed to update hero content.');
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); setTimeout(() => setMessage(''), 4000); }
  };

  const handleSaveAbout = async () => {
    if (!token) return;
    setSaving(true); setError(''); setMessage('');
    try {
      const ok = await updateAdminSingleton('/admin/about', token, aboutForm);
      if (ok) {
        setMessage('About Us story & mission updated successfully!');
        onRefresh();
      } else setError('Failed to update about content.');
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); setTimeout(() => setMessage(''), 4000); }
  };

  const handleSaveSettings = async () => {
    if (!token) return;
    setSaving(true); setError(''); setMessage('');
    try {
      const ok = await updateAdminSingleton('/admin/settings', token, settingsForm);
      if (ok) {
        setMessage('Contact info & header/footer settings updated successfully!');
        onRefresh();
      } else setError('Failed to update settings.');
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); setTimeout(() => setMessage(''), 4000); }
  };

  return (
    <div className="space-y-12 animate-fadeIn font-body text-xs">
      
      {/* Toast Alert */}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 sticky top-4 z-40 shadow-md animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 sticky top-4 z-40 shadow-md animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. VISUAL HOMEPAGE HERO SECTION EDITOR (ALL 3 BANNERS MASONRY GRID) */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-[#FAFAFC] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amberAccent uppercase tracking-widest block font-display">
              HOMEPAGE HERO SECTION (3-BANNER MASONRY GRID)
            </span>
            <h3 className="font-display text-base font-extrabold text-[#111]">
              Edit All 3 Banners As They Appear on Homepage
            </h3>
          </div>
          <button
            onClick={handleSaveHero}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-amberAccent hover:bg-amberAccentDark text-white font-display font-bold text-xs uppercase tracking-wider shadow-amberGlow flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Save Hero (All 3 Banners)
          </button>
        </div>

        {/* Visual 3-Banner Grid Editor */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Banner 1: Left Main Large Banner (7 cols) */}
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-[#0F1318] text-white p-6 sm:p-8 border border-gray-800 shadow-lg flex flex-col justify-between min-h-[460px]">
              <img
                src={getImageUrl(heroForm.hero_image_1 || heroForm.background_image_url) || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop"}
                alt="Banner 1"
                className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1318] via-[#0F1318]/80 to-transparent z-10" />

              <div className="relative z-20 space-y-3">
                <span className="text-[10px] font-bold text-amberAccent uppercase tracking-wider px-2.5 py-1 bg-amberAccent/20 rounded-full border border-amberAccent/30 inline-block font-display">
                  1. Main Left Banner
                </span>

                <div>
                  <label className="text-[10px] text-amberAccent font-bold uppercase tracking-wider block mb-1">
                    Tag Badge Text
                  </label>
                  <input
                    type="text"
                    value={heroForm.badge || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                    placeholder="INDUSTRIAL AUTOMATION & ENERGY SOLUTIONS"
                    className="w-full p-2 rounded-lg bg-white/10 text-amberAccent font-bold border border-amberAccent/30 focus:outline-none focus:border-amberAccent text-xs uppercase tracking-widest font-display"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-300 font-bold uppercase tracking-wider block mb-1">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    value={heroForm.headline || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, headline: e.target.value })}
                    placeholder="Engineering Intelligence."
                    className="w-full p-2 rounded-lg bg-white/10 text-white font-extrabold border border-white/20 focus:outline-none focus:border-amberAccent text-base font-display"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-300 font-bold uppercase tracking-wider block mb-1">
                    Description Text
                  </label>
                  <textarea
                    rows={3}
                    value={heroForm.description || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                    placeholder="Antrixx Technology delivers high-efficiency boiler house automation..."
                    className="w-full p-2 rounded-lg bg-white/10 text-gray-200 font-normal border border-white/20 focus:outline-none focus:border-amberAccent text-xs"
                  />
                </div>
              </div>

              <div className="relative z-20 pt-4 border-t border-white/10">
                <label className="text-[10px] text-gray-300 font-bold uppercase tracking-wider block mb-1">
                  Replace Main Banner Image
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'hero_1')}
                    disabled={uploadingTarget === 'hero_1'}
                    className="text-xs text-gray-300 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-amberAccent/20 file:text-amberAccent"
                  />
                  {uploadingTarget === 'hero_1' && <span className="text-amberAccent font-bold text-xs">Uploading...</span>}
                </div>
              </div>
            </div>

            {/* Right Column: Banners 2 & 3 Stacked (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Banner 2: Top Right Banner */}
              <div className="relative rounded-2xl overflow-hidden bg-[#0F1318] text-white p-5 border border-gray-800 shadow-md min-h-[220px] flex flex-col justify-between">
                <img
                  src={getImageUrl(heroForm.hero_image_2) || "https://images.unsplash.com/photo-1580982327559-c1202864eb05?q=80&w=800&auto=format&fit=crop"}
                  alt="Banner 2"
                  className="absolute inset-0 w-full h-full object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1318] via-[#0F1318]/70 to-transparent z-10" />

                <div className="relative z-20 space-y-2">
                  <span className="text-[10px] font-bold text-amberAccent uppercase tracking-wider px-2 py-0.5 bg-amberAccent/20 rounded-full border border-amberAccent/30 inline-block font-display">
                    2. Top-Right Banner
                  </span>

                  <div>
                    <label className="text-[10px] text-gray-300 font-bold uppercase block mb-0.5">Card Title</label>
                    <input
                      type="text"
                      value={heroForm.card_2_title || 'SCADA Telemetry'}
                      onChange={(e) => setHeroForm({ ...heroForm, card_2_title: e.target.value })}
                      placeholder="SCADA Telemetry"
                      className="w-full p-2 rounded-lg bg-white/10 text-white font-bold border border-white/20 text-xs focus:outline-none focus:border-amberAccent font-display"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-300 font-bold uppercase block mb-0.5">Link URL</label>
                    <input
                      type="text"
                      value={heroForm.card_2_link || '/solutions/utility-remote-monitoring'}
                      onChange={(e) => setHeroForm({ ...heroForm, card_2_link: e.target.value })}
                      placeholder="/solutions/utility-remote-monitoring"
                      className="w-full p-1.5 rounded-lg bg-white/10 text-amberAccent text-[11px] font-mono border border-white/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="relative z-20 pt-2 border-t border-white/10">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'hero_2')}
                    disabled={uploadingTarget === 'hero_2'}
                    className="text-xs text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-amberAccent/20 file:text-amberAccent"
                  />
                  {uploadingTarget === 'hero_2' && <span className="text-amberAccent font-bold text-[10px]">Uploading...</span>}
                </div>
              </div>

              {/* Banner 3: Bottom Right Banner */}
              <div className="relative rounded-2xl overflow-hidden bg-[#0F1318] text-white p-5 border border-gray-800 shadow-md min-h-[220px] flex flex-col justify-between">
                <img
                  src={getImageUrl(heroForm.hero_image_3) || "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?q=80&w=800&auto=format&fit=crop"}
                  alt="Banner 3"
                  className="absolute inset-0 w-full h-full object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1318] via-[#0F1318]/70 to-transparent z-10" />

                <div className="relative z-20 space-y-2">
                  <span className="text-[10px] font-bold text-amberAccent uppercase tracking-wider px-2 py-0.5 bg-amberAccent/20 rounded-full border border-amberAccent/30 inline-block font-display">
                    3. Bottom-Right Banner
                  </span>

                  <div>
                    <label className="text-[10px] text-gray-300 font-bold uppercase block mb-0.5">Card Title</label>
                    <input
                      type="text"
                      value={heroForm.card_3_title || 'Environment Control'}
                      onChange={(e) => setHeroForm({ ...heroForm, card_3_title: e.target.value })}
                      placeholder="Environment Control"
                      className="w-full p-2 rounded-lg bg-white/10 text-white font-bold border border-white/20 text-xs focus:outline-none focus:border-amberAccent font-display"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-300 font-bold uppercase block mb-0.5">Link URL</label>
                    <input
                      type="text"
                      value={heroForm.card_3_link || '/solutions/pollution-control-equipment'}
                      onChange={(e) => setHeroForm({ ...heroForm, card_3_link: e.target.value })}
                      placeholder="/solutions/pollution-control-equipment"
                      className="w-full p-1.5 rounded-lg bg-white/10 text-amberAccent text-[11px] font-mono border border-white/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="relative z-20 pt-2 border-t border-white/10">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'hero_3')}
                    disabled={uploadingTarget === 'hero_3'}
                    className="text-xs text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-amberAccent/20 file:text-amberAccent"
                  />
                  {uploadingTarget === 'hero_3' && <span className="text-amberAccent font-bold text-[10px]">Uploading...</span>}
                </div>
              </div>

            </div>

          </div>

          {/* SCADA Telemetry Values */}
          <div className="p-5 rounded-2xl bg-offWhite border border-gray-200 space-y-3">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              SCADA Live Dashboard Gauge Values (Homepage Live Widget)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Plant Efficiency (%)</label>
                <input
                  type="number"
                  value={heroForm.scada_plant_efficiency ?? 94}
                  onChange={(e) => setHeroForm({ ...heroForm, scada_plant_efficiency: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg bg-white border border-gray-300 font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Steam Flow (TPH)</label>
                <input
                  type="number"
                  step="0.1"
                  value={heroForm.scada_steam_flow ?? 14.8}
                  onChange={(e) => setHeroForm({ ...heroForm, scada_steam_flow: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg bg-white border border-gray-300 font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Fuel Burn Rate (Kg/hr)</label>
                <input
                  type="number"
                  value={heroForm.scada_fuel_consumption ?? 850}
                  onChange={(e) => setHeroForm({ ...heroForm, scada_fuel_consumption: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg bg-white border border-gray-300 font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Energy Saved (MWh)</label>
                <input
                  type="number"
                  value={heroForm.scada_energy_saved_mwh ?? 1240}
                  onChange={(e) => setHeroForm({ ...heroForm, scada_energy_saved_mwh: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg bg-white border border-gray-300 font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. VISUAL ABOUT US SECTION EDITOR */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-[#FAFAFC] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amberAccent uppercase tracking-widest block font-display">
              ABOUT US PAGE & COMPANY OVERVIEW
            </span>
            <h3 className="font-display text-base font-extrabold text-[#111]">
              Company Story, Mission, Vision & Core Values
            </h3>
          </div>
          <button
            onClick={handleSaveAbout}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-amberAccent hover:bg-amberAccentDark text-white font-display font-bold text-xs uppercase tracking-wider shadow-amberGlow flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Save About Us
          </button>
        </div>

        {/* Live About Us Mockup */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Story Card */}
            <div className="p-6 rounded-2xl bg-offWhite border border-gray-200 space-y-3">
              <span className="text-[10px] font-bold text-amberAccent uppercase tracking-widest block font-display">
                COMPANY STORY & HERITAGE
              </span>
              <label className="block text-xs font-bold text-inkBlack">
                About Antrixx Technology Paragraph
              </label>
              <textarea
                rows={6}
                value={aboutForm.company_story || ''}
                onChange={(e) => setAboutForm({ ...aboutForm, company_story: e.target.value })}
                placeholder="Antrixx Technology was established by veteran thermal and utility automation engineers..."
                className="w-full p-3 rounded-xl bg-white border border-gray-300 text-xs leading-relaxed focus:outline-none focus:border-amberAccent"
              />
            </div>

            {/* Mission & Vision Cards */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 font-display font-bold text-inkBlack text-sm">
                  <Target className="w-4 h-4 text-amberAccent" /> <span>Our Mission</span>
                </div>
                <textarea
                  rows={2}
                  value={aboutForm.mission || ''}
                  onChange={(e) => setAboutForm({ ...aboutForm, mission: e.target.value })}
                  placeholder="To transform industrial utility operations through smart automation..."
                  className="w-full p-2.5 rounded-lg bg-offWhite border border-gray-200 text-xs focus:outline-none focus:border-amberAccent"
                />
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 font-display font-bold text-inkBlack text-sm">
                  <Eye className="w-4 h-4 text-amberAccent" /> <span>Our Vision</span>
                </div>
                <textarea
                  rows={2}
                  value={aboutForm.vision || ''}
                  onChange={(e) => setAboutForm({ ...aboutForm, vision: e.target.value })}
                  placeholder="To be South Asia’s most trusted thermal optimization partner..."
                  className="w-full p-2.5 rounded-lg bg-offWhite border border-gray-200 text-xs focus:outline-none focus:border-amberAccent"
                />
              </div>
            </div>

          </div>

          {/* About Image Uploader */}
          <div className="p-4 rounded-xl bg-offWhite border border-gray-200 flex items-center gap-4">
            <div className="h-16 w-24 rounded-lg overflow-hidden bg-gray-200 shrink-0">
              <img src={getImageUrl(aboutForm.hero_image_url) || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop"} alt="About" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-1">
              <label className="block text-xs font-bold text-gray-700">About Us Page Featured Team Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'about_hero')}
                disabled={uploadingTarget === 'about_hero'}
                className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:font-bold file:bg-amberAccent/10 file:text-amberAccent"
              />
              {uploadingTarget === 'about_hero' && <span className="text-amberAccent font-bold text-xs">Uploading...</span>}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. VISUAL CONTACT & HEADER/FOOTER SETTINGS */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-[#FAFAFC] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amberAccent uppercase tracking-widest block font-display">
              GLOBAL CONTACT SETTINGS (HEADER, FOOTER & POPUPS)
            </span>
            <h3 className="font-display text-base font-extrabold text-[#111]">
              Phone, Email & Business Details
            </h3>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-amberAccent hover:bg-amberAccentDark text-white font-display font-bold text-xs uppercase tracking-wider shadow-amberGlow flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Save Contact Settings
          </button>
        </div>

        {/* Live Topbar Preview Layout */}
        <div className="p-6 space-y-6">
          <div className="p-4 rounded-xl bg-[#0F1318] text-white space-y-3">
            <span className="text-[10px] text-amberAccent font-bold uppercase tracking-wider block">
              Website Header/Footer Bar Live Preview:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                  <Phone className="w-3 h-3 text-amberAccent" /> Primary Phone
                </label>
                <input
                  type="text"
                  value={settingsForm.phone_primary || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone_primary: e.target.value })}
                  placeholder="+91 9748636108"
                  className="w-full p-2 rounded bg-white/10 text-white font-bold border border-white/20 focus:outline-none focus:border-amberAccent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                  <Phone className="w-3 h-3 text-amberAccent" /> Secondary Phone
                </label>
                <input
                  type="text"
                  value={settingsForm.phone_secondary || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone_secondary: e.target.value })}
                  placeholder="+91 9477179885"
                  className="w-full p-2 rounded bg-white/10 text-white font-bold border border-white/20 focus:outline-none focus:border-amberAccent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                  <Mail className="w-3 h-3 text-amberAccent" /> Email Address
                </label>
                <input
                  type="email"
                  value={settingsForm.email || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  placeholder="antrixxtechnology@gmail.com"
                  className="w-full p-2 rounded bg-white/10 text-white font-bold border border-white/20 focus:outline-none focus:border-amberAccent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amberAccent" /> Business Hours
                </label>
                <input
                  type="text"
                  value={settingsForm.business_hours || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, business_hours: e.target.value })}
                  placeholder="Mon - Sat: 9:00 AM - 7:00 PM"
                  className="w-full p-2 rounded bg-white/10 text-white font-bold border border-white/20 focus:outline-none focus:border-amberAccent"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mb-1">
                <MapPin className="w-3 h-3 text-amberAccent" /> Corporate Office Address
              </label>
              <input
                type="text"
                value={settingsForm.address || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                placeholder="e.g. Kolkata, West Bengal, India"
                className="w-full p-2 rounded bg-white/10 text-white font-bold border border-white/20 focus:outline-none focus:border-amberAccent"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
