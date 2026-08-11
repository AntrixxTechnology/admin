import { useState, useCallback } from 'react';
import {
  fetchAdminData as apiFetch,
  type SolutionItem,
  type HeroContent,
  type AboutContent,
  type SiteSettings,
  type StatItem,
  type IndustryItem,
  type ProjectItem,
  type ClientLogoItem,
  type TeamMember,
  type ResourcePost,
  type FaqItem,
  type JobOpening,
  type BlogPost,
  type ErpClient,
  type ErpTransaction,
  type ErpInvoice,
} from '../api/client';

export interface AdminDataState {
  hero: HeroContent | null;
  about: AboutContent | null;
  settings: SiteSettings | null;
  stats: StatItem[];
  solutions: SolutionItem[];
  industries: IndustryItem[];
  projects: ProjectItem[];
  clientLogos: ClientLogoItem[];
  team: TeamMember[];
  resources: ResourcePost[];
  faqs: FaqItem[];
  jobOpenings: JobOpening[];
  blogs: BlogPost[];
  erpClients: ErpClient[];
  erpTransactions: ErpTransaction[];
  erpInvoices: ErpInvoice[];
  inquiries: any[];
  applications: any[];
  fetchAdminData: () => Promise<void>;
  
  // Expose setter for optimistic updates or single item updates
  setHero: React.Dispatch<React.SetStateAction<HeroContent | null>>;
  setAbout: React.Dispatch<React.SetStateAction<AboutContent | null>>;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings | null>>;
  setStats: React.Dispatch<React.SetStateAction<StatItem[]>>;
  setSolutions: React.Dispatch<React.SetStateAction<SolutionItem[]>>;
  setIndustries: React.Dispatch<React.SetStateAction<IndustryItem[]>>;
  setProjects: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
  setClientLogos: React.Dispatch<React.SetStateAction<ClientLogoItem[]>>;
  setTeam: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  setResources: React.Dispatch<React.SetStateAction<ResourcePost[]>>;
  setFaqs: React.Dispatch<React.SetStateAction<FaqItem[]>>;
  setJobOpenings: React.Dispatch<React.SetStateAction<JobOpening[]>>;
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  setErpClients: React.Dispatch<React.SetStateAction<ErpClient[]>>;
  setErpTransactions: React.Dispatch<React.SetStateAction<ErpTransaction[]>>;
  setErpInvoices: React.Dispatch<React.SetStateAction<ErpInvoice[]>>;
  systemStatus: any | null;
}

export function useAdminData(token: string | null, onUnauthorized: () => void): AdminDataState {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [solutions, setSolutions] = useState<SolutionItem[]>([]);
  const [industries, setIndustries] = useState<IndustryItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [clientLogos, setClientLogos] = useState<ClientLogoItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [resources, setResources] = useState<ResourcePost[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [erpClients, setErpClients] = useState<ErpClient[]>([]);
  const [erpTransactions, setErpTransactions] = useState<ErpTransaction[]>([]);
  const [erpInvoices, setErpInvoices] = useState<ErpInvoice[]>([]);
  
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<any | null>(null);

  const fetchAdminData = useCallback(async () => {
    if (!token) return;
    try {
      const [
        heroData, aboutData, settingsData, statsData, 
        solutionsData, industriesData, projectsData, clientLogosData,
        teamData, resourcesData, faqsData, jobOpeningsData,
        blogsData, erpClientsData, erpTransactionsData, erpInvoicesData,
        inqData, appData, statusData
      ] = await Promise.all([
        apiFetch<HeroContent>('/admin/hero', token),
        apiFetch<AboutContent>('/admin/about', token),
        apiFetch<SiteSettings>('/admin/settings', token),
        apiFetch<StatItem[]>('/admin/stats', token),
        apiFetch<SolutionItem[]>('/solutions', token), // public route
        apiFetch<IndustryItem[]>('/admin/industries', token),
        apiFetch<ProjectItem[]>('/admin/projects', token),
        apiFetch<ClientLogoItem[]>('/admin/client-logos', token),
        apiFetch<TeamMember[]>('/admin/team', token),
        apiFetch<ResourcePost[]>('/admin/resources', token),
        apiFetch<FaqItem[]>('/admin/faqs', token),
        apiFetch<JobOpening[]>('/admin/job-openings', token),
        apiFetch<BlogPost[]>('/admin/blogs', token),
        apiFetch<ErpClient[]>('/admin/erp-clients', token),
        apiFetch<ErpTransaction[]>('/admin/erp-transactions', token),
        apiFetch<ErpInvoice[]>('/admin/erp-invoices', token),
        apiFetch<any[]>('/admin/inquiries', token),
        apiFetch<any[]>('/admin/applications', token),
        apiFetch<any>('/status', token).catch(() => null) // public route, ignore auth error
      ]);

      if (heroData) setHero(heroData);
      if (aboutData) setAbout(aboutData);
      if (settingsData) setSettings(settingsData);
      if (statsData) setStats(statsData);
      if (solutionsData) setSolutions(solutionsData);
      if (industriesData) setIndustries(industriesData);
      if (projectsData) setProjects(projectsData);
      if (clientLogosData) setClientLogos(clientLogosData);
      if (teamData) setTeam(teamData);
      if (resourcesData) setResources(resourcesData);
      if (faqsData) setFaqs(faqsData);
      if (jobOpeningsData) setJobOpenings(jobOpeningsData);
      if (blogsData) setBlogs(blogsData);
      if (erpClientsData) setErpClients(erpClientsData);
      if (erpTransactionsData) setErpTransactions(erpTransactionsData);
      if (erpInvoicesData) setErpInvoices(erpInvoicesData);
      
      if (inqData) setInquiries(inqData);
      else onUnauthorized(); // If one protected route fails due to auth, assume token is dead

      if (appData) setApplications(appData);
      if (statusData) setSystemStatus(statusData);
    } catch (err) {
      console.error('[Admin] Error loading full CMS data:', err);
    }
  }, [token, onUnauthorized]);

  return {
    hero, about, settings, stats, solutions, industries, projects, clientLogos,
    team, resources, faqs, jobOpenings, blogs, erpClients, erpTransactions, erpInvoices, inquiries, applications, systemStatus,
    fetchAdminData,
    setHero, setAbout, setSettings, setStats, setSolutions, setIndustries,
    setProjects, setClientLogos, setTeam, setResources, setFaqs, setJobOpenings,
    setBlogs, setErpClients, setErpTransactions, setErpInvoices
  };
}
