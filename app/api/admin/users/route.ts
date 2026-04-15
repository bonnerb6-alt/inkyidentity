import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try { await requireAdmin(); } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error';
    return NextResponse.json({ error: msg }, { status: msg === 'unauthenticated' ? 401 : 403 });
  }

  const db = getDb();
  const users = db.prepare(`
    SELECT
      u.id, u.display_id, u.username, u.email,
      u.bio, u.whatsapp_number, u.whatsapp_enabled, u.is_admin,
      u.created_at,
      COUNT(DISTINCT l.id)  AS link_count,
      COUNT(DISTINCT o.id)  AS order_count
    FROM users u
    LEFT JOIN links  l ON l.user_id = u.id
    LEFT JOIN orders o ON o.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `).all();

  return NextResponse.json({ users });
}

export async function PATCH(req: NextRequest) {
  try { await requireAdmin(); } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error';
    return NextResponse.json({ error: msg }, { status: msg === 'unauthenticated' ? 401 : 403 });
  }

  const { userId, is_admin } = await req.json();
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const db = getDb();
  db.prepare('UPDATE users SET is_admin = ? WHERE id = ?').run(is_admin ? 1 : 0, userId);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  try { await requireAdmin(); } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error';
    return NextResponse.json({ error: msg }, { status: msg === 'unauthenticated' ? 401 : 403 });
  }

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const db = getDb();
  // prevent deleting yourself — checked client-side too but belt-and-braces
  const session = (await import('@/lib/auth')).getSession();
  const s = await session;
  if (s?.userId === userId) return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });

  db.prepare('DELETE FROM users WHERE id = ?').run(userId);
  return NextResponse.json({ success: true });
}
