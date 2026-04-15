import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import getDb from '@/lib/db';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const db = getDb();
  const user = db.prepare(
    'SELECT id, display_id, username, email, bio, avatar_url, theme, whatsapp_number, whatsapp_enabled FROM users WHERE id = ?'
  ).get(session.userId) as {
    id: string; display_id: string; username: string; email: string;
    bio: string; avatar_url: string; theme: string;
    whatsapp_number: string; whatsapp_enabled: number;
  };

  const links = db.prepare(
    'SELECT * FROM links WHERE user_id = ? ORDER BY position ASC, id ASC'
  ).all(session.userId) as {
    id: number; title: string; url: string; icon: string; active: number; position: number;
  }[];

  const orders = db.prepare(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 5'
  ).all(session.userId) as {
    id: number; size: string; quantity: number; status: string; created_at: number;
  }[];

  return <DashboardClient user={user} initialLinks={links} orders={orders} />;
}
