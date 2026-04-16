/**
 * Prodigi Print-on-Demand API
 * Docs: https://www.prodigi.com/print-api/docs/
 *
 * SKU reference (verify in your Prodigi dashboard before going live):
 *   T-shirts : GLOBAL-FAT-001  (Gildan Heavy Cotton, print on back)
 *   Caps     : GLOBAL-HATS-001 (5-panel cap, embroidered front)
 *   Stickers : GLOBAL-STK-001  (die-cut sticker sheet)
 *
 * For QR tattoo stickers, check Prodigi's catalogue — if they don't carry
 * temporary-tattoo-paper products you may need a specialist supplier such as
 * Tattly or CustomInk and call their API separately.
 */

const BASE_URL =
  process.env.PRODIGI_ENV === 'sandbox'
    ? 'https://api.sandbox.prodigi.com/v4.0'
    : 'https://api.prodigi.com/v4.0';

const API_KEY = process.env.PRODIGI_API_KEY ?? '';

// ─── SKU resolution ───────────────────────────────────────────────────────────

interface ProductSpec {
  sku: string;
  printLocation: string;
  copies: number;
}

function resolveSpec(productType: string, size: string): ProductSpec {
  const getDb = require('./db').default as () => import('better-sqlite3').Database;
  const db = getDb();

  // Option-level SKU overrides the product-level SKU (useful for size-specific tattoo SKUs)
  const optRow = db.prepare(
    'SELECT prodigi_sku FROM product_options WHERE product_id = ? AND id = ?'
  ).get(productType, size) as { prodigi_sku: string } | undefined;

  const prodRow = db.prepare(
    'SELECT prodigi_sku, prodigi_print_location FROM products WHERE id = ?'
  ).get(productType) as { prodigi_sku: string; prodigi_print_location: string } | undefined;

  const sku = optRow?.prodigi_sku || prodRow?.prodigi_sku || '';
  const printLocation = prodRow?.prodigi_print_location || 'default';

  if (!sku) throw new Error(`No Prodigi SKU configured for product "${productType}"`);
  return { sku, printLocation, copies: 1 };
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProdigiRecipient {
  name: string;
  address: {
    line1: string;
    line2?: string;
    postalOrZipCode: string;
    countryCode: string;
    townOrCity: string;
  };
}

export interface ProdigiOrderInput {
  merchantReference: string;   // your internal order ID
  productType: string;         // tattoo | tshirt | cap
  size: string;
  colour: string;
  quantity: number;
  qrCodeUrl: string;           // publicly accessible URL to the QR PNG
  recipient: ProdigiRecipient;
}

// ─── API call ────────────────────────────────────────────────────────────────

export async function submitToProdigiAsync(input: ProdigiOrderInput): Promise<{ orderId: string }> {
  const spec = resolveSpec(input.productType, input.size);

  const body = {
    merchantReference: input.merchantReference,
    shippingMethod: 'Budget',
    recipient: input.recipient,
    items: [
      {
        merchantReference: `item-${input.merchantReference}`,
        sku: spec.sku,
        copies: input.quantity,
        sizing: 'fillPrintArea',
        attributes: {
          // Pass colour as an attribute — Prodigi uses these for variant selection
          ...(input.colour ? { color: input.colour } : {}),
          ...(input.size && input.productType !== 'tattoo' ? { size: input.size } : {}),
        },
        assets: [
          {
            printArea: spec.printLocation,
            url: input.qrCodeUrl,
          },
        ],
      },
    ],
  };

  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Prodigi API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  // Prodigi returns { outcome: 'Created', order: { id: '...' } }
  return { orderId: data.order?.id ?? '' };
}
