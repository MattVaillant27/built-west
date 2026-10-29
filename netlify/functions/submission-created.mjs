// Netlify runs this automatically for every verified (non-spam) form submission.
// Email sign-ups ("notify") are passed to Kit, which sends the confirmation email (double opt-in).
// Pitch-a-guest submissions become Guest leads, and sponsor enquiries become Sponsor prospects, in the CRM.
// Other forms are ignored.
import { randomUUID } from 'node:crypto';
import { connectLambda, getStore } from '@netlify/blobs';

const clean = (v, max = 2000) => String(v ?? '').trim().slice(0, max);
const KIT_FORM_ID = '10067197';

// Kit API v4 (needs the KIT_API_KEY env var in Netlify). The subscriber must exist before it can be added to a form,
// so create it first (Kit returns the existing one if the address is already on the list), then add it to the form.
async function subscribeToKit(email, referrer) {
  const who = email.replace(/^(.{2}).*@/, '$1…@');
  const key = process.env.KIT_API_KEY;
  if (!key) return console.error('Kit subscribe skipped: KIT_API_KEY is not set', who);
  const kit = async (path, body) => {
    const res = await fetch(`https://api.kit.com/v4${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Kit-Api-Key': key },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`${path} ${res.status} ${(await res.text()).slice(0, 300)}`);
  };
  try {
    await kit('/subscribers', { email_address: email, state: 'active' });
    await kit(`/forms/${KIT_FORM_ID}/subscribers`, { email_address: email, ...(referrer && { referrer }) });
    console.log('Kit subscribe ok', who);
  } catch (err) {
    console.error('Kit subscribe failed', who, err.message);
  }
}

export const handler = async (event) => {
  const { payload } = JSON.parse(event.body || '{}');
  if (payload?.form_name === 'notify') {
    const email = clean(payload.data?.email, 254);
    if (email) await subscribeToKit(email, clean(payload.data?.referrer, 500));
    return { statusCode: 200, body: 'ok' };
  }
  if (payload?.form_name === 'sponsor') {
    connectLambda(event);
    await saveRecord(sponsorRecord(payload.data ?? {}));
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
  await saveRecord(record);
  return { statusCode: 200, body: 'ok' };
};

const saveRecord = (record) => getStore({ name: 'crm', consistency: 'strong' }).setJSON(`records/${record.id}`, record);

function sponsorRecord(d) {
  const now = new Date().toISOString();
  const website = clean(d.website, 500);
  return {
    id: randomUUID(),
    kind: 'sponsor',
    name: clean(d.company, 200) || 'Unnamed company',
    stage: 'Prospect',
    fields: {
      ...(clean(d.name, 200) && { contactName: clean(d.name, 200) }),
      ...(clean(d.role, 200) && { role: clean(d.role, 200) }),
      ...(clean(d.email, 200) && { email: clean(d.email, 200) }),
      ...(website && { website }),
      ...(clean(d.interest, 100) && { package: clean(d.interest, 100) }),
    },
    followUp: null,
    notes: [
      {
        id: randomUUID(),
        at: now,
        text: [
          `Sponsorship enquiry via the website from ${clean(d.name, 200) || 'someone'}${d.email ? ` <${clean(d.email, 200)}>` : ''}.`,
          clean(d.interest, 100) && `Interested in: ${clean(d.interest, 100)}`,
          clean(d.message, 5000) && `What they'd like to achieve:\n${clean(d.message, 5000)}`,
          website && `Website: ${website}`,
        ]
          .filter(Boolean)
          .join('\n\n'),
      },
    ],
    archived: false,
    createdAt: now,
    updatedAt: now,
  };
}
