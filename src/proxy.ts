import { NextResponse, type NextRequest } from 'next/server.js';
import { isLocale, LANGUAGE_COOKIE, negotiateLocale } from './lib/i18n';

export function proxy(request: NextRequest) {
  const firstSegment = request.nextUrl.pathname.split('/')[1];
  if (isLocale(firstSegment)) return NextResponse.next();
  const locale = negotiateLocale(
    request.headers.get('accept-language'),
    request.cookies.get(LANGUAGE_COOKIE)?.value,
  );
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${url.pathname === '/' ? '' : url.pathname}`;
  const response = NextResponse.redirect(url, 307);
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Vary', 'Accept-Language, Cookie');
  return response;
}

export const config = {
  matcher: [
    '/((?!_next(?:/|$)|api(?:/|$)|robots\\.txt$|sitemap\\.xml$|.*\\.[^/]+$).*)',
  ],
};
