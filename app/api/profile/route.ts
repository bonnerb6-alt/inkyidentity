import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getSession } from '@/lib/auth';

const SELECT = 'SELECT id, display_id, username, email, bio, avatar_url, theme, whatsapp_number, whatsapp_enabled, created_at FROM users WHERE id = ?';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const user = db.prepare(SELECT).get(session.userId);
  return NextResponse.json({ user });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { bio, avatar_url, theme, username, whatsapp_number, whatsapp_enabled } = await req.json();

  if (username) {
    if (username.length < 3 || username.length > 30) {
      return NextResponse.json({ error: 'Username must be 3–30 characters' }, { status: 400 });
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return NextResponse.json({ error: 'Invalid username format' }, { status: 400 });
    }
    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username.toLowerCase(), session.userId);
    if (existing) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }
  }

  if (whatsapp_number !== undefined && whatsapp_number !== '') {
    const clean = whatsapp_number.replace(/[\s\-().]/g, '');
    if (!/^\+?[1-9]\d{6,14}$/.test(clean)) {
      return NextResponse.json({ error: 'Invalid WhatsApp number. Include country code, e.g. +447911123456' }, { status: 400 });
    }
  }

  const db = getDb();
  db.prepare(`
    UPDATE users SET
      bio              = COALESCE(?, bio),
      avatar_url       = COALESCE(?, avatar_url),
      theme            = COALESCE(?, theme),
      username         = COALESCE(?, username),
      whatsapp_number  = COALESCE(?, whatsapp_number),
      whatsapp_enabled = COALESCE(?, whatsapp_enabled)
    WHERE id = ?
  `).run(
    bio ?? null,
    avatar_url ?? null,
    theme ?? null,
    username ? username.toLowerCase() : null,
    whatsapp_number !== undefined ? whatsapp_number.replace(/[\s\-().]/g, '') : null,
    whatsapp_enabled !== undefined ? (whatsapp_enabled ? 1 : 0) : null,
    session.userId,
  );

  const user = db.prepare(SELECT).get(session.userId);
  return NextResponse.json({ user });
}
