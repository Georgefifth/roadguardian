export type IncidentType = 'crash' | 'breakdown';

export type TriageStep = 1 | 2 | 3 | 4;

export interface GPSLocation {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  addressApprox: string;
  timestamp: string;
}

export interface SafetyChecklist {
  hazardLightsOn: boolean;
  engineOff: boolean;
  behindGuardrail: boolean;
  warningTriangleSet: boolean;
  noInjuriesImmediate: boolean;
}

export interface PhotoEvidenceItem {
  id: string;
  category: 'plate' | 'vin' | 'driver_license' | 'insurance_card' | 'damage_front' | 'damage_rear' | 'scene_context';
  title: string;
  description: string;
  required: boolean;
  dataUrl: string | null;
  capturedAt: string | null;
}

export interface OtherPartyInfo {
  driverName: string;
  phone: string;
  licenseNumber: string;
  licenseState: string;
  insuranceCompany: string;
  policyNumber: string;
  vehicleMakeModel: string;
  vehicleYearColor: string;
  licensePlate: string;
  plateState: string;
  vin: string;
}

export interface TowTruckVerification {
  isDispatchedByMeOrPolice: boolean;
  companyName: string;
  driverNameOrBadge: string;
  towPermitNumber: string;
  quotedHookupFee: string;
  quotedStoragePerDay: string;
  refusedBlankForm: boolean;
  destinationLocation: string;
  notes: string;
}

export interface StatementDetails {
  driverDirection: string;
  approximateSpeed: string;
  weatherCondition: 'clear' | 'rain' | 'fog' | 'snow' | 'ice' | 'night';
  trafficLightStatus: string;
  factualNotes: string;
  audioMemoRecorded: boolean;
  audioDurationSeconds: number;
}

export interface CrashIncident {
  id: string;
  type: IncidentType;
  createdAt: string;
  updatedAt: string;
  location: GPSLocation;
  safetyChecklist: SafetyChecklist;
  photos: PhotoEvidenceItem[];
  otherParty: OtherPartyInfo;
  towShield: TowTruckVerification;
  statement: StatementDetails;
  integrityHash?: string;
  isCompleted: boolean;
}
