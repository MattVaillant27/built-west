// CRM storage on Netlify Blobs: one JSON document per record under `records/<id>`.
import { getStore } from '@netlify/blobs';
import { randomUUID } from 'node:crypto';
import { FIELDS, STAGES, TIME_ZONE, type Kind } from './config';

export interface Note {
  id: string;
  at: string; // ISO timestamp
  text: string;
}

export interface FollowUp {
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM (local, America/Vancouver)
  note?: string;
}

export interface CrmRecord {
  id: string;
  kind: Kind;
  name: string;
  stage?: string;
  fields: Record<string, string>;
  followUp?: FollowUp | null;
  notes: Note[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export const store = () => getStore({ name: 'crm', consistency: 'strong' });

const key = (id: string) => `records/${id}`;
const isId = (id: string) => /^[a-f0-9-]{36}$/.test(id);

export async function getRecord(id: string): Promise<CrmRecord | null> {
  if (!isId(id)) return null;
  return (await store().get(key(id), { type: 'json' })) as CrmRecord | null;
}

export async function listRecords(kind?: Kind, { includeArchived = false } = {}): Promise<CrmRecord[]> {
  const s = store();
  const { blobs } = await s.list({ prefix: 'records/' });
  const all = (await Promise.all(blobs.map((b) => s.get(b.key, { type: 'json' })))) as (CrmRecord | null)[];
  return all
    .filter((r): r is CrmRecord => !!r)
    .filter((r) => (!kind || r.kind === kind) && (includeArchived || !r.archived))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function saveRecord(r: CrmRecord): Promise<CrmRecord> {
  r.updatedAt = new Date().toISOString();
  await store().setJSON(key(r.id), r);
  return r;
}

export async function deleteRecord(id: string) {
  if (isId(id)) await store().delete(key(id));
}

export function newRecord(kind: Kind, name: string): CrmRecord {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    kind,
    name,
    stage: STAGES[kind]?.[0],
    fields: {},
    followUp: null,
    notes: [],
    archived: false,
    createdAt: now,
    updatedAt: now,
  };
}

/** Copy the kind's fields from a submitted form onto a record. */
export function applyFields(r: CrmRecord, form: FormData) {
  for (const f of FIELDS[r.kind]) {
    const v = String(form.get(f.key) ?? '').trim().slice(0, 2000);
    if (f.key === 'name') {
      if (v) r.name = v;
    } else if (v) r.fields[f.key] = v;
    else delete r.fields[f.key];
  }
  const stage = String(form.get('stage') ?? '');
  if (stage && STAGES[r.kind]?.includes(stage)) r.stage = stage;
}

export function addNote(r: CrmRecord, text: string) {
  const t = text.trim().slice(0, 10000);
  if (t) r.notes.unshift({ id: randomUUID(), at: new Date().toISOString(), text: t });
}

/** Today's date in Victoria, as YYYY-MM-DD. */
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date());

export function addDays(ymd: string, days: number) {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const formatDay = (ymd: string) =>
  new Date(`${ymd}T12:00:00Z`).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });

export const formatStamp = (iso: string) =>
  new Date(iso).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short', timeZone: TIME_ZONE });

/** One-line summary for lists: role/company for guests, contact for sponsors, etc. */
export function subtitle(r: CrmRecord) {
  const f = r.fields;
  if (r.kind === 'sponsor') return [f.contactName, f.package].filter(Boolean).join(' · ');
  return [f.role, f.company, r.kind === 'partner' ? f.type : ''].filter(Boolean).join(', ');
}
