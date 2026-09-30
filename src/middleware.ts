// Guards /crm: everything except the login page and the token-protected calendar feed
// needs a valid session. Public pages are untouched.
import { defineMiddleware } from 'astro:middleware';
import { readSession } from './crm/auth';

const PUBLIC_CRM = [/^\/crm\/login\/?$/, /^\/crm\/calendar\/[^/]+\.ics$/];

export const onRequest = defineMiddleware(async (ctx, next) => {
  const path = ctx.url.pathname;
  if (!path.startsWith('/crm')) return next();

  // Reject cross-site form posts outright (belt and braces with SameSite cookies + CSRF tokens).
  if (ctx.request.method !== 'GET' && ctx.request.method !== 'HEAD') {
    const origin = ctx.request.headers.get('origin');
    if (origin && origin !== ctx.url.origin) return new Response('Forbidden', { status: 403 });
  }

  let response: Response;
  if (PUBLIC_CRM.some((re) => re.test(path))) {
    response = await next();
  } else {
    const session = readSession(ctx.cookies);
    if (!session) {
      response =
        ctx.request.method === 'GET' ? ctx.redirect(`/crm/login?next=${encodeURIComponent(path + ctx.url.search)}`) : new Response('Unauthorized', { status: 401 });
    } else {
      ctx.locals.session = session;
      response = await next();
    }
  }

  // Set in place so Astro can still attach cookies (e.g. the session set at login).
  try {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Referrer-Policy', 'same-origin');
    response.headers.set('X-Frame-Options', 'DENY');
  } catch {
    // Immutable headers (rare): netlify.toml sets the same headers for /crm/* as a fallback.
  }
  return response;
});
