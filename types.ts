export type Role = 'BHW' | 'CITIZEN' | 'ADMIN' | null;

export enum RiskLevel {
  GREEN = 'GREEN',   // Home Care
  YELLOW = 'YELLOW', // Teleconsult / Clinic Visit
  RED = 'RED',       // Emergency Referral
}

export interface Vitals {
  temp: number;
  bpSystolic: number;
  bpDiastolic: number;
  pulse: number;
  oxygen: number;
}

export interface PhysicalExamCheck {
  id: string;
  prompt: string; // e.g., "Press lower right abdomen (McBurney's Point)."
  expectedFinding: string; // "Pain/Recoil"
  isChecked?: boolean;
  finding?: 'positive' | 'negative';
}

export interface ClinicalAssessment {
  riskLevel: RiskLevel;
  provisionalClassification: string;
  reasoning: string;
  immediateActions: string[];
  physicalExamPrompts: PhysicalExamCheck[];
  recommendedMedications: string[];
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  barangay: string;
  symptoms: string[];
  vitals: Vitals;
  assessment?: ClinicalAssessment;
  timestamp: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g., "Every 8 AM"
  totalTablets: number;
  remainingTablets: number;
  nextDose: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Medicine' | 'Equipment';
  stockLevel: number;
  unit: string;
  location: string; // Barangay
  demandTrend: 'up' | 'stable' | 'down';
  predictedRunoutDays: number;
}

export interface SyndromeReport {
  id: string;
  barangay: string;
  syndrome: 'Fever' | 'Cough' | 'Diarrhea' | 'Rash';
  timestamp: string;
}