import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

const PROTECTED = ['/dashboard', '/order'];

/**
 * Short-link host for QR codes (e.g. "inky.id"). Set NEXT_PUBLIC_SHORT_BASE_URL
 * and point that domain at this same app to shave characters off the encoded QR
 * URL (fewer chars → fewer QR modules → easier to tattoo). On that host:
 *
 *   inky.id/<id>  →  rewritten to /u/<id>  (profile renders, short URL stays)
 *   inky.id/      →  redirected to the main site
 *
 * Unset → no-op, main domain routes normally. Gating on the host is what stops
 * the main domain's own 8-char paths from being treated as profile IDs.
 */
const SHORT_HOST = (process.env.NEXT_PUBLIC_SHORT_BASE_URL || '')
  .replace(/^https?:\/\//, '')
  .replace(/\/.*$/, '')
  .toLowerCase();

const MAIN_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://inkyidentity.com';

// display_id is exactly 8 chars from generateId()'s alphabet.
const ID_RE = /^\/([0-9A-Za-z]{8})\/?$/;

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Short-link domain: serve profiles from a bare /<id> ──
  if (SHORT_HOST) {
    const host = (req.headers.get('host') || '').split(':')[0].toLowerCase();
    if (host === SHORT_HOST) {
      const match = pathname.match(ID_RE);
      if (match) {
        const url = req.nextUrl.clone();
        url.pathname = `/u/${match[1]}`;
        return NextResponse.rewrite(url);
      }
      if (pathname === '/') return NextResponse.redirect(MAIN_URL);
      return NextResponse.next();
    }
  }

  // ── Auth gate for protected routes (main domain) ──
  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  if (isProtected) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except API routes and static assets, so the short-link
  // host can be matched at the root and at /<id> (the auth gate above still only
  // fires for the PROTECTED prefixes).
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
