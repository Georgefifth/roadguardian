import React from 'react';
import { Shield, Database, Sparkles, PlusCircle } from 'lucide-react';
import { CrashIncident } from '../types';

interface HeaderProps {
  activeIncident: CrashIncident;
  onOpenVault: () => void;
  onLoadPracticeDrill: () => void;
  onNewIncident: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeIncident,
  onOpenVault,
  onLoadPracticeDrill,
  onNewIncident,
}) => {
  const isDrill = activeIncident.id.startsWith('DRILL-');

  return (
    <header className="no-print bg-obsidian-950/90 backdrop-blur-md border-b border-obsidian-700/80 sticky top-0 z-40 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-hazard-500/10 border border-hazard-500/30 flex items-center justify-center text-hazard-500 shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-slate-100 text-lg leading-tight">
                RoadGuardian
              </span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-hazard-500/15 text-hazard-400 font-semibold border border-hazard-500/20 uppercase tracking-wide">
                COPILOT
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-[11px]">100% Offline • Zero-Cloud Privacy</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isDrill ? (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-mono bg-hazard-500/20 text-hazard-300 border border-hazard-500/40 px-2 py-1 rounded-md">
              <Sparkles className="w-3.5 h-3.5" /> Practice Drill Mode
            </span>
          ) : (
            <button
              onClick={onLoadPracticeDrill}
              title="Load instant pre-filled highway crash scenario for evaluation"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-obsidian-800 hover:bg-obsidian-700 text-slate-300 border border-obsidian-600 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-hazard-400" />
              <span>Load Practice Drill</span>
            </button>
          )}

          <button
            onClick={onOpenVault}
            title="Browse saved incidents in local storage"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-obsidian-800 hover:bg-obsidian-700 text-slate-300 border border-obsidian-600 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xs:inline">Vault</span>
          </button>

          <button
            onClick={onNewIncident}
            title="Start fresh emergency intake"
            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md bg-hazard-500 hover:bg-hazard-600 text-obsidian-950 transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>
    </header>
  );
};
