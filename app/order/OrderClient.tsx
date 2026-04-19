'use client';
import { useState } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ClientProduct {
  id: string;
  name: string;
  tagline: string;
  icon_type: string;   // 'tattoo' | 'mug' | 'tshirt' | arbitrary emoji
  option_label: string;
  has_colour: boolean;
  options: Array<{ id: string; label: string; detail: string; price: number }>;
  colours: Array<{ id: string; label: string; hex: string }>;
}

// ─── Built-in SVG icons ───────────────────────────────────────────────────────

function TattooIcon() {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36">
      <rect x="2" y="2" width="12" height="12" rx="1.5" fill="currentColor" />
      <rect x="4" y="4" width="8" height="8" rx="0.5" fill="var(--ink-1)" />
      <rect x="5.5" y="5.5" width="5" height="5" rx="0.5" fill="currentColor" />
      <rect x="26" y="2" width="12" height="12" rx="1.5" fill="currentColor" />
      <rect x="28" y="4" width="8" height="8" rx="0.5" fill="var(--ink-1)" />
      <rect x="29.5" y="5.5" width="5" height="5" rx="0.5" fill="currentColor" />
      <rect x="2" y="26" width="12" height="12" rx="1.5" fill="currentColor" />
      <rect x="4" y="28" width="8" height="8" rx="0.5" fill="var(--ink-1)" />
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
  );
}

function MugIcon() {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
      <rect x="6" y="10" width="22" height="22" rx="3" fill="currentColor" />
      <path d="M28 16 Q36 16 36 22 Q36 28 28 28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="10" y="14" width="10" height="10" rx="1" fill="var(--ink-1)" opacity="0.3" />
      <rect x="11.5" y="15.5" width="7" height="7" rx="0.5" fill="currentColor" opacity="0.35" />
      <rect x="6" y="32" width="22" height="2.5" rx="1.25" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function TshirtIcon() {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
      <path d="M14 6 L6 12 L10 16 L10 34 L30 34 L30 16 L34 12 L26 6 C26 6 24 10 20 10 C16 10 14 6 14 6Z" fill="currentColor" />
      <path d="M14 6 L6 12 L10 16 L10 12 Z" fill="currentColor" opacity="0.6" />
      <path d="M26 6 L34 12 L30 16 L30 12 Z" fill="currentColor" opacity="0.6" />
      <rect x="15" y="18" width="10" height="10" rx="1" fill="var(--ink-1)" opacity="0.25" />
      <rect x="16.5" y="19.5" width="7" height="7" rx="0.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function ProductIcon({ iconType }: { iconType: string }) {
  if (iconType === 'tattoo') return <TattooIcon />;
  if (iconType === 'mug')    return <MugIcon />;
  if (iconType === 'tshirt') return <TshirtIcon />;
  // Custom product — render emoji / text
  return <span style={{ fontSize: '28px', lineHeight: 1 }}>{iconType}</span>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrderClient({
  displayId,
  products,
}: {
  displayId: string;
  products: ClientProduct[];
}) {
  const [step, setStep]       = useState<1 | 2 | 3 | 4>(1);
  const [productId, setProductId] = useState<string>(products[0]?.id ?? '');
  const [size, setSize]       = useState('');
  const [colour, setColour]   = useState('');
  const [quantity, setQuantity] = useState('1');
  const [addr, setAddr]       = useState({ line1: '', line2: '', city: '', postcode: '', country: 'GB' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const product = products.find(p => p.id === productId) ?? products[0];
  const selectedOption = product?.options.find(o => o.id === size) ?? product?.options[0];
  const unitPrice = selectedOption?.price ?? 0;
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
          size: size || product?.options[0]?.id,
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
      window.location.href = data.url;
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  function pickProduct(id: string) {
    const p = products.find(x => x.id === id)!;
    setProductId(id);
    setSize(p.options[0]?.id ?? '');
    setColour(p.has_colour ? p.colours[0]?.id ?? '' : '');
  }

  const card = (active: boolean): React.CSSProperties => ({
    background: active ? 'var(--carmine-tint)' : 'var(--ink-1)',
    border: `2px solid ${active ? 'var(--carmine)' : 'var(--ink-3)'}`,
    borderRadius: '12px', cursor: 'pointer', transition: 'all 0.15s', color: 'var(--paper)',
  });

  const stepDot = (n: number) => ({
    width: '28px', height: '28px', borderRadius: '50%',
    background: step >= n ? 'var(--carmine)' : 'var(--ink-3)',
    border: `2px solid ${step >= n ? 'var(--carmine)' : 'var(--ink-3)'}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.8rem', fontWeight: 700, color: step >= n ? 'white' : 'var(--paper-4)',
  } as React.CSSProperties);

  const STEPS = ['Product', 'Options', 'Delivery'];

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--ink-0)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--paper-3)' }}>No products are currently available.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-0)', color: 'var(--paper)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--ink-3)', padding: '0 24px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(8,8,8,0.95)',
      }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', color: 'var(--paper-3)', fontSize: '0.875rem' }}>
          ← Back to dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '7px',
            background: 'var(--carmine)',
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
                <span style={{ fontSize: '0.8rem', color: step >= i + 1 ? 'var(--paper)' : 'var(--paper-4)' }}>{label}</span>
                {i < STEPS.length - 1 && (
                  <div style={{ width: '24px', height: '1px', background: step > i + 1 ? 'var(--carmine)' : 'var(--ink-3)', margin: '0 4px' }} />
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
            <p style={{ color: 'var(--paper-3)', marginBottom: '32px' }}>
              Your QR code is printed on every product — scan it and it links straight to your profile.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {products.map(p => (
                <button
                  key={p.id}
                  onClick={() => pickProduct(p.id)}
                  style={{
                    ...card(productId === p.id),
                    padding: '20px 24px',
                    display: 'flex', alignItems: 'center', gap: '20px', textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '12px', flexShrink: 0,
                    background: productId === p.id ? 'var(--carmine-tint)' : 'var(--ink-2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: productId === p.id ? 'var(--carmine-soft)' : 'var(--paper-3)',
                    transition: 'all 0.15s',
                  }}>
                    <ProductIcon iconType={p.icon_type} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{p.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--paper-2)' }}>{p.tagline}</div>
                  </div>
                  <div style={{
                    fontSize: '1.1rem', fontWeight: 700,
                    color: productId === p.id ? 'var(--carmine-soft)' : 'var(--paper-3)',
                  }}>
                    from £{Math.min(...p.options.map(o => o.price)).toFixed(2).replace(/\.00$/, '')}
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
            <p style={{ color: 'var(--paper-3)', marginBottom: '28px' }}>{product.tagline}</p>

            {/* Size / option */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--paper-2)' }}>
                {product.option_label}
              </label>
              {product.options.length > 3 ? (
                // Many options: pill grid
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {product.options.map(o => (
                    <button
                      key={o.id}
                      onClick={() => setSize(o.id)}
                      style={{
                        padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                        background: size === o.id ? 'var(--carmine-tint)' : 'var(--ink-1)',
                        border: `2px solid ${size === o.id ? 'var(--carmine)' : 'var(--ink-3)'}`,
                        color: 'var(--paper)', fontWeight: 600, fontSize: '0.9rem',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div>{o.label}</div>
                      {o.detail && <div style={{ fontSize: '0.7rem', color: 'var(--paper-3)', marginTop: '2px' }}>{o.detail}</div>}
                    </button>
                  ))}
                </div>
              ) : (
                // Few options: vertical cards
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
                        {o.detail && <div style={{ fontSize: '0.8rem', color: 'var(--paper-2)' }}>{o.detail}</div>}
                      </div>
                      <div style={{ fontWeight: 700, color: size === o.id ? 'var(--carmine-soft)' : 'var(--paper-3)' }}>£{o.price.toFixed(2).replace(/\.00$/, '')}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Colour picker */}
            {product.has_colour && product.colours.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--paper-2)' }}>
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
                        background: colour === c.id ? 'var(--carmine-tint)' : 'var(--ink-1)',
                        border: `2px solid ${colour === c.id ? 'var(--carmine)' : 'var(--ink-3)'}`,
                        color: 'var(--paper)', fontSize: '0.85rem', fontWeight: 500,
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: c.hex,
                        border: c.hex === 'var(--paper)' ? '1px solid #3a3a3a' : 'none',
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
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--paper-2)' }}>
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
              background: 'var(--ink-1)', border: '1px solid var(--ink-3)', borderRadius: '10px',
              padding: '14px 20px', marginBottom: '24px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ color: 'var(--paper-2)', fontSize: '0.875rem' }}>
                {product.name}
                {size ? ` — ${size}` : ''}
                {colour ? ` / ${product.colours.find(c => c.id === colour)?.label ?? colour}` : ''}
                {` × ${quantity}`}
              </span>
              <span style={{ fontWeight: 700, color: 'var(--carmine-soft)' }}>£{total.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button
                className="btn-primary"
                onClick={() => setStep(3)}
                disabled={!size || (product.has_colour && !colour)}
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
            <p style={{ color: 'var(--paper-3)', marginBottom: '32px' }}>
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
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--paper-2)' }}>Address line 1 *</label>
                <input placeholder="123 High Street" value={addr.line1} onChange={e => setAddr(a => ({ ...a, line1: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--paper-2)' }}>Address line 2</label>
                <input placeholder="Flat 4 (optional)" value={addr.line2} onChange={e => setAddr(a => ({ ...a, line2: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--paper-2)' }}>City *</label>
                  <input placeholder="London" value={addr.city} onChange={e => setAddr(a => ({ ...a, city: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--paper-2)' }}>Postcode *</label>
                  <input placeholder="EC1A 1BB" value={addr.postcode} onChange={e => setAddr(a => ({ ...a, postcode: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--paper-2)' }}>Country *</label>
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
              background: 'var(--ink-1)', border: '1px solid var(--ink-3)', borderRadius: '12px',
              padding: '20px', marginBottom: '24px',
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--paper-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Order summary
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '8px', background: 'var(--ink-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--carmine-soft)', flexShrink: 0,
                }}>
                  <ProductIcon iconType={product.icon_type} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{product.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--paper-2)' }}>
                    {size}
                    {colour && product.has_colour && ` · ${product.colours.find(c => c.id === colour)?.label ?? colour}`}
                    {` · qty ${quantity}`}
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--paper)' }}>£{unitPrice.toFixed(2)}</div>
              </div>
              <div style={{ borderTop: '1px solid var(--ink-3)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: 'var(--carmine-soft)' }}>£{total.toFixed(2)}</span>
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
            <p style={{ color: 'var(--paper-2)', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto 8px' }}>
              Your <strong style={{ color: 'var(--paper)' }}>{product.name}</strong> is being prepared.
            </p>
            <p style={{ color: 'var(--paper-3)', fontSize: '0.875rem', marginBottom: '32px' }}>
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
