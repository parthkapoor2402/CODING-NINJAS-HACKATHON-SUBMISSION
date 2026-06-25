import type { AgentInvocationResponse } from '../../shared/agent-contract.ts';
import {
  AgentGatewayError,
  executeAgentInvocation,
  validateInvocationRequest,
} from './secure-agent-wrapper.ts';

export interface HttpHandlerResult {
  status: number;
  body: AgentInvocationResponse | { error: string; code: string };
}

export async function handleAgentInvokeHttp(body: unknown): Promise<HttpHandlerResult> {
  try {
    const request = validateInvocationRequest(body);
    const response = await executeAgentInvocation(request);
    return { status: 200, body: response };
  } catch (error) {
    if (error instanceof AgentGatewayError) {
      return {
        status: error.status,
        body: { error: error.message, code: error.code },
      };
    }
    return {
      status: 500,
      body: { error: 'Internal gateway error', code: 'INTERNAL_ERROR' },
    };
  }
}

export { executeAgentInvocation, validateInvocationRequest, AgentGatewayError } from './secure-agent-wrapper.ts';
export { getAuditEntries, clearAuditLog } from './audit-log.ts';
export { getServerEnv, isLiveAiEnabled } from './env.ts';
