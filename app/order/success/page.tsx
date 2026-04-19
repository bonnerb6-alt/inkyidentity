import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--ink-0)', color: 'var(--paper)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '440px' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)', border: '2px solid rgba(16, 185, 129, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px', fontSize: '2.2rem',
        }}>✓</div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '14px' }}>
          Payment confirmed!
        </h1>
        <p style={{ color: 'var(--paper-2)', lineHeight: 1.7, marginBottom: '8px' }}>
          Your order has been paid and sent to production. We&apos;ll email you a tracking link when it ships.
        </p>
        <p style={{ color: 'var(--paper-3)', fontSize: '0.875rem', marginBottom: '36px' }}>
          Usually dispatches within 2–3 business days.
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard?tab=orders" className="btn-primary" style={{ textDecoration: 'none' }}>
            View my orders
          </Link>
          <Link href="/dashboard" className="btn-secondary" style={{ textDecoration: 'none' }}>
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
