import React, { useState, useEffect } from 'react';
import { Lock, User, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AdminLayout, type AdminTab } from './components/AdminLayout';
import { OverviewTab } from './components/tabs/OverviewTab';
import { CoreContentTab } from './components/tabs/CoreContentTab';
import { SolutionsTab } from './components/tabs/SolutionsTab';
import { PortfolioTab } from './components/tabs/PortfolioTab';
import { ResourcesTab } from './components/tabs/ResourcesTab';
import { CareersTab } from './components/tabs/CareersTab';
import { InquiriesTab } from './components/tabs/InquiriesTab';
import { GenericEditModal, type FieldConfig } from './components/modals/GenericEditModal';

import { useAdminAuth } from './hooks/useAdminAuth';
import { useAdminData } from './hooks/useAdminData';
import { exportInquiriesCsvUrl, exportApplicationsCsvUrl, saveAdminEntity, deleteAdminEntity } from './api/client';

const App: React.FC = () => {
  const auth = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  
  // Generic Modal State
  const [editingEntity, setEditingEntity] = useState<{ type: string; title: string; endpoint: string; data: any; fields: FieldConfig[] } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState('');

  const data = useAdminData(auth.token, auth.handleLogout);

  useEffect(() => {
    if (auth.token) {
      data.fetchAdminData();
    }
  }, [auth.token]);

  // ── Modal Handlers ───────────────────────────────────────────────────────

  const handleSaveGenericEntity = async (formData: any): Promise<boolean> => {
    if (!editingEntity || !auth.token) return false;
    const ok = await saveAdminEntity(editingEntity.endpoint, auth.token, formData);
    if (ok) {
      setSaveSuccess(`${editingEntity.title} saved successfully!`);
      data.fetchAdminData();
      setTimeout(() => setSaveSuccess(''), 4000);
    }
    return ok;
  };

  const handleDeleteGenericEntity = async (endpoint: string, id: string, title: string) => {
    if (!auth.token || !window.confirm(`Are you sure you want to delete this ${title}?`)) return;
    const ok = await deleteAdminEntity(endpoint, auth.token, id);
    if (ok) {
      setSaveSuccess(`${title} deleted successfully!`);
      data.fetchAdminData();
      setTimeout(() => setSaveSuccess(''), 4000);
    } else {
      alert('Failed to delete item.');
    }
  };

  // ── Field Configurations ─────────────────────────────────────────────────

  const openModal = (type: string, title: string, endpoint: string, itemData: any, fields: FieldConfig[]) => {
    setEditingEntity({ type, title, endpoint, data: itemData, fields });
  };

  const openSolutionModal = (s: any) => openModal('solution', 'Solution', '/admin/solutions', s, [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'text', required: true },
    { key: 'short_description', label: 'Short Description', type: 'textarea' },
    { key: 'full_description', label: 'Full Description', type: 'textarea' },
    { key: 'icon_name', label: 'Icon Name (Lucide)', type: 'text' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_published', label: 'Published', type: 'checkbox' },
  ]);

  const openIndustryModal = (i: any) => openModal('industry', 'Industry', '/admin/industries', i, [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'icon_name', label: 'Icon Name (Lucide)', type: 'text' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_published', label: 'Published', type: 'checkbox' },
  ]);

  const openProjectModal = (p: any) => openModal('project', 'Project', '/admin/projects', p, [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'client_name', label: 'Client Name', type: 'text' },
    { key: 'industry', label: 'Industry', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'challenge', label: 'Challenge', type: 'textarea' },
    { key: 'solution', label: 'Solution Provided', type: 'textarea' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_published', label: 'Published', type: 'checkbox' },
  ]);

  const openClientLogoModal = (c: any) => openModal('client_logo', 'Client Logo', '/admin/client-logos', c, [
    { key: 'name', label: 'Client Name', type: 'text', required: true },
    { key: 'logo_url', label: 'Logo Image URL', type: 'url' },
    { key: 'website_url', label: 'Website URL', type: 'url' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_published', label: 'Published', type: 'checkbox' },
  ]);

  const openTeamModal = (t: any) => openModal('team', 'Team Member', '/admin/team', t, [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'role', label: 'Role/Title', type: 'text', required: true },
    { key: 'bio', label: 'Bio', type: 'textarea' },
    { key: 'image_url', label: 'Profile Image URL', type: 'url' },
    { key: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_published', label: 'Published', type: 'checkbox' },
  ]);

  const openResourceModal = (r: any) => openModal('resource', 'Resource', '/admin/resources', r, [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'text', required: true },
    { key: 'summary', label: 'Summary', type: 'textarea' },
    { key: 'author', label: 'Author', type: 'text' },
    { key: 'download_file_url', label: 'Download File URL', type: 'url' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_published', label: 'Published', type: 'checkbox' },
  ]);

  const openFaqModal = (f: any) => openModal('faq', 'FAQ', '/admin/faqs', f, [
    { key: 'question', label: 'Question', type: 'text', required: true },
    { key: 'answer', label: 'Answer', type: 'textarea', required: true },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_published', label: 'Published', type: 'checkbox' },
  ]);

  const openJobModal = (j: any) => openModal('job', 'Job Opening', '/admin/job-openings', j, [
    { key: 'title', label: 'Job Title', type: 'text', required: true },
    { key: 'department', label: 'Department', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'type', label: 'Type (e.g. Full-Time)', type: 'text' },
    { key: 'experience', label: 'Experience Required', type: 'text' },
    { key: 'description', label: 'Job Description', type: 'textarea' },
    { key: 'sort_order', label: 'Sort Order', type: 'number' },
    { key: 'is_published', label: 'Published', type: 'checkbox' },
  ]);

  // ── Login Screen ─────────────────────────────────────────────────────────

  if (!auth.token) {
    return (
      <div className="min-h-screen bg-offWhite flex items-center justify-center p-4 font-body py-12">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-gray200 shadow-cardHover space-y-6">
          <div className="text-center space-y-3">
            <img src="/logo.png" alt="Antrixx Technology" className="h-14 w-auto mx-auto object-contain" />
            <p className="text-xs text-gray-500">Sign in with your admin credentials to manage content and export lead CSVs.</p>
          </div>

          {auth.loginError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /><span>{auth.loginError}</span>
            </div>
          )}

          <form onSubmit={auth.handleLogin} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Admin Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input id="admin-email" type="email" required value={auth.email} onChange={(e) => auth.setEmail(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-md bg-offWhite border border-gray200 text-inkBlack focus:outline-none focus:border-amberAccent" />
              </div>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input id="admin-password" type="password" required value={auth.password} onChange={(e) => auth.setPassword(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-md bg-offWhite border border-gray200 text-inkBlack focus:outline-none focus:border-amberAccent" />
              </div>
            </div>
            <button id="admin-login-btn" type="submit" disabled={auth.loginLoading} className="w-full py-3 rounded-md bg-amberAccent hover:bg-amberAccentDark text-white font-display font-bold text-xs uppercase tracking-wider shadow-amberGlow flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
              {auth.loginLoading ? 'AUTHENTICATING...' : 'SIGN IN TO CMS PORTAL'} <Shield className="w-4 h-4" />
            </button>
          </form>
          <div className="pt-2 text-center text-[10px] text-gray-400 border-t border-gray200">
            Default credentials: <code className="text-amberAccent">admin@antrixx.com</code> / <code className="text-amberAccent">AntrixxAdmin2026!</code>
          </div>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard ───────────────────────────────────────────────────────

  return (
    <>
      <AdminLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={data.fetchAdminData}
        onLogout={auth.handleLogout}
        solutionCount={data.solutions.length + data.industries.length}
        inquiryCount={data.inquiries.length}
        applicationCount={data.applications.length}
        jobCount={data.jobOpenings.length}
      >
        {saveSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" /><span>{saveSuccess}</span>
          </div>
        )}

        {activeTab === 'overview' && <OverviewTab inquiryCount={data.inquiries.length} applicationCount={data.applications.length} onNavigate={setActiveTab} />}
        
        {activeTab === 'core' && (
          <CoreContentTab 
            hero={data.hero} 
            about={data.about} 
            settings={data.settings} 
            token={auth.token} 
            onRefresh={data.fetchAdminData} 
          />
        )}
        
        {activeTab === 'solutions' && (
          <SolutionsTab 
            solutions={data.solutions} 
            industries={data.industries}
            onEditSolution={openSolutionModal} 
            onEditIndustry={openIndustryModal}
            onDeleteSolution={(id) => handleDeleteGenericEntity('/admin/solutions', id, 'Solution')}
            onDeleteIndustry={(id) => handleDeleteGenericEntity('/admin/industries', id, 'Industry')}
          />
        )}
        
        {activeTab === 'portfolio' && (
          <PortfolioTab 
            projects={data.projects} 
            clientLogos={data.clientLogos}
            onEditProject={openProjectModal} 
            onEditLogo={openClientLogoModal}
            onDeleteProject={(id) => handleDeleteGenericEntity('/admin/projects', id, 'Project')}
            onDeleteLogo={(id) => handleDeleteGenericEntity('/admin/client-logos', id, 'Client Logo')}
          />
        )}

        {activeTab === 'resources' && (
          <ResourcesTab 
            resources={data.resources} 
            faqs={data.faqs} 
            team={data.team}
            onEditResource={openResourceModal} 
            onEditFaq={openFaqModal} 
            onEditTeam={openTeamModal}
            onDeleteResource={(id) => handleDeleteGenericEntity('/admin/resources', id, 'Resource')}
            onDeleteFaq={(id) => handleDeleteGenericEntity('/admin/faqs', id, 'FAQ')}
            onDeleteTeam={(id) => handleDeleteGenericEntity('/admin/team', id, 'Team Member')}
          />
        )}

        {activeTab === 'jobs' && (
          <CareersTab 
            jobOpenings={data.jobOpenings} 
            applications={data.applications}
            onEditJob={openJobModal}
            onDeleteJob={(id) => handleDeleteGenericEntity('/admin/job-openings', id, 'Job Opening')}
            onExportCsv={() => window.open(exportApplicationsCsvUrl(auth.token || ''), '_blank')}
          />
        )}
        
        {activeTab === 'inquiries' && (
          <InquiriesTab inquiries={data.inquiries} onExportCsv={() => window.open(exportInquiriesCsvUrl(auth.token || ''), '_blank')} />
        )}

      </AdminLayout>

      {/* Edit Generic Entity Modal */}
      {editingEntity && (
        <GenericEditModal
          title={editingEntity.title}
          initialData={editingEntity.data}
          fields={editingEntity.fields}
          onSave={handleSaveGenericEntity}
          onClose={() => setEditingEntity(null)}
        />
      )}
    </>
  );
};

export default App;
