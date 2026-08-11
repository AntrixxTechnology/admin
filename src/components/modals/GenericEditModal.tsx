import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export type FieldConfig = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'checkbox' | 'url' | 'image';
  required?: boolean;
};

interface GenericEditModalProps {
  title: string;
  initialData: any;
  fields: FieldConfig[];
  onSave: (data: any) => Promise<boolean>;
  onClose: () => void;
}

export const GenericEditModal: React.FC<GenericEditModalProps> = ({
  title, initialData, fields, onSave, onClose
}) => {
  const [formData, setFormData] = useState<any>(initialData || {});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState('');

  const handleImageUpload = async (key: string, file: File) => {
    try {
      setUploading(prev => ({ ...prev, [key]: true }));
      setError('');
      const { uploadImage, getImageUrl } = await import('../../api/client');
      const url = await uploadImage(file, 'general');
      handleChange(key, getImageUrl(url));
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const ok = await onSave(formData);
      if (ok) onClose();
      else setError('Failed to save changes. Please try again.');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-inkBlack/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl p-6 border border-gray200 max-w-xl w-full max-h-[90vh] flex flex-col shadow-cardHover">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray200 pb-3 mb-4 shrink-0">
          <h3 className="font-display text-lg font-extrabold text-inkBlack">
            {initialData?.id ? 'Edit' : 'Add'} <span className="text-amberAccent">{title}</span>
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-gray200 text-gray-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs shrink-0">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form id="generic-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-2 text-xs font-sans">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block font-bold text-gray-700 mb-1">{f.label} {f.required && <span className="text-red-500">*</span>}</label>
              
              {f.type === 'textarea' ? (
                <textarea 
                  rows={3} 
                  required={f.required}
                  value={formData[f.key] || ''} 
                  onChange={e => handleChange(f.key, e.target.value)}
                  className="w-full p-2 border border-gray200 rounded-md bg-offWhite focus:border-amberAccent focus:outline-none resize-y"
                />
              ) : f.type === 'checkbox' ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={!!formData[f.key]} 
                    onChange={e => handleChange(f.key, e.target.checked)}
                    className="w-4 h-4 text-amberAccent border-gray300 rounded focus:ring-amberAccent"
                  />
                  <span className="text-gray-600">Yes</span>
                </label>
              ) : f.type === 'number' ? (
                <input 
                  type="number" 
                  required={f.required}
                  value={formData[f.key] || 0} 
                  onChange={e => handleChange(f.key, parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray200 rounded-md bg-offWhite focus:border-amberAccent focus:outline-none"
                />
              ) : f.type === 'image' ? (
                <div className="space-y-2">
                  {formData[f.key] && (
                    <img src={formData[f.key]} alt="Preview" className="h-20 w-auto rounded border border-gray200 object-contain bg-offWhite" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => e.target.files?.[0] && handleImageUpload(f.key, e.target.files[0])}
                    disabled={uploading[f.key]}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-amberAccent/10 file:text-amberAccent hover:file:bg-amberAccent/20 disabled:opacity-50"
                  />
                  {uploading[f.key] && <span className="text-xs text-amberAccent">Uploading...</span>}
                </div>
              ) : (
                <input 
                  type={f.type === 'url' ? 'url' : 'text'} 
                  required={f.required}
                  value={formData[f.key] || ''} 
                  onChange={e => handleChange(f.key, e.target.value)}
                  className="w-full p-2 border border-gray200 rounded-md bg-offWhite focus:border-amberAccent focus:outline-none"
                />
              )}
            </div>
          ))}
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray200 mt-4 shrink-0">
          <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray200 text-gray-700 font-bold transition-colors">
            Cancel
          </button>
          <button type="submit" form="generic-form" disabled={saving} className="px-5 py-2 rounded-md bg-amberAccent hover:bg-amberAccentDark text-white font-bold transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

      </div>
    </div>
  );
};
