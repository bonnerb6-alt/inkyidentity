import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

function forbidden() { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }

// GET — list all products with their options and colours
export async function GET() {
  try { await requireAdmin(); } catch { return forbidden(); }
  const db = getDb();
  const products = db.prepare('SELECT * FROM products ORDER BY sort_order ASC, id ASC').all();
  const options  = db.prepare('SELECT * FROM product_options ORDER BY sort_order ASC').all();
  const colours  = db.prepare('SELECT * FROM product_colours').all();
  return NextResponse.json({ products, options, colours });
}

// POST — create a new product or add a new option
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }
  const db = getDb();
  const body = await req.json();

  if (body.type === 'product') {
    const { id, name, tagline, icon_type, option_label, has_colour, prodigi_sku, prodigi_print_location } = body;
    if (!id || !name) return NextResponse.json({ error: 'id and name are required' }, { status: 400 });
    if (!/^[a-z0-9_-]+$/.test(id)) return NextResponse.json({ error: 'id must be lowercase letters, numbers, hyphens or underscores' }, { status: 400 });
    if (db.prepare('SELECT id FROM products WHERE id = ?').get(id)) return NextResponse.json({ error: 'Product ID already exists' }, { status: 409 });
    const { n } = db.prepare('SELECT COUNT(*) as n FROM products').get() as { n: number };
    db.prepare(
      'INSERT INTO products (id,name,tagline,icon_type,option_label,has_colour,prodigi_sku,prodigi_print_location,enabled,sort_order) VALUES (?,?,?,?,?,?,?,?,1,?)'
    ).run(id, name, tagline || '', icon_type || '◎', option_label || 'Size', has_colour ? 1 : 0, prodigi_sku || '', prodigi_print_location || 'default', n);
    return NextResponse.json({ ok: true });
  }

  if (body.type === 'option') {
    const { id, product_id, label, detail, price_pence, prodigi_sku } = body;
    if (!id || !product_id || !label || price_pence == null) return NextResponse.json({ error: 'id, product_id, label and price_pence are required' }, { status: 400 });
    if (!/^[a-zA-Z0-9_.-]+$/.test(id)) return NextResponse.json({ error: 'option id must be alphanumeric, hyphens, dots or underscores' }, { status: 400 });
    if (db.prepare('SELECT id FROM product_options WHERE id = ? AND product_id = ?').get(id, product_id)) return NextResponse.json({ error: 'Option ID already exists for this product' }, { status: 409 });
    const { n } = db.prepare('SELECT COUNT(*) as n FROM product_options WHERE product_id = ?').get(product_id) as { n: number };
    db.prepare(
      'INSERT INTO product_options (id,product_id,label,detail,price_pence,prodigi_sku,sort_order) VALUES (?,?,?,?,?,?,?)'
    ).run(id, product_id, label, detail || '', Math.round(Number(price_pence)), prodigi_sku || '', n);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}

// PATCH — update a product or option
export async function PATCH(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }
  const db = getDb();
  const body = await req.json();

  if (body.type === 'option') {
    const { id, product_id, label, detail, price_pence, prodigi_sku } = body;
    db.prepare('UPDATE product_options SET label=?, detail=?, price_pence=?, prodigi_sku=? WHERE id=? AND product_id=?')
      .run(label, detail || '', Math.round(Number(price_pence)), prodigi_sku || '', id, product_id);
    return NextResponse.json({ ok: true });
  }

  if (body.type === 'product') {
    const { id, name, tagline, option_label, has_colour, prodigi_sku, prodigi_print_location, enabled } = body;
    db.prepare('UPDATE products SET name=?,tagline=?,option_label=?,has_colour=?,prodigi_sku=?,prodigi_print_location=?,enabled=? WHERE id=?')
      .run(name, tagline || '', option_label || 'Size', has_colour ? 1 : 0, prodigi_sku || '', prodigi_print_location || 'default', enabled ? 1 : 0, id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}

// DELETE — remove an option or an entire product
export async function DELETE(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }
  const db = getDb();
  const body = await req.json();

  if (body.type === 'option') {
    db.prepare('DELETE FROM product_options WHERE id=? AND product_id=?').run(body.id, body.product_id);
    return NextResponse.json({ ok: true });
  }

  if (body.type === 'product') {
    const { n } = db.prepare('SELECT COUNT(*) as n FROM orders WHERE product_type=?').get(body.id) as { n: number };
    if (n > 0) return NextResponse.json({ error: `Cannot delete — this product has ${n} existing orders` }, { status: 409 });
    db.prepare('DELETE FROM products WHERE id=?').run(body.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}
