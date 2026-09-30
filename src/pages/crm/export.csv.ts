import type { APIRoute } from 'astro';
import { FIELDS } from '../../crm/config';
import { listRecords, today } from '../../crm/store';

export const prerender = false;

const cell = (v: unknown) => {
  const s = String(v ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const GET: APIRoute = async () => {
  const records = await listRecords(undefined, { includeArchived: true });
  const fieldKeys = [...new Set(Object.values(FIELDS).flat().map((f) => f.key))].filter((k) => k !== 'name');
  const header = ['id', 'kind', 'name', 'stage', ...fieldKeys, 'followUpDate', 'followUpTime', 'followUpNote', 'notes', 'archived', 'createdAt', 'updatedAt'];
  const rows = records.map((r) => [
    r.id, r.kind, r.name, r.stage ?? '',
    ...fieldKeys.map((k) => r.fields[k] ?? ''),
    r.followUp?.date ?? '', r.followUp?.time ?? '', r.followUp?.note ?? '',
    r.notes.map((n) => `[${n.at.slice(0, 10)}] ${n.text}`).join('\n'),
    r.archived, r.createdAt, r.updatedAt,
  ]);
  const csv = [header, ...rows].map((row) => row.map(cell).join(',')).join('\r\n');
  return new Response('﻿' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="built-west-crm-${today()}.csv"`,
    },
  });
};
