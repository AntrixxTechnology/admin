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
  ListOrdered,
  List,
} from 'lucide-react';
import type { SolutionItem, SolutionSubProduct, SolutionScopeCard, SolutionBadge } from '../../api/client';
import { uploadImage, getImageUrl } from '../../api/client';

const STANDARD_INDUSTRIAL_OFFERINGS = [
  'Turnkey Project Execution',
  'System Design & Engineering',
  'Installation & Commissioning',
  'Spare Parts & Accessories',
  'AMC & Annual Maintenance Contracts',
  'Performance Optimization',
  'Retrofit & Upgradation',
  'Operation & Maintenance',
  'Ducting Design & Fabrication',
  'Pollution Monitoring Solutions',
  'Safety Interlock & Fuel Shut-off Skid',
  'Deaerator & Feed Tank Modernization',
  'Draft Optimization with VFD-driven ID/FD Fans',
  'Comprehensive Thermal Efficiency Audits',
  'Refractory Upgrades & Insulation',
  'PLC & HMI SCADA Integration',
  'Energy Audit & Heat Recovery Solutions',
  'Emission Compliance Verification',
];

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
  const [showDescPreview, setShowDescPreview] = useState(false);
  const [customServiceInput, setCustomServiceInput] = useState('');

  const handleAddService = (serviceName: string) => {
    const trimmed = serviceName.trim();
    if (!trimmed) return;
    const current = formData.products_and_services || [];
    if (!current.includes(trimmed)) {
      setFormData({
        ...formData,
        products_and_services: [...current, trimmed],
      });
    }
  };

  const handleAddNumberedPoint = () => {
    const current = formData.full_description || '';
    const numbers = [...current.matchAll(/(?:^|\n)\s*(\d+)[\.\)]/g)].map((m) => parseInt(m[1], 10));
    const nextNum = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
    const prefix = current.length > 0 && !current.endsWith('\n') ? '\n' : '';
    setFormData({
      ...formData,
      full_description: `${current}${prefix}${nextNum}. `,
    });
  };

  const handleAddBulletPoint = () => {
    const current = formData.full_description || '';
    const prefix = current.length > 0 && !current.endsWith('\n') ? '\n' : '';
    setFormData({
      ...formData,
      full_description: `${current}${prefix}• `,
    });
  };

  const handleAutoNumberLines = () => {
    const current = formData.full_description || '';
    if (!current.trim()) return;
    const lines = current.split('\n');
    let num = 1;
    const converted = lines
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        const clean = trimmed.replace(/^(\d+[\.\)]|[•\-\*])\s*/, '');
        return `${num++}. ${clean}`;
      })
      .join('\n');
    setFormData({ ...formData, full_description: converted });
  };

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
            image_url: initialData.hero_image_url || 'https://cjaeubdycgnwgfkbddvb.supabase.co/storage/v1/object/public/general/boiler_retrofit_thermic_heater_industrial.jpg',
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
                <span>These fields configure the main header banner, title, and key highlight badges on the solution page.</span>
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

              {/* Hero Highlights Badges */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                  <div>
                    <label className="block font-bold text-gray-800 text-xs">
                      Hero Highlights Badges (Dark banner bottom)
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Feature badges highlighting efficiency, reliability, and certifications.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const current = formData.badge_highlights || [];
                      setFormData({
                        ...formData,
                        badge_highlights: [
                          ...current,
                          {
                            title: 'Industrial Standard',
                            desc: 'Engineered for continuous uptime & compliance',
                            icon_name: 'ShieldCheck',
                          },
                        ],
                      });
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-amberAccent hover:bg-amberAccentDark text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow-sm transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Badge Highlight
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {formData.badge_highlights?.map((b, idx) => (
                    <div key={idx} className="p-3 bg-offWhite rounded-xl border border-gray-200 space-y-2 relative group">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[10px] text-amberAccent uppercase flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Badge #{idx + 1}
                        </span>
                        {formData.badge_highlights && formData.badge_highlights.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.badge_highlights!.filter((_, i) => i !== idx);
                              setFormData({ ...formData, badge_highlights: updated });
                            }}
                            className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                            title="Remove Badge"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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
                        className="w-full p-2 font-bold rounded-lg border border-gray-300 text-xs focus:border-amberAccent focus:outline-none"
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
                        className="w-full p-2 text-[11px] rounded-lg border border-gray-300 text-gray-600 focus:border-amberAccent focus:outline-none"
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

              <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block font-bold text-gray-800 text-xs">
                      What We Cover Overview & Bullet Highlights
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Supports plain text, numbered lists (1. 2. 3.), or dot bullets (•). Live site formats them into modern numbered badges.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={handleAddNumberedPoint}
                      className="px-2.5 py-1 rounded bg-amberAccent/10 hover:bg-amberAccent/20 text-[#A86400] font-bold text-[11px] flex items-center gap-1 border border-amberAccent/30 transition-colors"
                      title="Add next numbered point automatically"
                    >
                      <ListOrdered className="w-3.5 h-3.5" /> + Numbered Point (1, 2, 3)
                    </button>
                    <button
                      type="button"
                      onClick={handleAddBulletPoint}
                      className="px-2.5 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-[11px] flex items-center gap-1 transition-colors"
                      title="Add a dot bullet point"
                    >
                      <List className="w-3.5 h-3.5" /> + Bullet (•)
                    </button>
                    <button
                      type="button"
                      onClick={handleAutoNumberLines}
                      className="px-2 py-1 rounded bg-white hover:bg-gray-100 text-gray-700 font-semibold text-[10px] border border-gray-300 transition-colors"
                      title="Convert all current lines into 1. 2. 3. numbers"
                    >
                      Auto-Number Lines
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDescPreview(!showDescPreview)}
                      className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 border transition-colors ${
                        showDescPreview
                          ? 'bg-amberAccent text-white border-amberAccent'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <Eye className="w-3 h-3" /> {showDescPreview ? 'Hide Preview' : 'Preview Live'}
                    </button>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  placeholder="e.g.&#10;1. Continuous particulate emission control with high reliability&#10;2. Automated pulse jet cleaning without process stoppage&#10;3. Turnkey industrial ducting and fan balance"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-amberAccent focus:ring-1 focus:ring-amberAccent focus:outline-none font-mono text-xs leading-relaxed bg-white"
                />

                {showDescPreview && (
                  <div className="p-3 bg-white border border-amberAccent/30 rounded-lg shadow-sm space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amberAccent flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Live Frontend Preview
                    </span>
                    <div className="space-y-2 text-xs">
                      {formData.full_description?.split('\n').filter(Boolean).map((line, lIdx) => {
                        const numMatch = line.match(/^(\d+)[\.\)]\s*(.*)/);
                        if (numMatch) {
                          return (
                            <div key={lIdx} className="flex items-start gap-2 text-gray-700">
                              <span className="w-4 h-4 rounded-full bg-amberAccent/20 text-[#A86400] font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5 border border-amberAccent/40">
                                {numMatch[1]}
                              </span>
                              <span>{numMatch[2]}</span>
                            </div>
                          );
                        }
                        const bulletMatch = line.match(/^[•\-\*]\s*(.*)/);
                        if (bulletMatch) {
                          return (
                            <div key={lIdx} className="flex items-start gap-2 text-gray-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-amberAccent shrink-0 mt-1.5" />
                              <span>{bulletMatch[1]}</span>
                            </div>
                          );
                        }
                        return <p key={lIdx} className="text-gray-600">{line}</p>;
                      })}
                    </div>
                  </div>
                )}
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
              <div className="pb-3 border-b border-gray-200">
                <h4 className="font-display font-extrabold text-sm text-inkBlack">Products & Services Checklist</h4>
                <p className="text-gray-500 text-[11px]">Manage deliverables and service offerings displayed on the solution page.</p>
              </div>

              {/* Quick Add Section: Dropdown + Custom Input */}
              <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200 space-y-3">
                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block">
                  Add Deliverables & Scope
                </span>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                  {/* Standard Offerings Dropdown */}
                  <div className="md:col-span-6">
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddService(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="w-full p-2.5 bg-white rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 focus:border-amberAccent focus:outline-none cursor-pointer"
                    >
                      <option value="" disabled>
                        + Select from Standard Process Offerings...
                      </option>
                      {STANDARD_INDUSTRIAL_OFFERINGS.filter(
                        (opt) => !(formData.products_and_services || []).includes(opt)
                      ).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Service Input + Button */}
                  <div className="md:col-span-6 flex gap-2">
                    <input
                      type="text"
                      placeholder="Or type custom service name..."
                      value={customServiceInput}
                      onChange={(e) => setCustomServiceInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (customServiceInput.trim()) {
                            handleAddService(customServiceInput);
                            setCustomServiceInput('');
                          }
                        }
                      }}
                      className="flex-1 p-2 bg-white rounded-lg border border-gray-300 text-xs focus:border-amberAccent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customServiceInput.trim()) {
                          handleAddService(customServiceInput);
                          setCustomServiceInput('');
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-amberAccent hover:bg-amberAccentDark text-white font-bold text-xs shrink-0 flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>

                {/* Quick Add Chips (First 6 unselected standard offerings) */}
                <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-gray-400 font-semibold mr-1">Suggestions:</span>
                  {STANDARD_INDUSTRIAL_OFFERINGS.filter(
                    (opt) => !(formData.products_and_services || []).includes(opt)
                  )
                    .slice(0, 5)
                    .map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleAddService(opt)}
                        className="px-2 py-0.5 rounded-full bg-white hover:bg-amberAccent/10 hover:text-amberAccent border border-gray-200 text-gray-600 text-[10px] font-semibold transition-colors"
                      >
                        + {opt}
                      </button>
                    ))}
                </div>
              </div>

              {/* Active Checklist Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">
                    Active Deliverables ({formData.products_and_services?.length || 0})
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Click text to edit inline or 🗑 to delete
                  </span>
                </div>

                {formData.products_and_services && formData.products_and_services.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {formData.products_and_services.map((service, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-offWhite rounded-lg border border-gray-200 group">
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
                          title="Remove deliverable"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-xs text-gray-400">
                    No deliverables added yet. Use the dropdown above or type a custom service to add items.
                  </div>
                )}
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
                          name: 'Industrial Equipment Unit',
                          image_url: 'https://cjaeubdycgnwgfkbddvb.supabase.co/storage/v1/object/public/general/cyclone_dust_collector_industrial.jpg',
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
