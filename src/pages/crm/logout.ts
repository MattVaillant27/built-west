import type { APIRoute } from 'astro';
import { checkCsrf, endSession } from '../../crm/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, locals, redirect }) => {
  const form = await request.formData();
  if (!locals.session || !checkCsrf(locals.session, form.get('_csrf'))) return new Response('Forbidden', { status: 403 });
  endSession(cookies);
  return redirect('/crm/login', 303);
};
