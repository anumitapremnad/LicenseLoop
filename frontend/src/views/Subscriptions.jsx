import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  Users,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { DEMO_FULL_SUBSCRIPTIONS } from '../mock/demoData';
import DemoBanner from '../components/DemoBanner';

export default function Subscriptions({ globalSearch = '' }) {
  const [subscriptions, setSubscriptions] = useState(DEMO_FULL_SUBSCRIPTIONS);
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, review_needed, underutilized
  const [cycleFilter, setCycleFilter] = useState('all'); // all, Annual, Monthly
  const [selectedSub, setSelectedSub] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form state for creating a new subscription
  const [formData, setFormData] = useState({
    customerName: '',
    planName: 'Enterprise Tier',
    billingCycle: 'Annual',
    amount: '3600',
    seatsTotal: '150',
    seatsAllocated: '100',
  });

  const effectiveSearch = (globalSearch || localSearch).trim().toLowerCase();

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      // Status filter
      if (statusFilter !== 'all' && sub.status !== statusFilter) {
        return false;
      }
      // Billing cycle filter
      if (cycleFilter !== 'all' && sub.billingCycle !== cycleFilter) {
        return false;
      }
      // Search filter
      if (effectiveSearch) {
        const matchesName = sub.customerName.toLowerCase().includes(effectiveSearch);
        const matchesPlan = sub.planName.toLowerCase().includes(effectiveSearch);
        const matchesCode = sub.code.toLowerCase().includes(effectiveSearch);
        return matchesName || matchesPlan || matchesCode;
      }
      return true;
    });
  }, [subscriptions, statusFilter, cycleFilter, effectiveSearch]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalCount = subscriptions.length;
    const activeCount = subscriptions.filter((s) => s.status === 'active').length;
    const totalARR = subscriptions.reduce((acc, curr) => acc + curr.amount, 0);
    const totalSeatsAlloc = subscriptions.reduce((acc, curr) => acc + curr.seatsAllocated, 0);
    const totalSeatsCap = subscriptions.reduce((acc, curr) => acc + curr.seatsTotal, 0);
    const avgUtilization = totalSeatsCap > 0 ? Math.round((totalSeatsAlloc / totalSeatsCap) * 100) : 0;
    const flaggedCount = subscriptions.filter((s) => s.status !== 'active').length;

    return { totalCount, activeCount, totalARR, avgUtilization, flaggedCount };
  }, [subscriptions]);

  const handleCreateSubscription = (e) => {
    e.preventDefault();
    if (!formData.customerName.trim()) return;

    const newSub = {
      id: Date.now(),
      code: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: formData.customerName.trim(),
      planName: formData.planName,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: parseFloat(formData.amount) || 2400.0,
      seatsAllocated: parseInt(formData.seatsAllocated, 10) || 10,
      seatsTotal: parseInt(formData.seatsTotal, 10) || 50,
      billingCycle: formData.billingCycle,
    };

    setSubscriptions([newSub, ...subscriptions]);
    setIsNewModalOpen(false);
    setFormData({
      customerName: '',
      planName: 'Enterprise Tier',
      billingCycle: 'Annual',
      amount: '3600',
      seatsTotal: '150',
      seatsAllocated: '100',
    });

    setNotification(`Successfully created subscription ${newSub.code} for ${newSub.customerName}.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleStatusToggle = (subId, newStatus) => {
    setSubscriptions(
      subscriptions.map((s) => (s.id === subId ? { ...s, status: newStatus } : s))
    );
    if (selectedSub && selectedSub.id === subId) {
      setSelectedSub({ ...selectedSub, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Consistent Simulated Records Banner */}
      <DemoBanner
        title="Simulated Records"
        description="Subscriptions and license quotas are populated with demonstration data while backend subscription services are being finalized."
      />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Subscription Management
            </h1>
            <span className="text-[11px] font-semibold bg-forest-900/10 text-forest-800 px-2 py-0.5 rounded-full border border-forest-900/10">
              {subscriptions.length} Contracts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track customer subscriptions, seat quotas, and recurring license renewals.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Subscription</span>
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
            <span>Active Subscriptions</span>
            <CheckCircle2 className="w-4 h-4 text-mint-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.activeCount}</span>
            <span className="text-xs text-slate-400">of {metrics.totalCount} total</span>
          </div>
          <div className="mt-1 text-[11px] text-mint-700 font-medium">
            {Math.round((metrics.activeCount / metrics.totalCount) * 100)}% operational health
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Recurring Revenue</span>
            <DollarSign className="w-4 h-4 text-forest-700" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              ${metrics.totalARR.toLocaleString()}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Contracted license value
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Seat Utilization</span>
            <Users className="w-4 h-4 text-forest-700" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.avgUtilization}%</span>
            <span className="text-xs text-slate-400">across portfolio</span>
          </div>
          <div className="mt-1.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-forest-800 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.avgUtilization}%` }}
            />
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Attention Needed</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.flaggedCount}</span>
            <span className="text-xs text-slate-400">plans flagged</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-700 font-medium">
            Review or rightsizing recommended
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
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
              All ({subscriptions.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                statusFilter === 'active'
                  ? 'bg-surface text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('review_needed')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                statusFilter === 'review_needed'
                  ? 'bg-surface text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Review Needed
            </button>
            <button
              onClick={() => setStatusFilter('underutilized')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                statusFilter === 'underutilized'
                  ? 'bg-surface text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Underutilized
            </button>
          </div>

          {/* Search & Cycle Filter */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search subscription or client..."
                className="pl-8 pr-3 py-1.5 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 w-48 sm:w-60"
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
              value={cycleFilter}
              onChange={(e) => setCycleFilter(e.target.value)}
              className="text-xs bg-canvas border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-forest-800"
            >
              <option value="all">All Cycles</option>
              <option value="Annual">Annual</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-surface rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-canvas/80 border-b border-slate-200 text-slate-500 font-semibold text-xs tracking-wider">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Subscription Code</th>
                <th className="py-3 px-4 whitespace-nowrap">Customer</th>
                <th className="py-3 px-4 whitespace-nowrap">Plan & Cycle</th>
                <th className="py-3 px-4 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 whitespace-nowrap min-w-[140px]">Seat Allocation</th>
                <th className="py-3 px-4 whitespace-nowrap">Contract Value</th>
                <th className="py-3 px-4 whitespace-nowrap">Renewal Date</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 text-xs">
                    No subscriptions match your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((sub) => {
                  const utilPercent = Math.round((sub.seatsAllocated / sub.seatsTotal) * 100);
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-900 whitespace-nowrap">
                        {sub.code}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                          {sub.customerName}
                        </div>
                        <div className="text-[11px] text-slate-400">ID #{sub.id}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-xs font-medium text-slate-800">{sub.planName}</div>
                        <span className="inline-block text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                          {sub.billingCycle}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {sub.status === 'active' && (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-mint-800 bg-mint-100 px-2.5 py-0.5 rounded-full border border-mint-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-mint-500" />
                            <span>Active</span>
                          </span>
                        )}
                        {sub.status === 'review_needed' && (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>Review Needed</span>
                          </span>
                        )}
                        {sub.status === 'underutilized' && (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            <span>Underutilized</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 min-w-[140px] whitespace-nowrap">
                        <div className="flex items-center justify-between text-xs text-slate-700 mb-1">
                          <span>
                            {sub.seatsAllocated} / {sub.seatsTotal}
                          </span>
                          <span className="font-semibold text-slate-900">{utilPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              utilPercent < 50
                                ? 'bg-orange-500'
                                : utilPercent > 90
                                ? 'bg-forest-900'
                                : 'bg-mint-500'
                            }`}
                            style={{ width: `${utilPercent}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                        ${sub.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 font-mono whitespace-nowrap">
                        {sub.renewalDate}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedSub(sub)}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-forest-800 hover:text-forest-900 hover:underline"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-canvas/40 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
          </span>
          <span className="text-[11px] text-slate-400">
            Real-time seat allocation monitored
          </span>
        </div>
      </div>

      {/* Subscription Detail / Manage Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-surface rounded-2xl border border-slate-200 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-semibold text-forest-800 bg-forest-900/10 px-2 py-0.5 rounded">
                  {selectedSub.code}
                </span>
                <h3 className="font-bold text-slate-900 text-lg mt-1.5">
                  {selectedSub.customerName}
                </h3>
                <p className="text-xs text-slate-500">{selectedSub.planName} &bull; {selectedSub.billingCycle} billing</p>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-canvas p-3 rounded-lg border border-slate-100">
                  <div className="text-slate-400 font-medium">Contract Value</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    ${selectedSub.amount.toLocaleString()} / {selectedSub.billingCycle.toLowerCase()}
                  </div>
                </div>
                <div className="bg-canvas p-3 rounded-lg border border-slate-100">
                  <div className="text-slate-400 font-medium">Renewal Date</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                    {selectedSub.renewalDate}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Seat Utilization Ratio</span>
                  <span className="font-bold text-slate-900">
                    {selectedSub.seatsAllocated} of {selectedSub.seatsTotal} Seats (
                    {Math.round((selectedSub.seatsAllocated / selectedSub.seatsTotal) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-forest-800 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.round(
                        (selectedSub.seatsAllocated / selectedSub.seatsTotal) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Contract Health Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStatusToggle(selectedSub.id, 'active')}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition ${
                      selectedSub.status === 'active'
                        ? 'bg-mint-100 border-mint-300 text-mint-900 ring-1 ring-mint-400'
                        : 'bg-surface border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => handleStatusToggle(selectedSub.id, 'review_needed')}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition ${
                      selectedSub.status === 'review_needed'
                        ? 'bg-amber-100 border-amber-300 text-amber-900 ring-1 ring-amber-400'
                        : 'bg-surface border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Review Needed
                  </button>
                  <button
                    onClick={() => handleStatusToggle(selectedSub.id, 'underutilized')}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition ${
                      selectedSub.status === 'underutilized'
                        ? 'bg-orange-100 border-orange-300 text-orange-900 ring-1 ring-orange-400'
                        : 'bg-surface border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Underutilized
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Created: {selectedSub.startDate}
              </span>
              <button
                onClick={() => setSelectedSub(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Subscription Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-surface rounded-2xl border border-slate-200 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-forest-800" />
                <h3 className="font-bold text-slate-900 text-base">Create New Subscription</h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubscription} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer / Organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Acme Global Logistics"
                  className="w-full px-3 py-2 text-sm bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Plan Tier
                  </label>
                  <select
                    value={formData.planName}
                    onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  >
                    <option value="Enterprise Tier">Enterprise Tier</option>
                    <option value="Security Standard">Security Standard</option>
                    <option value="Growth Suite">Growth Suite</option>
                    <option value="Team Tier">Team Tier</option>
                    <option value="Business Pro">Business Pro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Billing Cycle
                  </label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  >
                    <option value="Annual">Annual</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount ($)
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
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Allocated Seats
                  </label>
                  <input
                    type="number"
                    value={formData.seatsAllocated}
                    onChange={(e) => setFormData({ ...formData, seatsAllocated: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Seats
                  </label>
                  <input
                    type="number"
                    value={formData.seatsTotal}
                    onChange={(e) => setFormData({ ...formData, seatsTotal: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
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
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
