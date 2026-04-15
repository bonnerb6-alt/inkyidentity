import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import getDb from '@/lib/db';
import AdminClient from './AdminClient';

export const metadata = { title: 'Admin — InkyIdentity' };

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const db = getDb();
  const me = db.prepare('SELECT is_admin FROM users WHERE id = ?').get(session.userId) as { is_admin: number } | undefined;
  if (!me?.is_admin) redirect('/dashboard');

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
  `).all() as AdminUser[];

  const orders = db.prepare(`
    SELECT o.*, u.username, u.email
    FROM orders o
    JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC
  `).all() as AdminOrder[];

  const stats = {
    users: users.length,
    orders: orders.length,
    activeLinks: db.prepare('SELECT COUNT(*) as n FROM links WHERE active = 1').get() as { n: number },
    pendingOrders: orders.filter(o => o.status === 'pending').length,
  };

  return <AdminClient
    initialUsers={users}
    initialOrders={orders}
    stats={stats}
    currentUserId={session.userId}
  />;
}

export interface AdminUser {
  id: string; display_id: string; username: string; email: string;
  bio: string; whatsapp_number: string; whatsapp_enabled: number;
  is_admin: number; created_at: number;
  link_count: number; order_count: number;
}

export interface AdminOrder {
  id: number; user_id: string; username: string; email: string;
  product_type: string; size: string; variant: string; quantity: number;
  address_line1: string; address_line2: string; city: string;
  postcode: string; country: string; status: string; created_at: number;
}
