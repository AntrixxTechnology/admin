import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

interface InquiriesTabProps {
  inquiries: any[];
  onExportCsv: () => void;
}

export const InquiriesTab: React.FC<InquiriesTabProps> = ({ inquiries, onExportCsv }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-extrabold text-inkBlack">
            Contact Inquiries & Technical Audit Requests
          </h2>
          <p className="text-xs text-gray-500">
            Submissions captured from website forms (<code>/api/contact</code>).
          </p>
        </div>
        <button onClick={onExportCsv} className="btn-primary shrink-0" style={{ backgroundColor: '#059669' }}>
          EXPORT INQUIRIES TO CSV <FileSpreadsheet className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">
            No contact inquiries recorded yet. Submit an inquiry on the Contact Us or Solutions page to view here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-offWhite text-gray-500 uppercase font-display font-bold border-b border-gray200">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Name & Company</th>
                  <th className="p-4">Email & Phone</th>
                  <th className="p-4">Message / Requirements</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray200">
                {inquiries.map((inq, idx) => (
                  <tr key={idx} className="hover:bg-offWhite/50 transition-colors">
                    <td className="p-4 text-gray-400 text-[10px] whitespace-nowrap">
                      {new Date(inq.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-inkBlack block">{inq.name}</span>
                      <span className="text-[10px] text-gray-500">{inq.company_name || 'N/A'}</span>
                    </td>
                    <td className="p-4">
                      <a href={`mailto:${inq.email}`} className="text-amberAccent font-bold hover:underline block">
                        {inq.email}
                      </a>
                      <span className="text-gray-500 text-[10px]">{inq.phone}</span>
                    </td>
                    <td className="p-4 text-gray-600 max-w-sm">
                      {inq.message}
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
