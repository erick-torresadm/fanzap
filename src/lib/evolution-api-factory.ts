import { EvolutionAPI } from './evolution-api';

const apiCache = new Map<string, EvolutionAPI>();

export function getEvolutionApi(apiUrl?: string, apiKey?: string): EvolutionAPI {
  const key = apiUrl || 'default';
  
  if (!apiCache.has(key)) {
    const api = new EvolutionAPI(apiUrl, apiKey);
    apiCache.set(key, api);
  }
  
  return apiCache.get(key)!;
}

export function clearApiCache() {
  apiCache.clear();
}