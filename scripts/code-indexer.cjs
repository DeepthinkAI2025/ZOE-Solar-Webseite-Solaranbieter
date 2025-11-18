#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || '';
const COLLECTION_NAME = process.env.QDRANT_COLLECTION || 'codebase-index';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY nicht gesetzt. Setze in .env.local oder Umgebung.');
  process.exit(1);
}

function getFiles() {
  // Fallback: rekursives Dateisystem-Walk (kompatibel ohne glob)
  const exts = ['.md', '.mdx', '.ts', '.tsx', '.js', '.jsx', '.html'];
  const results = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === 'node_modules') continue;
        walk(p);
      } else {
        if (exts.includes(path.extname(e.name))) results.push(p);
      }
    }
  }

  try {
    walk(process.cwd());
  } catch (err) {
    return Promise.reject(err);
  }

  // Rückgabe als relative Pfade, kompatibel zum bisherigen Verhalten
  const relative = results.map(p => path.relative(process.cwd(), p));
  return Promise.resolve(relative);
}

function extractText(content) {
  return content
    .replace(/<[^>]+>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function chunkText(text, maxLen = 1000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxLen) {
    chunks.push(text.slice(i, i + maxLen));
  }
  return chunks;
}

const EMBEDDING_PROVIDER = process.env.EMBEDDING_PROVIDER || 'openai';

// Service account / OAuth helpers for Google Generative API
const GOOGLE_USE_SA = process.env.GOOGLE_USE_SERVICE_ACCOUNT === 'true';
const GOOGLE_SA_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
const GOOGLE_SA_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_PATH;

let _cachedGoogleToken = null;

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function loadServiceAccount() {
  if (GOOGLE_SA_JSON) {
    try {
      return JSON.parse(GOOGLE_SA_JSON);
    } catch (e) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON ist kein gültiges JSON');
    }
  }
  if (GOOGLE_SA_PATH) {
    try {
      const raw = fs.readFileSync(GOOGLE_SA_PATH, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      throw new Error('Konnte Service-Account-Datei nicht lesen oder parsen: ' + e.message);
    }
  }
  throw new Error('Kein Service-Account konfiguriert. Setze GOOGLE_SERVICE_ACCOUNT_JSON oder GOOGLE_SERVICE_ACCOUNT_PATH bzw. setze GOOGLE_USE_SERVICE_ACCOUNT=false.');
}

function createSignedJWT(sa) {
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;
  const payload = base64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp,
    iat
  }));
  const unsigned = `${header}.${payload}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(sa.private_key, 'base64');
  const signatureUrl = signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return { jwt: `${unsigned}.${signatureUrl}`, exp };
}

async function getGoogleAccessToken() {
  if (_cachedGoogleToken && _cachedGoogleToken.exp > (Date.now() / 1000) + 60) {
    return _cachedGoogleToken.token;
  }

  const sa = loadServiceAccount();
  const { jwt, exp } = createSignedJWT(sa);

  try {
    const resp = await axios.post(
      'https://oauth2.googleapis.com/token',
      `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(jwt)}`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 10000 }
    );

    const token = resp.data.access_token;
    const expiresIn = resp.data.expires_in || 3600;
    _cachedGoogleToken = { token, exp: Math.floor(Date.now() / 1000) + expiresIn };
    return token;
  } catch (err) {
    console.error('Fehler beim Abrufen des Google Access Token:', err?.response?.data || err.message || err);
    throw err;
  }
}

async function embed(texts) {
  if (EMBEDDING_PROVIDER === 'google') {
    const model = process.env.GOOGLE_EMBEDDING_MODEL || 'textembedding-gecko-001';
    const url = `https://generativelanguage.googleapis.com/v1beta2/models/${model}:embed`;

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (GOOGLE_USE_SA) {
        const accessToken = await getGoogleAccessToken();
        headers['Authorization'] = `Bearer ${accessToken}`;
      } else if (OPENAI_API_KEY) {
        // fallback to api key as query param when not using service account
        // note: query param will be appended to URL
      }

      // If not using service account and OPENAI_API_KEY is present, append ?key=...
      const requestUrl = (!GOOGLE_USE_SA && OPENAI_API_KEY) ? `${url}?key=${OPENAI_API_KEY}` : url;

      const res = await axios.post(
        requestUrl,
        { input: texts },
        { headers, timeout: 60000 }
      );

      // Official response shape: { embeddings: [ { embedding: [...] }, ... ] }
      if (res.data && Array.isArray(res.data.embeddings)) {
        return res.data.embeddings.map(e => e.embedding);
      }

      // Some variants may return { data: [ { embedding: [...] } ] }
      if (res.data && Array.isArray(res.data.data)) {
        return res.data.data.map(d => d.embedding || d);
      }

      // Fallback: try common nested fields
      if (res.data && Array.isArray(res.data.responses)) {
        return res.data.responses.map(r => r.embedding || r);
      }

      throw new Error('Unerwartetes Antwortformat von Google Generative API (embed)');
    } catch (err) {
      const status = err?.response?.status;
      const respData = err?.response?.data;
      if (status === 401 || status === 403) {
  console.error(`Google Embedding Auth Fehler (${status}). Prüfe Service-Account / API‑Key & Berechtigungen. Antwort:`, respData);
        throw new Error(`Authentication error from Google Generative API (${status}). Verify credentials and API access.`);
      }
      if (status === 404) {
        console.error('Google Generative Embed Endpoint returned 404. Überprüfe Modellnamen und ob die Generative API im Projekt aktiviert ist. Antwort:', respData);
        throw new Error('Generative API Endpoint not found (404). Verify model name and API activation.');
      }
  console.error('Google-Embedding-Fehler:', respData || err.message || err);
      throw err;
    }
  } else {
    // OpenAI Embeddings (Fallback)
    const url = 'https://api.openai.com/v1/embeddings';
    const res = await axios.post(
      url,
      { model: EMBEDDING_MODEL, input: texts },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }, timeout: 60000 }
    );
    return res.data.data.map(d => d.embedding);
  }
}

function idFromPath(pathStr, idx) {
  const base = idx !== undefined ? `${pathStr}:${idx}` : pathStr;
  return crypto.createHash('sha1').update(base).digest('hex');
}

async function ensureCollection(dim) {
  try {
    const headers = QDRANT_API_KEY ? { 'api-key': QDRANT_API_KEY } : {};
    // Check if collection exists
    const check = await axios.get(`${QDRANT_URL}/collections/${COLLECTION_NAME}`, { headers });
    if (check.status >= 200 && check.status < 300) {
      console.log(`Collection ${COLLECTION_NAME} existiert.`);
      return;
    }
  } catch (err) {
    // If 404 create, else proceed
    if (err.response && err.response.status === 404) {
      // will create below
    } else {
      console.warn('Fehler beim Abfragen der Collection:', err.message || err);
    }
  }

  try {
    const headers = QDRANT_API_KEY ? { 'api-key': QDRANT_API_KEY } : {};
    await axios.put(`${QDRANT_URL}/collections/${COLLECTION_NAME}`, {
      vectors: { size: dim, distance: 'Cosine' }
    }, { headers });
    console.log(`Collection ${COLLECTION_NAME} erstellt (Vektor-Dim=${dim}).`);
  } catch (err) {
    console.error('Fehler beim Erstellen der Collection:', err?.response?.data || err.message || err);
    throw err;
  }
}

async function upsertPoints(points) {
  if (!points || points.length === 0) return;
  try {
    const headers = Object.assign({}, QDRANT_API_KEY ? { 'api-key': QDRANT_API_KEY } : {}, { 'Content-Type': 'application/json' });
    await axios.put(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points`, { points }, { headers, timeout: 60000 });
    console.log(`Uploaded ${points.length} points to ${COLLECTION_NAME}`);
  } catch (err) {
    console.error('Fehler beim Upload zu Qdrant:', err?.response?.data || err.message || err);
    throw err;
  }
}

async function run() {
  console.log('Starte Code-Indexer...');
  const files = await getFiles();
  console.log(`Gefundene Dateien: ${files.length}`);

  const pointsBatch = [];
  for (const filePath of files) {
    try {
      const abs = path.resolve(filePath);
      const raw = fs.readFileSync(abs, 'utf-8');
      const text = extractText(raw);
      if (!text || text.length < 20) continue;

      const chunks = chunkText(text, 1000);
      // Process in small groups to avoid large requests
      for (let i = 0; i < chunks.length; i += 10) {
        const slice = chunks.slice(i, i + 10);
        const embeddings = await embed(slice);
        for (let j = 0; j < embeddings.length; j++) {
          const id = idFromPath(filePath, i + j);
          pointsBatch.push({
            id,
            vector: embeddings[j],
            payload: { path: filePath, chunk: i + j, text: slice[j].slice(0, 300) }
          });
        }
      }
    } catch (e) {
      console.warn('Datei überspringen wegen Fehler:', filePath, e.message || e);
    }
  }

  if (pointsBatch.length === 0) {
    console.log('Keine Punkte zum Hochladen gefunden.');
    return;
  }

  const dim = pointsBatch[0].vector.length;
  await ensureCollection(dim);

  const BATCH_SIZE = 256;
  for (let i = 0; i < pointsBatch.length; i += BATCH_SIZE) {
    const batch = pointsBatch.slice(i, i + BATCH_SIZE);
    await upsertPoints(batch);
  }

  console.log('Indexierung abgeschlossen.');
}

run().catch(err => {
  console.error('Indexer-Fehler:', err);
  process.exit(1);
});