// Qdrant client wrapper for the project
// - nutzt QDRANT_URL und optional QDRANT_API_KEY aus der Umgebung
// - exportiert einen Axios-Client und eine Health-Check-Funktion

import axios, { AxiosInstance } from 'axios';

const QDRANT_URL = process.env.QDRANT_URL ?? 'http://localhost:6333';
const QDRANT_API_KEY = process.env.QDRANT_API_KEY ?? '';

const defaultHeaders: Record<string, string> = {};
if (QDRANT_API_KEY) {
  defaultHeaders['api-key'] = QDRANT_API_KEY;
}

export const qdrantClient: AxiosInstance = axios.create({
  baseURL: QDRANT_URL,
  headers: defaultHeaders,
  timeout: 10000,
});

/**
 * Versucht mehrere mögliche Health-Endpunkte und gibt das erste erfolgreiche Ergebnis zurück.
 */
export async function checkQdrantHealth(): Promise<{ ok: boolean; status: number; body?: any }> {
  const endpoints = ['/health', '/api/collections', '/collections'];
  for (const ep of endpoints) {
    try {
      const res = await qdrantClient.get(ep);
      if (res.status >= 200 && res.status < 300) {
        return { ok: true, status: res.status, body: res.data };
      }
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        return { ok: false, status: 403, body: err.response.data };
      }
      // weiter zum nächsten Endpoint
    }
  }
  return { ok: false, status: 404 };
}

export default qdrantClient;