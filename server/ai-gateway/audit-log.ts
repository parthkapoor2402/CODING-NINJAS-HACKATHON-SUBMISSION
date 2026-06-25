import type { AgentAuditEntry } from '../../shared/agent-contract.ts';

const auditStore: AgentAuditEntry[] = [];
const MAX_ENTRIES = 5000;

export function appendAuditEntry(entry: AgentAuditEntry): AgentAuditEntry {
  auditStore.push(entry);
  if (auditStore.length > MAX_ENTRIES) {
    auditStore.splice(0, auditStore.length - MAX_ENTRIES);
  }
  return entry;
}

export function getAuditEntries(): readonly AgentAuditEntry[] {
  return auditStore;
}

export function clearAuditLog(): void {
  auditStore.length = 0;
}

export function createAuditId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
