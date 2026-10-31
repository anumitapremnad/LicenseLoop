import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  KeyRound,
  TrendingDown,
  TrendingUp,
  Clock,
  Sparkles,
  Info,
  Activity,
  CheckCircle2
} from 'lucide-react';
import {
  OVERVIEW_METRICS,
  RECENT_SUBSCRIPTIONS,
  COST_SAVINGS_OPPORTUNITIES,
  RECENT_ACTIVITY
} from '../mock/demoData';

export default function Overview({ globalSearch = '' }) {
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter subscriptions based on search query and status tab
  const filteredSubscriptions = RECENT_SUBSCRIPTIONS.filter((sub) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      sub.status.toLowerCase() === statusFilter.toLowerCase() ||
      sub.status.toLowerCase().replace(/\s+/g, '-') === statusFilter.toLowerCase();
    
    const query = globalSearch.toLowerCase().trim();
    const matchesSearch =
      !query ||
      sub.product.toLowerCase().includes(query) ||
      sub.customer.toLowerCase().includes(query) ||
      sub.category.toLowerCase().includes(query) ||
      sub.id.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Demo Data Disclaimer Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Demo Data Presentation:</strong> The metrics and records below represent a curated enterprise dataset for demonstration while the FastAPI backend service is in standby.
          </span>
        </div>
        <span className="shrink-0 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[10px] uppercase tracking-wide">
          Simulated Data
        </span>
      </div>

      {/* Top Welcome & Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time subscription performance, active license allocation, and cost optimization insights.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-forest-700" />
          <span>Last synchronized: Today, 11:30 AM</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Subscriptions */}
        <div className="bg-surface rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Subscriptions
            </span>
            <div className="w-9 h-9 rounded-lg bg-forest-900/10 text-forest-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-forest-800" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              {OVERVIEW_METRICS.activeSubscriptions.value}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-mint-600 bg-mint-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              {OVERVIEW_METRICS.activeSubscriptions.change}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {OVERVIEW_METRICS.activeSubscriptions.label}
          </p>
        </div>

        {/* Card 2: License Utilization */}
        <div className="bg-surface rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              License Utilization
            </span>
            <div className="w-9 h-9 rounded-lg bg-forest-900/10 text-forest-800 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-forest-800" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              {OVERVIEW_METRICS.licenseUtilization.percentage}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({OVERVIEW_METRICS.licenseUtilization.usedSeats}/{OVERVIEW_METRICS.licenseUtilization.totalSeats} seats)
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-mint-500 h-1.5 rounded-full transition-all"
              style={{ width: `${OVERVIEW_METRICS.licenseUtilization.percentage}%` }}
            />
          </div>
        </div>

        {/* Card 3: Monthly Subscription Spending */}
        <div className="bg-surface rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monthly Subscription Spending
            </span>
            <div className="w-9 h-9 rounded-lg bg-mint-100 text-mint-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-mint-600" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              {OVERVIEW_METRICS.monthlyRunRate.value}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-mint-600 bg-mint-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              {OVERVIEW_METRICS.monthlyRunRate.change}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {OVERVIEW_METRICS.monthlyRunRate.label}
          </p>
        </div>

        {/* Card 4: Potential Cost Savings */}
        <div className="bg-surface rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Potential Cost Savings
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              {OVERVIEW_METRICS.identifiedSavings.value}
            </span>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
              {OVERVIEW_METRICS.identifiedSavings.count} idle seats
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {OVERVIEW_METRICS.identifiedSavings.label}
          </p>
        </div>
      </div>

      {/* Main Content Layout: Table (2/3) + Activity & Optimization (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Key Subscriptions & Licenses Table */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-slate-200 shadow-2xs flex flex-col">
          {/* Table Header Controls */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Key Subscriptions & Licenses</h3>
              <p className="text-xs text-slate-500">
                Monitored accounts, allocated seats, and upcoming renewal deadlines
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 bg-canvas p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  statusFilter === 'ALL'
                    ? 'bg-surface text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All ({RECENT_SUBSCRIPTIONS.length})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  statusFilter === 'active'
                    ? 'bg-surface text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('review-needed')}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  statusFilter === 'review-needed'
                    ? 'bg-surface text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Review Needed
              </button>
              <button
                onClick={() => setStatusFilter('underutilized')}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  statusFilter === 'underutilized'
                    ? 'bg-surface text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Underutilized
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-canvas/80 text-slate-500 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Subscription</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Seats Allocated</th>
                  <th className="py-3 px-4">Monthly Cost</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Renewal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                      No subscriptions match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSubscriptions.map((sub) => {
                    let badgeClass = 'bg-mint-50 text-mint-700 border-mint-200';
                    if (sub.status === 'Review Needed') {
                      badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                    } else if (sub.status === 'Underutilized') {
                      badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
                    }

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{sub.product}</div>
                          <div className="text-[11px] text-slate-400">{sub.category} &bull; {sub.plan}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {sub.customer}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-900 font-medium">
                            {sub.seats.used} / {sub.seats.total}
                          </div>
                          <div className="w-20 bg-slate-100 rounded-full h-1 mt-1">
                            <div
                              className={`h-1 rounded-full ${
                                sub.utilization < 60 ? 'bg-amber-500' : 'bg-mint-500'
                              }`}
                              style={{ width: `${sub.utilization}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {sub.monthlyAmount}
                          <span className="text-[10px] font-normal text-slate-400 block">
                            {sub.billingCycle}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${badgeClass}`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                          {sub.renewalDate}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-3 bg-canvas/40 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Showing {filteredSubscriptions.length} of {RECENT_SUBSCRIPTIONS.length} subscriptions</span>
            <span className="text-forest-800 font-medium">Verified Demo Dataset</span>
          </div>
        </div>

        {/* Right Column: Recent Activity & Cost Optimization Panel */}
        <div className="space-y-6">
          {/* Recent Subscription & License Activity Feed */}
          <div className="bg-surface rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-forest-900 font-bold text-base">
                <Activity className="w-4 h-4 text-mint-500" />
                <h3>Recent Activity</h3>
              </div>
              <span className="text-[11px] text-slate-400">Simulated activity</span>
            </div>

            <div className="space-y-3.5">
              {RECENT_ACTIVITY.map((act) => (
                <div key={act.id} className="flex items-start space-x-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-forest-900/10 text-forest-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest-800" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 leading-snug">{act.title}</div>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">{act.detail}</p>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1">
                      <span>{act.customer}</span>
                      <span>&bull;</span>
                      <span>{act.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Optimization & Recommendations Panel */}
          <div className="bg-surface rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center space-x-2 text-forest-900 font-bold text-base mb-1">
              <Sparkles className="w-4 h-4 text-mint-500" />
              <h3>Optimization Opportunities</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Actionable license adjustments to eliminate shelfware and decrease run-rate spend.
            </p>

            <div className="space-y-3">
              {COST_SAVINGS_OPPORTUNITIES.map((opt) => (
                <div
                  key={opt.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-canvas/40 hover:bg-canvas transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-xs text-slate-900 leading-snug">
                      {opt.title}
                    </span>
                    <span className="text-xs font-bold text-mint-600 shrink-0">
                      {opt.potentialSavings}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                    {opt.recommendation}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Target: {opt.customer}</span>
                    <span className="font-medium text-slate-700 uppercase">
                      {opt.impact} Priority
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Total potential recovery:</span>
              <span className="text-sm font-bold text-slate-900">$1,780/mo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
