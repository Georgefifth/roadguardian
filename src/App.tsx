import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { StepProgressBar } from './components/StepProgressBar';
import { TriageHUD } from './components/TriageHUD';
import { EvidenceVault } from './components/EvidenceVault';
import { TowShield } from './components/TowShield';
import { DossierExport } from './components/DossierExport';
import { IncidentVaultModal } from './components/IncidentVaultModal';
import { PracticeDrillBanner } from './components/PracticeDrillBanner';
import { CrashIncident, TriageStep, SafetyChecklist, IncidentType, PhotoEvidenceItem, OtherPartyInfo, TowTruckVerification, StatementDetails } from './types';
import {
  createNewIncident,
  saveIncidentToStorage,
  getAllIncidentsFromStorage,
  getActiveIncidentId,
  setActiveIncidentId,
  deleteIncidentFromStorage,
  createPracticeDrillIncident,
} from './utils/storage';
import { getDeviceGeolocation } from './utils/geolocation';

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<TriageStep>(1);
  const [incidents, setIncidents] = useState<CrashIncident[]>([]);
  const [activeIncident, setActiveIncident] = useState<CrashIncident>(createNewIncident());
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial load
  useEffect(() => {
    const stored = getAllIncidentsFromStorage();
    setIncidents(stored);

    const activeId = getActiveIncidentId();
    if (activeId && stored.length > 0) {
      const found = stored.find((i) => i.id === activeId);
      if (found) {
        setActiveIncident(found);
        return;
      }
    }

    // Default start with fresh incident and try GPS
    const fresh = createNewIncident();
    setActiveIncident(fresh);
    saveIncidentToStorage(fresh);
    refreshGPS(fresh.id);
  }, []);

  const refreshGPS = (incidentId?: string) => {
    getDeviceGeolocation().then((loc) => {
      setActiveIncident((prev) => {
        if (incidentId && prev.id !== incidentId) return prev;
        const updated = { ...prev, location: loc };
        saveIncidentToStorage(updated);
        return updated;
      });
    });
  };

  const updateIncident = (updated: CrashIncident) => {
    setActiveIncident(updated);
    saveIncidentToStorage(updated);
    setIncidents(getAllIncidentsFromStorage());
  };

  // Step 1: Safety Updates
  const handleUpdateSafety = (safetyChecklist: SafetyChecklist) => {
    updateIncident({
      ...activeIncident,
      safetyChecklist,
    });
  };

  const handleUpdateType = (type: IncidentType) => {
    updateIncident({
      ...activeIncident,
      type,
    });
    showToast(`Classification updated: ${type === 'crash' ? 'Collision' : 'Roadside Breakdown'}`);
  };

  // Step 2: Evidence Updates
  const handleUpdatePhotos = (photos: PhotoEvidenceItem[]) => {
    updateIncident({
      ...activeIncident,
      photos,
    });
  };

  const handleUpdateOtherParty = (otherParty: OtherPartyInfo) => {
    updateIncident({
      ...activeIncident,
      otherParty,
    });
  };

  const handleUpdateStatementNotes = (notes: string, audioRecorded?: boolean) => {
    updateIncident({
      ...activeIncident,
      statement: {
        ...activeIncident.statement,
        factualNotes: notes,
        audioMemoRecorded: audioRecorded ?? activeIncident.statement.audioMemoRecorded,
      },
    });
    if (audioRecorded) {
      showToast('Audio memo captured & cached in vault');
    }
  };

  // Step 3: Tow & Statement Shield
  const handleUpdateTowShield = (towShield: TowTruckVerification) => {
    updateIncident({
      ...activeIncident,
      towShield,
    });
  };

  const handleUpdateStatement = (statement: StatementDetails) => {
    updateIncident({
      ...activeIncident,
      statement,
    });
  };

  // Switch Incidents
  const handleSelectIncident = (id: string) => {
    const found = incidents.find((i) => i.id === id);
    if (found) {
      setActiveIncident(found);
      setActiveIncidentId(id);
      setCurrentStep(1);
      showToast(`Loaded incident dossier: ${id}`);
    }
  };

  const handleDeleteIncident = (id: string) => {
    deleteIncidentFromStorage(id);
    const remaining = getAllIncidentsFromStorage();
    setIncidents(remaining);
    if (activeIncident.id === id) {
      if (remaining.length > 0) {
        setActiveIncident(remaining[0]);
        setActiveIncidentId(remaining[0].id);
      } else {
        const fresh = createNewIncident();
        setActiveIncident(fresh);
        saveIncidentToStorage(fresh);
      }
    }
    showToast('Incident record deleted from local vault');
  };

  const handleNewIncident = () => {
    const fresh = createNewIncident();
    setActiveIncident(fresh);
    saveIncidentToStorage(fresh);
    setIncidents(getAllIncidentsFromStorage());
    setCurrentStep(1);
    refreshGPS(fresh.id);
    showToast('New emergency intake session initialized');
  };

  const handleLoadPracticeDrill = () => {
    const drill = createPracticeDrillIncident();
    updateIncident(drill);
    setCurrentStep(1);
    showToast('Highway crash drill scenario loaded for testing');
  };

  const safetySecured =
    activeIncident.safetyChecklist.hazardLightsOn &&
    activeIncident.safetyChecklist.engineOff &&
    activeIncident.safetyChecklist.behindGuardrail;

  const photosCount = activeIncident.photos.filter((p) => p.dataUrl).length;

  const towVerified = activeIncident.towShield.refusedBlankForm;

  return (
    <div className="min-h-screen bg-obsidian-900 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:bottom-4 z-50 bg-obsidian-950 border border-hazard-500/60 text-slate-200 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-mono flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-hazard-500 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Terminal Header */}
      <Header
        activeIncident={activeIncident}
        onOpenVault={() => setIsVaultOpen(true)}
        onLoadPracticeDrill={handleLoadPracticeDrill}
        onNewIncident={handleNewIncident}
      />

      {/* 4-Phase HUD Step Progress */}
      <StepProgressBar
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
        safetySecured={safetySecured}
        photosCount={photosCount}
        towVerified={towVerified}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Practice Drill Banner on Step 1 if not already drill */}
        {currentStep === 1 && !activeIncident.id.startsWith('DRILL-') && (
          <PracticeDrillBanner onLoadPracticeDrill={handleLoadPracticeDrill} />
        )}

        {/* Phase 1: Life Safety Triage */}
        {currentStep === 1 && (
          <TriageHUD
            incident={activeIncident}
            onUpdateSafety={handleUpdateSafety}
            onUpdateType={handleUpdateType}
            onRefreshLocation={() => refreshGPS(activeIncident.id)}
            onProceed={() => setCurrentStep(2)}
          />
        )}

        {/* Phase 2: Evidence Vault */}
        {currentStep === 2 && (
          <EvidenceVault
            incident={activeIncident}
            onUpdatePhotos={handleUpdatePhotos}
            onUpdateOtherParty={handleUpdateOtherParty}
            onUpdateStatementNotes={handleUpdateStatementNotes}
            onProceed={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {/* Phase 3: Tow Shield & Statement Shield */}
        {currentStep === 3 && (
          <TowShield
            incident={activeIncident}
            onUpdateTowShield={handleUpdateTowShield}
            onUpdateStatement={handleUpdateStatement}
            onProceed={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {/* Phase 4: Incident Dossier Export */}
        {currentStep === 4 && (
          <DossierExport
            incident={activeIncident}
            onBack={() => setCurrentStep(3)}
            onNewIncident={handleNewIncident}
          />
        )}
      </main>

      {/* Vault Modal */}
      <IncidentVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        incidents={incidents}
        activeId={activeIncident.id}
        onSelectIncident={handleSelectIncident}
        onDeleteIncident={handleDeleteIncident}
        onNewIncident={handleNewIncident}
        onLoadPracticeDrill={handleLoadPracticeDrill}
      />

      {/* Minimal Footer */}
      <footer className="no-print border-t border-obsidian-800/80 py-4 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>RoadGuardian • SafeSpace Hacks 2026</span>
          <span>Zero-Cloud • Client-Side Local Cryptographic Vault</span>
        </div>
      </footer>
    </div>
  );
};
