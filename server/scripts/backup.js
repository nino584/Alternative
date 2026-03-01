#!/usr/bin/env node
/**
 * Database Backup Script
 *
 * Creates a timestamped backup of server/db/data.json
 * Keeps the last 30 backups and removes older ones.
 *
 * Usage:
 *   node server/scripts/backup.js
 *
 * Automate with cron (daily at 3am):
 *   0 3 * * * cd /path/to/Alternative && node server/scripts/backup.js >> server/logs/backup.log 2>&1
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'db', 'data.json');
const BACKUP_DIR = join(__dirname, '..', 'backups');
const MAX_BACKUPS = 30;

function backup() {
  if (!existsSync(DB_PATH)) {
    console.error(`[BACKUP] ERROR: Database not found at ${DB_PATH}`);
    process.exit(1);
  }

  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = join(BACKUP_DIR, `data-${timestamp}.json`);

  try {
    const data = readFileSync(DB_PATH, 'utf-8');
    // Validate JSON before saving
    JSON.parse(data);
    writeFileSync(backupFile, data, 'utf-8');
    console.log(`[BACKUP] Created: ${backupFile}`);
  } catch (err) {
    console.error(`[BACKUP] ERROR: ${err.message}`);
    process.exit(1);
  }

  // Cleanup old backups
  try {
    const files = readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('data-') && f.endsWith('.json'))
      .sort()
      .reverse();

    if (files.length > MAX_BACKUPS) {
      const toDelete = files.slice(MAX_BACKUPS);
      for (const file of toDelete) {
        unlinkSync(join(BACKUP_DIR, file));
        console.log(`[BACKUP] Removed old backup: ${file}`);
      }
    }

    console.log(`[BACKUP] Total backups: ${Math.min(files.length, MAX_BACKUPS)}`);
  } catch (err) {
    console.error(`[BACKUP] Cleanup warning: ${err.message}`);
  }
}

backup();
