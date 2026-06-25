import type {
  AgentActor,
  AgentInvocationRequest,
  AgentInvocationResponse,
  AgentName,
} from '../../shared/agent-contract.ts';
import { appendAuditEntry, createAuditId, createRequestId } from './audit-log.ts';
import { getServerEnv, isLiveAiEnabled } from './env.ts';
import {
  grokCategorize,
  grokDetectDuplicateRisk,
  grokEstimateSeverity,
  grokGenerateCopy,
  grokSummarize,
} from './grok-handlers.ts';
import {
  mockCategorize,
  mockDetectDuplicateRisk,
  mockEstimateSeverity,
  mockGenerateCopy,
  mockSummarize,
  type ModelExecutionResult,
} from './mock-provider.ts';
import { buildRateLimitKey, checkRateLimit } from './rate-limit.ts';
import { redactImageFields, sanitizePlainText, summarizePayload } from './sanitizer.ts';

export class AgentGatewayError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status = 400,
  ) {
    super(message);
    this.name = 'AgentGatewayError';
  }
}

const HUMAN_OVERRIDE_AGENTS: Set<AgentName> = new Set([
  'duplicate_trust',
  'ops_triage_copilot',
  'resolution_watchdog',
  'trust_abuse_investigation',
]);

function resolveActor(actor?: AgentActor): AgentActor {
  return actor ?? { id: 'anonymous', role: 'guest' };
}

function sanitizePayload(
  payload: Record<string, unknown>,
  env = getServerEnv(),
): Record<string, unknown> {
  const safe: Record<string, unknown> = { ...payload };
  if (typeof safe.description === 'string') {
    safe.description = sanitizePlainText(safe.description, env.maxDescriptionLength);
  }
  if (typeof safe.imageUrl === 'string' && safe.imageUrl.length > env.maxImageBase64Length) {
    throw new AgentGatewayError('Image payload too large', 'IMAGE_TOO_LARGE', 413);
  }
  if (typeof safe.categoryHint === 'string') {
    safe.categoryHint = sanitizePlainText(safe.categoryHint, 40);
  }
  if (typeof safe.category === 'string') {
    safe.category = sanitizePlainText(safe.category, 40);
  }
  return safe;
}

async function executeWithFallback(
  liveFn: () => Promise<ModelExecutionResult>,
  mockFn: () => Promise<ModelExecutionResult>,
): Promise<{ result: ModelExecutionResult; fallbackUsed: boolean }> {
  if (!isLiveAiEnabled()) {
    return { result: await mockFn(), fallbackUsed: false };
  }
  try {
    return { result: await liveFn(), fallbackUsed: false };
  } catch {
    return { result: await mockFn(), fallbackUsed: true };
  }
}

async function dispatchAction(
  agent: AgentName,
  action: string,
  payload: Record<string, unknown>,
): Promise<{ result: ModelExecutionResult; fallbackUsed: boolean }> {
  const description = String(payload.description ?? '');
  const categoryHint = payload.categoryHint ? String(payload.categoryHint) : undefined;
  const imageUrl = typeof payload.imageUrl === 'string' ? payload.imageUrl : undefined;
  const category = String(payload.category ?? categoryHint ?? 'other');

  if (agent === 'report_intake') {
    switch (action) {
      case 'categorize':
        return executeWithFallback(
          () => grokCategorize({ description, categoryHint, imageUrl }),
          () => mockCategorize({ description, categoryHint, imageUrl }),
        );
      case 'estimate_severity':
        return executeWithFallback(
          () => grokEstimateSeverity({ description, categoryHint, imageUrl }),
          () => mockEstimateSeverity({ description, categoryHint, imageUrl }),
        );
      case 'summarize':
        return executeWithFallback(
          () => grokSummarize(description),
          () => mockSummarize(description),
        );
      case 'generate_copy':
        return executeWithFallback(
          () => grokGenerateCopy(description, categoryHint ?? category, imageUrl),
          () => mockGenerateCopy(description, categoryHint ?? category),
        );
      default:
        throw new AgentGatewayError(`Unknown report_intake action: ${action}`, 'UNKNOWN_ACTION');
    }
  }

  if (agent === 'duplicate_trust' && action === 'detect_risk') {
    const lat = Number(payload.lat);
    const lng = Number(payload.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new AgentGatewayError('lat/lng required', 'INVALID_LOCATION');
    }
    return executeWithFallback(
      () =>
        grokDetectDuplicateRisk({
          description,
          category,
          lat,
          lng,
        }),
      () =>
        mockDetectDuplicateRisk({
          description,
          category,
          lat,
          lng,
        }),
    );
  }

  throw new AgentGatewayError(
    `Agent not implemented: ${agent}/${action}`,
    'AGENT_NOT_IMPLEMENTED',
    501,
  );
}

export async function executeAgentInvocation(
  request: AgentInvocationRequest,
): Promise<AgentInvocationResponse> {
  const started = Date.now();
  const requestId = createRequestId();
  const auditId = createAuditId();
  const actor = resolveActor(request.actor);
  const env = getServerEnv();

  const rateKey = buildRateLimitKey(actor.id, request.agent, request.action);
  const rate = checkRateLimit(rateKey);
  if (!rate.allowed) {
    throw new AgentGatewayError('Rate limit exceeded', 'RATE_LIMITED', 429);
  }

  let sanitizedPayload: Record<string, unknown>;
  try {
    sanitizedPayload = sanitizePayload(request.payload ?? {}, env);
  } catch (error) {
    if (error instanceof AgentGatewayError) throw error;
    throw new AgentGatewayError('Invalid payload', 'INVALID_PAYLOAD');
  }

  const humanOverrideRequired = HUMAN_OVERRIDE_AGENTS.has(request.agent);

  try {
    const { result, fallbackUsed } = await dispatchAction(
      request.agent,
      request.action,
      sanitizedPayload,
    );

    const latencyMs = Date.now() - started;
    const response: AgentInvocationResponse = {
      requestId,
      auditId,
      agent: request.agent,
      action: request.action,
      success: true,
      data: result.data,
      confidence: result.confidence,
      fallbackUsed,
      humanOverrideRequired,
      model: result.model,
      latencyMs,
    };

    appendAuditEntry({
      id: auditId,
      requestId,
      timestamp: new Date().toISOString(),
      agent: request.agent,
      action: request.action,
      trigger: request.trigger,
      actorId: actor.id,
      actorRole: actor.role,
      sanitizedInputSummary: summarizePayload(redactImageFields(sanitizedPayload)),
      outputSummary: summarizePayload(result.data),
      confidence: result.confidence,
      fallbackUsed,
      humanOverrideRequired,
      model: result.model,
      latencyMs,
    });

    return response;
  } catch (error) {
    const latencyMs = Date.now() - started;
    const code = error instanceof AgentGatewayError ? error.code : 'EXECUTION_FAILED';
    const message = error instanceof Error ? error.message : 'Agent execution failed';

    appendAuditEntry({
      id: auditId,
      requestId,
      timestamp: new Date().toISOString(),
      agent: request.agent,
      action: request.action,
      trigger: request.trigger,
      actorId: actor.id,
      actorRole: actor.role,
      sanitizedInputSummary: summarizePayload(redactImageFields(sanitizedPayload)),
      outputSummary: `[error] ${message}`,
      confidence: null,
      fallbackUsed: false,
      humanOverrideRequired,
      model: isLiveAiEnabled() ? 'grok' : 'mock-rules',
      latencyMs,
      errorCode: code,
    });

    if (error instanceof AgentGatewayError) throw error;
    throw new AgentGatewayError(message, code, 500);
  }
}

export function validateInvocationRequest(body: unknown): AgentInvocationRequest {
  if (!body || typeof body !== 'object') {
    throw new AgentGatewayError('Request body required', 'INVALID_BODY');
  }
  const raw = body as Record<string, unknown>;
  const agent = raw.agent;
  const action = raw.action;
  const trigger = raw.trigger;

  if (typeof agent !== 'string' || !agent.trim()) {
    throw new AgentGatewayError('agent is required', 'INVALID_AGENT');
  }
  if (typeof action !== 'string' || !action.trim()) {
    throw new AgentGatewayError('action is required', 'INVALID_ACTION');
  }
  if (typeof trigger !== 'string' || !trigger.trim()) {
    throw new AgentGatewayError('trigger is required', 'INVALID_TRIGGER');
  }

  const payload =
    raw.payload && typeof raw.payload === 'object' && !Array.isArray(raw.payload)
      ? (raw.payload as Record<string, unknown>)
      : {};

  let actor: AgentActor | undefined;
  if (raw.actor && typeof raw.actor === 'object' && !Array.isArray(raw.actor)) {
    const a = raw.actor as Record<string, unknown>;
    if (typeof a.id === 'string' && typeof a.role === 'string') {
      actor = { id: a.id, role: a.role as AgentActor['role'] };
    }
  }

  return {
    agent: agent as AgentName,
    action,
    trigger,
    payload,
    actor,
  };
}
