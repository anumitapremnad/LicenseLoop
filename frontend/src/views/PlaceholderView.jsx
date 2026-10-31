import React from 'react';
import {
  Users,
  Layers,
  CreditCard,
  FileText,
  Wallet,
  KeyRound,
  BarChart3,
  Plus
} from 'lucide-react';

const SECTION_CONFIG = {
  customers: {
    title: 'Customer Accounts',
    subtitle: 'Manage client enterprise organizations, contacts, and license allocations.',
    icon: Users,
    primaryAction: 'Add Customer',
    sampleColumns: ['Company Name', 'Primary Contact', 'Active Plans', 'Total Seats', 'Status'],
    sampleData: [
      { col1: 'Apex Innovations Ltd', col2: 'sarah.m@apexinnovate.com', col3: 'Enterprise Tier', col4: '150 Seats', col5: 'Active' },
      { col1: 'Nordic Financial Group', col2: 'erik.lind@nordicfin.se', col3: 'Security Standard', col4: '450 Seats', col5: 'Active' },
      { col1: 'Crestview Health Systems', col2: 'admin@crestviewhealth.org', col3: 'Growth Suite', col4: '100 Seats', col5: 'Active' },
    ],
  },
  plans: {
    title: 'Subscription Plans & Tiers',
    subtitle: 'Define SaaS tiers, seat quotas, billing frequencies, and pricing terms.',
    icon: Layers,
    primaryAction: 'Create Plan',
    sampleColumns: ['Plan Tier', 'Seat Limits', 'Billing Terms', 'Base Rate', 'Active Subscriptions'],
    sampleData: [
      { col1: 'Enterprise Tier', col2: 'Unlimited Seats', col3: 'Annual Billing', col4: '$3,600/mo', col5: '42 Accounts' },
      { col1: 'Security Standard', col2: 'Up to 500 Seats', col3: 'Annual Billing', col4: '$8,200/mo', col5: '18 Accounts' },
      { col1: 'Growth Suite', col2: 'Up to 100 Seats', col3: 'Monthly Billing', col4: '$2,100/mo', col5: '76 Accounts' },
    ],
  },
  subscriptions: {
    title: 'Active Subscriptions',
    subtitle: 'Track recurring contracts, renewals, seat entitlements, and lifecycle changes.',
    icon: CreditCard,
    primaryAction: 'New Subscription',
    sampleColumns: ['Subscription ID', 'Product', 'Customer', 'Renewal Date', 'ARR'],
    sampleData: [
      { col1: 'SUB-1049', col2: 'CloudSuite Pro', col3: 'Apex Innovations Ltd', col4: '2026-11-28', col5: '$43,200' },
      { col1: 'SUB-1048', col2: 'SecureGuard Endpoint', col3: 'Nordic Financial Group', col4: '2026-12-15', col5: '$98,400' },
      { col1: 'SUB-1047', col2: 'DataPulse Analytics', col3: 'Crestview Health Systems', col4: '2026-11-05', col5: '$25,200' },
    ],
  },
  invoices: {
    title: 'Invoices & Billing Statements',
    subtitle: 'Generate, distribute, and track recurring billing statements and tax receipts.',
    icon: FileText,
    primaryAction: 'Generate Invoice',
    sampleColumns: ['Invoice #', 'Customer', 'Issue Date', 'Due Date', 'Amount', 'Status'],
    sampleData: [
      { col1: 'INV-2026-089', col2: 'Apex Innovations Ltd', col3: '2026-10-01', col4: '2026-10-31', col5: '$3,600.00', status: 'Paid' },
      { col1: 'INV-2026-088', col2: 'Nordic Financial Group', col3: '2026-10-01', col4: '2026-10-31', col5: '$8,200.00', status: 'Paid' },
      { col1: 'INV-2026-087', col2: 'Crestview Health Systems', col3: '2026-10-15', col4: '2026-11-15', col5: '$2,100.00', status: 'Pending' },
    ],
  },
  payments: {
    title: 'Payment Transactions',
    subtitle: 'Audit reconciled payments, transaction methods, and settlement statuses.',
    icon: Wallet,
    primaryAction: 'Record Payment',
    sampleColumns: ['Transaction ID', 'Customer', 'Payment Method', 'Amount', 'Date', 'Status'],
    sampleData: [
      { col1: 'TXN-94021', col2: 'Apex Innovations Ltd', col3: 'ACH Direct Debit', col4: '$3,600.00', col5: '2026-10-28', status: 'Settled' },
      { col1: 'TXN-94020', col2: 'Nordic Financial Group', col3: 'Wire Transfer', col4: '$8,200.00', col5: '2026-10-25', status: 'Settled' },
      { col1: 'TXN-94019', col2: 'Horizon Media Partners', col3: 'Corporate Card', col4: '$5,700.00', col5: '2026-10-20', status: 'Settled' },
    ],
  },
  licenses: {
    title: 'License Key & Seat Management',
    subtitle: 'Provision, reassign, revoke, and track individual user seats and software license keys.',
    icon: KeyRound,
    primaryAction: 'Provision License',
    sampleColumns: ['License Key / Token', 'Assigned To', 'Product', 'Allocated Seats', 'Status'],
    sampleData: [
      { col1: 'LIC-CSP-9921-X', col2: 'Engineering Team (Apex)', col3: 'CloudSuite Pro', col4: '120 / 150 Seats', status: 'Active' },
      { col1: 'LIC-SGE-4102-Y', col2: 'Security Operations (Nordic)', col3: 'SecureGuard Endpoint', col4: '410 / 450 Seats', status: 'Active' },
      { col1: 'LIC-DPA-0482-Z', col2: 'Clinical Research (Crestview)', col3: 'DataPulse Analytics', col4: '45 / 100 Seats', status: 'Underutilized' },
    ],
  },
  reports: {
    title: 'Analytics & Financial Reports',
    subtitle: 'Executive summaries on revenue run-rate, churn, seat waste, and optimization trends.',
    icon: BarChart3,
    primaryAction: 'Export Report',
    sampleColumns: ['Report Name', 'Type', 'Frequency', 'Last Generated', 'Format'],
    sampleData: [
      { col1: 'Monthly License Utilization Audit', col2: 'Operational Optimization', col3: 'Monthly', col4: '2026-10-31', col5: 'PDF / CSV' },
      { col1: 'SaaS Spend & Run-Rate Summary', col2: 'Financial MRR/ARR', col3: 'Quarterly', col4: '2026-10-15', col5: 'PDF' },
      { col1: 'Unallocated Seat Waste Analysis', col2: 'Cost Reduction', col3: 'Weekly', col4: '2026-10-29', col5: 'CSV' },
    ],
  },
};

export default function PlaceholderView({ sectionId }) {
  const config = SECTION_CONFIG[sectionId] || {
    title: 'Section Management',
    subtitle: 'SaaS resource management view.',
    icon: Layers,
    primaryAction: 'Add Record',
    sampleColumns: ['Item', 'Details', 'Status'],
    sampleData: [],
  };

  const Icon = config.icon;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center space-x-2 text-forest-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <Icon className="w-4 h-4 text-mint-500" />
            <span>LicenseLoop Console</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{config.title}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{config.subtitle}</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition shadow-2xs">
            <Plus className="w-3.5 h-3.5" />
            <span>{config.primaryAction}</span>
          </button>
        </div>
      </div>

      {/* Main Table / Data Card */}
      <div className="bg-surface rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Action Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-canvas/30">
          <div className="text-xs font-semibold text-slate-700">
            Records Preview (Ready for FastAPI Endpoint Connection)
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-mint-500 inline-block"></span>
            <span>Schema defined & ready for integration</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-canvas/80 text-slate-500 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
                {config.sampleColumns.map((col, idx) => (
                  <th key={idx} className="py-3 px-4">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {config.sampleData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{row.col1}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.col2}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.col3}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.col4}</td>
                  {row.col5 && (
                    <td className="py-3.5 px-4">
                      {row.status ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                            row.status === 'Paid' || row.status === 'Settled' || row.status === 'Active'
                              ? 'bg-mint-50 text-mint-700 border-mint-200'
                              : row.status === 'Underutilized'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {row.status}
                        </span>
                      ) : (
                        <span className="text-slate-600">{row.col5}</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info note */}
        <div className="p-3.5 bg-canvas/40 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            Contract specification prepared for: <code className="text-forest-800 font-mono">/api/{sectionId}</code>
          </span>
          <span className="text-[11px] text-slate-400">
            Live updates will replace demo records automatically when connected.
          </span>
        </div>
      </div>
    </div>
  );
}
