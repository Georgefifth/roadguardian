import React, { useState } from 'react';
import {
  Truck,
  FileText,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  CheckSquare,
  Square,
  Scale,
  Ban,
} from 'lucide-react';
import { CrashIncident, TowTruckVerification, StatementDetails } from '../types';

interface TowShieldProps {
  incident: CrashIncident;
  onUpdateTowShield: (tow: TowTruckVerification) => void;
  onUpdateStatement: (statement: StatementDetails) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const TowShield: React.FC<TowShieldProps> = ({
  incident,
  onUpdateTowShield,
  onUpdateStatement,
  onProceed,
  onBack,
}) => {
  const [copiedStatement, setCopiedStatement] = useState(false);
  const tow = incident.towShield;
  const stmt = incident.statement;

  const handleTowChange = (key: keyof TowTruckVerification, val: any) => {
    onUpdateTowShield({
      ...tow,
      [key]: val,
    });
  };

  const handleStmtChange = (key: keyof StatementDetails, val: any) => {
    onUpdateStatement({
      ...stmt,
      [key]: val,
    });
  };

  // Generate factual, neutral statement
  const generatedNeutralStatement = `On ${new Date(incident.createdAt).toLocaleDateString()} at approximately ${new Date(
    incident.createdAt
  ).toLocaleTimeString()}, my vehicle was operating ${
    stmt.driverDirection || 'in the designated lane'
  } at approximately ${stmt.approximateSpeed || 'traffic speed'}. Weather condition was ${
    stmt.weatherCondition
  }. Traffic flow/signal condition was: ${stmt.trafficLightStatus}. ${
    stmt.factualNotes
      ? `Observed events: ${stmt.factualNotes}. `
      : ''
  }All drivers exchanged documentation without physical conflict. No verbal admissions of legal fault were made at the scene.`;

  const handleCopyStatement = () => {
    navigator.clipboard.writeText(generatedNeutralStatement);
    setCopiedStatement(true);
    setTimeout(() => setCopiedStatement(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: Predatory Tow Truck Defense Shield */}
      <section className="bg-obsidian-800 rounded-xl border border-obsidian-700 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-hazard-500/15 text-hazard-500 flex items-center justify-center shrink-0 border border-hazard-500/30">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Bandit Tow Truck Defense Shield</span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-hazard-500/20 text-hazard-400 font-semibold uppercase">
                Anti-Extortion
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Predatory tow trucks monitor emergency scanners and pull up unsolicited within minutes.
              They take advantage of drivers in shock, pressuring them to sign blank authorization forms,
              and later charge $1,500+ to retrieve the vehicle from impound lots.
            </p>
          </div>
        </div>

        {/* Unsolicited Warning Banner */}
        <div className="mt-4 p-3 rounded-lg bg-emergency-500/10 border border-emergency-500/40 text-xs text-slate-200 flex items-start gap-2.5">
          <Ban className="w-4 h-4 text-emergency-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-emergency-300 font-semibold">
              Crucial Consumer Protection Rule:
            </strong>{' '}
            You have the absolute legal right to choose your tow provider. If you or the police did not call this specific company, you are NOT obligated to let them hook up your car.
          </div>
        </div>

        {/* Verification Form */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-mono mb-1">
              Who dispatched this tow truck?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTowChange('isDispatchedByMeOrPolice', true)}
                className={`py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                  tow.isDispatchedByMeOrPolice
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                    : 'bg-obsidian-900 border-obsidian-700 text-slate-400'
                }`}
              >
                ✓ Called by Me or Police
              </button>
              <button
                type="button"
                onClick={() => handleTowChange('isDispatchedByMeOrPolice', false)}
                className={`py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                  !tow.isDispatchedByMeOrPolice
                    ? 'bg-emergency-500/20 border-emergency-500/60 text-emergency-300'
                    : 'bg-obsidian-900 border-obsidian-700 text-slate-400'
                }`}
              >
                ⚠️ Arrived Unsolicited
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">
              Towing Company Name
            </label>
            <input
              type="text"
              placeholder="e.g. City Fleet Towing"
              value={tow.companyName}
              onChange={(e) => handleTowChange('companyName', e.target.value)}
              className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-hazard-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">
              Driver Name or Badge / Permit #
            </label>
            <input
              type="text"
              placeholder="e.g. Officer Miller / Badge #402"
              value={tow.driverNameOrBadge}
              onChange={(e) => handleTowChange('driverNameOrBadge', e.target.value)}
              className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-hazard-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">
              Destination Location (Shop / Lot)
            </label>
            <input
              type="text"
              placeholder="e.g. Insurer Approved Body Shop"
              value={tow.destinationLocation}
              onChange={(e) => handleTowChange('destinationLocation', e.target.value)}
              className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-hazard-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">
              Upfront Quoted Hookup Rate ($)
            </label>
            <input
              type="text"
              placeholder="e.g. $125 or Covered by AAA"
              value={tow.quotedHookupFee}
              onChange={(e) => handleTowChange('quotedHookupFee', e.target.value)}
              className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-hazard-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">
              Quoted Daily Storage Fee ($/day)
            </label>
            <input
              type="text"
              placeholder="e.g. $40/day"
              value={tow.quotedStoragePerDay}
              onChange={(e) => handleTowChange('quotedStoragePerDay', e.target.value)}
              className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-hazard-500 font-mono"
            />
          </div>
        </div>

        {/* Refused Blank Form Shield Toggle */}
        <div
          onClick={() => handleTowChange('refusedBlankForm', !tow.refusedBlankForm)}
          className={`mt-4 p-3 rounded-xl border cursor-pointer select-none flex items-center gap-3 transition-all ${
            tow.refusedBlankForm
              ? 'bg-emerald-500/15 border-emerald-500/60 text-slate-100 shadow-sm'
              : 'bg-obsidian-900/80 border-obsidian-700 text-slate-300'
          }`}
        >
          <div className="shrink-0 text-emerald-400">
            {tow.refusedBlankForm ? (
              <CheckSquare className="w-5 h-5 text-emerald-400" />
            ) : (
              <Square className="w-5 h-5 text-slate-500" />
            )}
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-100 block sm:inline">
              Defensive Shield Verified:{' '}
            </span>
            <span className="text-slate-300">
              I refused to sign any blank forms, blank screens, or unitemized authorization waivers.
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: Statement Shield (Liability Protection) */}
      <section className="bg-obsidian-800 rounded-xl border border-obsidian-700 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-hazard-500/15 text-hazard-500 flex items-center justify-center shrink-0 border border-hazard-500/30">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Neutral Statement Shield</span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold uppercase">
                Liability Shield
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              In the adrenaline rush after a crash, many drivers instinctively say{' '}
              <em>"I'm so sorry, I didn't see you!"</em> Out of politeness. Insurance companies and lawyers
              frequently use scene apologies as an admission of full liability. Stick strictly to facts.
            </p>
          </div>
        </div>

        {/* Statement Inputs */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-mono mb-1">
              Traveling Direction & Lane
            </label>
            <input
              type="text"
              placeholder="e.g. Northbound Lane 1"
              value={stmt.driverDirection}
              onChange={(e) => handleStmtChange('driverDirection', e.target.value)}
              className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-hazard-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">
              Approximate Speed
            </label>
            <input
              type="text"
              placeholder="e.g. 35 mph / Stopped at light"
              value={stmt.approximateSpeed}
              onChange={(e) => handleStmtChange('approximateSpeed', e.target.value)}
              className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-hazard-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">
              Weather Condition
            </label>
            <select
              value={stmt.weatherCondition}
              onChange={(e) => handleStmtChange('weatherCondition', e.target.value)}
              className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-hazard-500"
            >
              <option value="clear">Clear & Dry</option>
              <option value="rain">Rain / Wet Road</option>
              <option value="fog">Fog / Low Visibility</option>
              <option value="snow">Snow / Sleet</option>
              <option value="ice">Ice / Frost</option>
              <option value="night">Night / Unlit Highway</option>
            </select>
          </div>
        </div>

        {/* Live Generated Factual Statement Box */}
        <div className="mt-4 bg-obsidian-950/80 border border-obsidian-700/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-hazard-500" />
              <span>Generated Factual Incident Statement</span>
            </span>
            <button
              onClick={handleCopyStatement}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-obsidian-800 hover:bg-obsidian-700 text-slate-200 border border-obsidian-600 text-xs font-mono transition-colors"
            >
              {copiedStatement ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Statement</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-300 font-mono bg-obsidian-900/80 p-3 rounded-lg border border-obsidian-800 leading-relaxed select-all">
            {generatedNeutralStatement}
          </p>
        </div>
      </section>

      {/* Bottom Navigation Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-slate-300 border border-obsidian-600 font-semibold text-sm flex items-center justify-center gap-2 transition-colors min-h-[52px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Evidence Vault</span>
        </button>

        <button
          onClick={onProceed}
          className="w-full flex-1 py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-3 bg-hazard-500 hover:bg-hazard-600 text-obsidian-950 transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] min-h-[52px] active:scale-[0.99]"
        >
          <span>Compile & Export Final Incident Dossier</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
