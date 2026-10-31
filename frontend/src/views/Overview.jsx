import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  KeyRound,
  TrendingDown,
  TrendingUp,
  Clock,
  Sparkles,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import {
  OVERVIEW_METRICS,
  RECENT_SUBSCRIPTIONS,
  COST_SAVINGS_OPPORTUNITIES,
  RECENT_ACTIVITY,
} from '../mock/demoData';
import DemoBanner from '../components/DemoBanner';

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
      {/* Consistent Demo Data Disclaimer Banner */}
      <DemoBanner
        title="Demo Data Presentation"
        description="The metrics and records below represent a curated enterprise dataset for demonstration while the FastAPI backend service is in standby."
      />

      {/* Top Row: KPI Statistics Grid */}
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

        {/* Card 2: Monitored Licenses */}
        <div className="bg-surface rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monitored Licenses
            </span>
            <div className="w-9 h-9 rounded-lg bg-forest-900/10 text-forest-800 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-forest-800" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              {OVERVIEW_METRICS.licenseUtilization.usedSeats}
            </span>
            <span className="text-xs text-slate-500">
              / {OVERVIEW_METRICS.licenseUtilization.totalSeats} seats
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-forest-800 h-1.5 rounded-full"
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
            <div className="w-9 h-9 rounded-lg bg-mint-100 text-mint-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-mint-600" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              {OVERVIEW_METRICS.identifiedSavings.value}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-mint-600 bg-mint-50 px-1.5 py-0.5 rounded">
              <TrendingDown className="w-3 h-3 mr-0.5" />
              {OVERVIEW_METRICS.identifiedSavings.count} flags
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

          {/* Table Container with whitespace-nowrap preventing awkward column breaks */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-canvas/80 text-slate-500 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 whitespace-nowrap">Subscription</th>
                  <th className="py-3 px-4 whitespace-nowrap">Customer</th>
                  <th className="py-3 px-4 whitespace-nowrap">Seats Allocated</th>
                  <th className="py-3 px-4 whitespace-nowrap">Monthly Cost</th>
                  <th className="py-3 px-4 whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 whitespace-nowrap">Renewal</th>
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
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-900">{sub.product}</div>
                          <div className="text-[11px] text-slate-400">{sub.category} &bull; {sub.plan}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                          {sub.customer}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
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
                        <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          {sub.monthlyAmount}
                          <span className="text-[10px] font-normal text-slate-400 block">
                            {sub.billingCycle}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${badgeClass}`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap font-mono">
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
            <span className="text-forest-800 font-medium text-[11px]">Verified Demo Dataset</span>
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
                    <p className="font-semibold text-slate-800 leading-snug">{act.title}</p>
                    <p className="text-slate-500 text-[11px] truncate mt-0.5">{act.detail}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono shrink-0">
                    {act.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Optimization Highlights */}
          <div className="bg-surface rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center space-x-2 text-forest-900 font-bold text-base mb-1">
              <Sparkles className="w-4 h-4 text-mint-500" />
              <h3>Cost Optimization</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              AI-driven insights on inactive seats and unused enterprise tiers.
            </p>

            <div className="space-y-3">
              {COST_SAVINGS_OPPORTUNITIES.map((opp) => (
                <div
                  key={opp.id}
                  className="p-3 rounded-lg border border-slate-100 bg-canvas/40 hover:bg-canvas transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">{opp.product}</span>
                    <span className="text-xs font-bold text-mint-700 bg-mint-50 px-2 py-0.5 rounded">
                      {opp.potentialSavings}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">{opp.issue}</p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{opp.urgency}</span>
                    </span>
                    <span className="font-semibold text-forest-800 hover:text-forest-900 cursor-pointer">
                      {opp.action} &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
