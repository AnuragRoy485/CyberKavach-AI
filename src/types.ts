export interface UrgentAction {
  step: string;
  details: string;
  icon: string;
}

export interface EvidenceTip {
  item: string;
  purpose: string;
  instruction: string;
}

export interface CyberLawProvision {
  provision: string;
  statute: string;
  penalty: string;
  explanation: string;
}

export interface IncidentAnalysis {
  fraudType: string;
  subType: string;
  confidence: number;
  shortSummary: string;
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  immediateActions: UrgentAction[];
  evidenceTips: EvidenceTip[];
  cyberLaws: CyberLawProvision[];
  complaintDraft: string;
  isFinancialLoss: boolean;
  financialSop?: string[];
  nextSteps: string[];
}

export interface ThreatAnalysis {
  isSuspicious: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number; // 0 (safe) to 100 (highly fraudulent)
  fraudType: string;
  maliciousFactors: string[];
  aiSafetyVerdict: string;
  recommendedPrecaution: string;
}

export interface InteractiveQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CyberCellContact {
  state: string;
  helpline: string;
  email: string;
  website: string;
}
