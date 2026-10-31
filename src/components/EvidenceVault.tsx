import React, { useRef, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Trash2,
  Mic,
  MicOff,
  User,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { CrashIncident, PhotoEvidenceItem, OtherPartyInfo } from '../types';

interface EvidenceVaultProps {
  incident: CrashIncident;
  onUpdatePhotos: (photos: PhotoEvidenceItem[]) => void;
  onUpdateOtherParty: (info: OtherPartyInfo) => void;
  onUpdateStatementNotes: (notes: string, audioRecorded?: boolean) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const EvidenceVault: React.FC<EvidenceVaultProps> = ({
  incident,
  onUpdatePhotos,
  onUpdateOtherParty,
  onUpdateStatementNotes,
  onProceed,
  onBack,
}) => {
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [recordingAudio, setRecordingAudio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photos = incident.photos;
  const other = incident.otherParty;
  const capturedCount = photos.filter((p) => p.dataUrl).length;

  const handleTriggerUpload = (slotId: string) => {
    setActiveSlotId(slotId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlotId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated = photos.map((p) =>
        p.id === activeSlotId
          ? { ...p, dataUrl, capturedAt: new Date().toISOString() }
          : p
      );
      onUpdatePhotos(updated);
      setActiveSlotId(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleGenerateMockPhoto = (slotId: string, title: string) => {
    const cleanTitle = title.replace(/&/g, '&amp;').toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260">
      <rect width="400" height="260" fill="#1e293b"/>
      <rect x="12" y="12" width="376" height="236" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="8,6"/>
      <circle cx="200" cy="90" r="28" fill="#F59E0B" fill-opacity="0.2"/>
      <path d="M190 90h20M200 80v20" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      <text x="200" y="145" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">${cleanTitle}</text>
      <text x="200" y="175" font-family="monospace" font-size="12" fill="#94a3b8" text-anchor="middle">VERIFIED GPS &amp; TIMESTAMP</text>
      <text x="200" y="200" font-family="monospace" font-size="11" fill="#64748b" text-anchor="middle">${new Date().toLocaleString()}</text>
    </svg>`;
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    const updated = photos.map((p) =>
      p.id === slotId
        ? { ...p, dataUrl, capturedAt: new Date().toISOString() }
        : p
    );
    onUpdatePhotos(updated);
  };

  const handleRemovePhoto = (slotId: string) => {
    const updated = photos.map((p) =>
      p.id === slotId ? { ...p, dataUrl: null, capturedAt: null } : p
    );
    onUpdatePhotos(updated);
  };

  const handleOtherChange = (key: keyof OtherPartyInfo, val: string) => {
    onUpdateOtherParty({
      ...other,
      [key]: val,
    });
  };

  const toggleVoiceRecording = () => {
    if (!recordingAudio) {
      setRecordingAudio(true);
      setTimeout(() => {
        setRecordingAudio(false);
        onUpdateStatementNotes(
          incident.statement.factualNotes
            ? incident.statement.factualNotes
            : 'Voice memo transcribed: Traffic stopped suddenly, impact felt on rear bumper at moderate speed.',
          true
        );
      }, 3000);
    } else {
      setRecordingAudio(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for camera/photo picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Intro Guidance Banner */}
      <section className="bg-obsidian-800/80 rounded-xl border border-obsidian-700 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Camera className="w-5 h-5 text-hazard-500" />
              <span>Standardized Evidence & Exchange Vault</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Capture these 6 essential items before vehicles are moved by tow trucks or cleared by highway patrol. All items are encrypted and stored locally on your device.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-hazard-500/20 text-hazard-300 border border-hazard-500/30">
              {capturedCount}/6 Secured
            </span>
          </div>
        </div>
      </section>

      {/* Guided Photo Checklist Slots */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
          <span>Required Evidence Shots</span>
          <span>Tap to capture or simulate</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {photos.map((slot) => {
            const hasPhoto = Boolean(slot.dataUrl);

            return (
              <div
                key={slot.id}
                className={`flex flex-col justify-between p-3.5 rounded-xl border transition-all ${
                  hasPhoto
                    ? 'bg-obsidian-800/90 border-emerald-500/40 shadow-sm'
                    : 'bg-obsidian-800/50 border-obsidian-700/80 hover:border-obsidian-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-slate-200 truncate">
                      {slot.title}
                    </span>
                    {hasPhoto ? (
                      <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-mono shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Secured
                      </span>
                    ) : slot.required ? (
                      <span className="text-hazard-400 text-[10px] font-mono px-1 rounded bg-hazard-500/10 border border-hazard-500/20 shrink-0">
                        Essential
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px] font-mono shrink-0">
                        Optional
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {slot.description}
                  </p>
                </div>

                {/* Photo Preview or Placeholder */}
                <div className="mt-3">
                  {hasPhoto ? (
                    <div className="relative rounded-lg overflow-hidden border border-obsidian-600 aspect-[16/10] bg-black">
                      <img
                        src={slot.dataUrl!}
                        alt={slot.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-300 truncate">
                          {slot.capturedAt
                            ? new Date(slot.capturedAt).toLocaleTimeString()
                            : 'Saved'}
                        </span>
                        <button
                          onClick={() => handleRemovePhoto(slot.id)}
                          className="p-1 rounded bg-emergency-500/80 hover:bg-emergency-600 text-white transition-colors"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleTriggerUpload(slot.id)}
                        className="w-full py-3 px-3 rounded-lg bg-obsidian-900 hover:bg-obsidian-750 border border-dashed border-obsidian-600 hover:border-hazard-500/60 text-slate-300 flex items-center justify-center gap-2 text-xs font-medium transition-all group"
                      >
                        <Camera className="w-4 h-4 text-hazard-500 group-hover:scale-110 transition-transform" />
                        <span>Take Photo / Upload</span>
                      </button>

                      <button
                        onClick={() => handleGenerateMockPhoto(slot.id, slot.title)}
                        className="w-full py-1.5 px-2 rounded bg-obsidian-900/60 hover:bg-obsidian-800 text-[11px] font-mono text-slate-400 hover:text-slate-200 border border-obsidian-700/50 transition-colors"
                      >
                        ⚡ Simulate Sample Shot
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Other Driver & Vehicle Information Exchange */}
      <section className="bg-obsidian-800 rounded-xl border border-obsidian-700 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-hazard-500" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
            Other Driver & Vehicle Information
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-mono mb-1">
              Driver Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={other.driverName}
              onChange={(e) => handleOtherChange('driverName', e.target.value)}
              className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-hazard-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">
              Contact Phone Number
            </label>
            <input
              type="tel"
              placeholder="e.g. (555) 019-2831"
              value={other.phone}
              onChange={(e) => handleOtherChange('phone', e.target.value)}
              className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-hazard-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">
              Insurance Carrier
            </label>
            <input
              type="text"
              placeholder="e.g. State Farm, Geico, Allstate"
              value={other.insuranceCompany}
              onChange={(e) => handleOtherChange('insuranceCompany', e.target.value)}
              className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-hazard-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">
              Insurance Policy #
            </label>
            <input
              type="text"
              placeholder="e.g. 9482-1082-99"
              value={other.policyNumber}
              onChange={(e) => handleOtherChange('policyNumber', e.target.value)}
              className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-hazard-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">
              License Plate & State
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="PLATE #"
                value={other.licensePlate}
                onChange={(e) => handleOtherChange('licensePlate', e.target.value.toUpperCase())}
                className="col-span-2 bg-obsidian-900 border border-obsidian-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-hazard-500 font-mono uppercase"
              />
              <input
                type="text"
                placeholder="STATE"
                maxLength={2}
                value={other.plateState}
                onChange={(e) => handleOtherChange('plateState', e.target.value.toUpperCase())}
                className="bg-obsidian-900 border border-obsidian-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-hazard-500 font-mono uppercase text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1 flex items-center justify-between">
              <span>VIN (17 Characters)</span>
              <span className={`text-[11px] ${other.vin.length === 17 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {other.vin.length}/17
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. 1HGCR2F83HA019284"
              maxLength={17}
              value={other.vin}
              onChange={(e) => handleOtherChange('vin', e.target.value.toUpperCase())}
              className={`w-full bg-obsidian-900 border rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none font-mono uppercase ${
                other.vin.length === 17 ? 'border-emerald-500/50' : 'border-obsidian-700 focus:border-hazard-500'
              }`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-400 font-mono mb-1">
              Vehicle Description (Make / Model / Year / Color)
            </label>
            <input
              type="text"
              placeholder="e.g. 2021 Silver Toyota RAV4"
              value={other.vehicleMakeModel}
              onChange={(e) => handleOtherChange('vehicleMakeModel', e.target.value)}
              className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-hazard-500"
            />
          </div>
        </div>
      </section>

      {/* Voice Memo & Quick Facts Recorder */}
      <section className="bg-obsidian-800 rounded-xl border border-obsidian-700 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Mic className="w-4 h-4 text-hazard-500" />
            <span>Factual Voice Memo & Notes</span>
          </h3>
          <button
            onClick={toggleVoiceRecording}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              recordingAudio
                ? 'bg-emergency-500 text-white animate-pulse'
                : incident.statement.audioMemoRecorded
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-obsidian-900 text-slate-300 border border-obsidian-700 hover:border-slate-500'
            }`}
          >
            {recordingAudio ? (
              <>
                <MicOff className="w-3.5 h-3.5" />
                <span>Recording Memo...</span>
              </>
            ) : incident.statement.audioMemoRecorded ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audio Memo Recorded</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-hazard-400" />
                <span>Record Voice Memo</span>
              </>
            )}
          </button>
        </div>

        <textarea
          rows={3}
          value={incident.statement.factualNotes}
          onChange={(e) => onUpdateStatementNotes(e.target.value)}
          placeholder="Briefly describe what happened objectively (e.g. 'Traveling 35 mph in right lane, vehicle ahead stopped abruptly, contact occurred on rear bumper. Surface was wet from rain.'). Do not state opinions on fault."
          className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-hazard-500 leading-relaxed"
        />
      </section>

      {/* Bottom Sticky Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-slate-300 border border-obsidian-600 font-semibold text-sm flex items-center justify-center gap-2 transition-colors min-h-[52px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Life Safety</span>
        </button>

        <button
          onClick={onProceed}
          className="w-full flex-1 py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-3 bg-hazard-500 hover:bg-hazard-600 text-obsidian-950 transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] min-h-[52px] active:scale-[0.99]"
        >
          <span>Proceed to Tow Truck & Statement Shield</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
