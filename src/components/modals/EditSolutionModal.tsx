import React from 'react';
import { X } from 'lucide-react';
import type { SolutionItem } from '../../api/client';

interface EditSolutionModalProps {
  solution: SolutionItem;
  onSave: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
  onChange: (updated: SolutionItem) => void;
}

export const EditSolutionModal: React.FC<EditSolutionModalProps> = ({
  solution,
  onSave,
  onClose,
  onChange,
}) => {
  return (
    <div
      className="fixed inset-0 bg-inkBlack/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl p-6 border border-gray200 max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto shadow-cardHover">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray200 pb-3">
          <h3 className="font-display text-lg font-extrabold text-inkBlack">
            Edit Solution: <span className="text-amberAccent">{solution.title}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-gray200 text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSave} className="space-y-4 text-xs font-sans">

          <Field label="Title">
            <input
              type="text"
              value={solution.title}
              onChange={(e) => onChange({ ...solution, title: e.target.value })}
              className="input-base"
            />
          </Field>

          <Field label="Category">
            <input
              type="text"
              value={solution.category}
              onChange={(e) => onChange({ ...solution, category: e.target.value })}
              className="input-base"
            />
          </Field>

          <Field label="Short Description">
            <textarea
              rows={2}
              value={solution.short_description}
              onChange={(e) => onChange({ ...solution, short_description: e.target.value })}
              className="input-base resize-none"
            />
          </Field>

          <Field label="Full Overview">
            <textarea
              rows={5}
              value={solution.full_description}
              onChange={(e) => onChange({ ...solution, full_description: e.target.value })}
              className="input-base resize-none"
            />
          </Field>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray200 text-gray-700 font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-amberAccent hover:bg-amberAccentDark text-white font-bold transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Small helper for form fields
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block font-bold text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);
