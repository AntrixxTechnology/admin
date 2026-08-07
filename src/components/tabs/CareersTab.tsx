import React from 'react';
import { Edit2, Plus, Trash2, Download } from 'lucide-react';
import type { JobOpening } from '../../api/client';

interface CareersTabProps {
  jobOpenings: JobOpening[];
  applications: any[];
  onEditJob: (j: JobOpening | Partial<JobOpening>) => void;
  onDeleteJob: (id: string) => void;
  onExportCsv: () => void;
}

export const CareersTab: React.FC<CareersTabProps> = ({ 
  jobOpenings, applications,
  onEditJob, onDeleteJob,
  onExportCsv
}) => {
  return (
    <div className="space-y-12 animate-fadeIn">
      
      {/* JOB OPENINGS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-extrabold text-inkBlack">
            Job Openings ({jobOpenings.length})
          </h2>
          <button onClick={() => onEditJob({})} className="btn-primary flex items-center gap-2 text-xs py-1.5 px-3">
            <Plus className="w-3.5 h-3.5" /> Add Job
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-cardHover border border-gray200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-offWhite text-gray-500 uppercase font-display font-bold border-b border-gray200">
              <tr>
                <th className="p-4">Title & Dept</th>
                <th className="p-4">Location & Type</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray200">
              {jobOpenings.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No job openings loaded.</td></tr>
              ) : jobOpenings.sort((a,b)=>a.sort_order - b.sort_order).map((j) => (
                <tr key={j.id} className="hover:bg-offWhite/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-inkBlack">{j.title}</div>
                    <div className="text-gray-500 mt-0.5">{j.department}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-inkBlack">{j.location}</div>
                    <div className="text-gray-500 mt-0.5">{j.type}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${j.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {j.is_published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEditJob(j)} className="p-1.5 text-gray-500 hover:text-amberAccent hover:bg-amberAccent/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => onDeleteJob(j.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* APPLICATIONS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-extrabold text-inkBlack">
            Job Applications ({applications.length})
          </h2>
          <button onClick={onExportCsv} className="px-4 py-2 rounded-md bg-white border border-gray200 hover:border-amberAccent hover:text-amberAccent text-inkBlack font-bold text-xs flex items-center gap-2 transition-colors">
            <Download className="w-3.5 h-3.5" /> EXPORT CSV
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-cardHover border border-gray200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-offWhite text-gray-500 uppercase font-display font-bold border-b border-gray200">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Applicant</th>
                <th className="p-4">Role Applied</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray200">
              {applications.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No applications received yet.</td></tr>
              ) : applications.map((app) => (
                <tr key={app.id} className="hover:bg-offWhite/50 transition-colors">
                  <td className="p-4 text-gray-500">{new Date(app.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="font-bold text-inkBlack">{app.applicant_name}</div>
                    <div className="text-gray-500 mt-0.5">{app.email}</div>
                  </td>
                  <td className="p-4 text-gray-700">{app.role_title}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${
                      app.status === 'unread' ? 'bg-red-50 border-red-200 text-red-600' :
                      app.status === 'contacted' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                      'bg-gray-50 border-gray-200 text-gray-600'
                    }`}>
                      {app.status.toUpperCase()}
                    </span>
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
