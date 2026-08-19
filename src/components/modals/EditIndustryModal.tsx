import React, { useState } from 'react';
import { X, Save, Image as ImageIcon, Sparkles, Factory, Utensils, Coffee, Layers, Wheat, FlaskConical, Zap } from 'lucide-react';
import type { IndustryItem } from '../../api/client';
import { uploadImage, getImageUrl } from '../../api/client';

interface EditIndustryModalProps {
  initialData: Partial<IndustryItem>;
  onSave: (data: Partial<IndustryItem>) => Promise<void>;
  onClose: () => void;
}

const AVAILABLE_ICONS = [
  { name: 'Factory', label: 'Factory / Manufacturing' },
  { name: 'Utensils', label: 'Food Processing' },
  { name: 'Coffee', label: 'Beverages & Breweries' },
  { name: 'Wheat', label: 'Rice & Agro Processing' },
  { name: 'Layers', label: 'Textile & Spinning' },
  { name: 'FlaskConical', label: 'Chemical & Pharma' },
  { name: 'Zap', label: 'Power & Utility' },
];

function renderIconPreview(iconName?: string) {
  const props = { className: 'w-6 h-6 text-amberAccent' };
  switch (iconName) {
    case 'Utensils': return <Utensils {...props} />;
    case 'Coffee': return <Coffee {...props} />;
    case 'Layers': return <Layers {...props} />;
    case 'Wheat': return <Wheat {...props} />;
    case 'FlaskConical': return <FlaskConical {...props} />;
    case 'Zap': return <Zap {...props} />;
    default: return <Factory {...props} />;
  }
}

export const EditIndustryModal: React.FC<EditIndustryModalProps> = ({
  initialData,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Partial<IndustryItem>>({
    id: initialData.id,
    title: initialData.title || '',
    slug: initialData.slug || '',
    description: initialData.description || '',
    icon_name: initialData.icon_name || 'Factory',
    image_url: initialData.image_url || '',
    sort_order: initialData.sort_order || 1,
    is_published: initialData.is_published !== undefined ? initialData.is_published : true,
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      setError('');
      const uploadedUrl = await uploadImage(file, 'industries');
      const finalUrl = getImageUrl(uploadedUrl);
      setFormData((prev) => ({ ...prev, image_url: finalUrl }));
    } catch (err: any) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setError('Please provide an Industry Title.');
      return;
    }
    if (!formData.slug?.trim()) {
      formData.slug = generateSlug(formData.title);
    }
    setSaving(true);
    setError('');
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save industry.');
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-inkBlack/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl border border-gray-200 max-w-xl w-full my-8 flex flex-col shadow-2xl overflow-hidden font-body text-xs">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-200 bg-[#FAFAFC] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amberAccent uppercase tracking-widest block font-display">
              {formData.id ? 'EDITING INDUSTRY' : 'ADD NEW INDUSTRY'}
            </span>
            <h3 className="font-display text-base font-extrabold text-[#111]">
              {formData.title || 'Untitled Industry Vertical'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Live Card Preview */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
            <div className="relative h-40 bg-gray-100 overflow-hidden">
              <img
                src={getImageUrl(formData.image_url) || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop"}
                alt="Industry Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white border border-gray-200 shadow">
                  {renderIconPreview(formData.icon_name)}
                </div>
                <h4 className="font-display text-sm font-extrabold text-white">
                  {formData.title || 'Industry Title'}
                </h4>
              </div>
            </div>

            <div className="p-3 bg-offWhite/50 border-t border-gray-100">
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Replace Industry Cover Photo:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                disabled={uploading}
                className="text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amberAccent/10 file:text-amberAccent hover:file:bg-amberAccent/20"
              />
              {uploading && <span className="text-amberAccent font-bold text-[11px] block mt-1">Uploading photo...</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Industry Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Food Processing & FMCG"
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-amberAccent focus:outline-none text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">URL Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. food-processing"
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-amberAccent focus:outline-none text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Category Icon</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_ICONS.map((icon) => {
                const isSelected = formData.icon_name === icon.name;
                return (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon_name: icon.name })}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-amberAccent bg-amberAccent/10 text-amberAccent font-bold'
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {renderIconPreview(icon.name)}
                    <span className="text-[11px] truncate">{icon.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Description Paragraph</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Clean steam generation, strict temperature controls, and high-efficiency heat recovery..."
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-amberAccent focus:outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1 border-t border-gray-100">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                className="w-full p-2 rounded-lg border border-gray-300 font-bold"
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

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-amberAccent hover:bg-amberAccentDark text-white font-display font-bold text-xs uppercase tracking-wider shadow-amberGlow disabled:opacity-50"
            >
              {saving ? 'SAVING...' : 'SAVE INDUSTRY'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
