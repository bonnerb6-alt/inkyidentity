import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try { await requireAdmin(); } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error';
    return NextResponse.json({ error: msg }, { status: msg === 'unauthenticated' ? 401 : 403 });
  }

  const db = getDb();
  const orders = db.prepare(`
    SELECT o.*, u.username, u.email
    FROM orders o
    JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC
  `).all();

  return NextResponse.json({ orders });
}

export async function PATCH(req: NextRequest) {
  try { await requireAdmin(); } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error';
    return NextResponse.json({ error: msg }, { status: msg === 'unauthenticated' ? 401 : 403 });
  }

  const { orderId, status } = await req.json();
  const VALID = ['pending','processing','shipped','delivered','cancelled'];
  if (!orderId || !VALID.includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const db = getDb();
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);
  const order = db.prepare('SELECT o.*, u.username, u.email FROM orders o JOIN users u ON u.id = o.user_id WHERE o.id = ?').get(orderId);
  return NextResponse.json({ order });
}
