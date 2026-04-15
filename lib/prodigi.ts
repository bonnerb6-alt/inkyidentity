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

// ─── Product → Prodigi SKU + print position map ──────────────────────────────

interface ProductSpec {
  sku: string;
  printLocation: string;  // Prodigi asset placement key
  copies: number;
}

// Update these SKUs once you've verified them in your Prodigi sandbox catalogue:
// https://dashboard.prodigi.com/products
// Tattoo size → Prodigi SKU
const TATTOO_SKU: Record<string, string> = {
  '5x5cm':   'GLOBAL-TATT-S',   // ~50x75mm
  '8x8cm':   'GLOBAL-TATT-M',   // ~75x100mm
  '12x12cm': 'GLOBAL-TATT-L',   // ~100x150mm
};

const PRODUCT_MAP: Record<string, (size: string, colour: string) => ProductSpec> = {
  tattoo: (size, _colour) => ({
    sku: TATTOO_SKU[size] ?? 'GLOBAL-TATT-M',
    printLocation: 'default',
    copies: 1,
  }),
  tshirt: (_size, _colour) => ({
    sku: 'GLOBAL-TEE-GIL-64000',   // Gildan 64000 Softstyle
    printLocation: 'left_chest',
    copies: 1,
  }),
  mug: (_size, _colour) => ({
    sku: 'GLOBAL-MUG',
    printLocation: 'default',
    copies: 1,
  }),
};

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
  const spec = PRODUCT_MAP[input.productType]?.(input.size, input.colour);
  if (!spec) throw new Error(`Unknown product type: ${input.productType}`);

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
