import React from 'react';
import { Repeat, Sparkles, X } from 'lucide-react';
import { NAV_ITEMS } from '../constants/navigation';

export default function Sidebar({ activeTab, onSelectTab, isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-forest-900 text-slate-100 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-forest-800`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-forest-800/80 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {/* Simple loop-inspired brand mark */}
            <div className="w-10 h-10 rounded-xl bg-forest-950 border border-forest-700/60 flex items-center justify-center shrink-0 shadow-inner">
              <Repeat className="w-5 h-5 text-mint-400 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold text-white tracking-tight">LicenseLoop</span>
              </div>
              <p className="text-[11px] leading-tight text-forest-200/80 mt-1 font-normal">
                Manage subscriptions. Optimize licenses. Reduce costs.
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-forest-300 hover:text-white hover:bg-forest-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-forest-300/70 px-3 mb-2">
            Navigation
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors text-left ${
                    isActive
                      ? 'bg-forest-800 text-white font-medium border-l-[3px] border-mint-400 shadow-xs'
                      : 'text-forest-100/80 hover:text-white hover:bg-forest-800/60 font-normal'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-mint-400' : 'text-forest-300/80'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Cost Optimizer Quick Callout */}
          <div className="mt-8 mx-1 p-3.5 rounded-xl bg-forest-950/80 border border-forest-800">
            <div className="flex items-center space-x-2 text-mint-400 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>License Optimizer</span>
            </div>
            <p className="text-[11px] text-forest-200/80 leading-relaxed">
              38 unallocated seats identified across active plans.
            </p>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-forest-800/80 bg-forest-950/40">
          <div className="flex items-center justify-between text-xs text-forest-300/70">
            <span>Workspace</span>
            <span className="font-medium text-forest-200">Enterprise Core</span>
          </div>
        </div>
      </aside>
    </>
  );
}
