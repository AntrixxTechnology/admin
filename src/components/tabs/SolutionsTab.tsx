import React from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import type { SolutionItem, IndustryItem } from '../../api/client';

interface SolutionsTabProps {
  solutions: SolutionItem[];
  industries: IndustryItem[];
  onEditSolution: (s: SolutionItem | Partial<SolutionItem>) => void;
  onEditIndustry: (i: IndustryItem | Partial<IndustryItem>) => void;
  onDeleteSolution: (id: string) => void;
  onDeleteIndustry: (id: string) => void;
}

export const SolutionsTab: React.FC<SolutionsTabProps> = ({ 
  solutions, industries, 
  onEditSolution, onEditIndustry,
  onDeleteSolution, onDeleteIndustry
}) => {
  return (
    <div className="space-y-12 animate-fadeIn">
      
      {/* SOLUTIONS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-extrabold text-inkBlack">
            Core Services & Solutions ({solutions.length})
          </h2>
          <button onClick={() => onEditSolution({})} className="btn-primary flex items-center gap-2 text-xs py-1.5 px-3">
            <Plus className="w-3.5 h-3.5" /> Add Solution
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-cardHover border border-gray200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-offWhite text-gray-500 uppercase font-display font-bold border-b border-gray200">
              <tr>
                <th className="p-4">Icon & Title</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray200">
              {solutions.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No solutions loaded.</td></tr>
              ) : solutions.sort((a,b)=>a.sort_order - b.sort_order).map((sol) => (
                <tr key={sol.id} className="hover:bg-offWhite/50 transition-colors">
                  <td className="p-4 font-bold text-inkBlack flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-amberAccent/10 text-amberAccent font-extrabold text-sm flex items-center justify-center shrink-0">
                      {sol.title.charAt(0)}
                    </span>
                    <span>{sol.title}</span>
                  </td>
                  <td className="p-4"><span className="px-2.5 py-1 rounded-full bg-offWhite border border-gray200 text-[10px] font-bold text-gray-600">{sol.category}</span></td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sol.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {sol.is_published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEditSolution(sol)} className="p-1.5 text-gray-500 hover:text-amberAccent hover:bg-amberAccent/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => onDeleteSolution(sol.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-extrabold text-inkBlack">
            Served Industries ({industries.length})
          </h2>
          <button onClick={() => onEditIndustry({})} className="btn-primary flex items-center gap-2 text-xs py-1.5 px-3">
            <Plus className="w-3.5 h-3.5" /> Add Industry
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-cardHover border border-gray200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-offWhite text-gray-500 uppercase font-display font-bold border-b border-gray200">
              <tr>
                <th className="p-4">Title & Slug</th>
                <th className="p-4 text-center">Order</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray200">
              {industries.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No industries loaded.</td></tr>
              ) : industries.sort((a,b)=>a.sort_order - b.sort_order).map((ind) => (
                <tr key={ind.id} className="hover:bg-offWhite/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-inkBlack">{ind.title}</div>
                    <div className="text-gray-500 mt-0.5 font-mono text-[10px]">{ind.slug}</div>
                  </td>
                  <td className="p-4 text-center font-bold">{ind.sort_order}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ind.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {ind.is_published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEditIndustry(ind)} className="p-1.5 text-gray-500 hover:text-amberAccent hover:bg-amberAccent/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => onDeleteIndustry(ind.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};
