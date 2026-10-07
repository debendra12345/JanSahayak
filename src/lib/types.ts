export type Category = "General" | "OBC" | "SC" | "ST" | "EWS" | "Any";
export type Gender = "Male" | "Female" | "Any";
export type EducationLevel =
  | "School"
  | "Diploma"
  | "Undergraduate"
  | "Postgraduate"
  | "Any";

export interface UserProfile {
  name?: string;
  age?: number;
  gender?: Gender;
  state?: string;
  category?: Category;
  familyIncome?: number; // annual, in INR
  educationLevel?: EducationLevel;
  occupation?: string;
  occupationStatus?: string;
  disability?: boolean;
  rawText: string;
}

export interface ProfileExtractionResult {
  profile: UserProfile;
  source: "ai" | "fallback";
  missingFields: string[];
}

export interface SchemeEligibilityRule {
  minAge?: number;
  maxAge?: number;
  gender?: Gender;
  categories?: Category[]; // allowed categories, "Any" means everyone
  maxFamilyIncome?: number;
  educationLevels?: EducationLevel[];
  states?: string[]; // empty/["All India"] means nationwide
  requiresDisability?: boolean;
  occupations?: string[]; // e.g. ["student"]
}

export interface Scheme {
  id: string;
  name: string;
  nameHindi?: string;
  department: string;
  description: string;
  benefit: string;
  rules: SchemeEligibilityRule;
  documents: string[];
  officialUrl: string;
  verifiedBy: string;
  lastVerified: string;
  category: "Scholarship" | "Financial Aid" | "Skill Development" | "Insurance" | "Housing";
}

export type EligibilityStatus = "Eligible" | "Likely Eligible" | "Not Eligible";

export interface EligibilityReason {
  criterion: string;
  passed: boolean | "unknown";
  detail: string;
}

export interface EligibilityResult {
  schemeId: string;
  status: EligibilityStatus;
  score: number; // 0-100
  reasons: EligibilityReason[];
}

export interface MatchedScheme {
  scheme: Scheme;
  eligibility: EligibilityResult;
}

export type ApplicationStatus = "Saved" | "Applied" | "Approved" | "Rejected";

export interface SavedApplication {
  id: string;
  clientId: string;
  schemeId: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

// Document Checklist
export type DocumentStatus = "NOT_AVAILABLE" | "NEEDED" | "AVAILABLE" | "UPLOADED" | "VERIFIED";

export interface Document {
  id: string;
  name: string;
  description: string;
  required: boolean;
  status: DocumentStatus;
  verificationStatus?: "pending" | "verified" | "rejected";
}

export interface DocumentChecklist {
  schemeId: string;
  userId: string;
  documents: Document[];
  completedAt?: string;
}

// Application Tracking
export type ApplicationTrackingStatus = 
  | "DRAFT" 
  | "DOCUMENTS_PENDING" 
  | "SUBMITTED" 
  | "UNDER_REVIEW" 
  | "APPROVED" 
  | "REJECTED" 
  | "COMPLETED";

export interface ApplicationTracking {
  id: string;
  userId: string;
  schemeId: string;
  schemeName: string;
  applicationNumber?: string;
  status: ApplicationTrackingStatus;
  submittedAt?: string;
  expectedProcessingDays?: number;
  expectedCompletionDate?: string;
  lastUpdated: string;
  nextAction?: string;
  notes?: string;
}

// Reminders
export type ReminderStatus = "UPCOMING" | "COMPLETED" | "DISMISSED";

export interface Reminder {
  id: string;
  userId: string;
  applicationId: string;
  title: string;
  description?: string;
  reminderDate: string;
  status: ReminderStatus;
  createdAt: string;
}

// Source Verification
export type SourceTrustStatus = "VERIFIED" | "NEEDS_REVIEW" | "UNVERIFIED";
export type FreshnessStatus = "CURRENT" | "AGING" | "OUTDATED";

export interface SourceVerification {
  schemeId: string;
  officialDomain?: string;
  sourceUrl?: string;
  isOfficial: boolean;
  lastVerifiedAt: string;
  sourceStatus: SourceTrustStatus;
  freshnessStatus: FreshnessStatus;
  conflictStatus?: string;
}
