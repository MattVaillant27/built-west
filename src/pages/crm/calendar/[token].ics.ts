import type { APIRoute } from 'astro';
import { calendarTokenOk } from '../../../crm/auth';
import { icsFeed } from '../../../crm/calendar';
import { listRecords } from '../../../crm/store';

export const prerender = false;

// Private follow-up feed for Google Calendar. The secret token in the URL is the only credential.
export const GET: APIRoute = async ({ params, url }) => {
  if (!calendarTokenOk(params.token ?? '')) return new Response('Not found', { status: 404 });
  const records = await listRecords();
  return new Response(icsFeed(records, url.origin), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'inline; filename="built-west-follow-ups.ics"' },
  });
};
