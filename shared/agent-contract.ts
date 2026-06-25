/** Shared agent invocation contract (client + server). */

export type AgentName =
  | 'report_intake'
  | 'duplicate_trust'
  | 'verification_orchestrator'
  | 'ops_triage_copilot'
  | 'resolution_watchdog'
  | 'emerging_pattern_insight'
  | 'trust_abuse_investigation';

export type ActorRole = 'citizen' | 'admin' | 'mod' | 'system' | 'guest';

export interface AgentActor {
  id: string;
  role: ActorRole;
}

export interface AgentInvocationRequest {
  agent: AgentName;
  action: string;
  trigger: string;
  payload: Record<string, unknown>;
  actor?: AgentActor;
}

export interface AgentInvocationResponse {
  requestId: string;
  auditId: string;
  agent: AgentName;
  action: string;
  success: boolean;
  data: Record<string, unknown> | null;
  confidence: number | null;
  fallbackUsed: boolean;
  humanOverrideRequired: boolean;
  model: string;
  latencyMs: number;
  error?: string;
}

export interface AgentAuditEntry {
  id: string;
  requestId: string;
  timestamp: string;
  agent: AgentName;
  action: string;
  trigger: string;
  actorId: string;
  actorRole: ActorRole;
  sanitizedInputSummary: string;
  outputSummary: string;
  confidence: number | null;
  fallbackUsed: boolean;
  humanOverrideRequired: boolean;
  model: string;
  latencyMs: number;
  errorCode?: string;
}
