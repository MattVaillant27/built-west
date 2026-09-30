// Built West CRM — record kinds, pipeline stages and form fields.
// Edit stage lists here; existing records keep their stage text even if it's renamed.

export type Kind = 'guest' | 'sponsor' | 'partner';

export const KINDS: Record<Kind, { label: string; plural: string; path: string }> = {
  guest: { label: 'Guest', plural: 'Guests', path: '/crm/guests' },
  sponsor: { label: 'Sponsor', plural: 'Sponsors', path: '/crm/sponsors' },
  partner: { label: 'Partner', plural: 'Partners', path: '/crm/partners' },
};

// The last stage in each list is the "closed / not proceeding" outcome.
export const STAGES: Partial<Record<Kind, string[]>> = {
  guest: ['Idea', 'Researching', 'Reached out', 'In conversation', 'Booked', 'Recorded', 'Published', 'Passed'],
  sponsor: ['Prospect', 'Contacted', 'Pitched', 'Negotiating', 'Signed', 'Active', 'Renewal', 'Lost'],
};

export const GUEST_SOURCES = ['Outreach', 'Pitch form', 'Referral', 'Inbound', 'Other'];

export type FieldType = 'text' | 'email' | 'tel' | 'url' | 'date' | 'number' | 'select' | 'textarea';

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

const contact: Field[] = [
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel' },
  { key: 'website', label: 'Website / LinkedIn', type: 'url', placeholder: 'https://' },
];

export const FIELDS: Record<Kind, Field[]> = {
  guest: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'role', label: 'Role', type: 'text' },
    { key: 'company', label: 'Company', type: 'text' },
    ...contact,
    { key: 'source', label: 'Source', type: 'select', options: GUEST_SOURCES },
    { key: 'recordingDate', label: 'Recording date', type: 'date' },
    { key: 'episodeSlug', label: 'Episode page slug', type: 'text', placeholder: '01-guest-name' },
    { key: 'tags', label: 'Tags', type: 'text', placeholder: 'fintech, Vancouver' },
  ],
  sponsor: [
    { key: 'name', label: 'Company', type: 'text', required: true },
    { key: 'contactName', label: 'Contact name', type: 'text' },
    { key: 'role', label: 'Contact role', type: 'text' },
    ...contact,
    { key: 'package', label: 'Package', type: 'text', placeholder: 'e.g. 4-episode host read' },
    { key: 'value', label: 'Deal value (CAD)', type: 'number' },
    { key: 'startDate', label: 'Start date', type: 'date' },
    { key: 'endDate', label: 'End date', type: 'date' },
  ],
  partner: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'type', label: 'Type', type: 'text', placeholder: 'e.g. Community, Venue, Media' },
    ...contact,
  ],
};

export const TIME_ZONE = 'America/Vancouver';
