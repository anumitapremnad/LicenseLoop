import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  X,
  CheckCircle2,
  DollarSign,
  Users,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { DEMO_PLANS } from '../mock/demoData';
import DemoBanner from '../components/DemoBanner';

export default function Plans({ globalSearch = '' }) {
  const [plans, setPlans] = useState(DEMO_PLANS);
  const [searchQuery, setSearchQuery] = useState('');
  const [billingFilter, setBillingFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    billingCycle: 'Annual',
    seatLimit: 'Up to 100 Seats',
  });
  const [successNotification, setSuccessNotification] = useState(null);

  // Filter plans by billing cycle and search query
  const activeSearch = (searchQuery || globalSearch).toLowerCase().trim();
  const filteredPlans = plans.filter((plan) => {
    const matchesBilling =
      billingFilter === 'ALL' ||
      plan.billingCycle.toLowerCase() === billingFilter.toLowerCase();
    const matchesQuery =
      !activeSearch ||
      plan.name.toLowerCase().includes(activeSearch) ||
      plan.seatLimit.toLowerCase().includes(activeSearch);
    return matchesBilling && matchesQuery;
  });

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) return;

    const newPlan = {
      id: plans.length + 1,
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      billingCycle: formData.billingCycle,
      seatLimit: formData.seatLimit,
      activeSubscribers: 0,
      features: ['Automated Auditing', 'Seat Management', 'Standard Support'],
      popular: false,
    };

    setPlans([newPlan, ...plans]);
    setIsModalOpen(false);
    setFormData({ name: '', price: '', billingCycle: 'Annual', seatLimit: 'Up to 100 Seats' });
    setSuccessNotification(`Plan "${newPlan.name}" created successfully.`);
  };

  return (
    <div className="space-y-6">
      {/* Consistent Disclaimer Banner */}
      <DemoBanner
        title="Simulated Plan Tiers"
        description="Plan configurations and tiers are demonstrated in standalone mode awaiting backend Plans API integration."
      />

      {/* Success Notification */}
      {successNotification && (
        <div className="p-3.5 rounded-xl bg-mint-50 border border-mint-200 text-mint-900 text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-mint-600 shrink-0" />
            <span className="font-medium">{successNotification}</span>
          </div>
          <button
            onClick={() => setSuccessNotification(null)}
            className="text-mint-700 hover:text-mint-900 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center space-x-2 text-forest-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4 text-mint-500" />
            <span>Pricing & Tiers</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Subscription Plans
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure license tiers, seat limits, and recurring subscription fees.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plan name or seats..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 placeholder-slate-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Billing cycle filters */}
        <div className="flex items-center space-x-1 bg-canvas p-1 rounded-lg border border-slate-200 text-xs self-start sm:self-auto">
          <button
            onClick={() => setBillingFilter('ALL')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              billingFilter === 'ALL'
                ? 'bg-surface text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Cycles
          </button>
          <button
            onClick={() => setBillingFilter('annual')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              billingFilter === 'annual'
                ? 'bg-surface text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Annual
          </button>
          <button
            onClick={() => setBillingFilter('monthly')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              billingFilter === 'monthly'
                ? 'bg-surface text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Plans Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-surface rounded-2xl border p-6 flex flex-col justify-between transition hover:border-slate-300 shadow-2xs ${
              plan.popular ? 'border-forest-800 ring-1 ring-forest-800/10' : 'border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">{plan.name}</h3>
                  <span className="inline-block mt-1 text-[11px] font-medium text-forest-700 bg-forest-900/10 px-2 py-0.5 rounded">
                    {plan.seatLimit}
                  </span>
                </div>
                {plan.popular && (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-mint-800 bg-mint-100 px-2 py-0.5 rounded-full border border-mint-200 shrink-0">
                    <Sparkles className="w-3 h-3 text-mint-600" />
                    <span>Popular</span>
                  </span>
                )}
              </div>

              <div className="my-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-slate-900">
                  ${plan.price.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 ml-1.5">
                  / {plan.billingCycle.toLowerCase()}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Key Entitlements
                </div>
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-mint-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{plan.activeSubscribers} Accounts enrolled</span>
              </span>
              <span className="font-medium text-forest-800">{plan.billingCycle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-surface rounded-xl border border-slate-200 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Create New Subscription Plan</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plan Tier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Enterprise Plus"
                  className="w-full px-3 py-2 text-sm bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rate Amount (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="3500.00"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Billing Cycle
                  </label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition"
                  >
                    <option value="Annual">Annual</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seat Limit
                  </label>
                  <input
                    type="text"
                    value={formData.seatLimit}
                    onChange={(e) => setFormData({ ...formData, seatLimit: e.target.value })}
                    placeholder="e.g. Up to 150 Seats"
                    className="w-full px-3 py-2 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
