import React from 'react';
import { 
  Repeat, 
  Layers, 
  ShieldCheck, 
  TrendingDown, 
  ArrowRight,
  Server
} from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-canvas text-slate-800 flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="bg-surface border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Loop-inspired brand mark */}
            <div className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center text-mint-400 shadow-sm">
              <Repeat className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-forest-900">LicenseLoop</span>
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-mint-50 text-mint-600 border border-mint-200">
                Frontend v0.1
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-mint-500 inline-block"></span>
            <span>Vite + React + Tailwind Ready</span>
          </div>
        </div>
      </header>

      {/* Main Content Hero Card */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="bg-surface rounded-2xl border border-slate-200 shadow-sm p-8 md:p-10">
          <div className="flex items-center space-x-2 text-forest-700 text-sm font-semibold tracking-wide uppercase mb-3">
            <Layers className="w-4 h-4 text-mint-500" />
            <span>Smart Subscription Management System</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-forest-900 tracking-tight leading-tight mb-3">
            Manage subscriptions.<br />
            Optimize licenses.<br />
            <span className="text-mint-600">Reduce costs.</span>
          </h1>

          <p className="text-slate-600 text-base md:text-lg mb-8 max-w-2xl leading-relaxed">
            Frontend foundation initialized for the 6-hour hackathon. The architecture is ready to build the dashboard views and connect to Neha's FastAPI backend.
          </p>

          {/* Core Feature Pillars / Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl border border-slate-200 bg-canvas/60">
              <div className="w-8 h-8 rounded-lg bg-forest-900/10 text-forest-800 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4 text-forest-800" />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm mb-1">Tailwind Design Tokens</h3>
              <p className="text-xs text-slate-500">Dark forest green, mint green, white, and off-white configured.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-canvas/60">
              <div className="w-8 h-8 rounded-lg bg-mint-100 text-mint-600 flex items-center justify-center mb-3">
                <TrendingDown className="w-4 h-4 text-mint-600" />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm mb-1">Lucide Icons Ready</h3>
              <p className="text-xs text-slate-500">Vector icon library installed for clean, readable dashboard elements.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-canvas/60">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
                <Server className="w-4 h-4 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm mb-1">FastAPI Client Layer</h3>
              <p className="text-xs text-slate-500">Dedicated API bridge module prepared for seamless integration.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-100 gap-4">
            <span className="text-xs text-slate-500">
              Branch: <code className="bg-slate-100 px-2 py-0.5 rounded text-forest-800 font-mono">frontend-anu</code>
            </span>
            <div className="inline-flex items-center space-x-1.5 text-xs font-medium text-forest-800 bg-forest-900/5 px-3 py-1.5 rounded-lg border border-forest-900/10">
              <span>Ready for dashboard layout & components</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="text-center py-5 text-xs text-slate-500 border-t border-slate-200 bg-surface">
        LicenseLoop &copy; 2026 &mdash; Built for Hackathon
      </footer>
    </div>
  );
}

export default App;
