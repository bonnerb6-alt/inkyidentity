import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--ink-0)', color: 'var(--paper)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '24px',
    }}>
      <div>
        <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--ink-3)', lineHeight: 1, marginBottom: '16px' }}>
          404
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Page not found</h1>
        <p style={{ color: 'var(--paper-3)', marginBottom: '32px' }}>
          This page doesn&apos;t exist — or the profile may have been removed.
        </p>
        <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>
          Go home
        </Link>
      </div>
    </div>
  );
}
