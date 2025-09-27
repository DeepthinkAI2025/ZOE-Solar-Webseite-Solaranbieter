#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  cp,
  mkdir,
  readdir,
  rm,
  stat,
} from 'fs/promises';

interface CliOptions {
  wikiDir: string;
  dryRun: boolean;
  clean: boolean;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const sourceDir = path.join(rootDir, 'docs', 'wiki');

const DEFAULT_WIKI_DIR = path.resolve(rootDir, '..', 'ZOE-Solar-Webseite-Solaranbieter.wiki');

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    wikiDir: process.env.WIKI_SYNC_TARGET ? path.resolve(process.env.WIKI_SYNC_TARGET) : DEFAULT_WIKI_DIR,
    dryRun: false,
    clean: true,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--wiki-dir' || arg === '--target') {
      const value = args[index + 1];
      if (!value) {
        throw new Error(`Fehlender Wert für ${arg}`);
      }
      options.wikiDir = path.resolve(value);
      index += 1;
    } else if (arg.startsWith('--wiki-dir=')) {
      options.wikiDir = path.resolve(arg.split('=')[1] ?? '');
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--no-clean') {
      options.clean = false;
    } else if (arg === '--clean') {
      options.clean = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp(): void {
  console.log(`ZOE Solar Wiki Sync\n\n` +
    `Kopiert Inhalte aus docs/wiki in das GitHub Wiki Repository.\n\n` +
    `Optionen:\n` +
    `  --wiki-dir <pfad>     Zielverzeichnis (Standard: ../ZOE-Solar-Webseite-Solaranbieter.wiki)\n` +
    `  --dry-run             Nur Aktionen ausgeben, nichts schreiben\n` +
    `  --no-clean            Zielverzeichnis vor dem Kopieren nicht bereinigen\n` +
    `  --clean               Zielverzeichnis vollständig bereinigen (Standard)\n` +
    `  --help, -h            Diese Hilfe anzeigen\n` +
    `\nUmgebungsvariable:\n` +
    `  WIKI_SYNC_TARGET      Alternativer Standardpfad für das Wiki-Repo\n`);
}

async function ensureExists(dir: string): Promise<boolean> {
  try {
    await stat(dir);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

async function cleanDestination(destDir: string, dryRun: boolean): Promise<void> {
  const entries = await readdir(destDir);
  for (const entry of entries) {
    if (entry === '.git') continue;
    const entryPath = path.join(destDir, entry);
    if (dryRun) {
      console.log(`[dry-run] löschen ${entryPath}`);
    } else {
      await rm(entryPath, { recursive: true, force: true });
    }
  }
}

async function copyContents(source: string, destination: string, dryRun: boolean): Promise<void> {
  const entries = await readdir(source);
  if (!entries.length) {
    console.log('⚠️  Keine Dateien in docs/wiki gefunden.');
    return;
  }

  for (const entry of entries) {
    const src = path.join(source, entry);
    const dest = path.join(destination, entry);
    if (dryRun) {
      console.log(`[dry-run] kopiere ${src} -> ${dest}`);
    } else {
      await cp(src, dest, { recursive: true, force: true });
    }
  }
}

async function main(): Promise<void> {
  const options = parseArgs();

  if (!(await ensureExists(sourceDir))) {
    throw new Error(`Quellverzeichnis ${sourceDir} existiert nicht.`);
  }

  const exists = await ensureExists(options.wikiDir);
  if (!exists) {
    console.error(`❌ Zielverzeichnis ${options.wikiDir} existiert nicht.`);
    console.error('Bitte klone vorher das Wiki Repo:');
    console.error('  git clone https://github.com/DeepthinkAI2025/ZOE-Solar-Webseite-Solaranbieter.wiki.git');
    process.exit(1);
  }

  if (!options.dryRun) {
    await mkdir(options.wikiDir, { recursive: true });
  }

  console.log(`📁 Quelle:      ${sourceDir}`);
  console.log(`📁 Ziel:        ${options.wikiDir}`);
  console.log(`🧹 Bereinigen: ${options.clean ? 'ja' : 'nein'}`);
  console.log(`🧪 Dry-Run:    ${options.dryRun ? 'ja' : 'nein'}`);

  if (options.clean) {
    await cleanDestination(options.wikiDir, options.dryRun);
  }

  await copyContents(sourceDir, options.wikiDir, options.dryRun);

  console.log(options.dryRun ? '\n✅ Dry-Run abgeschlossen.' : '\n✅ Wiki-Sync abgeschlossen.');
  console.log('ℹ️  Abschließend im Wiki-Repo committen & pushen:');
  console.log('    git add . && git commit -m "Sync wiki" && git push');
}

main().catch((error) => {
  console.error('❌ Wiki-Sync fehlgeschlagen:', error);
  process.exitCode = 1;
});
