import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getSession } from '@/lib/auth';

const VALID_PRODUCT_TYPES = ['tattoo', 'cap', 'tshirt'];

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const orders = db.prepare(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
  ).all(session.userId);

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { product_type, size, variant, quantity, address_line1, address_line2, city, postcode, country } = await req.json();

  if (!product_type || !VALID_PRODUCT_TYPES.includes(product_type)) {
    return NextResponse.json({ error: 'Invalid product type' }, { status: 400 });
  }
  if (!size || !address_line1 || !city || !postcode || !country) {
    return NextResponse.json({ error: 'Please fill all required fields' }, { status: 400 });
  }

  const db = getDb();
  const result = db.prepare(`
    INSERT INTO orders (user_id, product_type, size, variant, quantity, address_line1, address_line2, city, postcode, country)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    session.userId, product_type, size, variant || '', quantity || 1,
    address_line1, address_line2 || '', city, postcode, country
  );

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);
  return NextResponse.json({ order });
}
