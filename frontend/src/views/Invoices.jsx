import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
} from 'lucide-react';
import { DEMO_INVOICES } from '../mock/demoData';
import DemoBanner from '../components/DemoBanner';

export default function Invoices({ globalSearch = '' }) {
  const [invoices, setInvoices] = useState(DEMO_INVOICES);
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, paid, pending, overdue
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form data for creating a new invoice with lazy date initialization
  const [formData, setFormData] = useState(() => ({
    customerName: '',
    subscriptionCode: 'SUB-1049',
    amount: '2400.00',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pending',
  }));

  const effectiveSearch = (globalSearch || localSearch).trim().toLowerCase();

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) {
        return false;
      }
      if (effectiveSearch) {
        const matchesNum = inv.invoiceNumber.toLowerCase().includes(effectiveSearch);
        const matchesCust = inv.customerName.toLowerCase().includes(effectiveSearch);
        const matchesSub = inv.subscriptionCode.toLowerCase().includes(effectiveSearch);
        return matchesNum || matchesCust || matchesSub;
      }
      return true;
    });
  }, [invoices, statusFilter, effectiveSearch]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidAmount = invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const pendingAmount = invoices
      .filter((inv) => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const overdueAmount = invoices
      .filter((inv) => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);

    return { totalAmount, paidAmount, pendingAmount, overdueAmount };
  }, [invoices]);

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!formData.customerName.trim()) return;

    const newInv = {
      id: Date.now(),
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName: formData.customerName.trim(),
      subscriptionCode: formData.subscriptionCode,
      amount: parseFloat(formData.amount) || 1200.0,
      status: formData.status,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
    };

    setInvoices([newInv, ...invoices]);
    setIsNewModalOpen(false);
    setFormData({
      customerName: '',
      subscriptionCode: 'SUB-1049',
      amount: '2400.00',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
    });

    setNotification(`Invoice ${newInv.invoiceNumber} created successfully for ${newInv.customerName}.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleExportCSV = () => {
    const headers = ['Invoice Number', 'Customer', 'Subscription', 'Amount', 'Status', 'Issue Date', 'Due Date'];
    const rows = filteredInvoices.map((inv) => [
      inv.invoiceNumber,
      `"${inv.customerName}"`,
      inv.subscriptionCode,
      inv.amount,
      inv.status,
      inv.issueDate,
      inv.dueDate,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `licenseloop-invoices-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotification('Invoice summary CSV successfully exported.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleMarkStatus = (invoiceId, newStatus) => {
    setInvoices(
      invoices.map((inv) => (inv.id === invoiceId ? { ...inv, status: newStatus } : inv))
    );
    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      setSelectedInvoice({ ...selectedInvoice, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Consistent Simulated Records Banner */}
      <DemoBanner
        title="Simulated Records"
        description="Invoice statement records and billing schedules are generated for demonstration while backend invoicing services are being finalized."
      />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Invoices & Billing
            </h1>
            <span className="text-[11px] font-semibold bg-forest-900/10 text-forest-800 px-2 py-0.5 rounded-full border border-forest-900/10">
              {invoices.length} Statements
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage customer invoicing, automated recurring billing, and receivables.
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-surface text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 bg-mint-50 border border-mint-200 text-mint-900 text-xs rounded-xl flex items-center justify-between animate-fade-in shadow-2xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-mint-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-mint-700 hover:text-mint-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Invoiced</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            ${metrics.totalAmount.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {invoices.length} cumulative statements
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Collected / Paid</span>
            <CheckCircle2 className="w-4 h-4 text-mint-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            ${metrics.paidAmount.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-mint-700 font-medium">
            {Math.round((metrics.paidAmount / (metrics.totalAmount || 1)) * 100)}% realization rate
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Receivables</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            ${metrics.pendingAmount.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Due within next 30 days
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Overdue Amount</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            ${metrics.overdueAmount.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-red-600 font-medium">
            Action required
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1 bg-canvas p-1 rounded-lg border border-slate-200/80 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                statusFilter === 'all'
                  ? 'bg-surface text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({invoices.length})
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                statusFilter === 'paid'
                  ? 'bg-surface text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                statusFilter === 'pending'
                  ? 'bg-surface text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('overdue')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                statusFilter === 'overdue'
                  ? 'bg-surface text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Overdue
            </button>
          </div>

          {/* Search Field */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search invoice # or customer..."
              className="pl-8 pr-3 py-1.5 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 w-full sm:w-64"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-surface rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-canvas/80 border-b border-slate-200 text-slate-500 font-semibold text-xs tracking-wider">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Invoice #</th>
                <th className="py-3 px-4 whitespace-nowrap">Customer</th>
                <th className="py-3 px-4 whitespace-nowrap">Subscription</th>
                <th className="py-3 px-4 whitespace-nowrap">Amount</th>
                <th className="py-3 px-4 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 whitespace-nowrap">Issue Date</th>
                <th className="py-3 px-4 whitespace-nowrap">Due Date</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 text-xs">
                    No invoice statements match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-900 whitespace-nowrap">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                      {inv.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                      {inv.subscriptionCode}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                      ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {inv.status === 'paid' && (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-mint-800 bg-mint-100 px-2.5 py-0.5 rounded-full border border-mint-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-mint-500" />
                          <span>Paid</span>
                        </span>
                      )}
                      {inv.status === 'pending' && (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Pending</span>
                        </span>
                      )}
                      {inv.status === 'overdue' && (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-red-800 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          <span>Overdue</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 font-mono whitespace-nowrap">
                      {inv.issueDate}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 font-mono whitespace-nowrap">
                      {inv.dueDate}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="text-xs font-semibold text-forest-800 hover:text-forest-900 hover:underline"
                      >
                        View Statement
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-canvas/40 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Showing {filteredInvoices.length} of {invoices.length} invoices
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Automated Net-30 Terms
          </span>
        </div>
      </div>

      {/* Invoice Detail / Statement Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-surface rounded-2xl border border-slate-200 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-forest-800 bg-forest-900/10 px-2.5 py-0.5 rounded">
                    {selectedInvoice.invoiceNumber}
                  </span>
                  <span className="text-xs text-slate-400">&bull; {selectedInvoice.subscriptionCode}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mt-1.5">
                  {selectedInvoice.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-canvas p-3 rounded-lg border border-slate-100">
                  <div className="text-slate-400 font-medium">Issue Date</div>
                  <div className="text-slate-900 font-mono font-semibold mt-0.5">
                    {selectedInvoice.issueDate}
                  </div>
                </div>
                <div className="bg-canvas p-3 rounded-lg border border-slate-100">
                  <div className="text-slate-400 font-medium">Due Date</div>
                  <div className="text-slate-900 font-mono font-semibold mt-0.5">
                    {selectedInvoice.dueDate}
                  </div>
                </div>
              </div>

              {/* Line items simulated breakdown */}
              <div className="border border-slate-100 rounded-xl p-3 bg-canvas/60">
                <div className="font-semibold text-slate-800 mb-2">Itemized Entitlements</div>
                <div className="space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>License Subscription Plan Entitlement</span>
                    <span className="font-semibold text-slate-900">
                      ${(selectedInvoice.amount * 0.85).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tier SLA Support & Telemetry</span>
                    <span className="font-semibold text-slate-900">
                      ${(selectedInvoice.amount * 0.15).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between font-bold text-slate-900 text-sm">
                    <span>Total Statement Due</span>
                    <span>${selectedInvoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Update Payment Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleMarkStatus(selectedInvoice.id, 'paid')}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition ${
                      selectedInvoice.status === 'paid'
                        ? 'bg-mint-100 border-mint-300 text-mint-900 ring-1 ring-mint-400'
                        : 'bg-surface border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Paid
                  </button>
                  <button
                    onClick={() => handleMarkStatus(selectedInvoice.id, 'pending')}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition ${
                      selectedInvoice.status === 'pending'
                        ? 'bg-amber-100 border-amber-300 text-amber-900 ring-1 ring-amber-400'
                        : 'bg-surface border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleMarkStatus(selectedInvoice.id, 'overdue')}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition ${
                      selectedInvoice.status === 'overdue'
                        ? 'bg-red-100 border-red-300 text-red-900 ring-1 ring-red-400'
                        : 'bg-surface border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Overdue
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedInvoice(null);
                  handleExportCSV();
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Download PDF Statement</span>
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Invoice Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-surface rounded-2xl border border-slate-200 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-forest-800" />
                <h3 className="font-bold text-slate-900 text-base">Generate Invoice</h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Customer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Apex Innovations Ltd"
                  className="w-full px-3 py-2 text-sm bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subscription Code
                  </label>
                  <input
                    type="text"
                    value={formData.subscriptionCode}
                    onChange={(e) => setFormData({ ...formData, subscriptionCode: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition"
                >
                  Issue Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
