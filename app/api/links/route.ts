import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const links = db.prepare(
    'SELECT * FROM links WHERE user_id = ? ORDER BY position ASC, id ASC'
  ).all(session.userId);

  return NextResponse.json({ links });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, url, icon } = await req.json();
  if (!title || !url) return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });

  try { new URL(url); } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const db = getDb();
  const maxPos = db.prepare('SELECT MAX(position) as m FROM links WHERE user_id = ?').get(session.userId) as { m: number | null };
  const position = (maxPos.m ?? -1) + 1;

  const result = db.prepare(
    'INSERT INTO links (user_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?)'
  ).run(session.userId, title, url, icon || '', position);

  const link = db.prepare('SELECT * FROM links WHERE id = ?').get(result.lastInsertRowid);
  return NextResponse.json({ link });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, title, url, icon, active, position } = await req.json();
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const db = getDb();
  const existing = db.prepare('SELECT * FROM links WHERE id = ? AND user_id = ?').get(id, session.userId);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  db.prepare(`
    UPDATE links SET
      title    = COALESCE(?, title),
      url      = COALESCE(?, url),
      icon     = COALESCE(?, icon),
      active   = COALESCE(?, active),
      position = COALESCE(?, position)
    WHERE id = ? AND user_id = ?
  `).run(title ?? null, url ?? null, icon ?? null, active ?? null, position ?? null, id, session.userId);

  const link = db.prepare('SELECT * FROM links WHERE id = ?').get(id);
  return NextResponse.json({ link });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const db = getDb();
  db.prepare('DELETE FROM links WHERE id = ? AND user_id = ?').run(id, session.userId);
  return NextResponse.json({ success: true });
}
