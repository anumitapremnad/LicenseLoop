import React from 'react';
import { Info } from 'lucide-react';

export default function DemoBanner({
  title = 'Demonstration Mode',
  description,
  badge = 'Demo Mode',
}) {
  return (
    <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 flex items-start sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs">
      <div className="flex items-center space-x-2.5 min-w-0">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
        <span className="leading-relaxed">
          <strong className="font-semibold text-amber-950">{title}:</strong>{' '}
          {description}
        </span>
      </div>
      <span className="shrink-0 px-2 py-0.5 rounded bg-amber-100/90 text-amber-800 font-semibold text-[10px] uppercase tracking-wider border border-amber-200">
        {badge}
      </span>
    </div>
  );
}
