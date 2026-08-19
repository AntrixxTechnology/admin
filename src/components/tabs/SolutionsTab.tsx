import React, { useState } from 'react';
import {
  Edit2,
  Plus,
  Trash2,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Leaf,
  Wind,
  Droplets,
  Flame,
  LayoutGrid,
  List,
} from 'lucide-react';
import type { SolutionItem, IndustryItem } from '../../api/client';
import { getImageUrl } from '../../api/client';

interface SolutionsTabProps {
  solutions: SolutionItem[];
  industries: IndustryItem[];
  onEditSolution: (s: SolutionItem | Partial<SolutionItem>) => void;
  onEditIndustry: (i: IndustryItem | Partial<IndustryItem>) => void;
  onDeleteSolution: (id: string) => void;
  onDeleteIndustry: (id: string) => void;
}

export const SolutionsTab: React.FC<SolutionsTabProps> = ({ 
  solutions, 
  industries, 
  onEditSolution, 
  onEditIndustry,
  onDeleteSolution, 
  onDeleteIndustry
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showSectionGuide, setShowSectionGuide] = useState(false);

  return (
    <div className="space-y-10 animate-fadeIn font-body text-xs">
      
      {/* Header with Visual View Switcher & Add Button */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-amberAccent font-bold text-[10px] uppercase tracking-widest block font-display">
              SOLUTIONS & SERVICES CMS
            </span>
            <h2 className="font-display text-xl font-extrabold text-inkBlack">
              Manage Core Solutions & Detail Pages ({solutions.length})
            </h2>
            <p className="text-gray-500 text-xs mt-1">
              Click "Edit Full Page" on any card below to visually edit its Hero, Scope Cards, Products Matrix, and Equipment Specs Table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-offWhite p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'grid' ? 'bg-white text-inkBlack shadow-sm' : 'text-gray-500 hover:text-inkBlack'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Visual Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'table' ? 'bg-white text-inkBlack shadow-sm' : 'text-gray-500 hover:text-inkBlack'
                }`}
              >
                <List className="w-3.5 h-3.5" /> Table List
              </button>
            </div>

            <button 
              onClick={() => onEditSolution({})} 
              className="px-4 py-2 rounded-xl bg-amberAccent hover:bg-amberAccentDark text-white font-display font-bold text-xs uppercase tracking-wider shadow-amberGlow flex items-center gap-2 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Solution
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. VISUAL CARDS GRID VIEW (MATCHING FRONTEND /solutions HUB) */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.sort((a,b)=>a.sort_order - b.sort_order).map((sol) => (
            <div
              key={sol.id}
              className="group relative rounded-2xl overflow-hidden bg-[#0F1318] text-white border border-gray-800 shadow-md flex flex-col justify-between min-h-[360px] transition-all hover:border-amberAccent/50 hover:shadow-xl"
            >
              {/* Background Image Preview */}
              <img
                src={getImageUrl(sol.hero_image_url) || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"}
                alt={sol.title}
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1318] via-[#0F1318]/85 to-transparent z-10" />

              {/* Card Top Info */}
              <div className="relative z-20 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amberAccent uppercase tracking-wider px-2 py-0.5 bg-amberAccent/20 rounded-full border border-amberAccent/30 inline-block font-display">
                    {sol.category || "INDUSTRIAL SOLUTION"}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${sol.is_published ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-gray-500/20 text-gray-400'}`}>
                    {sol.is_published ? 'LIVE' : 'DRAFT'}
                  </span>
                </div>

                <h3 className="font-display text-lg font-extrabold text-white leading-snug">
                  {sol.title}
                </h3>

                <p className="text-[11px] text-gray-300 line-clamp-3 leading-relaxed">
                  {sol.short_description || sol.full_description}
                </p>
              </div>

              {/* Card Bottom Actions */}
              <div className="relative z-20 p-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2 bg-[#0F1318]/80 backdrop-blur-sm">
                <a
                  href={`http://localhost:5173/solutions/${sol.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amberAccent" /> Live Site
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditSolution(sol)}
                    className="px-4 py-2 rounded-xl bg-amberAccent hover:bg-amberAccentDark text-[#111] font-display font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amberAccent/20 transition-all hover:scale-105"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Full Page
                  </button>

                  <button
                    onClick={() => onDeleteSolution(sol.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    title="Delete Solution"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TABLE LIST VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl shadow-cardHover border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-offWhite text-gray-500 uppercase font-display font-bold border-b border-gray-200">
              <tr>
                <th className="p-4">Solution & Category</th>
                <th className="p-4 text-center">Equipment Cards</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {solutions.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No solutions loaded.</td></tr>
              ) : solutions.sort((a,b)=>a.sort_order - b.sort_order).map((sol) => (
                <tr key={sol.id} className="hover:bg-offWhite/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-amberAccent/10 text-amberAccent font-black text-sm flex items-center justify-center shrink-0">
                        {sol.title.charAt(0)}
                      </span>
                      <div>
                        <div className="font-bold text-inkBlack font-display text-sm">{sol.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="px-2 py-0.5 rounded-full bg-offWhite border border-gray-200 text-[10px] font-bold text-gray-600">
                            {sol.category}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">/solutions/{sol.slug}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-bold text-[11px]">
                      {sol.sub_products?.length || 1} Equipment
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${sol.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {sol.is_published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`http://localhost:5173/solutions/${sol.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 text-gray-600 hover:text-amberAccent hover:bg-amberAccent/10 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        title="View live on website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live View</span>
                      </a>
                      <button 
                        onClick={() => onEditSolution(sol)} 
                        className="px-3 py-1.5 bg-amberAccent/10 text-amberAccent hover:bg-amberAccent hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                        title="Edit solution content"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Full Page
                      </button>
                      <button 
                        onClick={() => onDeleteSolution(sol.id)} 
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete solution"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SERVED INDUSTRIES SECTION */}
      {/* ========================================================================= */}
      <section className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-extrabold text-inkBlack">
              Industry Verticals ({industries.length})
            </h2>
            <p className="text-xs text-gray-500">Manage industries served across Rice, FMCG, Chemical, Paper, Power and Mining.</p>
          </div>
          <button 
            onClick={() => onEditIndustry({})} 
            className="px-3 py-1.5 rounded-xl bg-offWhite border border-gray-200 text-inkBlack font-display font-bold text-xs uppercase hover:bg-gray-100 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amberAccent" /> Add Industry
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {industries.map((ind) => (
            <div key={ind.id} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-offWhite overflow-hidden shrink-0 border border-gray-200">
                  <img src={getImageUrl(ind.image_url) || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=300&auto=format&fit=crop"} alt={ind.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-inkBlack">{ind.title}</h4>
                  <span className="text-[10px] text-gray-400">/{ind.slug}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => onEditIndustry(ind)} className="p-1.5 text-gray-400 hover:text-amberAccent rounded">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onDeleteIndustry(ind.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
