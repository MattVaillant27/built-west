// Private API for adding contacts from a Claude chat. Auth: `Authorization: Bearer <CRM_API_TOKEN>`.
//   GET  /crm/api/records?q=name      → matching records (id, kind, name, stage, role, company) for duplicate checks
//   POST /crm/api/records              → { records: [{ kind, name, stage?, fields?, note?, followUp? }] }
//        New names are created. Existing ones (same kind + name) get the note appended and empty fields filled.
import type { APIRoute } from 'astro';
import { apiTokenOk } from '../../../crm/auth';
import { FIELDS, KINDS, STAGES, type Kind } from '../../../crm/config';
import { addNote, listRecords, newRecord, saveRecord, type CrmRecord } from '../../../crm/store';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body, null, 2), { status, headers: { 'Content-Type': 'application/json' } });

const authorized = (request: Request) => apiTokenOk((request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, ''));

const summary = (r: CrmRecord) => ({ id: r.id, kind: r.kind, name: r.name, stage: r.stage, role: r.fields.role, company: r.fields.company });

export const GET: APIRoute = async ({ request, url }) => {
  if (!authorized(request)) return json({ error: 'Unauthorized' }, 401);
  const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();
  const all = await listRecords(undefined, { includeArchived: true });
  const hits = q ? all.filter((r) => [r.name, r.fields.company ?? ''].join(' ').toLowerCase().includes(q)) : all;
  return json({ records: hits.slice(0, 50).map(summary) });
};

interface Incoming {
  kind?: string;
  name?: string;
  stage?: string;
  fields?: Record<string, unknown>;
  note?: string;
  followUp?: { date?: string; time?: string; note?: string };
}

export const POST: APIRoute = async ({ request }) => {
  if (!authorized(request)) return json({ error: 'Unauthorized' }, 401);
  let body: { records?: Incoming[] };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Body must be JSON' }, 400);
  }
  const incoming = Array.isArray(body.records) ? body.records.slice(0, 50) : [];
  if (!incoming.length) return json({ error: 'No records' }, 400);

  const all = await listRecords(undefined, { includeArchived: true });
  const created: ReturnType<typeof summary>[] = [];
  const updated: ReturnType<typeof summary>[] = [];
  const errors: string[] = [];

  for (const item of incoming) {
    const kind = String(item.kind ?? 'guest') as Kind;
    const name = String(item.name ?? '').trim().slice(0, 200);
    if (!Object.hasOwn(KINDS, kind) || !name) {
      errors.push(`Skipped ${name || '(no name)'}: needs a valid kind and name.`);
      continue;
    }
    const existing = all.find((r) => r.kind === kind && r.name.toLowerCase() === name.toLowerCase());
    const r = existing ?? newRecord(kind, name);

    for (const f of FIELDS[kind]) {
      if (f.key === 'name') continue;
      const v = String(item.fields?.[f.key] ?? '').trim().slice(0, 5000);
      if (v && !r.fields[f.key]) r.fields[f.key] = v; // never overwrite what's already there
    }
    if (item.stage && STAGES[kind]?.includes(item.stage) && (!existing || existing.stage === STAGES[kind]![0])) r.stage = item.stage;
    const fu = item.followUp;
    if (fu?.date && /^\d{4}-\d{2}-\d{2}$/.test(fu.date)) {
      r.followUp = {
        date: fu.date,
        ...(fu.time && /^\d{2}:\d{2}$/.test(fu.time) && { time: fu.time }),
        ...(fu.note && { note: String(fu.note).slice(0, 300) }),
      };
    }
    addNote(r, String(item.note ?? ''));
    await saveRecord(r);
    if (!existing) all.push(r);
    (existing ? updated : created).push(summary(r));
  }
  return json({ created, updated, errors });
};
