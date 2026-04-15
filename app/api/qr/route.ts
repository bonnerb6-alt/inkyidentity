import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getQRDataUrl } from '@/lib/qr';
import { headers } from 'next/headers';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const proto = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${proto}://${host}`;

  const dataUrl = await getQRDataUrl(session.displayId, baseUrl);
  return NextResponse.json({ dataUrl, profileUrl: `${baseUrl}/u/${session.displayId}` });
}
