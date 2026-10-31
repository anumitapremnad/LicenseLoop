import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Plus,
  Search,
  Download,
  CheckCircle2,
  Clock,
  CreditCard,
  Building,
  X,
  FileCheck,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { DEMO_PAYMENTS } from '../mock/demoData';
import DemoBanner from '../components/DemoBanner';

export default function Payments({ globalSearch = '' }) {
  const [payments, setPayments] = useState(DEMO_PAYMENTS);
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, settled, processing
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form for recording a payment with lazy initializer for date
  const [formData, setFormData] = useState(() => ({
    invoiceNumber: 'INV-2026-087',
    customerName: '',
    amount: '2100.00',
    method: 'ACH Direct Debit',
    status: 'settled',
    paymentDate: new Date().toISOString().split('T')[0],
  }));

  const effectiveSearch = (globalSearch || localSearch).trim().toLowerCase();

  const filteredPayments = useMemo(() => {
    return payments.filter((pmt) => {
      if (statusFilter !== 'all' && pmt.status !== statusFilter) {
        return false;
      }
      if (methodFilter !== 'all' && pmt.method !== methodFilter) {
        return false;
      }
      if (effectiveSearch) {
        const matchesTxn = pmt.transactionCode.toLowerCase().includes(effectiveSearch);
        const matchesInv = pmt.invoiceNumber.toLowerCase().includes(effectiveSearch);
        const matchesCust = pmt.customerName.toLowerCase().includes(effectiveSearch);
        return matchesTxn || matchesInv || matchesCust;
      }
      return true;
    });
  }, [payments, statusFilter, methodFilter, effectiveSearch]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalVolume = payments.reduce((sum, p) => sum + p.amount, 0);
    const settledCount = payments.filter((p) => p.status === 'settled').length;
    const processingVolume = payments
      .filter((p) => p.status === 'processing')
      .reduce((sum, p) => sum + p.amount, 0);
    const avgSettlement = payments.length > 0 ? Math.round(totalVolume / payments.length) : 0;

    return { totalVolume, settledCount, processingVolume, avgSettlement };
  }, [payments]);

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!formData.customerName.trim()) return;

    const newPayment = {
      id: Date.now(),
      transactionCode: `TXN-${Math.floor(90000 + Math.random() * 9999)}`,
      invoiceNumber: formData.invoiceNumber.trim(),
      customerName: formData.customerName.trim(),
      amount: parseFloat(formData.amount) || 1000.0,
      method: formData.method,
      status: formData.status,
      paymentDate: formData.paymentDate,
    };

    setPayments([newPayment, ...payments]);
    setIsRecordModalOpen(false);
    setFormData({
      invoiceNumber: 'INV-2026-087',
      customerName: '',
      amount: '2100.00',
      method: 'ACH Direct Debit',
      status: 'settled',
      paymentDate: new Date().toISOString().split('T')[0],
    });

    setNotification(`Payment ${newPayment.transactionCode} recorded for ${newPayment.customerName}.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Invoice #', 'Customer', 'Amount', 'Method', 'Status', 'Date'];
    const rows = filteredPayments.map((p) => [
      p.transactionCode,
      p.invoiceNumber,
      `"${p.customerName}"`,
      p.amount,
      `"${p.method}"`,
      p.status,
      p.paymentDate,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `licenseloop-payments-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotification('Payments ledger exported successfully.');
    setTimeout(() => setNotification(null), 3000);
  };

  const getMethodIcon = (method) => {
    if (method.includes('Card')) return <CreditCard className="w-3.5 h-3.5 text-forest-700" />;
    return <Building className="w-3.5 h-3.5 text-mint-700" />;
  };

  return (
    <div className="space-y-6">
      {/* Consistent Simulated Records Banner */}
      <DemoBanner
        title="Simulated Records"
        description="Payment gateway transaction history is populated with demonstration data while banking webhooks and settlement APIs are connected."
      />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Payments & Settlements
            </h1>
            <span className="text-[11px] font-semibold bg-forest-900/10 text-forest-800 px-2 py-0.5 rounded-full border border-forest-900/10">
              {payments.length} Settlements
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time transaction settlement ledger and payment processor reconciliation.
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-surface text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Ledger</span>
          </button>
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Payment</span>
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
            <span>Settled Volume</span>
            <Wallet className="w-4 h-4 text-forest-700" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            ${metrics.totalVolume.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-mint-700 font-medium">
            100% captured funds
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Settlement Success Rate</span>
            <ShieldCheck className="w-4 h-4 text-mint-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">98.4%</div>
          <div className="mt-1 text-[11px] text-slate-400">
            0 chargebacks recorded
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>In-Flight Processing</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            ${metrics.processingVolume.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Estimated clearance 24 hrs
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Average Transaction</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            ${metrics.avgSettlement.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Across enterprise accounts
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
              All ({payments.length})
            </button>
            <button
              onClick={() => setStatusFilter('settled')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                statusFilter === 'settled'
                  ? 'bg-surface text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Settled
            </button>
            <button
              onClick={() => setStatusFilter('processing')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                statusFilter === 'processing'
                  ? 'bg-surface text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Processing
            </button>
          </div>

          {/* Search & Method Filter */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search txn # or customer..."
                className="pl-8 pr-3 py-1.5 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 w-44 sm:w-56"
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

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="text-xs bg-canvas border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-forest-800"
            >
              <option value="all">All Methods</option>
              <option value="ACH Direct Debit">ACH Direct Debit</option>
              <option value="Wire Transfer">Wire Transfer</option>
              <option value="Corporate Card">Corporate Card</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-surface rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-canvas/80 border-b border-slate-200 text-slate-500 font-semibold text-xs tracking-wider">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Transaction Code</th>
                <th className="py-3 px-4 whitespace-nowrap">Invoice #</th>
                <th className="py-3 px-4 whitespace-nowrap">Customer</th>
                <th className="py-3 px-4 whitespace-nowrap">Amount</th>
                <th className="py-3 px-4 whitespace-nowrap">Settlement Method</th>
                <th className="py-3 px-4 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 whitespace-nowrap">Date</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 text-xs">
                    No transactions match your query.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pmt) => (
                  <tr key={pmt.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-900 whitespace-nowrap">
                      {pmt.transactionCode}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                      {pmt.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                      {pmt.customerName}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                      ${pmt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-700">
                        {getMethodIcon(pmt.method)}
                        <span>{pmt.method}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {pmt.status === 'settled' ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-mint-800 bg-mint-100 px-2.5 py-0.5 rounded-full border border-mint-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-mint-500" />
                          <span>Settled</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Processing</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 font-mono whitespace-nowrap">
                      {pmt.paymentDate}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedPayment(pmt)}
                        className="text-xs font-semibold text-forest-800 hover:text-forest-900 hover:underline"
                      >
                        Receipt
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
            Showing {filteredPayments.length} of {payments.length} transactions
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Encrypted TLS 1.3 Settlement
          </span>
        </div>
      </div>

      {/* Payment Receipt Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-surface rounded-2xl border border-slate-200 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-mint-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Payment Receipt</h3>
                  <p className="text-[11px] font-mono text-slate-400">{selectedPayment.transactionCode}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="text-center py-3 bg-canvas rounded-xl border border-slate-100">
                <div className="text-slate-400 text-xs">Total Amount Settled</div>
                <div className="text-2xl font-bold text-slate-900 mt-0.5">
                  ${selectedPayment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="mt-1 inline-flex items-center space-x-1 text-[11px] font-semibold text-mint-800 bg-mint-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-mint-600" />
                  <span className="capitalize">{selectedPayment.status}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex justify-between py-1 text-slate-600 border-b border-slate-50">
                  <span>Customer</span>
                  <span className="font-semibold text-slate-900">{selectedPayment.customerName}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600 border-b border-slate-50">
                  <span>Invoice Reference</span>
                  <span className="font-mono text-slate-900">{selectedPayment.invoiceNumber}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600 border-b border-slate-50">
                  <span>Settlement Method</span>
                  <span className="font-medium text-slate-900">{selectedPayment.method}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Settlement Date</span>
                  <span className="font-mono text-slate-900">{selectedPayment.paymentDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Auth ref: #ATH-8849-OK</span>
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-surface rounded-2xl border border-slate-200 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-forest-800" />
                <h3 className="font-bold text-slate-900 text-base">Record Payment</h3>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer / Payer <span className="text-red-500">*</span>
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
                    Invoice #
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
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
                    Payment Method
                  </label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  >
                    <option value="ACH Direct Debit">ACH Direct Debit</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="Corporate Card">Corporate Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Settlement Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition"
                >
                  Record Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
