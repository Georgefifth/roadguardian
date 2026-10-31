export const DEFAULT_PHOTO_ITEMS = [
  { id: 'photo_plate', category: 'plate', title: "Other Vehicle's License Plate", required: true },
  { id: 'photo_vin', category: 'vin', title: "Windshield VIN Barcode", required: true },
  { id: 'photo_driver_license', category: 'driver_license', title: "Other Driver's License Card", required: true },
  { id: 'photo_insurance_card', category: 'insurance_card', title: "Other Driver's Insurance Card", required: true },
  { id: 'photo_damage_impact', category: 'damage_front', title: "Point of Impact & Vehicle Damage", required: true },
  { id: 'photo_scene_context', category: 'scene_context', title: "Scene Context", required: false },
];

export function createNewIncident(type = 'crash') {
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

export function createPracticeDrillIncident() {
  const base = createNewIncident('crash');
  base.id = 'DRILL-US101-CRASH-DEMO';
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
    notes: 'Verified CHP authorized dispatch log #892.',
  };
  base.statement = {
    driverDirection: 'Southbound Lane 2 on US-101',
    approximateSpeed: '25 mph in slowing traffic',
    weatherCondition: 'fog',
    trafficLightStatus: 'Highway Flow / Heavy Traffic',
    factualNotes: 'Vehicle was traveling at approximately 25 mph in lane 2. Traffic in front slowed down due to congestion.',
    audioMemoRecorded: true,
    audioDurationSeconds: 42,
  };
  base.photos = base.photos.map((p) => ({
    ...p,
    dataUrl: 'data:image/svg+xml;utf8,<svg></svg>',
    capturedAt: new Date().toISOString(),
  }));
  return base;
}
