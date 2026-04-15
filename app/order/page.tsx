import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import OrderClient from './OrderClient';

export default async function OrderPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');
  return <OrderClient displayId={session.displayId} />;
}
