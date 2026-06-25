import type {
  AgentActor,
  AgentInvocationRequest,
  AgentInvocationResponse,
  AgentName,
} from '@shared/agent-contract';
import { getAgentApiBaseUrl, isAiGatewayEnabled } from '@/services/ai/gateway-config';

export class AgentClientError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'AgentClientError';
  }
}

function resolveActor(actor?: Partial<AgentActor>): AgentActor {
  return {
    id: actor?.id ?? 'anonymous',
    role: actor?.role ?? 'guest',
  };
}

export async function invokeAgent<T extends Record<string, unknown> = Record<string, unknown>>(
  agent: AgentName,
  action: string,
  payload: Record<string, unknown>,
  options?: { trigger?: string; actor?: Partial<AgentActor> },
): Promise<AgentInvocationResponse & { data: T | null }> {
  if (!isAiGatewayEnabled()) {
    throw new AgentClientError('AI gateway is disabled', 'GATEWAY_DISABLED');
  }

  const request: AgentInvocationRequest = {
    agent,
    action,
    trigger: options?.trigger ?? 'client_invoke',
    payload,
    actor: resolveActor(options?.actor),
  };

  const base = getAgentApiBaseUrl();
  const url = `${base}/api/agents/invoke`;

  const controller = new AbortController();
  const timeoutMs = 8_000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    const body = (await response.json()) as AgentInvocationResponse | { error: string; code: string };

    if (!response.ok) {
      const err = body as { error: string; code: string };
      throw new AgentClientError(
        err.error ?? 'Gateway request failed',
        err.code ?? 'GATEWAY_ERROR',
        response.status,
      );
    }

    return body as AgentInvocationResponse & { data: T | null };
  } finally {
    clearTimeout(timeout);
  }
}
