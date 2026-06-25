/** Client-side gateway toggle — API keys must never ship to the browser. */

export function isAiGatewayEnabled(): boolean {
  const value = import.meta.env.VITE_AI_GATEWAY_ENABLED;
  if (value === undefined || value === '') return true;
  return value === 'true' || value === '1';
}

export function getAgentApiBaseUrl(): string {
  return import.meta.env.VITE_AGENT_API_BASE_URL ?? '';
}
