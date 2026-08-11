import React from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import type { ProjectItem, ClientLogoItem } from '../../api/client';
import { getImageUrl } from '../../api/client';

interface PortfolioTabProps {
  projects: ProjectItem[];
  clientLogos: ClientLogoItem[];
  onEditProject: (p: ProjectItem | Partial<ProjectItem>) => void;
  onEditLogo: (c: ClientLogoItem | Partial<ClientLogoItem>) => void;
  onDeleteProject: (id: string) => void;
  onDeleteLogo: (id: string) => void;
}

export const PortfolioTab: React.FC<PortfolioTabProps> = ({ 
  projects, clientLogos, 
  onEditProject, onEditLogo,
  onDeleteProject, onDeleteLogo
}) => {
  return (
    <div className="space-y-12 animate-fadeIn">
      
      {/* PROJECTS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-extrabold text-inkBlack">
            Projects Portfolio ({projects.length})
          </h2>
          <button onClick={() => onEditProject({})} className="btn-primary flex items-center gap-2 text-xs py-1.5 px-3">
            <Plus className="w-3.5 h-3.5" /> Add Project
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-cardHover border border-gray200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-offWhite text-gray-500 uppercase font-display font-bold border-b border-gray200">
              <tr>
                <th className="p-4">Title & Client</th>
                <th className="p-4">Industry / Location</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray200">
              {projects.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No projects loaded.</td></tr>
              ) : projects.map((p) => (
                <tr key={p.id} className="hover:bg-offWhite/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-inkBlack">{p.title}</div>
                    <div className="text-gray-500 mt-0.5">{p.client_name}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-inkBlack">{p.industry}</div>
                    <div className="text-gray-500 mt-0.5">{p.location}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {p.is_published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEditProject(p)} className="p-1.5 text-gray-500 hover:text-amberAccent hover:bg-amberAccent/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => onDeleteProject(p.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CLIENT LOGOS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-extrabold text-inkBlack">
            Client Logos ({clientLogos.length})
          </h2>
          <button onClick={() => onEditLogo({})} className="btn-primary flex items-center gap-2 text-xs py-1.5 px-3">
            <Plus className="w-3.5 h-3.5" /> Add Logo
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-cardHover border border-gray200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-offWhite text-gray-500 uppercase font-display font-bold border-b border-gray200">
              <tr>
                <th className="p-4">Logo & Name</th>
                <th className="p-4">Website URL</th>
                <th className="p-4 text-center">Order</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray200">
              {clientLogos.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">No client logos loaded.</td></tr>
              ) : clientLogos.sort((a,b)=>a.sort_order - b.sort_order).map((c) => (
                <tr key={c.id} className="hover:bg-offWhite/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-offWhite border border-gray200 flex items-center justify-center p-1">
                      {c.logo_url ? <img src={getImageUrl(c.logo_url)} alt={c.name} className="max-w-full max-h-full object-contain" /> : <span className="text-gray-400 font-bold">{c.name.charAt(0)}</span>}
                    </div>
                    <span className="font-bold text-inkBlack">{c.name}</span>
                  </td>
                  <td className="p-4 text-gray-500 truncate max-w-[200px]">{c.website_url || '-'}</td>
                  <td className="p-4 text-center font-bold">{c.sort_order}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {c.is_published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEditLogo(c)} className="p-1.5 text-gray-500 hover:text-amberAccent hover:bg-amberAccent/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => onDeleteLogo(c.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
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
