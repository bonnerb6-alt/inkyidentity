import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import getDb from '@/lib/db';
import OrderClient from './OrderClient';
import type { ClientProduct } from './OrderClient';

export default async function OrderPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const db = getDb();
  const rawProducts = db.prepare(
    'SELECT * FROM products WHERE enabled = 1 ORDER BY sort_order ASC, id ASC'
  ).all() as {
    id: string; name: string; tagline: string; icon_type: string;
    option_label: string; has_colour: number;
    prodigi_sku: string; prodigi_print_location: string;
    enabled: number; sort_order: number;
  }[];

  const rawOptions = db.prepare(
    'SELECT * FROM product_options ORDER BY sort_order ASC'
  ).all() as {
    id: string; product_id: string; label: string;
    detail: string; price_pence: number; sort_order: number;
  }[];

  const rawColours = db.prepare(
    'SELECT * FROM product_colours'
  ).all() as {
    id: string; product_id: string; label: string; hex: string;
  }[];

  const products: ClientProduct[] = rawProducts.map(p => ({
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    icon_type: p.icon_type,
    option_label: p.option_label,
    has_colour: !!p.has_colour,
    options: rawOptions
      .filter(o => o.product_id === p.id)
      .map(o => ({ id: o.id, label: o.label, detail: o.detail, price: o.price_pence / 100 })),
    colours: rawColours
      .filter(c => c.product_id === p.id)
      .map(c => ({ id: c.id, label: c.label, hex: c.hex })),
  }));

  return <OrderClient displayId={session.displayId} products={products} />;
}
