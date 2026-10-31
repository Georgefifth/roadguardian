import React from 'react';
import { ShieldAlert, Camera, ShieldCheck, FileCheck2 } from 'lucide-react';
import { TriageStep } from '../types';

interface StepProgressBarProps {
  currentStep: TriageStep;
  onSelectStep: (step: TriageStep) => void;
  safetySecured: boolean;
  photosCount: number;
  towVerified: boolean;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  onSelectStep,
  safetySecured,
  photosCount,
  towVerified,
}) => {
  const steps: { step: TriageStep; label: string; sub: string; icon: React.FC<{ className?: string }>; done: boolean }[] = [
    {
      step: 1,
      label: '1. Life Safety',
      sub: safetySecured ? 'Secured' : 'Action Required',
      icon: ShieldAlert,
      done: safetySecured,
    },
    {
      step: 2,
      label: '2. Evidence Vault',
      sub: `${photosCount}/6 Captured`,
      icon: Camera,
      done: photosCount >= 4,
    },
    {
      step: 3,
      label: '3. Tow Shield',
      sub: towVerified ? 'Protected' : 'Anti-Scam Check',
      icon: ShieldCheck,
      done: towVerified,
    },
    {
      step: 4,
      label: '4. Incident Packet',
      sub: 'Export Dossier',
      icon: FileCheck2,
      done: false,
    },
  ];

  return (
    <nav className="no-print bg-obsidian-900 border-b border-obsidian-700/60 py-2.5 px-3">
      <div className="max-w-4xl mx-auto grid grid-cols-4 gap-1.5 sm:gap-3">
        {steps.map((item) => {
          const isActive = currentStep === item.step;
          const Icon = item.icon;

          return (
            <button
              key={item.step}
              onClick={() => onSelectStep(item.step)}
              className={`flex flex-col items-center sm:items-start p-2 rounded-lg border transition-all text-left ${
                isActive
                  ? 'bg-hazard-500/10 border-hazard-500/60 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                  : item.done
                  ? 'bg-obsidian-800/80 border-emerald-500/30 hover:border-emerald-500/50'
                  : 'bg-obsidian-800/40 border-obsidian-700/50 hover:border-obsidian-600'
              }`}
            >
              <div className="flex items-center gap-1.5 w-full">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                    isActive
                      ? 'bg-hazard-500 text-obsidian-950 font-extrabold'
                      : item.done
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-obsidian-700 text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span
                  className={`text-xs font-semibold truncate hidden sm:inline ${
                    isActive ? 'text-hazard-400' : item.done ? 'text-slate-200' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </div>
              <div className="mt-1 w-full flex items-center justify-between text-[11px] font-mono">
                <span className="truncate text-slate-400 hidden xs:inline">{item.sub}</span>
                {item.done && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 ml-auto"></span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
