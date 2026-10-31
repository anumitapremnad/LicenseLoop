import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Plus,
  Search,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Building2,
  Mail,
  User,
} from 'lucide-react';
import { fetchApi } from '../api/client';
import { DEMO_CUSTOMERS } from '../mock/demoData';
import DemoBanner from '../components/DemoBanner';

export default function Customers({ globalSearch = '', backendStatus }) {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Customer Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotification, setSuccessNotification] = useState(null);

  // Load customers from GET /api/customers/ with fallback to DEMO_CUSTOMERS if disconnected
  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await fetchApi('/api/customers/');
      setCustomers(Array.isArray(data) ? data : []);
      setIsLiveConnected(true);
    } catch (err) {
      setFetchError(err.message || 'FastAPI backend is offline or unreachable.');
      setIsLiveConnected(false);
      // Fallback to demo customers if live database is unreachable
      setCustomers((prev) => (prev.length > 0 && isLiveConnected ? prev : DEMO_CUSTOMERS));
    } finally {
      setIsLoading(false);
    }
  }, [isLiveConnected]);

  // Initial fetch on mount
  useEffect(() => {
    let ignore = false;
    async function fetchInitialData() {
      try {
        const data = await fetchApi('/api/customers/');
        if (!ignore) {
          setCustomers(Array.isArray(data) ? data : []);
          setIsLiveConnected(true);
        }
      } catch (err) {
        if (!ignore) {
          setFetchError(err.message || 'FastAPI backend is offline or unreachable.');
          setIsLiveConnected(false);
          setCustomers(DEMO_CUSTOMERS);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchInitialData();
    return () => {
      ignore = true;
    };
  }, []);

  // Client-side input validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Contact name is required.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    return errors;
  };

  // Submit new customer via POST /api/customers/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || null,
      };

      const createdCustomer = await fetchApi('/api/customers/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Append newly created customer with database ID
      setCustomers((prev) => [createdCustomer, ...prev]);
      setIsLiveConnected(true);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', company: '' });
      setFormErrors({});
      setSuccessNotification(
        `Customer "${createdCustomer.name}" created successfully (ID: #${createdCustomer.id}).`
      );
    } catch (err) {
      // If backend is offline, provide clear error message
      setSubmitError(err.message || 'Failed to create customer record on backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter customers by search term
  const activeSearch = (searchQuery || globalSearch).toLowerCase().trim();
  const filteredCustomers = customers.filter((cust) => {
    if (!activeSearch) return true;
    const nameMatch = cust.name?.toLowerCase().includes(activeSearch);
    const emailMatch = cust.email?.toLowerCase().includes(activeSearch);
    const companyMatch = cust.company?.toLowerCase().includes(activeSearch);
    const idMatch = String(cust.id).includes(activeSearch);
    return nameMatch || emailMatch || companyMatch || idMatch;
  });

  const isActuallyConnected = isLiveConnected && (backendStatus ? backendStatus.connected : true);

  return (
    <div className="space-y-6">
      {/* Consistent Backend-Disconnected Demo-Mode Banner */}
      {!isActuallyConnected && (
        <DemoBanner
          title="Backend Disconnected"
          description="FastAPI backend is offline at http://localhost:8000. Displaying demonstration customer records until the live service connects."
        />
      )}

      {/* Subtle Connection Error Notice with Retry Button if error occurred */}
      {fetchError && !isLoading && (
        <div className="p-3 bg-amber-50/70 border border-amber-200/90 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900 shadow-2xs">
          <div className="flex items-center space-x-2 min-w-0">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="truncate">
              <strong>Live Sync Notice:</strong> {fetchError} Fallback demo dataset active.
            </span>
          </div>
          <button
            onClick={loadCustomers}
            className="self-start sm:self-auto shrink-0 px-2.5 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium text-xs transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Success Notification Banner */}
      {successNotification && (
        <div className="p-3.5 rounded-xl bg-mint-50 border border-mint-200 text-mint-900 text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-mint-600 shrink-0" />
            <span className="font-medium">{successNotification}</span>
          </div>
          <button
            onClick={() => setSuccessNotification(null)}
            className="text-mint-700 hover:text-mint-900 p-1"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center space-x-2 text-forest-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-mint-500" />
            <span>Customer Accounts</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Enterprise Customers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage client enterprise accounts, contacts, and registered organizations.
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={loadCustomers}
            disabled={isLoading}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-surface text-slate-700 text-xs font-medium hover:bg-canvas transition shadow-2xs disabled:opacity-50"
            title="Refresh from FastAPI backend"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => {
              setSubmitError(null);
              setFormErrors({});
              setIsModalOpen(true);
            }}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-surface rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Action Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-canvas/30">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, email, or company..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-surface border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 placeholder-slate-400 transition"
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

          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span
              className={`w-2 h-2 rounded-full ${
                isActuallyConnected ? 'bg-mint-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="font-mono text-[11px] text-slate-600">GET /api/customers/</span>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-forest-700 mb-3" />
            <p className="text-xs font-medium text-slate-700">Loading customers...</p>
            <p className="text-[11px] text-slate-400 mt-1">Connecting to FastAPI backend</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-canvas/80 text-slate-500 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 w-16 whitespace-nowrap">ID</th>
                  <th className="py-3 px-4 whitespace-nowrap">Organization / Company</th>
                  <th className="py-3 px-4 whitespace-nowrap">Primary Contact</th>
                  <th className="py-3 px-4 whitespace-nowrap">Email Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-slate-400 text-xs">
                      No customer records found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                        #{cust.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {cust.company ? (
                          <div className="flex items-center space-x-1.5">
                            <Building2 className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                            <span>{cust.company}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">None specified</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{cust.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs font-mono whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{cust.email}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info: Accurate connection status */}
        <div className="p-3.5 bg-canvas/40 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            Showing {filteredCustomers.length} of {customers.length} customer records
          </span>
          {isActuallyConnected ? (
            <span className="inline-flex items-center space-x-1.5 text-[11px] text-mint-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-mint-500 animate-pulse" />
              <span>Live Database Synced</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 text-[11px] text-amber-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Backend Disconnected (Demo Standby)</span>
            </span>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-surface rounded-xl border border-slate-200 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-forest-800" />
                <h3 className="font-bold text-slate-900 text-base">Add New Customer</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Banner inside Modal */}
            {submitError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                    }}
                    placeholder="e.g. Jane Doe"
                    disabled={isSubmitting}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition"
                  />
                </div>
                {formErrors.name && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: null });
                    }}
                    placeholder="e.g. jane@example.com"
                    disabled={isSubmitting}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Company Field (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Acme Corporation"
                    disabled={isSubmitting}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Customer</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
