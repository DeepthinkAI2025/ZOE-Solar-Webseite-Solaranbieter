import fs from 'fs';
import path from 'path';
import glob from 'glob';
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { qdrantClient, checkQdrantHealth } from '../server/qdrantClient';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const COLLECTION_NAME = process.env.QDRANT_COLLECTION || 'codebase-index';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY nicht gesetzt. Setze in .env.local oder Umgebung.');
  process.exit(1);
}

async function getFiles(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob('**/*.{md,mdx,ts,tsx,js,jsx,html}', { ignore: 'node_modules/**' }, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}

function extractText(content: string): string {
  // Einfacher HTML/JSX/Markdown-Stripper
  return content
    .replace(/<[^>]+>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function chunkText(text: string, maxLen = 1000): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += maxLen) {
    chunks.push(text.slice(i, i + maxLen));
  }
  return chunks;
}

async function embed(texts: string[]): Promise<number[][]> {
  const url = 'https://api.openai.com/v1/embeddings';
  const res = await axios.post(
    url,
    { model: EMBEDDING_MODEL, input: texts },
    { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
  );
  return res.data.data.map((d: any) => d.embedding);
}

function idFromPath(pathStr: string, idx?: number) {
  const base = idx !== undefined ? `${pathStr}:${idx}` : pathStr;
  return crypto.createHash('sha1').update(base).digest('hex');
}

async function ensureCollection(dim: number) {
  try {
    console.log(`Prüfe Qdrant Health...`);
    const health = await checkQdrantHealth();
    console.log('Qdrant health:', health.status);
  } catch (e) {
    console.warn('Qdrant Health-Check fehlgeschlagen, versuche trotzdem weiter.');
  }

  try {
    // Create collection if not exists
    await qdrantClient.put(`/collections/${COLLECTION_NAME}`, {
      vectors: { size: dim, distance: 'Cosine' }
    });
    console.log(`Collection ${COLLECTION_NAME} erstellt / bestätigt (Vektor-Dim=${dim}).`);
  } catch (err: any) {
    if (err.response && (err.response.status === 409 || err.response.status === 400)) {
      console.log('Collection existiert eventuell bereits.');
    } else {
      console.error('Fehler beim Erstellen der Collection:', err?.message || err);
      throw err;
    }
  }
}

async function upsertPoints(points: any[]) {
  if (points.length === 0) return;
  try {
    // Qdrant upsert (PUT /collections/{name}/points)
    await qdrantClient.put(`/collections/${COLLECTION_NAME}/points`, { points });
    console.log(`Uploaded ${points.length} points to ${COLLECTION_NAME}`);
  } catch (err: any) {
    console.error('Fehler beim Upload zu Qdrant:', err?.response?.data || err?.message || err);
    throw err;
  }
}

async function run() {
  console.log('Starte Code-Indexer...');
  const files = await getFiles();
  console.log(`Gefundene Dateien: ${files.length}`);

  const pointsBatch: any[] = [];
  for (const filePath of files) {
    try {
      const abs = path.resolve(filePath);
      const raw = fs.readFileSync(abs, 'utf-8');
      const text = extractText(raw);
      if (!text || text.length < 20) continue;

      const chunks = chunkText(text, 1000);
      const embeddings = await embed(chunks);

      for (let i = 0; i < embeddings.length; i++) {
        const id = idFromPath(filePath, i);
        pointsBatch.push({
          id,
          vector: embeddings[i],
          payload: { path: filePath, chunk: i, text: chunks[i].slice(0, 300) }
        });
      }
    } catch (e) {
      console.warn('Datei überspringen wegen Fehler:', filePath, (e as Error).message);
    }
  }

  if (pointsBatch.length === 0) {
    console.log('Keine Punkte zum Hochladen gefunden.');
    return;
  }

  const dim = pointsBatch[0].vector.length;
  await ensureCollection(dim);

  // Upload in Batches
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