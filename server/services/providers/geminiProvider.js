// DEPRECATED: Gemini provider removed.
// This file is kept for backward compatibility.
// Use OpenRouter provider (openrouterProvider.js) instead.

import { isOpenRouterConfigured } from './openrouterProvider.js';

export function isGeminiConfigured() {
  return false;
}

export async function geminiProvider() {
  throw new Error('Gemini provider removed. Use openrouterProvider instead.');
}

export async function evaluateAssetCandidates() {
  throw new Error('Gemini provider removed. Use openrouterProvider.evaluateAssetCandidates instead.');
}

// Re-export OpenRouter functions for backward compatibility
export { isOpenRouterConfigured } from './openrouterProvider.js';

export function isAIProviderConfigured() {
  return isOpenRouterConfigured();
}