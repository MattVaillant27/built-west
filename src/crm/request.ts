import type { AstroGlobal } from 'astro';
import { checkCsrf } from './auth';

/** For authenticated pages: returns the posted form if it carries a valid CSRF token, otherwise null. */
export async function readPost(Astro: AstroGlobal): Promise<FormData | null> {
  if (Astro.request.method !== 'POST' || !Astro.locals.session) return null;
  const form = await Astro.request.formData();
  return checkCsrf(Astro.locals.session, form.get('_csrf')) ? form : null;
}
