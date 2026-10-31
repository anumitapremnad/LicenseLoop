import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './views/Overview';
import PlaceholderView from './views/PlaceholderView';
import { NAV_ITEMS } from './constants/navigation';
import { checkBackendHealth } from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    status: 'Checking...',
    url: 'http://localhost:8000',
  });

  // Probe FastAPI backend connection on mount
  useEffect(() => {
    let isMounted = true;
    checkBackendHealth().then((status) => {
      if (isMounted) {
        setBackendStatus(status);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Find active navigation item title
  const activeNavItem = NAV_ITEMS.find((item) => item.id === activeTab);
  const currentTitle = activeNavItem ? activeNavItem.label : 'Overview';

  return (
    <div className="min-h-screen bg-canvas text-slate-800 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        {/* Top Header */}
        <Header
          pageTitle={currentTitle}
          onOpenSidebar={() => setSidebarOpen(true)}
          backendStatus={backendStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' ? (
            <Overview globalSearch={searchQuery} />
          ) : (
            <PlaceholderView sectionId={activeTab} />
          )}
        </main>

        {/* Professional Minimal Footer */}
        <footer className="border-t border-slate-200/80 bg-surface/60 py-4 px-6 text-center text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span className="font-medium text-slate-500">
              LicenseLoop &mdash; Enterprise Subscription & License Management
            </span>
            <span className="text-slate-400">
              Manage subscriptions. Optimize licenses. Reduce costs.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
