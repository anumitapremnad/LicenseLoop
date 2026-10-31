import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  X,
  Info
} from 'lucide-react';

export default function Header({
  pageTitle,
  onOpenSidebar,
  backendStatus,
  searchQuery,
  onSearchChange,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-slate-200 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Active Page Title */}
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight truncate">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Center: Search Control */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search subscriptions, customers, or licenses..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-canvas border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 placeholder-slate-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Backend Connection Status, Notifications & Profile */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* Backend Connection Indicator with clear Offline / Online distinction */}
          <button
            onClick={() => setShowStatusModal(!showStatusModal)}
            className={`flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs border transition cursor-pointer ${
              backendStatus?.connected
                ? 'bg-mint-50 border-mint-200 text-mint-800'
                : 'bg-amber-50/80 border-amber-200 text-amber-800 hover:bg-amber-100/70'
            }`}
            title="Click for backend connection details"
          >
            {backendStatus?.connected ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-mint-600" />
                <span className="font-medium hidden sm:inline">Backend: Connected</span>
                <span className="font-medium sm:hidden">Online</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-medium hidden sm:inline">Backend: Disconnected (Demo Mode)</span>
                <span className="font-medium sm:hidden">Demo</span>
              </>
            )}
          </button>

          {/* Notifications Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-mint-500 rounded-full ring-2 ring-white" />
            </button>

            {/* Notification Dropdown Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-surface rounded-xl shadow-lg border border-slate-200 p-4 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-bold text-slate-900">Notifications</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2.5">
                  <div className="p-2 rounded bg-amber-50/60 border border-amber-100 text-slate-700">
                    <div className="font-semibold text-amber-900">Seat Optimization Alert</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      40 idle seats flagged in DataPulse Analytics.
                    </div>
                  </div>
                  <div className="p-2 rounded bg-mint-50/60 border border-mint-100 text-slate-700">
                    <div className="font-semibold text-mint-900">Renewal Successful</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      SecureGuard Endpoint renewed for 12 months.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-forest-900 text-mint-300 font-semibold text-xs flex items-center justify-center border border-forest-800">
              LL
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-900 leading-none">Anu P.</div>
              <div className="text-[10px] text-slate-500 leading-none mt-1">Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Backend Status Explanation Modal / Popover */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs">
          <div className="bg-surface rounded-xl border border-slate-200 p-5 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-forest-800" />
                <h3 className="font-bold text-slate-900 text-sm">Backend Connectivity Status</h3>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-canvas border border-slate-200">
                <span className="font-medium text-slate-700">Status</span>
                <span className={`font-semibold ${backendStatus?.connected ? 'text-mint-600' : 'text-amber-700'}`}>
                  {backendStatus?.connected ? 'Connected to FastAPI' : 'Disconnected (Demo Mode Active)'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-canvas border border-slate-200">
                <span className="font-medium text-slate-700">Target Base URL</span>
                <code className="font-mono text-slate-800">{backendStatus?.url || 'http://localhost:8000'}</code>
              </div>
              <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
                {backendStatus?.connected
                  ? 'All data requests are actively querying the live FastAPI backend.'
                  : 'FastAPI backend was not detected at the configured base URL. The application is running on isolated, verified demo data for judge presentation and testing.'}
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
