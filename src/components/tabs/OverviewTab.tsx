import React from 'react';
import { BarChart3, MessageSquare, Users } from 'lucide-react';

interface OverviewTabProps {
  solutionCount: number;
  clientCount: number;
  inquiryCount: number;
  applicationCount: number;
  systemStatus?: any;
  erpTransactions: any[];
  onNavigate: (tab: any) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  solutionCount,
  clientCount,
  inquiryCount,
  applicationCount,
  systemStatus,
  erpTransactions = [],
  onNavigate,
}) => {
  const totalIncome = erpTransactions.filter(t => t.type === 'Income' && t.status === 'Completed').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = erpTransactions.filter(t => t.type === 'Expense' && t.status === 'Completed').reduce((sum, t) => sum + Number(t.amount), 0);
  
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-8">

      {/* ── ERP Financial Dashboard ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-cardLight space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-12 -mt-12 z-0" />
          <span className="relative z-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Revenue (INR)</span>
          <span className="relative z-10 font-display text-3xl font-extrabold text-inkBlack">{formatCurrency(totalIncome)}</span>
          <button onClick={() => onNavigate('erp')} className="relative z-10 text-xs text-emerald-600 font-bold underline">View Finance</button>
        </div>
        
        <div className="p-6 rounded-2xl bg-white border border-red-100 shadow-cardLight space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-12 -mt-12 z-0" />
          <span className="relative z-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Expenses (INR)</span>
          <span className="relative z-10 font-display text-3xl font-extrabold text-inkBlack">{formatCurrency(totalExpense)}</span>
          <button onClick={() => onNavigate('erp')} className="relative z-10 text-xs text-red-600 font-bold underline">View Finance</button>
        </div>
        <StatCard
          label="Total Services"
          value={solutionCount.toString()}
          sub="Live From Supabase"
          subColor="text-amberAccent"
        />
        <StatCard
          label="Enterprise Clients"
          value={clientCount.toString()}
          sub="Trusted global partners"
          subColor="text-emerald-600"
        />
        <div className="p-6 rounded-2xl bg-white border border-gray200 shadow-cardLight space-y-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
            INQUIRIES RECEIVED
          </span>
          <span className="font-display text-3xl font-extrabold text-amberAccent">
            {inquiryCount}
          </span>
          <button
            onClick={() => onNavigate('inquiries')}
            className="text-xs text-inkBlack font-bold underline hover:text-amberAccent"
          >
            View & Export CSV
          </button>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-gray200 shadow-cardLight space-y-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
            APPLICATIONS
          </span>
          <span className="font-display text-3xl font-extrabold text-amberAccent">
            {applicationCount}
          </span>
          <button
            onClick={() => onNavigate('inquiries')}
            className="text-xs text-inkBlack font-bold underline hover:text-amberAccent"
          >
            View & Export CSV
          </button>
        </div>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Services"
          value={solutionCount.toString()}
          sub="Live From Supabase"
          subColor="text-amberAccent"
        />
        <StatCard
          label="Enterprise Clients"
          value={clientCount.toString()}
          sub="Trusted global partners"
          subColor="text-emerald-600"
        />
        <div className="p-6 rounded-2xl bg-white border border-gray200 shadow-cardLight space-y-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
            APPLICATIONS
          </span>
          <span className="font-display text-3xl font-extrabold text-amberAccent">
            {applicationCount}
          </span>
          <button
            onClick={() => onNavigate('jobs')}
            className="text-xs text-inkBlack font-bold underline hover:text-amberAccent"
          >
            View & Export CSV
          </button>
        </div>
      </div>

      {/* ── Backend Status ───────────────────────────────────────────── */}
      <div className="p-8 rounded-2xl bg-white border border-gray200 shadow-cardLight space-y-4">
        <h3 className="font-display text-lg font-bold text-inkBlack">
          Backend System Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
          <StatusCard
            label="API Repository"
            value={systemStatus?.repository || 'Loading...'}
            note={systemStatus?.repository === 'SupabaseRepository' ? 'Live Cloud Database Active' : 'Swappable to Supabase PostgreSQL'}
          />
          <StatusCard
            label="Storage Provider"
            value={systemStatus?.storage || 'Loading...'}
            note={systemStatus?.storage === 'SupabaseStorageProvider' ? 'Cloud Object Storage Active' : 'Swappable to Supabase Storage'}
          />
          <StatusCard
            label="API Port"
            value={systemStatus ? `http://localhost:${systemStatus.port} (Active)` : 'Loading...'}
            valueColor="text-emerald-600"
            note={systemStatus ? `Uptime: ${systemStatus.uptime_seconds}s` : ''}
          />
        </div>
      </div>
    </div>
  );
};

// ── Small sub-components ──────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  subColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, subColor = 'text-gray-500' }) => (
  <div className="p-6 rounded-2xl bg-white border border-gray200 shadow-cardLight space-y-2">
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{label}</span>
    <span className="font-display text-3xl font-extrabold text-inkBlack">{value}</span>
    <span className={`text-xs font-bold block ${subColor}`}>{sub}</span>
  </div>
);

interface StatusCardProps {
  label: string;
  value: string;
  valueColor?: string;
  note: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ label, value, valueColor = 'text-inkBlack', note }) => (
  <div className="p-4 rounded-xl bg-offWhite border border-gray200">
    <span className="text-gray-500 font-bold block">{label}</span>
    <span className={`font-extrabold text-sm mt-1 block ${valueColor}`}>{value}</span>
    <span className="text-[10px] text-gray-400">{note}</span>
  </div>
);
