export type VerificationStatus = 'Verified' | 'Needs Review' | 'Flagged';
export type ComparisonStatus = 'Verified Match' | 'Mismatch Detected' | 'Unverified';
export type OrderClassification = 'Final Judgment' | 'Interim / Procedural Order' | 'Indeterminate';

export interface ExtractedField {
  value: string;
  confidence: number; // 0 to 100
  pageNumber: number | null;
  evidenceQuote: string | null;
  status: 'Verified' | 'Needs Review';
  reviewReason?: string;
}

export interface CitedSection {
  act: string;
  section: string;
  description: string;
  relevance?: string;
  pageNumber: number;
  quote: string;
  confidence: number;
  status: 'Verified' | 'Needs Review';
}

export interface ExtractedOutcome {
  disposition: 
    | 'Appeal Allowed' 
    | 'Appeal Dismissed' 
    | 'Petition Allowed' 
    | 'Petition Dismissed' 
    | 'Bail Granted' 
    | 'Bail Rejected' 
    | 'Acquitted' 
    | 'Conviction Upheld' 
    | 'Remanded' 
    | 'Order Modified'
    | 'Disposed of'
    | 'Interim Order / Stay Granted'
    | 'Needs Review';
  verdictText: string;
  pageNumber: number;
  evidenceQuote: string;
  confidence: number;
  status: 'Verified' | 'Needs Review';
  orderType: OrderClassification;
  reviewReason?: string;
}

export interface PageContent {
  pageNumber: number;
  text: string;
}

export interface CourtJudgment {
  id: string;
  fileName: string;
  fileSize: number;
  analyzedAt: string;
  pageCount: number;
  rawText: string;
  pages: PageContent[];
  hasExtractableText: boolean;
  ocrNotice?: string;
  isDemo?: boolean;
  extractedData: {
    courtName: ExtractedField;
    caseType: ExtractedField;
    caseNumber: ExtractedField;
    year: ExtractedField;
    bench: ExtractedField;
    petitioner: ExtractedField;
    respondent: ExtractedField;
    actsAndSections: CitedSection[];
    finalOutcome: ExtractedOutcome;
    summary: string;
    keyIssues: string[];
    operativeOrderText: string;
    orderType: OrderClassification;
  };
  overallStatus: VerificationStatus;
  confidenceScore: number;
  authoritativeSourceChecked: boolean;
  notes?: string;
}

export interface ComparisonFieldResult {
  field: string;
  label: string;
  valA: string;
  valB: string;
  pageA?: number | null;
  pageB?: number | null;
  matchStatus: 'Match' | 'Mismatch' | 'Partial' | 'Unverified';
  details?: string;
}

export interface DocumentComparisonResult {
  id: string;
  timestamp: string;
  docAId: string;
  docAName: string;
  docBId: string;
  docBName: string;
  overallStatus: ComparisonStatus;
  similarityScore: number;
  authoritativeSourceChecked: boolean;
  discrepanciesCount: number;
  fields: ComparisonFieldResult[];
  verdictComparison: {
    outcomeA: string;
    outcomeB: string;
    isMatch: boolean;
    evidenceQuoteA?: string;
    evidenceQuoteB?: string;
  };
  notice: string;
}
