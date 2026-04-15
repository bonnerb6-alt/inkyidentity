import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import getDb from '@/lib/db';
import { submitToProdigiAsync } from '@/lib/prodigi';
import { headers } from 'next/headers';

// Must disable body parsing — Stripe needs the raw body to verify signature
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Webhook error';
    console.error('Stripe webhook signature failed:', msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    const userId  = session.metadata?.userId;
    const displayId = session.metadata?.displayId;

    if (!orderId || !userId) {
      console.error('Webhook: missing metadata', session.metadata);
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    const db = getDb();
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(Number(orderId)) as {
      id: number; product_type: string; size: string; variant: string; quantity: number;
      address_line1: string; address_line2: string; city: string; postcode: string; country: string;
      status: string;
    } | undefined;

    if (!order) {
      console.error('Webhook: order not found', orderId);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Mark as paid
    db.prepare("UPDATE orders SET status = 'paid' WHERE id = ?").run(Number(orderId));

    // Build the public QR code URL — Prodigi needs to fetch the image
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';
    const qrCodeUrl = `${baseUrl}/api/qr/image/${displayId}`;

    // Get shipping address — prefer Stripe's collected address if available
    const stripeAddr = session.shipping_details?.address;
    const recipient = {
      name: session.shipping_details?.name || session.customer_details?.name || 'Customer',
      address: {
        line1:           stripeAddr?.line1        || order.address_line1,
        line2:           stripeAddr?.line2        || order.address_line2 || undefined,
        postalOrZipCode: stripeAddr?.postal_code  || order.postcode,
        countryCode:     stripeAddr?.country      || order.country,
        townOrCity:      stripeAddr?.city         || order.city,
      },
    };

    try {
      const { orderId: prodigiOrderId } = await submitToProdigiAsync({
        merchantReference: `inky-${orderId}`,
        productType: order.product_type,
        size: order.size,
        colour: order.variant,
        quantity: order.quantity,
        qrCodeUrl,
        recipient,
      });

      db.prepare("UPDATE orders SET status = 'processing', prodigi_id = ? WHERE id = ?")
        .run(prodigiOrderId, Number(orderId));

      console.log(`Order ${orderId} submitted to Prodigi as ${prodigiOrderId}`);
    } catch (err) {
      console.error(`Prodigi submission failed for order ${orderId}:`, err);
      // Keep status as 'paid' — admin can retry manually via the admin panel
      db.prepare("UPDATE orders SET status = 'paid' WHERE id = ?").run(Number(orderId));
    }
  }

  return NextResponse.json({ received: true });
}
