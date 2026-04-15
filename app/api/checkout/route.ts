import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import getDb from '@/lib/db';
import { getSession } from '@/lib/auth';

const PRICES: Record<string, number> = {
  // tattoo sizes (pence)
  '5x5cm': 1200, '8x8cm': 1600, '12x12cm': 2200,
  // mug
  'one-size': 1800,
  // t-shirt sizes (XS–XXL)
  'XS': 2400, 'S': 2400, 'M': 2400, 'L': 2400, 'XL': 2400, 'XXL': 2600,
};

const PRODUCT_NAMES: Record<string, string> = {
  tattoo: 'QR Tattoo Sticker',
  mug: 'Ceramic Mug with QR Code',
  tshirt: 'T-Shirt with QR Code',
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { product_type, size, variant, quantity, address_line1, address_line2, city, postcode, country } = await req.json();

  if (!product_type || !size || !address_line1 || !city || !postcode || !country) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const unitPrice = PRICES[size];
  if (!unitPrice) return NextResponse.json({ error: `Unknown size: ${size}` }, { status: 400 });

  const qty = parseInt(quantity) || 1;
  const db = getDb();

  // Save a pending order so we have an ID to reference in Stripe metadata
  const result = db.prepare(`
    INSERT INTO orders (user_id, product_type, size, variant, quantity, address_line1, address_line2, city, postcode, country, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'awaiting_payment')
  `).run(session.userId, product_type, size, variant || '', qty, address_line1, address_line2 || '', city, postcode, country);

  const orderId = result.lastInsertRowid as number;

  const productName = PRODUCT_NAMES[product_type] || 'InkyIdentity Product';
  const variantDesc = variant ? ` — ${size} / ${variant}` : ` — ${size}`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          unit_amount: unitPrice,
          product_data: {
            name: productName,
            description: `QR code${variantDesc} × ${qty}`,
            images: [],
          },
        },
        quantity: qty,
      },
    ],
    metadata: {
      orderId: String(orderId),
      userId: session.userId,
      displayId: session.displayId,
    },
    customer_email: session.email,
    success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/order?cancelled=1`,
    shipping_address_collection: { allowed_countries: ['GB','US','AU','CA','DE','FR','NL','SE','NO','DK','IE','NZ','ZA','ES','IT','PL','PT','BE','CH'] },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
