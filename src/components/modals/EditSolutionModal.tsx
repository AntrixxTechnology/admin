import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Layers,
  Sparkles,
  HelpCircle,
  Eye,
  Settings,
  ChevronRight,
} from 'lucide-react';
import type { SolutionItem, SolutionSubProduct, SolutionScopeCard, SolutionBadge } from '../../api/client';
import { uploadImage, getImageUrl } from '../../api/client';

interface EditSolutionModalProps {
  solution: Partial<SolutionItem>;
  token: string;
  onSave: (saved: SolutionItem) => Promise<void>;
  onClose: () => void;
}

export const EditSolutionModal: React.FC<EditSolutionModalProps> = ({
  solution: initialData,
  token,
  onSave,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'scope' | 'services' | 'equipment'>('hero');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  // Form State with 100% prefill and smart defaults
  const [formData, setFormData] = useState<SolutionItem>({
    id: initialData.id || '',
    slug: initialData.slug || '',
    title: initialData.title || '',
    category: initialData.category || 'Industrial Solutions',
    short_description: initialData.short_description || '',
    full_description: initialData.full_description || '',
    icon_name: initialData.icon_name || 'Wind',
    hero_image_url: initialData.hero_image_url || '',
    badge_highlights: initialData.badge_highlights && initialData.badge_highlights.length > 0
      ? initialData.badge_highlights
      : [
          { title: 'High Efficiency', desc: 'Maximum performance with low emissions', icon_name: 'ShieldCheck' },
          { title: 'Reliable Operation', desc: 'Built for continuous industrial performance', icon_name: 'Cpu' },
          { title: 'Sustainable Solutions', desc: 'Cleaner environment, better tomorrow', icon_name: 'Leaf' },
        ],
    scope_cards: initialData.scope_cards && initialData.scope_cards.length > 0
      ? initialData.scope_cards
      : (initialData.features && initialData.features.length > 0
          ? initialData.features.map((f, idx) => ({
              title: f.split(' - ')[0] || f,
              description: f.split(' - ')[1] || `Advanced engineering design ensuring peak performance.`,
              icon_name: idx % 3 === 0 ? 'Wind' : idx % 3 === 1 ? 'Layers' : 'Droplets'
            }))
          : [
              { title: 'System Design & Engineering', description: 'Engineered for continuous heavy-duty industrial duty.', icon_name: 'Wind' },
              { title: 'High Efficiency Filtration', description: 'Advanced particulate capture with clean air compliance.', icon_name: 'Layers' },
              { title: 'Turnkey Integration', description: 'Complete manufacturing, erection, and commissioning.', icon_name: 'Droplets' },
            ]
        ),
    products_and_services: initialData.products_and_services && initialData.products_and_services.length > 0
      ? initialData.products_and_services
      : (initialData.deliverables && initialData.deliverables.length > 0
          ? initialData.deliverables
          : [
              'System Design & Engineering',
              'Installation & Commissioning',
              'Spare Parts & Accessories',
              'Performance Optimization',
              'Retrofit & Upgradation',
              'AMC & Maintenance Contracts'
            ]
        ),
    sub_products: initialData.sub_products && initialData.sub_products.length > 0
      ? initialData.sub_products
      : [
          {
            id: 'sub-1',
            name: initialData.title || 'Core Equipment System',
            image_url: initialData.hero_image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
            description: initialData.short_description || '',
            technical_specs: initialData.technical_specs && Object.keys(initialData.technical_specs).length > 0
              ? initialData.technical_specs
              : {
                  'Application': 'Cement, Power, Steel, Food, Chemical & more',
                  'Operating Capacity': 'Customized as per process requirement',
                  'Material of Construction': 'Mild Steel / SS316 / Special Alloys',
                  'Efficiency Standard': 'Guaranteed > 98% collection efficiency',
                }
          }
        ],
    features: initialData.features || [],
    deliverables: initialData.deliverables || [],
    technical_specs: initialData.technical_specs || {},
    sort_order: initialData.sort_order || 1,
    is_published: initialData.is_published !== undefined ? initialData.is_published : true,
  });

  // Handle uploading hero image or subproduct image
  const handleUploadImage = async (file: File, target: 'hero' | { subIndex: number }) => {
    try {
      setUploadingImage(target === 'hero' ? 'hero' : `sub-${(target as any).subIndex}`);
      setError('');
      const uploadedUrl = await uploadImage(file, 'solutions');
      const finalUrl = getImageUrl(uploadedUrl);

      if (target === 'hero') {
        setFormData((prev) => ({ ...prev, hero_image_url: finalUrl }));
      } else {
        const subIndex = (target as any).subIndex;
        setFormData((prev) => {
          const updatedSubs = [...prev.sub_products!];
          updatedSubs[subIndex] = { ...updatedSubs[subIndex], image_url: finalUrl };
          return { ...prev, sub_products: updatedSubs };
        });
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(null);
    }
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug || generateSlug(val),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a Solution Title.');
      return;
    }
    if (!formData.slug.trim()) {
      formData.slug = generateSlug(formData.title);
    }
    setSaving(true);
    setError('');
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save solution.');
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-inkBlack/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl border border-gray-200 max-w-4xl w-full my-8 max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-body text-xs">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-200 bg-[#FAFAFC] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold text-amberAccent uppercase tracking-widest block font-display">
              {formData.id ? 'EDITING SOLUTION' : 'CREATE NEW SOLUTION'}
            </span>
            <h3 className="font-display text-lg font-extrabold text-[#111] flex items-center gap-2">
              {formData.title || 'Untitled Solution'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-white px-5 shrink-0 overflow-x-auto">
          {[
            { id: 'hero', label: '1. Hero & Badges', badge: 'Top Banner' },
            { id: 'scope', label: '2. What We Cover', badge: 'Scope Cards' },
            { id: 'services', label: '3. Products & Services', badge: 'Checklist' },
            { id: 'equipment', label: '4. Equipment & Specs Table', badge: 'Equipment Specs' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 font-display font-bold text-xs border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-amberAccent text-amberAccent'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-amberAccent/10 text-amberAccent' : 'bg-gray-100 text-gray-400'}`}>
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: HERO & BADGES */}
          {/* ========================================================================= */}
          {activeTab === 'hero' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-blue-900 text-[11px] flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded">Where it appears</span>
                <span>Ye saari fields solution page ke sabse top dark banner me render hoti hain.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Solution Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Pollution Control Equipment"
                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-amberAccent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. pollution-control-equipment"
                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-amberAccent focus:outline-none font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Environmental & Emission Systems"
                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-amberAccent focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Sort Order</label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-amberAccent focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                      <input
                        type="checkbox"
                        checked={formData.is_published}
                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                        className="w-4 h-4 text-amberAccent rounded"
                      />
                      <span>Published (Live)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Hero Background Photo</label>
                <div className="flex items-center gap-4">
                  {formData.hero_image_url ? (
                    <div className="h-20 w-36 rounded-xl overflow-hidden border border-gray-300 bg-offWhite shrink-0 relative shadow-sm">
                      <img src={getImageUrl(formData.hero_image_url)} alt="Hero" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-20 w-36 rounded-xl border border-dashed border-gray-300 bg-offWhite flex items-center justify-center text-gray-400 shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 block">Select image from computer:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleUploadImage(e.target.files[0], 'hero')}
                      disabled={uploadingImage === 'hero'}
                      className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amberAccent/10 file:text-amberAccent hover:file:bg-amberAccent/20"
                    />
                    {uploadingImage === 'hero' && <span className="text-amberAccent font-bold text-[11px]">Uploading image...</span>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hero Subtitle / Tagline</label>
                <textarea
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="e.g. Advanced, reliable & energy-efficient solutions for clean air..."
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-amberAccent focus:outline-none"
                />
              </div>

              {/* 3 Value Proposition Badges */}
              <div className="space-y-3 pt-2">
                <label className="block font-bold text-gray-700">3 Hero Highlights Badges (Bottom of dark banner)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {formData.badge_highlights?.map((b, idx) => (
                    <div key={idx} className="p-3 bg-offWhite rounded-xl border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[10px] text-gray-500 uppercase">Badge #{idx + 1}</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Badge Title"
                        value={b.title}
                        onChange={(e) => {
                          const updated = [...formData.badge_highlights!];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setFormData({ ...formData, badge_highlights: updated });
                        }}
                        className="w-full p-1.5 font-bold rounded border border-gray-300 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Badge Description"
                        value={b.desc}
                        onChange={(e) => {
                          const updated = [...formData.badge_highlights!];
                          updated[idx] = { ...updated[idx], desc: e.target.value };
                          setFormData({ ...formData, badge_highlights: updated });
                        }}
                        className="w-full p-1.5 text-[11px] rounded border border-gray-300 text-gray-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: WHAT WE COVER (SCOPE CARDS) */}
          {/* ========================================================================= */}
          {activeTab === 'scope' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h4 className="font-display font-extrabold text-sm text-inkBlack">Engineering Scope Cards</h4>
                  <p className="text-gray-500 text-[11px]">Add or customize the core service cards shown in What We Cover.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      scope_cards: [
                        ...(formData.scope_cards || []),
                        { title: 'New Sub-System', description: 'Describe engineering details and performance...', icon_name: 'Wind' },
                      ],
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-amberAccent hover:bg-amberAccentDark text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Scope Card
                </button>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Scope Overview Paragraph</label>
                <textarea
                  rows={3}
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  placeholder="e.g. We design, engineer and deliver advanced air pollution control systems that ensure cleaner air..."
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-amberAccent focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="block font-bold text-gray-700">Engineering Scope Cards</label>
                <div className="space-y-3">
                  {formData.scope_cards?.map((card, idx) => (
                    <div key={idx} className="p-4 bg-offWhite rounded-xl border border-gray-200 space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-amberAccent flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" /> Scope Card #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.scope_cards!.filter((_, i) => i !== idx);
                            setFormData({ ...formData, scope_cards: updated });
                          }}
                          className="p-1 rounded text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Card Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Cyclone Dust Collector"
                            value={card.title}
                            onChange={(e) => {
                              const updated = [...formData.scope_cards!];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setFormData({ ...formData, scope_cards: updated });
                            }}
                            className="w-full p-2 rounded-lg border border-gray-300 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Icon Name</label>
                          <select
                            value={card.icon_name || 'Wind'}
                            onChange={(e) => {
                              const updated = [...formData.scope_cards!];
                              updated[idx] = { ...updated[idx], icon_name: e.target.value };
                              setFormData({ ...formData, scope_cards: updated });
                            }}
                            className="w-full p-2 rounded-lg border border-gray-300 bg-white"
                          >
                            <option value="Wind">Wind (Cyclone)</option>
                            <option value="Layers">Layers (Bag Filter)</option>
                            <option value="Droplets">Droplets (Scrubber)</option>
                            <option value="Cpu">Cpu (Automation)</option>
                            <option value="ShieldCheck">ShieldCheck (Efficiency)</option>
                            <option value="Zap">Zap (Energy)</option>
                            <option value="Wrench">Wrench (Service)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Card Description</label>
                        <textarea
                          rows={2}
                          placeholder="Cyclone dust collectors use centrifugal force to separate and collect coarse particles..."
                          value={card.description}
                          onChange={(e) => {
                            const updated = [...formData.scope_cards!];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            setFormData({ ...formData, scope_cards: updated });
                          }}
                          className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: PRODUCTS & SERVICES (3-COLUMN MATRIX CHECKLIST) */}
          {/* ========================================================================= */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h4 className="font-display font-extrabold text-sm text-inkBlack">Products & Services Checklist</h4>
                  <p className="text-gray-500 text-[11px]">List all deliverables and service offerings for this solution.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      products_and_services: [
                        ...(formData.products_and_services || []),
                        'New Offering / Service Scope',
                      ],
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-amberAccent hover:bg-amberAccentDark text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Checklist Item
                </button>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formData.products_and_services?.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-offWhite rounded-lg border border-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-amberAccent shrink-0" />
                      <input
                        type="text"
                        value={service}
                        onChange={(e) => {
                          const updated = [...formData.products_and_services!];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, products_and_services: updated });
                        }}
                        className="flex-1 p-1 bg-transparent text-xs font-semibold focus:outline-none border-b border-gray-300 focus:border-amberAccent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.products_and_services!.filter((_, i) => i !== idx);
                          setFormData({ ...formData, products_and_services: updated });
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: EQUIPMENT CAROUSEL & TECHNICAL SPECS TABLE */}
          {/* ========================================================================= */}
          {activeTab === 'equipment' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h4 className="font-display font-extrabold text-sm text-inkBlack">Equipment Models & Specifications</h4>
                  <p className="text-gray-500 text-[11px]">Manage equipment units, carousel photos, and technical specifications.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      sub_products: [
                        ...(formData.sub_products || []),
                        {
                          id: `prod-${Date.now()}`,
                          name: 'New Equipment Model',
                          image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
                          description: 'High performance industrial equipment description...',
                          technical_specs: {
                            'Application': 'Cement, Power, Steel & Manufacturing',
                            'Capacity': 'Standard / Custom design',
                            'Material': 'Mild Steel / SS316',
                          },
                        },
                      ],
                    });
                  }}
                  className="px-2.5 py-1.5 rounded-md bg-amberAccent text-white font-bold text-[11px] flex items-center gap-1 shrink-0 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Equipment Card
                </button>
              </div>

              <div className="space-y-6">
                {formData.sub_products?.map((prod, pIdx) => (
                  <div key={prod.id || pIdx} className="p-5 bg-offWhite rounded-2xl border-2 border-gray-200 space-y-4">
                    
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <h4 className="font-display font-extrabold text-sm text-[#111] flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-amberAccent text-white flex items-center justify-center text-xs font-black">
                          {pIdx + 1}
                        </span>
                        <span>Equipment: {prod.name}</span>
                      </h4>

                      {formData.sub_products!.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.sub_products!.filter((_, i) => i !== pIdx);
                            setFormData({ ...formData, sub_products: updated });
                          }}
                          className="px-2 py-1 rounded text-red-600 hover:bg-red-50 text-[11px] font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove Equipment
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                      {/* Product Image & Uploader */}
                      <div className="sm:col-span-4 space-y-2">
                        <label className="block text-[11px] font-bold text-gray-700">Equipment Photo (Carousel Card)</label>
                        <div className="h-32 w-full rounded-xl overflow-hidden border border-gray-300 bg-white relative">
                          <img src={getImageUrl(prod.image_url)} alt={prod.name} className="w-full h-full object-cover" />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleUploadImage(e.target.files[0], { subIndex: pIdx })}
                          disabled={uploadingImage === `sub-${pIdx}`}
                          className="w-full text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-amberAccent/10 file:text-amberAccent"
                        />
                        {uploadingImage === `sub-${pIdx}` && <span className="text-amberAccent font-bold text-[10px]">Uploading photo...</span>}
                      </div>

                      {/* Product Details */}
                      <div className="sm:col-span-8 space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-0.5">Equipment Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Cyclone Dust Collector"
                            value={prod.name}
                            onChange={(e) => {
                              const updated = [...formData.sub_products!];
                              updated[pIdx] = { ...updated[pIdx], name: e.target.value };
                              setFormData({ ...formData, sub_products: updated });
                            }}
                            className="w-full p-2 rounded-lg border border-gray-300 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-0.5">Short Sub-Description (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Centrifugal particulate separator for high dust load..."
                            value={prod.description || ''}
                            onChange={(e) => {
                              const updated = [...formData.sub_products!];
                              updated[pIdx] = { ...updated[pIdx], description: e.target.value };
                              setFormData({ ...formData, sub_products: updated });
                            }}
                            className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Friendly Key-Value Technical Specifications Table */}
                    <div className="pt-2 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-extrabold text-gray-800">
                          Technical Specifications Table for <span className="text-amberAccent">{prod.name}</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.sub_products!];
                            const currentSpecs = updated[pIdx].technical_specs || {};
                            updated[pIdx].technical_specs = {
                              ...currentSpecs,
                              [`Param_${Object.keys(currentSpecs).length + 1}`]: 'Spec Value',
                            };
                            setFormData({ ...formData, sub_products: updated });
                          }}
                          className="px-2 py-1 rounded bg-amberAccent/10 text-amberAccent hover:bg-amberAccent/20 font-bold text-[10px] flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Spec Row
                        </button>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#FAFAFC] text-gray-500 font-bold uppercase text-[10px] border-b border-gray-200">
                            <tr>
                              <th className="p-2.5 w-1/3">Parameter Name</th>
                              <th className="p-2.5">Specification Value</th>
                              <th className="p-2.5 w-10 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {prod.technical_specs && Object.entries(prod.technical_specs).length > 0 ? (
                              Object.entries(prod.technical_specs).map(([sKey, sVal], rowIdx) => (
                                <tr key={rowIdx}>
                                  <td className="p-2 align-top">
                                    <input
                                      type="text"
                                      value={sKey}
                                      onChange={(e) => {
                                        const newKey = e.target.value;
                                        const updated = [...formData.sub_products!];
                                        const entries = Object.entries(updated[pIdx].technical_specs || {});
                                        const newSpecs: Record<string, string> = {};
                                        entries.forEach(([k, v], i) => {
                                          if (i === rowIdx) {
                                            newSpecs[newKey] = v;
                                          } else {
                                            newSpecs[k] = v;
                                          }
                                        });
                                        updated[pIdx].technical_specs = newSpecs;
                                        setFormData({ ...formData, sub_products: updated });
                                      }}
                                      className="w-full p-1.5 bg-offWhite rounded border border-gray-200 font-bold text-xs"
                                    />
                                  </td>
                                  <td className="p-2 align-top">
                                    <input
                                      type="text"
                                      value={sVal}
                                      onChange={(e) => {
                                        const newVal = e.target.value;
                                        const updated = [...formData.sub_products!];
                                        const currentSpecs = { ...updated[pIdx].technical_specs };
                                        currentSpecs[sKey] = newVal;
                                        updated[pIdx].technical_specs = currentSpecs;
                                        setFormData({ ...formData, sub_products: updated });
                                      }}
                                      className="w-full p-1.5 bg-offWhite rounded border border-gray-200 text-xs"
                                    />
                                  </td>
                                  <td className="p-2 text-center align-top">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...formData.sub_products!];
                                        const currentSpecs = { ...updated[pIdx].technical_specs };
                                        delete currentSpecs[sKey];
                                        updated[pIdx].technical_specs = currentSpecs;
                                        setFormData({ ...formData, sub_products: updated });
                                      }}
                                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={3} className="p-4 text-center text-gray-400 text-xs">
                                  No specifications added yet. Click "+ Add Spec Row" above.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="border-t border-gray-200 pt-4 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-amberAccent hover:bg-amberAccentDark text-white font-display font-bold text-xs uppercase tracking-wider shadow-amberGlow transition-colors disabled:opacity-50"
            >
              {saving ? 'SAVING CHANGES...' : 'SAVE SOLUTION CHANGES'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
