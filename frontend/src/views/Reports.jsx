import React, { useState } from 'react';
import {
  Download,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  Sparkles,
  Layers,
  ShieldCheck,
  RefreshCw,
  X,
} from 'lucide-react';
import { DEMO_REPORT_METRICS } from '../mock/demoData';
import DemoBanner from '../components/DemoBanner';

export default function Reports() {
  const [reportData] = useState(DEMO_REPORT_METRICS);
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [appliedRecommendations, setAppliedRecommendations] = useState({});

  const recommendations = [
    {
      id: 'REC-01',
      title: 'DevMatrix CI/CD Seat Rightsizing',
      account: 'Vanguard Software Inc',
      savings: '$1,850 / month',
      description: '52 runner seats have recorded 0 pipeline triggers for 60+ days.',
      impact: 'High Impact',
    },
    {
      id: 'REC-02',
      title: 'DataPulse Analytics Quota Downscale',
      account: 'Crestview Health Systems',
      savings: '$1,400 / month',
      description: 'Only 45 of 100 provisioned BI explorer licenses are actively used.',
      impact: 'Medium Impact',
    },
    {
      id: 'REC-03',
      title: 'CollabHub Enterprise Annual True-Up',
      account: 'Horizon Media Partners',
      savings: '$590 / month',
      description: 'Consolidate 15 legacy contractor seats into the primary workspace pool.',
      impact: 'Low Impact',
    },
  ];

  const handleApplyRec = (id) => {
    setAppliedRecommendations((prev) => ({ ...prev, [id]: true }));
    setNotification('Optimization recommendation queued for account executive review.');
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRefreshAnalytics = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setNotification('Executive reports re-indexed with latest seat audit telemetry.');
      setTimeout(() => setNotification(null), 3000);
    }, 600);
  };

  const handleExportFullCSV = () => {
    const csvLines = [
      'LicenseLoop Executive Report Export',
      `Generated On,${new Date().toISOString()}`,
      '',
      'Monthly SaaS Spend Trend',
      'Month,Spend (USD)',
      ...reportData.monthlySpendHistory.map((m) => `${m.month},${m.amount}`),
      '',
      'Departmental Seat Allocation',
      'Department,Seats,Percentage',
      ...reportData.departmentAllocations.map((d) => `"${d.department}",${d.seats},${d.percentage}%`),
      '',
      'Category Spend',
      'Category,Amount,Share',
      ...reportData.categorySpend.map((c) => `"${c.category}","${c.amount}","${c.share}"`),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvLines.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `licenseloop-executive-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotification('Executive CSV report successfully downloaded.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Consistent Simulated Records Banner */}
      <DemoBanner
        title="Simulated Records"
        description="Analytics trends and department allocations are generated from demonstration telemetry while enterprise data warehouse connectors are being deployed."
      />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Reports & Executive Analytics
            </h1>
            <span className="text-[11px] font-semibold bg-forest-900/10 text-forest-800 px-2 py-0.5 rounded-full border border-forest-900/10">
              Q4 FY2026
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Holistic SaaS spend breakdown, departmental distribution, and automated cost optimization opportunities.
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handleRefreshAnalytics}
            disabled={isRefreshing}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-surface text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-2xs disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Analyzing...' : 'Refresh'}</span>
          </button>
          <button
            onClick={handleExportFullCSV}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full Report</span>
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

      {/* Top Level KPI Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Annualized SaaS Spend</span>
            <DollarSign className="w-4 h-4 text-forest-700" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">$579,000</div>
          <div className="mt-1 flex items-center space-x-1 text-[11px] text-mint-700 font-medium">
            <TrendingUp className="w-3 h-3 text-mint-600" />
            <span>+2.8% vs last month</span>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Potential Cost Savings</span>
            <Sparkles className="w-4 h-4 text-mint-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">$3,840/mo</div>
          <div className="mt-1 text-[11px] text-forest-800 font-medium">
            3 actionable recommendations
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Monitored Employee Seats</span>
            <Users className="w-4 h-4 text-forest-700" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">1,415 Seats</div>
          <div className="mt-1 text-[11px] text-slate-400">
            Across 4 primary departments
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active License Compliance</span>
            <ShieldCheck className="w-4 h-4 text-mint-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">99.2%</div>
          <div className="mt-1 text-[11px] text-mint-700 font-medium">
            SOC2 / ISO27001 aligned
          </div>
        </div>
      </div>

      {/* Main Charts Grid: Monthly Trend Bar Chart & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly SaaS Spend Run-Rate Bar Chart */}
        <div className="lg:col-span-7 bg-surface rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900 text-base">Monthly SaaS Spend Run-Rate</h3>
              <span className="text-xs font-medium text-slate-400">May &ndash; Oct 2026</span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Total monthly expenditure on enterprise software licenses and subscriptions.
            </p>

            {/* Custom Interactive SVG/CSS Bar Chart with overflow protection */}
            <div className="overflow-x-auto pb-2">
              <div className="h-56 min-w-[280px] flex items-end justify-between gap-2 sm:gap-3 pt-6 pb-2 px-4 bg-canvas/60 rounded-xl border border-slate-100 relative">
                {reportData.monthlySpendHistory.map((item, index) => {
                  const isHovered = hoveredMonth === item.month;
                  const isCurrent = index === reportData.monthlySpendHistory.length - 1;

                  return (
                    <div
                      key={item.month}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                      onMouseEnter={() => setHoveredMonth(item.month)}
                      onMouseLeave={() => setHoveredMonth(null)}
                    >
                      {/* Tooltip on hover */}
                      {isHovered && (
                        <div className="absolute -top-10 bg-slate-900 text-white text-[11px] font-semibold py-1 px-2 rounded shadow-lg whitespace-nowrap z-20 animate-fade-in pointer-events-none">
                          ${item.amount.toLocaleString()}
                          <div className="text-[9px] text-mint-400 font-normal">
                            {isCurrent ? 'Current Month' : 'Historical'}
                          </div>
                        </div>
                      )}

                      {/* Bar */}
                      <div
                        className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 ${
                          isCurrent
                            ? 'bg-forest-900 group-hover:bg-forest-800'
                            : 'bg-forest-600/70 group-hover:bg-forest-700'
                        }`}
                        style={{ height: `${item.height}%` }}
                      />

                      {/* Month Label */}
                      <span className="text-xs font-medium text-slate-600 mt-2 whitespace-nowrap">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center space-x-1.5 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-sm bg-forest-900 inline-block" />
              <span>Current month: $48,250</span>
            </span>
            <span className="text-[11px] text-slate-400 whitespace-nowrap">
              Hover over bars to inspect spend
            </span>
          </div>
        </div>

        {/* Department Seat Distribution */}
        <div className="lg:col-span-5 bg-surface rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900 text-base">Seat Allocation by Team</h3>
              <span className="text-xs font-medium text-slate-400">1,415 Total</span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Departmental breakdown of provisioned employee seat quotas.
            </p>

            {/* Distribution bars */}
            <div className="space-y-4">
              {reportData.departmentAllocations.map((dept) => (
                <div key={dept.department}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-800">{dept.department}</span>
                    <span className="font-mono text-slate-600 whitespace-nowrap">
                      {dept.seats} seats ({dept.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${dept.color}`}
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 bg-canvas/60 p-3 rounded-xl border border-slate-100 text-xs">
            <div className="font-semibold text-slate-900 mb-1">Efficiency Insight</div>
            <p className="text-slate-600 text-[11px]">
              Engineering represents 38% of seat costs. Optimizing inactive runner seats can yield immediate savings.
            </p>
          </div>
        </div>
      </div>

      {/* Category Spend & Cost Optimization Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Spend Breakdown */}
        <div className="lg:col-span-5 bg-surface rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-slate-900 text-base">Category Spend Share</h3>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500 mb-5">
            Software licensing budget divided across critical infrastructure pillars.
          </p>

          <div className="space-y-3">
            {reportData.categorySpend.map((cat) => (
              <div
                key={cat.category}
                className="p-3 rounded-xl border border-slate-100 bg-canvas/40 flex items-center justify-between hover:bg-canvas transition"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900">{cat.category}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{cat.share} of total budget</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900">{cat.amount}</div>
                  <div className="text-[10px] text-mint-700 font-medium">Monthly run-rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Optimization Recommendations */}
        <div className="lg:col-span-7 bg-surface rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-mint-600" />
                <h3 className="font-bold text-slate-900 text-base">Active Optimization Opportunities</h3>
              </div>
              <span className="text-xs font-semibold text-mint-800 bg-mint-100 px-2 py-0.5 rounded-full border border-mint-200 shrink-0">
                $3,840/mo potential
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Automated algorithmic suggestions for reducing unused SaaS seat licenses.
            </p>

            <div className="space-y-3">
              {recommendations.map((rec) => {
                const isApplied = appliedRecommendations[rec.id];

                return (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-canvas/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{rec.title}</span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {rec.account}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{rec.description}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-mint-700">{rec.savings}</div>
                        <div className="text-[10px] text-slate-400">{rec.impact}</div>
                      </div>

                      <button
                        onClick={() => handleApplyRec(rec.id)}
                        disabled={isApplied}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          isApplied
                            ? 'bg-mint-100 text-mint-800 border border-mint-200 cursor-default'
                            : 'bg-forest-900 text-white hover:bg-forest-800 shadow-2xs'
                        }`}
                      >
                        {isApplied ? (
                          <span className="inline-flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-mint-600" />
                            <span>Queued</span>
                          </span>
                        ) : (
                          <span>Apply</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Automated rightsizing scanner active</span>
            <span className="text-[11px] text-slate-500 font-mono">Next scan: 00:00 UTC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
