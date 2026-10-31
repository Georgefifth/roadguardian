import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PracticeDrillBannerProps {
  onLoadPracticeDrill: () => void;
}

export const PracticeDrillBanner: React.FC<PracticeDrillBannerProps> = ({
  onLoadPracticeDrill,
}) => {
  return (
    <aside className="no-print bg-obsidian-800/80 hover:bg-obsidian-800 border border-hazard-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md transition-colors">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-hazard-500/20 text-hazard-400 flex items-center justify-center shrink-0 border border-hazard-500/30">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
            <span>Preparedness & Evaluation Drill</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-hazard-500/20 text-hazard-400">
              Instant Demo
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Evaluate all 4 stages (GPS, photo proofs, tow verification, and SHA-256 dossier) with one click.
          </p>
        </div>
      </div>

      <button
        onClick={onLoadPracticeDrill}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-hazard-500 hover:bg-hazard-600 text-obsidian-950 font-bold text-xs transition-all shadow-sm shrink-0 active:scale-95"
      >
        <span>Load Highway Crash Drill</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
