
export type Language = 'English' | 'Hindi' | 'Marathi' | 'Bengali' | 'Telugu' | 'Tamil' | 'Gujarati' | 'Kannada' | 'Malayalam' | 'Punjabi';

export interface HealthMetrics {
  systolicBP: number;
  diastolicBP: number;
  bloodSugar: number;
  hemoglobin: number;
  weight: number;
  age: number;
  weekOfPregnancy: number;
  hivStatus: 'Positive' | 'Negative' | 'Unknown';
  rhFactor: 'Rh+' | 'Rh-';
}

export interface MedicalHistory {
  conditions: string;
  surgeries: string;
  allergies: string;
}

export interface UserProfile {
  name: string;
  role: 'patient' | 'doctor' | 'asha';
  metrics: HealthMetrics;
  history: MedicalHistory;
}

export interface RiskAssessmentResult {
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical';
  riskScore: number;
  potentialConditions: string[];
  reasoning: string;
  recommendations: string[];
}

// Added SymptomAnalysis interface
export interface SymptomAnalysis {
  severity: 'Self-Care' | 'Consult Doctor' | 'Immediate Emergency';
  possibleCauses: string[];
  actionRequired: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface CallAppointment {
  id: string;
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
  status: 'Upcoming' | 'Live' | 'Completed' | 'Missed';
  type: 'Voice' | 'Video';
}

export interface DietDay {
  day: string;
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
  calories: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  lastTakenDate?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  timestamp: Date;
  read: boolean;
}

export interface EducationalSource {
  uri: string;
  title: string;
}

export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  CALL_SCHEDULER = 'CALL_SCHEDULER',
  DIET_PLAN = 'DIET_PLAN',
  CHATBOT = 'CHATBOT',
  REPORTS = 'REPORTS',
  APPOINTMENTS = 'APPOINTMENTS',
  MEDICATION_TRACKER = 'MEDICATION_TRACKER',
  EDUCATION = 'EDUCATION'
}