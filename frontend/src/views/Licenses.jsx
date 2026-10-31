import React, { useState, useMemo } from 'react';
import {
  KeyRound,
  Plus,
  Search,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  X,
  Layers,
  Users,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { DEMO_LICENSES } from '../mock/demoData';
import DemoBanner from '../components/DemoBanner';

export default function Licenses({ globalSearch = '' }) {
  const [licenses, setLicenses] = useState(DEMO_LICENSES);
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, Active, Underutilized
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // Form for provisioning a new license
  const [formData, setFormData] = useState({
    product: 'CloudSuite Pro',
    customer: '',
    assignedTeam: 'Engineering & DevOps',
    totalSeats: '100',
    usedSeats: '75',
  });

  const effectiveSearch = (globalSearch || localSearch).trim().toLowerCase();

  const filteredLicenses = useMemo(() => {
    return licenses.filter((lic) => {
      if (statusFilter !== 'all' && lic.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      if (effectiveSearch) {
        const matchesToken = lic.token.toLowerCase().includes(effectiveSearch);
        const matchesProd = lic.product.toLowerCase().includes(effectiveSearch);
        const matchesCust = lic.customer.toLowerCase().includes(effectiveSearch);
        const matchesTeam = lic.assignedTeam.toLowerCase().includes(effectiveSearch);
        return matchesToken || matchesProd || matchesCust || matchesTeam;
      }
      return true;
    });
  }, [licenses, statusFilter, effectiveSearch]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalSeats = licenses.reduce((sum, l) => sum + l.totalSeats, 0);
    const usedSeats = licenses.reduce((sum, l) => sum + l.usedSeats, 0);
    const overallUtil = totalSeats > 0 ? Math.round((usedSeats / totalSeats) * 100) : 0;
    const underutilizedCount = licenses.filter((l) => l.status === 'Underutilized').length;

    return { totalSeats, usedSeats, overallUtil, underutilizedCount };
  }, [licenses]);

  const handleCopy = (token) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleAuditAll = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      setLicenses(licenses.map((l) => ({ ...l, lastAudited: today })));
      setIsAuditing(false);
      setNotification('Telemetry audit completed across all active license seats.');
      setTimeout(() => setNotification(null), 3500);
    }, 700);
  };

  const handleProvisionLicense = (e) => {
    e.preventDefault();
    if (!formData.customer.trim()) return;

    const prefix = formData.product.substring(0, 3).toUpperCase();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const randChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));

    const total = parseInt(formData.totalSeats, 10) || 50;
    const used = parseInt(formData.usedSeats, 10) || 20;
    const util = used / total;

    const newLic = {
      id: `LIC-${Math.floor(10 + Math.random() * 90)}`,
      token: `LIC-${prefix}-${randNum}-${randChar}`,
      product: formData.product,
      customer: formData.customer.trim(),
      assignedTeam: formData.assignedTeam,
      totalSeats: total,
      usedSeats: used,
      status: util < 0.5 ? 'Underutilized' : 'Active',
      lastAudited: new Date().toISOString().split('T')[0],
    };

    setLicenses([newLic, ...licenses]);
    setIsProvisionModalOpen(false);
    setFormData({
      product: 'CloudSuite Pro',
      customer: '',
      assignedTeam: 'Engineering & DevOps',
      totalSeats: '100',
      usedSeats: '75',
    });

    setNotification(`Provisioned license key ${newLic.token} for ${newLic.customer}.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setLicenses(
      licenses.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    if (selectedLicense && selectedLicense.id === id) {
      setSelectedLicense({ ...selectedLicense, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Consistent Simulated Records Banner */}
      <DemoBanner
        title="Simulated Records"
        description="License quotas, token keys, and seat allocations are populated with demonstration data while license verification endpoints are in development."
      />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              License Management
            </h1>
            <span className="text-[11px] font-semibold bg-forest-900/10 text-forest-800 px-2 py-0.5 rounded-full border border-forest-900/10">
              {licenses.length} License Keys
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit seat allocations, monitor software utilization, and provision enterprise tokens.
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handleAuditAll}
            disabled={isAuditing}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-surface text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-2xs disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing...' : 'Run Audit'}</span>
          </button>
          <button
            onClick={() => setIsProvisionModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Provision Key</span>
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
            <span>Total Licensed Seats</span>
            <Layers className="w-4 h-4 text-forest-700" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {metrics.totalSeats.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Across {licenses.length} product pools
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Consumed Seats</span>
            <Users className="w-4 h-4 text-mint-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {metrics.usedSeats.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-mint-700 font-medium">
            Active employee seats
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Average Utilization</span>
            <ShieldCheck className="w-4 h-4 text-forest-700" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{metrics.overallUtil}%</div>
          <div className="mt-1.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-forest-800 h-full rounded-full transition-all"
              style={{ width: `${metrics.overallUtil}%` }}
            />
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Underutilized Licenses</span>
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {metrics.underutilizedCount}
          </div>
          <div className="mt-1 text-[11px] text-orange-700 font-medium">
            Downsize to save ~$2,950/mo
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
              All ({licenses.length})
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

          {/* Search Field */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search token, product, or team..."
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

      {/* Licenses Table */}
      <div className="bg-surface rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-canvas/80 border-b border-slate-200 text-slate-500 font-semibold text-xs tracking-wider">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">License Key Token</th>
                <th className="py-3 px-4 whitespace-nowrap">Product</th>
                <th className="py-3 px-4 whitespace-nowrap">Customer & Team</th>
                <th className="py-3 px-4 whitespace-nowrap min-w-[130px]">Seat Allocation</th>
                <th className="py-3 px-4 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 whitespace-nowrap">Last Audited</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLicenses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 text-xs">
                    No license tokens match the search query.
                  </td>
                </tr>
              ) : (
                filteredLicenses.map((lic) => {
                  const utilPercent = Math.round((lic.usedSeats / lic.totalSeats) * 100);
                  const isCopied = copiedToken === lic.token;

                  return (
                    <tr key={lic.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-mono text-xs whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-semibold text-slate-900 bg-canvas px-2 py-0.5 rounded border border-slate-200">
                            {lic.token}
                          </span>
                          <button
                            onClick={() => handleCopy(lic.token)}
                            className="text-slate-400 hover:text-slate-600 p-1"
                            title="Copy Token"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-mint-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                        {lic.product}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-slate-900">{lic.customer}</div>
                        <div className="text-[11px] text-slate-400">{lic.assignedTeam}</div>
                      </td>
                      <td className="py-3.5 px-4 min-w-[130px] whitespace-nowrap">
                        <div className="flex items-center justify-between text-xs text-slate-700 mb-1">
                          <span>
                            {lic.usedSeats} / {lic.totalSeats} seats
                          </span>
                          <span className="font-semibold text-slate-900">{utilPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              utilPercent < 50
                                ? 'bg-orange-500'
                                : utilPercent > 85
                                ? 'bg-forest-900'
                                : 'bg-mint-500'
                            }`}
                            style={{ width: `${utilPercent}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {lic.status === 'Active' ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-mint-800 bg-mint-100 px-2.5 py-0.5 rounded-full border border-mint-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-mint-500" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            <span>Underutilized</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 font-mono whitespace-nowrap">
                        {lic.lastAudited}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLicense(lic)}
                          className="text-xs font-semibold text-forest-800 hover:text-forest-900 hover:underline"
                        >
                          Configure
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
            Showing {filteredLicenses.length} of {licenses.length} provisioned licenses
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Seat Entitlement Polling Active
          </span>
        </div>
      </div>

      {/* Configure License Modal */}
      {selectedLicense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-surface rounded-2xl border border-slate-200 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-forest-800 bg-forest-900/10 px-2.5 py-0.5 rounded">
                  {selectedLicense.token}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1.5">
                  {selectedLicense.product}
                </h3>
                <p className="text-xs text-slate-500">{selectedLicense.customer} &bull; {selectedLicense.assignedTeam}</p>
              </div>
              <button
                onClick={() => setSelectedLicense(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="bg-canvas p-3 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700">Seat Utilization Ratio</span>
                  <span className="font-bold text-slate-900">
                    {selectedLicense.usedSeats} / {selectedLicense.totalSeats} seats (
                    {Math.round((selectedLicense.usedSeats / selectedLicense.totalSeats) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-forest-800 h-full rounded-full"
                    style={{
                      width: `${Math.round(
                        (selectedLicense.usedSeats / selectedLicense.totalSeats) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Status Designation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedLicense.id, 'Active')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition ${
                      selectedLicense.status === 'Active'
                        ? 'bg-mint-100 border-mint-300 text-mint-900 ring-1 ring-mint-400'
                        : 'bg-surface border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLicense.id, 'Underutilized')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition ${
                      selectedLicense.status === 'Underutilized'
                        ? 'bg-orange-100 border-orange-300 text-orange-900 ring-1 ring-orange-400'
                        : 'bg-surface border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Underutilized
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                Last verified telemetry ping: {selectedLicense.lastAudited}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedLicense(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provision License Key Modal */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-surface rounded-2xl border border-slate-200 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-forest-800" />
                <h3 className="font-bold text-slate-900 text-base">Provision License Key</h3>
              </div>
              <button
                onClick={() => setIsProvisionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProvisionLicense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Customer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  placeholder="e.g. Apex Innovations Ltd"
                  className="w-full px-3 py-2 text-sm bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Product Package
                  </label>
                  <select
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  >
                    <option value="CloudSuite Pro">CloudSuite Pro</option>
                    <option value="SecureGuard Endpoint">SecureGuard Endpoint</option>
                    <option value="DevMatrix CI/CD">DevMatrix CI/CD</option>
                    <option value="DataPulse Analytics">DataPulse Analytics</option>
                    <option value="CollabHub Enterprise">CollabHub Enterprise</option>
                    <option value="TalentFlow HR">TalentFlow HR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Team
                  </label>
                  <input
                    type="text"
                    value={formData.assignedTeam}
                    onChange={(e) => setFormData({ ...formData, assignedTeam: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Seat Quota
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Currently Assigned
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.usedSeats}
                    onChange={(e) => setFormData({ ...formData, usedSeats: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProvisionModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition"
                >
                  Generate & Provision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
