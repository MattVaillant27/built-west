// "Who's coming" cards on the home page (before launch).
// To announce a guest (only once Matt confirms they've approved it): replace ONE placeholder with
//   { announced: true, name, role, company, episode: 1, dateLine: 'Coming January 2027', photo? }
// where photo is an import from src/assets (supplied by Matt, never pulled from the web).
// Always leave at least one placeholder so the section never goes quiet.
import type { ImageMetadata } from 'astro';

export interface UpcomingGuest {
  announced: boolean;
  name?: string;
  role?: string;
  company?: string;
  episode?: number;
  dateLine?: string;
  photo?: ImageMetadata;
}

export const upcomingGuests: UpcomingGuest[] = [{ announced: false }, { announced: false }, { announced: false }];
