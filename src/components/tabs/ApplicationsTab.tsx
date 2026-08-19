import React from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';

interface ApplicationsTabProps {
  applications: any[];
  onExportCsv: () => void;
}

export const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  applications,
  onExportCsv,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-extrabold text-inkBlack">
            Job Applications & Resumes
          </h2>
          <p className="text-xs text-gray-500">
            Resumes and job applications received through the careers portal.
          </p>
        </div>
        <button onClick={onExportCsv} className="btn-primary shrink-0" style={{ backgroundColor: '#059669' }}>
          EXPORT APPLICATIONS TO CSV <FileSpreadsheet className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">
            No job applications recorded yet. Submit a resume on the Careers page to view here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-offWhite text-gray-500 uppercase font-display font-bold border-b border-gray200">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Applicant Name</th>
                  <th className="p-4">Applied Role</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Resume / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray200">
                {applications.map((app, idx) => (
                  <tr key={idx} className="hover:bg-offWhite/50 transition-colors">
                    <td className="p-4 text-gray-400 text-[10px] whitespace-nowrap">
                      {new Date(app.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-inkBlack">{app.applicant_name}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-amberAccent/10 text-amberAccent border border-amberAccent/30 font-bold text-[10px]">
                        {app.role_title}
                      </span>
                    </td>
                    <td className="p-4">
                      <a href={`mailto:${app.email}`} className="text-amberAccent font-bold hover:underline block">
                        {app.email}
                      </a>
                      <span className="text-gray-500 text-[10px]">{app.phone}</span>
                    </td>
                    <td className="p-4">
                      {app.resume_file_url ? (
                        <a
                          href={app.resume_file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 font-bold underline flex items-center gap-1 mb-1"
                        >
                          <Download className="w-3.5 h-3.5" /> View Resume
                        </a>
                      ) : (
                        <span className="text-gray-400 text-[10px]">No Link</span>
                      )}
                      <p className="text-gray-600 text-[11px] truncate max-w-xs">{app.notes}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
