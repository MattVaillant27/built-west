// Bulk import from CSV. Columns are matched by field key or label (case-insensitive):
// kind, name, stage, any field in FIELDS (e.g. role, company, region, lane, warmth…), and note/notes.
// The CSV from Settings → Download CSV re-imports too. Existing records (same kind + name) are skipped.
import { FIELDS, KINDS, STAGES, type Kind } from './config';
import { addNote, listRecords, newRecord, saveRecord } from './store';

export const MAX_ROWS = 1000;

/** RFC 4180 CSV → rows of cells (handles quotes, commas and newlines inside quotes, BOM). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const src = text.replace(/^﻿/, '');
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((v) => v.trim()));
}

export interface ImportResult { created: number; skipped: string[]; errors: string[] }

export async function importCsv(text: string, defaultKind: Kind): Promise<ImportResult> {
  const [header, ...rows] = parseCsv(text);
  const result: ImportResult = { created: 0, skipped: [], errors: [] };
  if (!header) return { ...result, errors: ['The file is empty.'] };
  if (rows.length > MAX_ROWS) return { ...result, errors: [`Too many rows (max ${MAX_ROWS}).`] };

  const col = new Map(header.map((h, i) => [h.trim().toLowerCase(), i]));
  const get = (row: string[], ...names: string[]) => {
    for (const n of names) {
      const i = col.get(n.toLowerCase());
      if (i !== undefined && row[i]?.trim()) return row[i].trim();
    }
    return '';
  };
  if (!col.has('name')) return { ...result, errors: ['No "name" column found.'] };

  const toSave: ReturnType<typeof newRecord>[] = [];
  const existing = new Set((await listRecords(undefined, { includeArchived: true })).map((r) => `${r.kind}:${r.name.toLowerCase()}`));

  for (const [n, row] of rows.entries()) {
    const name = get(row, 'name').slice(0, 200);
    const kindText = get(row, 'kind').toLowerCase();
    const kind = (Object.hasOwn(KINDS, kindText) ? kindText : defaultKind) as Kind;
    if (!name) { result.errors.push(`Row ${n + 2}: no name, skipped.`); continue; }
    const dedupeKey = `${kind}:${name.toLowerCase()}`;
    if (existing.has(dedupeKey)) { result.skipped.push(name); continue; }

    const r = newRecord(kind, name);
    for (const f of FIELDS[kind]) {
      if (f.key === 'name') continue;
      const v = get(row, f.key, f.label).slice(0, 5000);
      if (v) r.fields[f.key] = v;
    }
    const stage = get(row, 'stage');
    if (stage && STAGES[kind]?.includes(stage)) r.stage = stage;
    addNote(r, get(row, 'note', 'notes'));
    toSave.push(r);
    existing.add(dedupeKey);
  }

  // Save in parallel batches to stay well inside the function time limit.
  for (let i = 0; i < toSave.length; i += 20) {
    await Promise.all(toSave.slice(i, i + 20).map((r) => saveRecord(r)));
  }
  result.created = toSave.length;
  return result;
}
