import { CrashIncident, PhotoEvidenceItem } from '../types';

const STORAGE_KEY = 'roadguardian_incidents_v1';
const CURRENT_ACTIVE_KEY = 'roadguardian_active_id';

export const DEFAULT_PHOTO_ITEMS: Omit<PhotoEvidenceItem, 'dataUrl' | 'capturedAt'>[] = [
  {
    id: 'photo_plate',
    category: 'plate',
    title: "Other Vehicle's License Plate",
    description: "Close-up of rear/front plate including state name and registration tags",
    required: true,
  },
  {
    id: 'photo_vin',
    category: 'vin',
    title: "Windshield VIN Barcode",
    description: "Located on driver's side lower dashboard visible through windshield",
    required: true,
  },
  {
    id: 'photo_driver_license',
    category: 'driver_license',
    title: "Other Driver's License Card",
    description: "Full front face of license showing name, DOB, and license number",
    required: true,
  },
  {
    id: 'photo_insurance_card',
    category: 'insurance_card',
    title: "Other Driver's Insurance Card",
    description: "Policy card showing insurer name, effective dates, and policy number",
    required: true,
  },
  {
    id: 'photo_damage_impact',
    category: 'damage_front',
    title: "Point of Impact & Vehicle Damage",
    description: "Wide angle showing both vehicles' relative positions and direct damage",
    required: true,
  },
  {
    id: 'photo_scene_context',
    category: 'scene_context',
    title: "Scene Context (Signs, Signals, Skids)",
    description: "Intersection name, street lights, skid marks, or lane markers",
    required: false,
  },
];

export function createNewIncident(type: 'crash' | 'breakdown' = 'crash'): CrashIncident {
  const now = new Date();
  const id = `RG-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    id,
    type,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    location: {
      latitude: null,
      longitude: null,
      accuracy: null,
      addressApprox: 'Locating via GPS...',
      timestamp: now.toISOString(),
    },
    safetyChecklist: {
      hazardLightsOn: false,
      engineOff: false,
      behindGuardrail: false,
      warningTriangleSet: false,
      noInjuriesImmediate: false,
    },
    photos: DEFAULT_PHOTO_ITEMS.map((item) => ({
      ...item,
      dataUrl: null,
      capturedAt: null,
    })),
    otherParty: {
      driverName: '',
      phone: '',
      licenseNumber: '',
      licenseState: 'CA',
      insuranceCompany: '',
      policyNumber: '',
      vehicleMakeModel: '',
      vehicleYearColor: '',
      licensePlate: '',
      plateState: 'CA',
      vin: '',
    },
    towShield: {
      isDispatchedByMeOrPolice: true,
      companyName: '',
      driverNameOrBadge: '',
      towPermitNumber: '',
      quotedHookupFee: '',
      quotedStoragePerDay: '',
      refusedBlankForm: true,
      destinationLocation: '',
      notes: '',
    },
    statement: {
      driverDirection: '',
      approximateSpeed: '',
      weatherCondition: 'clear',
      trafficLightStatus: 'Green / Clear',
      factualNotes: '',
      audioMemoRecorded: false,
      audioDurationSeconds: 0,
    },
    isCompleted: false,
  };
}

// Compute SHA-256 checksum of incident for evidence integrity
export async function calculateIntegrityHash(incident: CrashIncident): Promise<string> {
  const content = JSON.stringify({
    id: incident.id,
    type: incident.type,
    createdAt: incident.createdAt,
    location: incident.location,
    safetyChecklist: incident.safetyChecklist,
    otherParty: incident.otherParty,
    towShield: incident.towShield,
    statement: incident.statement,
    photoCounts: incident.photos.filter((p) => p.dataUrl).length,
  });

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback simple checksum if SubtleCrypto unavailable
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = (hash << 5) - hash + content.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

export function saveIncidentToStorage(incident: CrashIncident): void {
  try {
    const existing = getAllIncidentsFromStorage();
    const index = existing.findIndex((i) => i.id === incident.id);
    if (index >= 0) {
      existing[index] = { ...incident, updatedAt: new Date().toISOString() };
    } else {
      existing.unshift(incident);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    localStorage.setItem(CURRENT_ACTIVE_KEY, incident.id);
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function getAllIncidentsFromStorage(): CrashIncident[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getActiveIncidentId(): string | null {
  return localStorage.getItem(CURRENT_ACTIVE_KEY);
}

export function setActiveIncidentId(id: string): void {
  localStorage.setItem(CURRENT_ACTIVE_KEY, id);
}

export function deleteIncidentFromStorage(id: string): void {
  try {
    const existing = getAllIncidentsFromStorage();
    const filtered = existing.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete incident:', err);
  }
}

// Generates an interactive practice drill accident for demoing & testing
export function createPracticeDrillIncident(): CrashIncident {
  const base = createNewIncident('crash');
  base.id = 'DRILL-US101-CRASH-DEMO';
  base.location = {
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 4.8,
    addressApprox: 'US-101 Southbound near Exit 432 (Civic Center Blvd, San Francisco, CA)',
    timestamp: new Date().toISOString(),
  };
  base.safetyChecklist = {
    hazardLightsOn: true,
    engineOff: true,
    behindGuardrail: true,
    warningTriangleSet: true,
    noInjuriesImmediate: true,
  };
  base.otherParty = {
    driverName: 'Marcus Vance',
    phone: '(415) 555-0192',
    licenseNumber: 'D8921734',
    licenseState: 'CA',
    insuranceCompany: 'State Farm Mutual Auto',
    policyNumber: 'SF-904128-09B',
    vehicleMakeModel: 'Toyota Camry LE',
    vehicleYearColor: '2022 Metallic Gray',
    licensePlate: '8XYZ419',
    plateState: 'CA',
    vin: '4T1B11HK5NU109284',
  };
  base.towShield = {
    isDispatchedByMeOrPolice: true,
    companyName: 'Golden Gate Authorized Highway Towing',
    driverNameOrBadge: 'Officer Miller / Driver Ray #402',
    towPermitNumber: 'SF-TOW-2026-88',
    quotedHookupFee: '$145 Standard Flatbed (CHP Approved)',
    quotedStoragePerDay: '$45/day city regulated lot',
    refusedBlankForm: true,
    destinationLocation: 'State Farm Certified Repair Center (South Van Ness)',
    notes: 'Verified CHP authorized dispatch log #892. Refused bandit tow truck that arrived 4 mins prior.',
  };
  base.statement = {
    driverDirection: 'Southbound Lane 2 on US-101',
    approximateSpeed: '25 mph in slowing traffic',
    weatherCondition: 'fog',
    trafficLightStatus: 'Highway Flow / Heavy Traffic',
    factualNotes: 'Vehicle was traveling at approximately 25 mph in lane 2. Traffic in front slowed down due to congestion. My vehicle came to a controlled stop with foot on brake. The trailing gray Camry failed to stop in time and impacted my rear bumper.',
    audioMemoRecorded: true,
    audioDurationSeconds: 42,
  };

  // Mock SVG image thumbnails for photos
  const createMockSvgDataUrl = (label: string, color: string) => {
    const cleanLabel = label.replace(/&/g, '&amp;');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260">
      <rect width="400" height="260" fill="${color}"/>
      <rect x="10" y="10" width="380" height="240" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="6,6"/>
      <text x="200" y="110" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">EVIDENCE CAPTURED</text>
      <text x="200" y="145" font-family="sans-serif" font-size="15" fill="#f8fafc" text-anchor="middle">${cleanLabel}</text>
      <text x="200" y="180" font-family="monospace" font-size="12" fill="#cbd5e1" text-anchor="middle">TIMESTAMP: 2026-10-31 16:30 PST</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  base.photos[0].dataUrl = createMockSvgDataUrl('PLATE: 8XYZ419 (CA)', '#1e293b');
  base.photos[0].capturedAt = new Date().toISOString();

  base.photos[1].dataUrl = createMockSvgDataUrl('VIN: 4T1B11HK5NU109284', '#0f172a');
  base.photos[1].capturedAt = new Date().toISOString();

  base.photos[2].dataUrl = createMockSvgDataUrl('DL: Marcus Vance #D8921734', '#334155');
  base.photos[2].capturedAt = new Date().toISOString();

  base.photos[3].dataUrl = createMockSvgDataUrl('INSURANCE: State Farm #SF-904128', '#1e3a5f');
  base.photos[3].capturedAt = new Date().toISOString();

  base.photos[4].dataUrl = createMockSvgDataUrl('REAR BUMPER CRUMPLE & TAIL LIGHT', '#7f1d1d');
  base.photos[4].capturedAt = new Date().toISOString();

  base.photos[5].dataUrl = createMockSvgDataUrl('SCENE: US-101 EXIT 432 SKID MARKS', '#14532d');
  base.photos[5].capturedAt = new Date().toISOString();

  base.integrityHash = '9b83f0a1d47e8c3491b29a8f4c2e6d19e072b435af86d914e6b281cf3189e472';
  base.isCompleted = true;

  return base;
}
