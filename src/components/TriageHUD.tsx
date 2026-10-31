import React, { useState } from 'react';
import {
  AlertOctagon,
  PhoneCall,
  MapPin,
  CheckSquare,
  Square,
  ArrowRight,
  ShieldAlert,
  Car,
  Wrench,
  Copy,
  Check,
  Navigation,
} from 'lucide-react';
import { CrashIncident, SafetyChecklist, IncidentType } from '../types';

interface TriageHUDProps {
  incident: CrashIncident;
  onUpdateSafety: (checklist: SafetyChecklist) => void;
  onUpdateType: (type: IncidentType) => void;
  onRefreshLocation: () => void;
  onProceed: () => void;
}

export const TriageHUD: React.FC<TriageHUDProps> = ({
  incident,
  onUpdateSafety,
  onUpdateType,
  onRefreshLocation,
  onProceed,
}) => {
  const [copiedCoords, setCopiedCoords] = useState(false);
  const checklist = incident.safetyChecklist;

  const toggleItem = (key: keyof SafetyChecklist) => {
    onUpdateSafety({
      ...checklist,
      [key]: !checklist[key],
    });
  };

  const allSafetyItemsDone =
    checklist.hazardLightsOn &&
    checklist.engineOff &&
    checklist.behindGuardrail;

  const handleCopyLocation = () => {
    const text = incident.location.latitude && incident.location.longitude
      ? `Latitude: ${incident.location.latitude}, Longitude: ${incident.location.longitude} (${incident.location.addressApprox})`
      : incident.location.addressApprox;

    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Emergency Call & Direct Dispatch Ribbon */}
      <section className="bg-obsidian-800/90 rounded-xl border border-obsidian-700 p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emergency-500/20 text-emergency-500 flex items-center justify-center shrink-0 border border-emergency-500/40">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Emergency Dispatch Quick Dial
              </div>
              <div className="text-sm font-semibold text-slate-100">
                Are there injuries or active road blockages?
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:911"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emergency-500 hover:bg-emergency-600 text-white font-bold text-sm transition-all shadow-md active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 911</span>
            </a>
            <a
              href="tel:18002224357"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-obsidian-700 hover:bg-obsidian-600 text-slate-200 border border-obsidian-600 font-medium text-sm transition-colors active:scale-95"
            >
              <span>Call Roadside</span>
            </a>
          </div>
        </div>

        {/* Live GPS Coordinates Banner (To read out to 911 dispatcher) */}
        <div className="mt-3 pt-3 border-t border-obsidian-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs bg-obsidian-950/60 px-3 py-2 rounded-lg border border-obsidian-700/40">
          <div className="flex items-center gap-2 text-slate-300 overflow-hidden">
            <MapPin className="w-4 h-4 text-hazard-500 shrink-0" />
            <span className="font-mono text-slate-400 shrink-0">Your Coordinates:</span>
            <span className="font-mono font-semibold text-slate-200 truncate">
              {incident.location.latitude && incident.location.longitude
                ? `${incident.location.latitude}, ${incident.location.longitude}`
                : incident.location.addressApprox}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyLocation}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-obsidian-800 hover:bg-obsidian-700 text-slate-300 border border-obsidian-600 text-[11px] font-mono transition-colors"
            >
              {copiedCoords ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Coordinates</span>
                </>
              )}
            </button>
            <button
              onClick={onRefreshLocation}
              title="Refresh GPS"
              className="p-1 rounded bg-obsidian-800 hover:bg-obsidian-700 text-slate-400 hover:text-slate-200 border border-obsidian-600 transition-colors"
            >
              <Navigation className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Incident Type Switcher */}
      <section className="bg-obsidian-800/60 rounded-xl border border-obsidian-700 p-4">
        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
          Incident Classification
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onUpdateType('crash')}
            className={`flex items-center justify-center gap-2.5 p-3 rounded-lg border text-sm font-semibold transition-all ${
              incident.type === 'crash'
                ? 'bg-hazard-500/15 border-hazard-500 text-hazard-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                : 'bg-obsidian-900/60 border-obsidian-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Collision / Crash</span>
          </button>
          <button
            onClick={() => onUpdateType('breakdown')}
            className={`flex items-center justify-center gap-2.5 p-3 rounded-lg border text-sm font-semibold transition-all ${
              incident.type === 'breakdown'
                ? 'bg-hazard-500/15 border-hazard-500 text-hazard-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                : 'bg-obsidian-900/60 border-obsidian-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Roadside Breakdown / Flat</span>
          </button>
        </div>
      </section>

      {/* Life-Critical Alert: Secondary Collision Warning */}
      <section className="bg-emergency-500/10 border-2 border-emergency-500/50 rounded-xl p-4 sm:p-5 relative overflow-hidden">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-emergency-500/20 text-emergency-500 flex items-center justify-center shrink-0 border border-emergency-500/40">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              Life-Critical Rule: Prevent Secondary Collisions
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-emergency-400 font-semibold">NEVER</strong> stand between
              vehicles or behind your car's trunk on a highway or active road. High-speed drivers
              distracted by the scene cause fatal secondary chain collisions. Step safely{' '}
              <strong className="text-white underline">behind the steel guardrail</strong> or
              concrete barrier immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Life-Safety Checklist */}
      <section className="bg-obsidian-800 rounded-xl border border-obsidian-700 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-hazard-500" />
            <span>Immediate Life-Safety Checklist</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {Object.values(checklist).filter(Boolean).length} of 5 completed
          </span>
        </div>

        <div className="space-y-2.5">
          {/* Item 1 */}
          <div
            onClick={() => toggleItem('hazardLightsOn')}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all ${
              checklist.hazardLightsOn
                ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-200'
                : 'bg-obsidian-900/80 border-obsidian-700 text-slate-300 hover:border-obsidian-600'
            }`}
          >
            <button className="mt-0.5 text-hazard-400 shrink-0">
              {checklist.hazardLightsOn ? (
                <CheckSquare className="w-5 h-5 text-emerald-400" />
              ) : (
                <Square className="w-5 h-5 text-slate-500" />
              )}
            </button>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>1. Hazard Flashers Activated</span>
                {checklist.hazardLightsOn && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Done
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Turn on emergency 4-way flashers to warn approaching vehicles in both lanes.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div
            onClick={() => toggleItem('engineOff')}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all ${
              checklist.engineOff
                ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-200'
                : 'bg-obsidian-900/80 border-obsidian-700 text-slate-300 hover:border-obsidian-600'
            }`}
          >
            <button className="mt-0.5 text-hazard-400 shrink-0">
              {checklist.engineOff ? (
                <CheckSquare className="w-5 h-5 text-emerald-400" />
              ) : (
                <Square className="w-5 h-5 text-slate-500" />
              )}
            </button>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>2. Engine Switched Off & Parking Brake Set</span>
                {checklist.engineOff && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Done
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cuts ignition sparks, prevents fuel vaporization fire risk, and locks wheels in place.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div
            onClick={() => toggleItem('behindGuardrail')}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all ${
              checklist.behindGuardrail
                ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-200'
                : 'bg-obsidian-900/80 border-obsidian-700 text-slate-300 hover:border-obsidian-600'
            }`}
          >
            <button className="mt-0.5 text-hazard-400 shrink-0">
              {checklist.behindGuardrail ? (
                <CheckSquare className="w-5 h-5 text-emerald-400" />
              ) : (
                <Square className="w-5 h-5 text-slate-500" />
              )}
            </button>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>3. Positioned Behind Guardrail or Barrier</span>
                {checklist.behindGuardrail && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Crucial Safe
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                All vehicle occupants have exited safely away from traffic side and are standing behind the barrier.
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div
            onClick={() => toggleItem('warningTriangleSet')}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all ${
              checklist.warningTriangleSet
                ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-200'
                : 'bg-obsidian-900/80 border-obsidian-700 text-slate-300 hover:border-obsidian-600'
            }`}
          >
            <button className="mt-0.5 text-hazard-400 shrink-0">
              {checklist.warningTriangleSet ? (
                <CheckSquare className="w-5 h-5 text-emerald-400" />
              ) : (
                <Square className="w-5 h-5 text-slate-500" />
              )}
            </button>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>4. Warning Triangle / Flares Deployed (If Available)</span>
                {checklist.warningTriangleSet && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Done
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Place 100–200 feet behind vehicle only if traffic conditions allow safe walking.
              </p>
            </div>
          </div>

          {/* Item 5 */}
          <div
            onClick={() => toggleItem('noInjuriesImmediate')}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all ${
              checklist.noInjuriesImmediate
                ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-200'
                : 'bg-obsidian-900/80 border-obsidian-700 text-slate-300 hover:border-obsidian-600'
            }`}
          >
            <button className="mt-0.5 text-hazard-400 shrink-0">
              {checklist.noInjuriesImmediate ? (
                <CheckSquare className="w-5 h-5 text-emerald-400" />
              ) : (
                <Square className="w-5 h-5 text-slate-500" />
              )}
            </button>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>5. Medical / Concussion Check Conducted</span>
                {checklist.noInjuriesImmediate && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Assessed
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Verified no dizziness, neck pain, bleeding, or head impact across all vehicle occupants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Proceed Action */}
      <div className="pt-2">
        <button
          onClick={onProceed}
          className={`w-full py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-lg min-h-[52px] ${
            allSafetyItemsDone
              ? 'bg-hazard-500 hover:bg-hazard-600 text-obsidian-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-[0.99]'
              : 'bg-obsidian-800 hover:bg-obsidian-700 text-slate-200 border border-hazard-500/40'
          }`}
        >
          <span>
            {allSafetyItemsDone
              ? 'Physical Safety Secured — Proceed to Evidence Capture'
              : 'I Am in a Safe Position — Continue to Evidence Vault'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
        {!allSafetyItemsDone && (
          <p className="text-center text-xs text-slate-400 mt-2 font-mono">
            Tip: Verify items 1, 2, and 3 to ensure maximum safety before stepping near traffic.
          </p>
        )}
      </div>
    </div>
  );
};
