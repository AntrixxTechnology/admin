import React, { useState } from 'react';
import { Briefcase, DollarSign, FileText, Plus, Edit, Trash2, ArrowUpRight, ArrowDownRight, Users } from 'lucide-react';
import type { ErpClient, ErpTransaction, ErpInvoice } from '../../api/client';

interface ErpTabProps {
  clients: ErpClient[];
  transactions: ErpTransaction[];
  invoices: ErpInvoice[];
  onEditClient: (c: Partial<ErpClient>) => void;
  onDeleteClient: (id: string) => void;
  onEditTransaction: (t: Partial<ErpTransaction>) => void;
  onDeleteTransaction: (id: string) => void;
  onEditInvoice: (i: Partial<ErpInvoice>) => void;
  onDeleteInvoice: (id: string) => void;
}

export const ErpTab: React.FC<ErpTabProps> = ({
  clients, transactions, invoices,
  onEditClient, onDeleteClient,
  onEditTransaction, onDeleteTransaction,
  onEditInvoice, onDeleteInvoice
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'transactions' | 'invoices' | 'clients'>('transactions');

  const totalIncome = transactions.filter(t => t.type === 'Income' && t.status === 'Completed').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'Expense' && t.status === 'Completed').reduce((sum, t) => sum + Number(t.amount), 0);
  const pendingInvoicesAmount = invoices.filter(i => i.status !== 'Paid' && i.status !== 'Cancelled').reduce((sum, i) => sum + (Number(i.total_amount) - Number(i.amount_paid)), 0);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-display font-bold text-inkBlack">ERP & Business</h2>
          <p className="text-sm text-gray-500 mt-1">Manage finances, clients, and billing</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 z-0" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Income</h3>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><ArrowUpRight className="w-5 h-5" /></div>
          </div>
          <p className="relative z-10 text-3xl font-display font-extrabold text-inkBlack">{formatCurrency(totalIncome)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-16 -mt-16 z-0" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Expenses</h3>
            <div className="p-2 bg-red-100 text-red-600 rounded-lg"><ArrowDownRight className="w-5 h-5" /></div>
          </div>
          <p className="relative z-10 text-3xl font-display font-extrabold text-inkBlack">{formatCurrency(totalExpense)}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-16 -mt-16 z-0" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Pending Receivables</h3>
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><DollarSign className="w-5 h-5" /></div>
          </div>
          <p className="relative z-10 text-3xl font-display font-extrabold text-inkBlack">{formatCurrency(pendingInvoicesAmount)}</p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-6 border-b border-gray200 mb-6">
        <button onClick={() => setActiveSubTab('transactions')} className={`pb-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${activeSubTab === 'transactions' ? 'text-inkBlack border-b-2 border-amberAccent' : 'text-gray-400 hover:text-inkBlack'}`}>
          <DollarSign className="w-4 h-4" /> Transactions
        </button>
        <button onClick={() => setActiveSubTab('invoices')} className={`pb-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${activeSubTab === 'invoices' ? 'text-inkBlack border-b-2 border-amberAccent' : 'text-gray-400 hover:text-inkBlack'}`}>
          <FileText className="w-4 h-4" /> Invoices
        </button>
        <button onClick={() => setActiveSubTab('clients')} className={`pb-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${activeSubTab === 'clients' ? 'text-inkBlack border-b-2 border-amberAccent' : 'text-gray-400 hover:text-inkBlack'}`}>
          <Users className="w-4 h-4" /> Clients Directory
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray200 shadow-cardHover overflow-hidden">
        
        {/* Transactions Tab */}
        {activeSubTab === 'transactions' && (
          <div>
            <div className="p-4 border-b border-gray200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-sm text-inkBlack">Recent Transactions</h3>
              <button onClick={() => onEditTransaction({ type: 'Income', status: 'Completed' })} className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1">
                <Plus className="w-3 h-3" /> Record Transaction
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-gray100 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray100">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50/50">
                      <td className="p-4">{new Date(t.transaction_date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${t.type === 'Income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{t.type}</span>
                      </td>
                      <td className="p-4">{t.category}</td>
                      <td className="p-4 font-bold">{formatCurrency(t.amount)}</td>
                      <td className="p-4">{t.status}</td>
                      <td className="p-4 flex items-center justify-end gap-2">
                        <button onClick={() => onEditTransaction(t)} className="p-1.5 text-gray-400 hover:text-amberAccent rounded"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => onDeleteTransaction(t.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-gray-400">No transactions recorded.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeSubTab === 'invoices' && (
          <div>
            <div className="p-4 border-b border-gray200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-sm text-inkBlack">Invoices</h3>
              <button onClick={() => onEditInvoice({ status: 'Pending', items: [] })} className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1">
                <Plus className="w-3 h-3" /> Create Invoice
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-gray100 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="p-4">Invoice #</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray100">
                  {invoices.map(inv => {
                    const client = clients.find(c => c.id === inv.client_id);
                    return (
                      <tr key={inv.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-bold text-inkBlack">{inv.invoice_number}</td>
                        <td className="p-4">{client?.company_name || 'Unknown Client'}</td>
                        <td className="p-4">{new Date(inv.due_date).toLocaleDateString()}</td>
                        <td className="p-4 font-bold">{formatCurrency(inv.total_amount)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                            inv.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            inv.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'
                          }`}>{inv.status}</span>
                        </td>
                        <td className="p-4 flex items-center justify-end gap-2">
                          <button onClick={() => onEditInvoice(inv)} className="p-1.5 text-gray-400 hover:text-amberAccent rounded"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => onDeleteInvoice(inv.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    );
                  })}
                  {invoices.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-gray-400">No invoices found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeSubTab === 'clients' && (
          <div>
            <div className="p-4 border-b border-gray200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-sm text-inkBlack">Client Directory</h3>
              <button onClick={() => onEditClient({ status: 'Active' })} className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Client
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-gray100 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="p-4">Company</th>
                    <th className="p-4">Contact Person</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray100">
                  {clients.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-inkBlack">{c.company_name}</td>
                      <td className="p-4">{c.contact_person || '-'}</td>
                      <td className="p-4">{c.email || '-'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>{c.status}</span>
                      </td>
                      <td className="p-4 flex items-center justify-end gap-2">
                        <button onClick={() => onEditClient(c)} className="p-1.5 text-gray-400 hover:text-amberAccent rounded"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => onDeleteClient(c.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {clients.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-400">No clients found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
