#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

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
  return new Promise((resolve, reject) => {
    glob('**/*.{md,mdx,ts,tsx,js,jsx,html}', { ignore: 'node_modules/**' }, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
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

async function embed(texts) {
  const url = 'https://api.openai.com/v1/embeddings';
  const res = await axios.post(
    url,
    { model: EMBEDDING_MODEL, input: texts },
    { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
  );
  return res.data.data.map(d => d.embedding);
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