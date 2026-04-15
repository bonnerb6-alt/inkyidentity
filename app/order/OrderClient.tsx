'use client';
import { useState } from 'react';
import Link from 'next/link';

// ─── Product catalogue ────────────────────────────────────────────────────────

const PRODUCTS = {
  tattoo: {
    id: 'tattoo',
    name: 'QR Tattoo Sticker',
    tagline: 'Permanent ink. Dynamic profile.',
    icon: (
      <svg viewBox="0 0 40 40" width="36" height="36">
        <rect x="2" y="2" width="12" height="12" rx="1.5" fill="currentColor" />
        <rect x="4" y="4" width="8" height="8" rx="0.5" fill="#111" />
        <rect x="5.5" y="5.5" width="5" height="5" rx="0.5" fill="currentColor" />
        <rect x="26" y="2" width="12" height="12" rx="1.5" fill="currentColor" />
        <rect x="28" y="4" width="8" height="8" rx="0.5" fill="#111" />
        <rect x="29.5" y="5.5" width="5" height="5" rx="0.5" fill="currentColor" />
        <rect x="2" y="26" width="12" height="12" rx="1.5" fill="currentColor" />
        <rect x="4" y="28" width="8" height="8" rx="0.5" fill="#111" />
        <rect x="5.5" y="29.5" width="5" height="5" rx="0.5" fill="currentColor" />
        <rect x="16" y="2" width="3" height="3" fill="currentColor" />
        <rect x="21" y="5" width="3" height="3" fill="currentColor" />
        <rect x="16" y="9" width="3" height="3" fill="currentColor" />
        <rect x="21" y="16" width="3" height="3" fill="currentColor" />
        <rect x="16" y="21" width="3" height="3" fill="currentColor" />
        <rect x="26" y="16" width="3" height="3" fill="currentColor" />
        <rect x="21" y="26" width="3" height="3" fill="currentColor" />
        <rect x="16" y="29" width="3" height="3" fill="currentColor" />
        <rect x="29" y="21" width="3" height="3" fill="currentColor" />
      </svg>
    ),
    options: [
      { id: '5x5cm',   label: '5 × 5 cm',   detail: 'Wrist / ankle',        price: 12 },
      { id: '8x8cm',   label: '8 × 8 cm',   detail: 'Forearm / shoulder',   price: 16 },
      { id: '12x12cm', label: '12 × 12 cm', detail: 'Back / chest',         price: 22 },
    ],
    optionLabel: 'Size',
    hasColour: false,
    colours: [],
  },
  mug: {
    id: 'mug',
    name: 'Ceramic Mug',
    tagline: 'QR printed on an 11oz ceramic mug.',
    icon: (
      <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
        <rect x="6" y="10" width="22" height="22" rx="3" fill="currentColor" />
        <path d="M28 16 Q36 16 36 22 Q36 28 28 28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="10" y="14" width="10" height="10" rx="1" fill="#111" opacity="0.3" />
        <rect x="11.5" y="15.5" width="7" height="7" rx="0.5" fill="currentColor" opacity="0.35" />
        <rect x="6" y="32" width="22" height="2.5" rx="1.25" fill="currentColor" opacity="0.5" />
      </svg>
    ),
    options: [
      { id: 'one-size', label: '11oz Mug', detail: 'Standard ceramic, dishwasher safe', price: 18 },
    ],
    optionLabel: 'Size',
    hasColour: false,
    colours: [],
  },
  tshirt: {
    id: 'tshirt',
    name: 'T-Shirt',
    tagline: 'QR printed on the left chest.',
    icon: (
      <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
        <path d="M14 6 L6 12 L10 16 L10 34 L30 34 L30 16 L34 12 L26 6 C26 6 24 10 20 10 C16 10 14 6 14 6Z" fill="currentColor" />
        <path d="M14 6 L6 12 L10 16 L10 12 Z" fill="currentColor" opacity="0.6" />
        <path d="M26 6 L34 12 L30 16 L30 12 Z" fill="currentColor" opacity="0.6" />
        <rect x="15" y="18" width="10" height="10" rx="1" fill="#111" opacity="0.25" />
        <rect x="16.5" y="19.5" width="7" height="7" rx="0.5" fill="currentColor" opacity="0.3" />
      </svg>
    ),
    options: [
      { id: 'XS', label: 'XS', detail: 'Chest 32–34"',  price: 24 },
      { id: 'S',  label: 'S',  detail: 'Chest 35–37"',  price: 24 },
      { id: 'M',  label: 'M',  detail: 'Chest 38–40"',  price: 24 },
      { id: 'L',  label: 'L',  detail: 'Chest 41–43"',  price: 24 },
      { id: 'XL', label: 'XL', detail: 'Chest 44–46"',  price: 24 },
      { id: 'XXL',label: 'XXL',detail: 'Chest 47–49"',  price: 26 },
    ],
    optionLabel: 'Size',
    hasColour: true,
    colours: [
      { id: 'black', label: 'Black', hex: '#111111' },
      { id: 'white', label: 'White', hex: '#f9fafb' },
      { id: 'navy',  label: 'Navy',  hex: '#1e3a5f' },
      { id: 'grey',  label: 'Grey',  hex: '#6b7280' },
    ],
  },
} as const;

type ProductId = keyof typeof PRODUCTS;

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrderClient({ displayId }: { displayId: string }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [productId, setProductId] = useState<ProductId>('tattoo');
  const [size, setSize] = useState('');
  const [colour, setColour] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [addr, setAddr] = useState({ line1: '', line2: '', city: '', postcode: '', country: 'GB' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const product = PRODUCTS[productId];
  const selectedOption = product.options.find(o => o.id === size) ?? product.options[0];
  const unitPrice = selectedOption.price;
  const total = unitPrice * parseInt(quantity || '1');

  async function submitOrder() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_type: productId,
          size: size || product.options[0].id,
          variant: colour,
          quantity: parseInt(quantity),
          address_line1: addr.line1,
          address_line2: addr.line2,
          city: addr.city,
          postcode: addr.postcode,
          country: addr.country,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  function pickProduct(id: ProductId) {
    setProductId(id);
    setSize(PRODUCTS[id].options[0].id);
    setColour(PRODUCTS[id].hasColour ? PRODUCTS[id].colours[0].id : '');
  }

  // ── shared styles
  const card = (active: boolean): React.CSSProperties => ({
    background: active ? 'rgba(124, 58, 237, 0.08)' : '#111',
    border: `2px solid ${active ? '#7c3aed' : '#1f1f1f'}`,
    borderRadius: '12px', cursor: 'pointer', transition: 'all 0.15s', color: '#f9fafb',
  });

  const stepDot = (n: number) => ({
    width: '28px', height: '28px', borderRadius: '50%',
    background: step >= n ? '#7c3aed' : '#1f1f1f',
    border: `2px solid ${step >= n ? '#7c3aed' : '#2a2a2a'}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.8rem', fontWeight: 700, color: step >= n ? 'white' : '#4b5563',
  } as React.CSSProperties);

  const STEPS = ['Product', 'Options', 'Delivery'];

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#f9fafb' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid #1f1f1f', padding: '0 24px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(8,8,8,0.95)',
      }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', color: '#6b7280', fontSize: '0.875rem' }}>
          ← Back to dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '7px',
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '14px', color: 'white',
          }}>I</div>
          <span style={{ fontWeight: 700 }}>InkyIdentity</span>
        </div>
      </header>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Step indicator */}
        {step < 4 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '40px' }}>
            {STEPS.map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={stepDot(i + 1)}>{i + 1}</div>
                <span style={{ fontSize: '0.8rem', color: step >= i + 1 ? '#f9fafb' : '#4b5563' }}>{label}</span>
                {i < STEPS.length - 1 && (
                  <div style={{ width: '24px', height: '1px', background: step > i + 1 ? '#7c3aed' : '#2a2a2a', margin: '0 4px' }} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 1: Choose product ── */}
        {step === 1 && (
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
              What would you like?
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
              Your QR code is printed on every product — scan it and it links straight to your profile.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {(Object.values(PRODUCTS) as typeof PRODUCTS[ProductId][]).map(p => (
                <button
                  key={p.id}
                  onClick={() => pickProduct(p.id as ProductId)}
                  style={{
                    ...card(productId === p.id),
                    padding: '20px 24px',
                    display: 'flex', alignItems: 'center', gap: '20px', textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '12px', flexShrink: 0,
                    background: productId === p.id ? 'rgba(124, 58, 237, 0.15)' : '#1a1a1a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: productId === p.id ? '#a78bfa' : '#6b7280',
                    transition: 'all 0.15s',
                  }}>
                    {p.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{p.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{p.tagline}</div>
                  </div>
                  <div style={{
                    fontSize: '1.1rem', fontWeight: 700,
                    color: productId === p.id ? '#a78bfa' : '#6b7280',
                  }}>
                    from £{Math.min(...p.options.map(o => o.price))}
                  </div>
                </button>
              ))}
            </div>

            <button
              className="btn-primary"
              onClick={() => setStep(2)}
              style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px' }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* ── STEP 2: Options (size + colour) ── */}
        {step === 2 && (
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
              {product.name}
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '28px' }}>{product.tagline}</p>

            {/* Size */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.875rem', fontWeight: 600, color: '#d1d5db' }}>
                {product.optionLabel}
              </label>
              {productId === 'tshirt' && product.options.length > 2 ? (
                // T-shirt: pill grid
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {product.options.map(o => (
                    <button
                      key={o.id}
                      onClick={() => setSize(o.id)}
                      style={{
                        padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                        background: size === o.id ? 'rgba(124, 58, 237, 0.15)' : '#111',
                        border: `2px solid ${size === o.id ? '#7c3aed' : '#1f1f1f'}`,
                        color: '#f9fafb', fontWeight: 600, fontSize: '0.9rem',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div>{o.label}</div>
                      <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>{o.detail}</div>
                    </button>
                  ))}
                </div>
              ) : (
                // Tattoo / cap: vertical cards
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {product.options.map(o => (
                    <button
                      key={o.id}
                      onClick={() => setSize(o.id)}
                      style={{
                        ...card(size === o.id),
                        padding: '14px 20px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{o.label}</div>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{o.detail}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: size === o.id ? '#a78bfa' : '#6b7280' }}>£{o.price}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Colour picker */}
            {product.hasColour && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.875rem', fontWeight: 600, color: '#d1d5db' }}>
                  Colour
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {product.colours.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setColour(c.id)}
                      title={c.label}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 14px', borderRadius: '8px', cursor: 'pointer',
                        background: colour === c.id ? 'rgba(124, 58, 237, 0.12)' : '#111',
                        border: `2px solid ${colour === c.id ? '#7c3aed' : '#1f1f1f'}`,
                        color: '#f9fafb', fontSize: '0.85rem', fontWeight: 500,
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: c.hex,
                        border: c.hex === '#f9fafb' ? '1px solid #3a3a3a' : 'none',
                        flexShrink: 0,
                      }} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#d1d5db' }}>
                Quantity
              </label>
              <select
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                style={{ maxWidth: '160px' }}
              >
                {[1,2,3,5,10].map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>

            {/* Summary pill */}
            <div style={{
              background: '#111', border: '1px solid #1f1f1f', borderRadius: '10px',
              padding: '14px 20px', marginBottom: '24px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                {product.name}
                {size ? ` — ${size}` : ''}
                {colour ? ` / ${product.hasColour ? product.colours.find(c => c.id === colour)?.label : ''}` : ''}
                {` × ${quantity}`}
              </span>
              <span style={{ fontWeight: 700, color: '#a78bfa' }}>£{total.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button
                className="btn-primary"
                onClick={() => setStep(3)}
                disabled={!size || (product.hasColour && !colour)}
                style={{ flex: 1, justifyContent: 'center', fontSize: '1rem', padding: '14px' }}
              >
                Continue to delivery →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Delivery ── */}
        {step === 3 && (
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
              Delivery address
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
              We ship worldwide. Orders dispatch within 2–3 business days.
            </p>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px', padding: '12px 16px', color: '#f87171',
                marginBottom: '20px', fontSize: '0.875rem',
              }}>{error}</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db' }}>Address line 1 *</label>
                <input placeholder="123 High Street" value={addr.line1} onChange={e => setAddr(a => ({ ...a, line1: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db' }}>Address line 2</label>
                <input placeholder="Flat 4 (optional)" value={addr.line2} onChange={e => setAddr(a => ({ ...a, line2: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db' }}>City *</label>
                  <input placeholder="London" value={addr.city} onChange={e => setAddr(a => ({ ...a, city: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db' }}>Postcode *</label>
                  <input placeholder="EC1A 1BB" value={addr.postcode} onChange={e => setAddr(a => ({ ...a, postcode: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db' }}>Country *</label>
                <select value={addr.country} onChange={e => setAddr(a => ({ ...a, country: e.target.value }))}>
                  {[
                    ['GB','United Kingdom'],['US','United States'],['AU','Australia'],
                    ['CA','Canada'],['DE','Germany'],['FR','France'],['NL','Netherlands'],
                    ['SE','Sweden'],['NO','Norway'],['DK','Denmark'],['IE','Ireland'],
                    ['NZ','New Zealand'],['ZA','South Africa'],['ES','Spain'],['IT','Italy'],
                    ['PL','Poland'],['PT','Portugal'],['BE','Belgium'],['CH','Switzerland'],
                  ].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Order summary */}
            <div style={{
              background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px',
              padding: '20px', marginBottom: '24px',
            }}>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Order summary
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '8px', background: '#1a1a1a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#a78bfa', flexShrink: 0,
                }}>
                  {product.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{product.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    {size}
                    {colour && product.hasColour && ` · ${product.colours.find(c => c.id === colour)?.label}`}
                    {` · qty ${quantity}`}
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: '#f9fafb' }}>£{unitPrice.toFixed(2)}</div>
              </div>
              <div style={{ borderTop: '1px solid #1f1f1f', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: '#a78bfa' }}>£{total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
              <button
                className="btn-primary"
                onClick={submitOrder}
                disabled={loading || !addr.line1 || !addr.city || !addr.postcode}
                style={{ flex: 1, justifyContent: 'center', fontSize: '1rem', padding: '14px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Placing order…' : 'Place order →'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Confirmation ── */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)', border: '2px solid rgba(16, 185, 129, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', fontSize: '2rem',
            }}>✓</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Order placed!
            </h1>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto 8px' }}>
              Your <strong style={{ color: '#f9fafb' }}>{product.name}</strong> is being prepared.
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '32px' }}>
              Dispatches within 2–3 business days. We&apos;ll email you a tracking link.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/dashboard?tab=orders" className="btn-primary" style={{ textDecoration: 'none' }}>
                View my orders
              </Link>
              <button
                className="btn-secondary"
                onClick={() => { setStep(1); setSize(''); setColour(''); setQuantity('1'); }}
              >
                Order another
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
