/** Machine-readable report intake output — shared by gateway and client. */

export interface ReportIntakeConfidence {
  category: number;
  severity: number;
  overall: number;
}

export interface ReportIntakeResult {
  category: string;
  severity: string;
  suggestedTitle: string;
  summary: string;
  safetyCues: string[];
  confidence: ReportIntakeConfidence;
  explanation: string;
  categoryRationale?: string;
  severityRationale?: string;
}

export interface ReportIntakePayload {
  description: string;
  categoryHint?: string;
  imageUrl?: string;
  hasVideo?: boolean;
  location?: { lat: number; lng: number; wardId?: string };
}
