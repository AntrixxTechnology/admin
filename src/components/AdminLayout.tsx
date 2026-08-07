import React from 'react';
import { RefreshCw, LogOut, BarChart3, Layers, MessageSquare, Users, Image as ImageIcon, Briefcase, FileText } from 'lucide-react';

export type AdminTab = 'overview' | 'core' | 'solutions' | 'portfolio' | 'resources' | 'jobs' | 'inquiries';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onRefresh: () => void;
  onLogout: () => void;
  solutionCount: number;
  inquiryCount: number;
  applicationCount: number;
  jobCount?: number;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  onRefresh,
  onLogout,
  solutionCount,
  inquiryCount,
  applicationCount,
  jobCount = 0,
}) => {
  const tabs: { id: AdminTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'core', label: 'Core Content', icon: <FileText className="w-4 h-4" /> },
    { id: 'solutions', label: 'Solutions & Industries', icon: <Layers className="w-4 h-4" />, count: solutionCount },
    { id: 'portfolio', label: 'Portfolio', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'resources', label: 'Resources & Team', icon: <Users className="w-4 h-4" /> },
    { id: 'jobs', label: 'Careers & Jobs', icon: <Briefcase className="w-4 h-4" />, count: jobCount + applicationCount },
    { id: 'inquiries', label: 'Inquiries & Leads', icon: <MessageSquare className="w-4 h-4" />, count: inquiryCount },
  ];

  return (
    <div className="flex h-screen bg-offWhite text-inkBlack font-body overflow-hidden">
      
      {/* ── Left Sidebar ─────────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-gray200 flex flex-col shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-gray200 shrink-0">
          <img
            src="/logo.png"
            alt="Antrixx Technology"
            className="h-8 w-auto object-contain"
          />
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              CMS Navigation
            </span>
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === tab.id
                  ? 'bg-amberAccent text-white shadow-amberGlow'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-inkBlack'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={activeTab === tab.id ? 'text-white' : 'text-gray-400'}>
                  {tab.icon}
                </span>
                {tab.label}
              </div>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray200 text-gray-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray200 shrink-0 bg-gray-50">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
            Logged In As
          </span>
          <span className="text-xs text-inkBlack font-bold block truncate">
            admin@antrixx.com
          </span>
        </div>
      </aside>

      {/* ── Main Content Area ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray200 flex items-center justify-between px-6 shrink-0 z-10">
          <h1 className="font-display font-extrabold text-lg text-inkBlack">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          
          <div className="flex items-center gap-3">
            <button onClick={onRefresh} className="btn-ghost text-xs" title="Refresh data">
              <RefreshCw className="w-4 h-4 text-amberAccent" />
              Refresh
            </button>
            <button onClick={onLogout} className="btn-danger text-xs">
              Logout <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>
        
        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>
      
    </div>
  );
};
