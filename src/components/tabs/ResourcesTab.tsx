import React from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import type { ResourcePost, FaqItem, TeamMember } from '../../api/client';

interface ResourcesTabProps {
  resources: ResourcePost[];
  faqs: FaqItem[];
  team: TeamMember[];
  onEditResource: (r: ResourcePost | Partial<ResourcePost>) => void;
  onEditFaq: (f: FaqItem | Partial<FaqItem>) => void;
  onEditTeam: (t: TeamMember | Partial<TeamMember>) => void;
  onDeleteResource: (id: string) => void;
  onDeleteFaq: (id: string) => void;
  onDeleteTeam: (id: string) => void;
}

export const ResourcesTab: React.FC<ResourcesTabProps> = ({ 
  resources, faqs, team,
  onEditResource, onEditFaq, onEditTeam,
  onDeleteResource, onDeleteFaq, onDeleteTeam
}) => {
  return (
    <div className="space-y-12 animate-fadeIn">
      
      {/* TEAM */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-extrabold text-inkBlack">
            Leadership & Team ({team.length})
          </h2>
          <button onClick={() => onEditTeam({})} className="btn-primary flex items-center gap-2 text-xs py-1.5 px-3">
            <Plus className="w-3.5 h-3.5" /> Add Member
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-cardHover border border-gray200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-offWhite text-gray-500 uppercase font-display font-bold border-b border-gray200">
              <tr>
                <th className="p-4">Name & Role</th>
                <th className="p-4 text-center">Order</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray200">
              {team.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No team members loaded.</td></tr>
              ) : team.sort((a,b)=>a.sort_order - b.sort_order).map((t) => (
                <tr key={t.id} className="hover:bg-offWhite/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-offWhite border border-gray200 overflow-hidden">
                      {t.image_url ? <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">{t.name.charAt(0)}</div>}
                    </div>
                    <div>
                      <div className="font-bold text-inkBlack">{t.name}</div>
                      <div className="text-gray-500">{t.role}</div>
                    </div>
                  </td>
                  <td className="p-4 text-center font-bold">{t.sort_order}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {t.is_published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEditTeam(t)} className="p-1.5 text-gray-500 hover:text-amberAccent hover:bg-amberAccent/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => onDeleteTeam(t.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* RESOURCES */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-extrabold text-inkBlack">
            Resources & Downloads ({resources.length})
          </h2>
          <button onClick={() => onEditResource({})} className="btn-primary flex items-center gap-2 text-xs py-1.5 px-3">
            <Plus className="w-3.5 h-3.5" /> Add Resource
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-cardHover border border-gray200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-offWhite text-gray-500 uppercase font-display font-bold border-b border-gray200">
              <tr>
                <th className="p-4">Title & Category</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray200">
              {resources.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No resources loaded.</td></tr>
              ) : resources.sort((a,b)=>a.sort_order - b.sort_order).map((r) => (
                <tr key={r.id} className="hover:bg-offWhite/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-inkBlack">{r.title}</div>
                    <div className="text-gray-500 mt-0.5">{r.category}</div>
                  </td>
                  <td className="p-4 text-gray-500">{r.published_date}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {r.is_published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEditResource(r)} className="p-1.5 text-gray-500 hover:text-amberAccent hover:bg-amberAccent/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => onDeleteResource(r.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-extrabold text-inkBlack">
            FAQs ({faqs.length})
          </h2>
          <button onClick={() => onEditFaq({})} className="btn-primary flex items-center gap-2 text-xs py-1.5 px-3">
            <Plus className="w-3.5 h-3.5" /> Add FAQ
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-cardHover border border-gray200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-offWhite text-gray-500 uppercase font-display font-bold border-b border-gray200">
              <tr>
                <th className="p-4">Question & Category</th>
                <th className="p-4 text-center">Order</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray200">
              {faqs.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No FAQs loaded.</td></tr>
              ) : faqs.sort((a,b)=>a.sort_order - b.sort_order).map((f) => (
                <tr key={f.id} className="hover:bg-offWhite/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-inkBlack max-w-sm truncate">{f.question}</div>
                    <div className="text-gray-500 mt-0.5">{f.category}</div>
                  </td>
                  <td className="p-4 text-center font-bold">{f.sort_order}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${f.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {f.is_published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEditFaq(f)} className="p-1.5 text-gray-500 hover:text-amberAccent hover:bg-amberAccent/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => onDeleteFaq(f.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
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
