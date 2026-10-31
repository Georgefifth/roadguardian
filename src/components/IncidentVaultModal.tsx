import React from 'react';
import { X, Database, Clock, Trash2, ArrowRight, PlusCircle, Sparkles } from 'lucide-react';
import { CrashIncident } from '../types';

interface IncidentVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: CrashIncident[];
  activeId: string;
  onSelectIncident: (id: string) => void;
  onDeleteIncident: (id: string) => void;
  onNewIncident: () => void;
  onLoadPracticeDrill: () => void;
}

export const IncidentVaultModal: React.FC<IncidentVaultModalProps> = ({
  isOpen,
  onClose,
  incidents,
  activeId,
  onSelectIncident,
  onDeleteIncident,
  onNewIncident,
  onLoadPracticeDrill,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-obsidian-900 border border-obsidian-700 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-obsidian-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-hazard-500" />
            <h3 className="font-bold text-slate-100 text-sm">
              Local Storage Incident Vault
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Incidents List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {incidents.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs space-y-3">
              <p>No incidents recorded in local storage yet.</p>
              <button
                onClick={onLoadPracticeDrill}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-hazard-500/20 text-hazard-300 border border-hazard-500/30 text-xs font-semibold hover:bg-hazard-500/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>Load Practice Accident Drill</span>
              </button>
            </div>
          ) : (
            incidents.map((item) => {
              const isActive = item.id === activeId;
              const photosCount = item.photos.filter((p) => p.dataUrl).length;

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    isActive
                      ? 'bg-hazard-500/10 border-hazard-500/60 shadow-sm'
                      : 'bg-obsidian-800/60 border-obsidian-700/80 hover:border-obsidian-600'
                  }`}
                >
                  <div
                    onClick={() => {
                      onSelectIncident(item.id);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-100 text-xs">
                        {item.id}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-mono px-1 rounded bg-hazard-500 text-obsidian-950 font-extrabold uppercase">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{photosCount} Photos</span>
                      <span>•</span>
                      <span className="capitalize">{item.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        onSelectIncident(item.id);
                        onClose();
                      }}
                      className="p-1.5 rounded-lg bg-obsidian-700 hover:bg-obsidian-600 text-slate-200 transition-colors"
                      title="Load this incident"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteIncident(item.id)}
                      className="p-1.5 rounded-lg bg-obsidian-700/60 hover:bg-emergency-500/80 text-slate-400 hover:text-white transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-obsidian-700 bg-obsidian-950 flex items-center justify-between gap-2 text-xs">
          <button
            onClick={() => {
              onLoadPracticeDrill();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-hazard-400 font-mono text-[11px] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Drill</span>
          </button>

          <button
            onClick={() => {
              onNewIncident();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-hazard-500 hover:bg-hazard-600 text-obsidian-950 font-bold transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New</span>
          </button>
        </div>
      </div>
    </div>
  );
};
