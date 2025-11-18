// OpenRouter API Client for LLMs (e.g. Mistral-7B-Instruct, OpenHermes-2.5, etc.)
// Usage: import { callOpenRouter } from './openrouterClient';

// ES Module Version mit node-fetch Import
import fetch from 'node-fetch';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_API_KEY = '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';
const DEFAULT_MODEL = 'mistralai/mistral-7b-instruct';

/**
 * Call OpenRouter API
 * @param {Object} params
 * @param {Array} params.messages - Chat messages
 * @param {string} [params.model] - Model name
 * @param {number} [params.temperature]
 * @param {number} [params.max_tokens]
 * @param {string} [params.apiKey] - Optional API key override
 * @returns {Promise<string>} - Model response
 */
export async function callOpenRouter({ messages, model = DEFAULT_MODEL, temperature = 0.7, max_tokens = 1024, apiKey }) {
  const key = apiKey || DEFAULT_API_KEY;
  const res = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens
    })
  });
  if (!res.ok) {
    throw new Error(`OpenRouter API error: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) ? data.choices[0].message.content : '';
}

export { DEFAULT_MODEL };