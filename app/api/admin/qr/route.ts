import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { clearQRCache, generateQRSvg } from '@/lib/qr';

/**
 * Regenerate cached QR codes with the latest generation settings.
 *   POST { displayId }  → regenerate one user's QR
 *   POST { all: true }  → regenerate every user's QR
 */
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error';
    return NextResponse.json({ error: msg }, { status: msg === 'unauthenticated' ? 401 : 403 });
  }

  const { displayId, all } = await req.json().catch(() => ({}));

  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const proto = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${proto}://${host}`;

  const db = getDb();

  if (all) {
    clearQRCache();
    const users = db.prepare('SELECT display_id FROM users').all() as { display_id: string }[];
    for (const u of users) {
      await generateQRSvg(u.display_id, baseUrl, true);
    }
    return NextResponse.json({ regenerated: users.length });
  }

  if (!displayId) {
    return NextResponse.json({ error: 'displayId or all required' }, { status: 400 });
  }

  const exists = db.prepare('SELECT 1 FROM users WHERE display_id = ?').get(displayId);
  if (!exists) return NextResponse.json({ error: 'Unknown user' }, { status: 404 });

  clearQRCache(displayId);
  await generateQRSvg(displayId, baseUrl, true);
  return NextResponse.json({ regenerated: 1 });
}
