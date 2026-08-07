// ─── Types ────────────────────────────────────────────────────────────────────

export interface SolutionItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  full_description: string;
  icon_name: string;
  hero_image_url?: string;
  features: string[];
  deliverables: string[];
  technical_specs?: Record<string, string>;
  sort_order: number;
  is_published: boolean;
}

export interface HeroContent {
  id: string;
  badge: string;
  headline: string;
  accent_text: string;
  description: string;
  primary_cta_text: string;
  primary_cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
  background_image_url?: string;
  scada_plant_efficiency: number;
  scada_steam_flow: number;
  scada_fuel_consumption: number;
  scada_energy_saved_mwh: number;
  is_published: boolean;
}

export interface AboutContent {
  id: string;
  company_story: string;
  mission: string;
  vision: string;
  values: string[];
  capabilities: string[];
  hero_image_url?: string;
}

export interface SiteSettings {
  id: string;
  phone_primary: string;
  phone_secondary: string;
  email: string;
  address: string;
  business_hours: string;
  linkedin_url: string;
  brochure_pdf_url?: string;
}

export interface StatItem {
  id: string;
  label: string;
  value_number: number;
  suffix: string;
  description?: string;
  icon_name: string;
  sort_order: number;
  is_published: boolean;
}

export interface IndustryItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_name: string;
  image_url?: string;
  key_benefits: string[];
  sort_order: number;
  is_published: boolean;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  client_name: string;
  industry: string;
  location: string;
  challenge: string;
  solution: string;
  results: string[];
  image_url?: string;
  sort_order: number;
  is_published: boolean;
}

export interface ClientLogoItem {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  sort_order: number;
  is_published: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  linkedin_url?: string;
  sort_order: number;
  is_published: boolean;
}

export interface ResourcePost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  read_time: string;
  cover_image_url?: string;
  download_file_url?: string;
  published_date: string;
  sort_order: number;
  is_published: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: boolean;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  sort_order: number;
  is_published: boolean;
}

// ─── Base Fetcher ─────────────────────────────────────────────────────────────

const API_BASE = '/api';

async function fetchJson<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[Admin API] Error fetching ${endpoint}:`, err);
    return fallback;
  }
}

// ─── Public API (no auth needed) ─────────────────────────────────────────────

export const getSolutions = () => fetchJson<SolutionItem[]>('/solutions', []);

// ─── Admin API (JWT auth required) ───────────────────────────────────────────

export async function adminFetch(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function validateAdminToken(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/health`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getAdminInquiries(token: string) {
  const res = await adminFetch('/admin/inquiries', token);
  if (!res.ok) return null;
  return res.json();
}

export async function getAdminApplications(token: string) {
  const res = await adminFetch('/admin/applications', token);
  if (!res.ok) return null;
  return res.json();
}

export async function updateSolution(
  token: string,
  id: string,
  data: Partial<SolutionItem>
): Promise<boolean> {
  const res = await adminFetch(`/admin/solutions/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.ok;
}

export function exportInquiriesCsvUrl(token: string) {
  return `${API_BASE}/admin/inquiries/export-csv?token=${token}`;
}

export function exportApplicationsCsvUrl(token: string) {
  return `${API_BASE}/admin/applications/export-csv?token=${token}`;
}

// ─── Universal CRUD Helpers ────────────────────────────────────────────────

export async function fetchAdminData<T>(endpoint: string, token: string): Promise<T | null> {
  const res = await adminFetch(endpoint, token);
  if (!res.ok) return null;
  return res.json();
}

export async function updateAdminSingleton<T>(endpoint: string, token: string, data: Partial<T>): Promise<boolean> {
  const res = await adminFetch(endpoint, token, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return res.ok;
}

export async function saveAdminEntity<T extends { id?: string }>(endpoint: string, token: string, data: T): Promise<boolean> {
  const isNew = !data.id;
  const method = isNew ? 'POST' : 'PUT';
  const url = isNew ? endpoint : `${endpoint}/${data.id}`;
  const res = await adminFetch(url, token, {
    method,
    body: JSON.stringify(data)
  });
  return res.ok;
}

export async function deleteAdminEntity(endpoint: string, token: string, id: string): Promise<boolean> {
  const res = await adminFetch(`${endpoint}/${id}`, token, { method: 'DELETE' });
  return res.ok;
}
