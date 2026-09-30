// Follow-ups → calendar: a private iCalendar feed and one-click Google Calendar links.
import { KINDS, TIME_ZONE } from './config';
import { addDays, type CrmRecord } from './store';

const compact = (ymd: string) => ymd.replaceAll('-', '');
const hhmm = (t: string) => t.replace(':', '') + '00';

const addMinutes = (time: string, mins: number) => {
  const [h, m] = time.split(':').map(Number);
  const total = Math.min(h * 60 + m + mins, 23 * 60 + 59);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

const title = (r: CrmRecord) => `Follow up: ${r.name} (${KINDS[r.kind].label})`;
const details = (r: CrmRecord, site: string) =>
  [r.followUp?.note, `${site}/crm/r/${r.id}`].filter(Boolean).join('\n\n');

/** Escape text per RFC 5545 and fold long lines. */
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const fold = (line: string) => {
  const out: string[] = [];
  for (let i = 0; i < line.length; i += 73) out.push((i ? ' ' : '') + line.slice(i, i + 73));
  return out.join('\r\n');
};

export function icsFeed(records: CrmRecord[], site: string) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Built West//CRM//EN',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:Built West follow-ups',
    `X-WR-TIMEZONE:${TIME_ZONE}`,
    'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
  ];
  for (const r of records) {
    const f = r.followUp;
    if (!f?.date || r.archived) continue;
    lines.push('BEGIN:VEVENT', `UID:${r.id}-followup@builtwest.ca`, `DTSTAMP:${stamp}`);
    if (f.time) {
      lines.push(`DTSTART;TZID=${TIME_ZONE}:${compact(f.date)}T${hhmm(f.time)}`, `DTEND;TZID=${TIME_ZONE}:${compact(f.date)}T${hhmm(addMinutes(f.time, 30))}`);
    } else {
      lines.push(`DTSTART;VALUE=DATE:${compact(f.date)}`, `DTEND;VALUE=DATE:${compact(addDays(f.date, 1))}`);
    }
    lines.push(`SUMMARY:${esc(title(r))}`, `DESCRIPTION:${esc(details(r, site))}`, `URL:${site}/crm/r/${r.id}`, 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}

export function googleCalendarLink(r: CrmRecord, site: string) {
  const f = r.followUp;
  if (!f?.date) return null;
  const dates = f.time
    ? `${compact(f.date)}T${hhmm(f.time)}/${compact(f.date)}T${hhmm(addMinutes(f.time, 30))}`
    : `${compact(f.date)}/${compact(addDays(f.date, 1))}`;
  const q = new URLSearchParams({ action: 'TEMPLATE', text: title(r), dates, details: details(r, site), ctz: TIME_ZONE });
  return `https://calendar.google.com/calendar/render?${q}`;
}
