// Netlify runs this automatically for every verified (non-spam) form submission.
// Email sign-ups ("notify") are passed to Kit, which sends the confirmation email (double opt-in).
// Pitch-a-guest submissions become Guest leads in the CRM; other forms are ignored.
import { randomUUID } from 'node:crypto';
import { connectLambda, getStore } from '@netlify/blobs';

const clean = (v, max = 2000) => String(v ?? '').trim().slice(0, max);
const KIT_FORM_ID = '10067197';

async function subscribeToKit(email) {
  const res = await fetch(`https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ email_address: email }).toString(),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.status === 'failed') console.error('Kit subscribe failed', res.status, JSON.stringify(json.errors ?? json));
}

export const handler = async (event) => {
  const { payload } = JSON.parse(event.body || '{}');
  if (payload?.form_name === 'notify') {
    const email = clean(payload.data?.email, 254);
    if (email) await subscribeToKit(email);
    return { statusCode: 200, body: 'ok' };
  }
  if (payload?.form_name !== 'pitch') return { statusCode: 200, body: 'ignored' };

  connectLambda(event);
  const d = payload.data ?? {};
  const now = new Date().toISOString();
  const guestName = clean(d.guest, 200) || 'Unnamed guest';
  const role = clean(d.guest_role, 200);
  const record = {
    id: randomUUID(),
    kind: 'guest',
    name: guestName,
    stage: 'Idea',
    fields: {
      source: 'Pitch form',
      ...(role && { role }),
      ...(clean(d.link, 500) && { website: clean(d.link, 500) }),
    },
    followUp: null,
    notes: [
      {
        id: randomUUID(),
        at: now,
        text: [
          `Pitched via the website by ${clean(d.name, 200) || 'someone'}${d.email ? ` <${clean(d.email, 200)}>` : ''}.`,
          role && `Role/company: ${role}`,
          clean(d.why, 5000) && `Why they're worth an hour:\n${clean(d.why, 5000)}`,
          clean(d.link, 500) && `Link: ${clean(d.link, 500)}`,
        ]
          .filter(Boolean)
          .join('\n\n'),
      },
    ],
    archived: false,
    createdAt: now,
    updatedAt: now,
  };
  await getStore({ name: 'crm', consistency: 'strong' }).setJSON(`records/${record.id}`, record);
  return { statusCode: 200, body: 'ok' };
};
