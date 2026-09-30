// Daily snapshot of every CRM record to Blobs (backups/YYYY-MM-DD). Keeps the latest 30.
import { getStore } from '@netlify/blobs';

export default async () => {
  const store = getStore({ name: 'crm', consistency: 'strong' });
  const { blobs } = await store.list({ prefix: 'records/' });
  const records = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })));
  const day = new Date().toISOString().slice(0, 10);
  await store.setJSON(`backups/${day}`, { takenAt: new Date().toISOString(), records: records.filter(Boolean) });

  const { blobs: backups } = await store.list({ prefix: 'backups/' });
  const old = backups.map((b) => b.key).sort().slice(0, -30);
  await Promise.all(old.map((k) => store.delete(k)));
  return new Response(`Backed up ${records.length} records`);
};

export const config = { schedule: '@daily' };
