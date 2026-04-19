'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function NavClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav style={{
        padding: '0 24px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'color-mix(in oklch, var(--ink-0) 82%, transparent)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--ink-3)',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--carmine)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display-stack)',
            fontWeight: 800, fontSize: '17px', color: 'var(--paper)',
            letterSpacing: '-0.04em',
            flexShrink: 0,
          }}>I</div>
          <span style={{
            fontFamily: 'var(--font-display-stack)',
            fontWeight: 700, fontSize: '17px', letterSpacing: '-0.025em', color: 'var(--paper)',
          }}>InkyIdentity</span>
        </Link>

        <div className="nav-desktop" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>Dashboard</Link>
          ) : (
            <>
              <Link href="/auth/login" className="btn-secondary" style={{ textDecoration: 'none' }}>Sign in</Link>
              <Link href="/auth/signup" className="btn-primary" style={{ textDecoration: 'none' }}>Get started</Link>
            </>
          )}
        </div>

        <button
          className="nav-mobile"
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
          style={{
            background: 'transparent', border: '1px solid var(--ink-3)', borderRadius: '8px',
            width: '40px', height: '40px', cursor: 'pointer', color: 'var(--paper)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 3l12 12M15 3L3 15" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2 5h14M2 9h14M2 13h14" />
            </svg>
          )}
        </button>
      </nav>

      {open && (
        <div className="nav-mobile" style={{
          position: 'fixed', top: '64px', left: 0, right: 0,
          background: 'color-mix(in oklch, var(--ink-0) 96%, transparent)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--ink-3)',
          padding: '20px 24px', zIndex: 99,
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center', justifyContent: 'center' }} onClick={() => setOpen(false)}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="btn-secondary" style={{ textDecoration: 'none', textAlign: 'center', justifyContent: 'center' }} onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link href="/auth/signup" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center', justifyContent: 'center' }} onClick={() => setOpen(false)}>
                Get started — free
              </Link>
            </>
          )}
          <div style={{ borderTop: '1px solid var(--ink-3)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <a href="#how" style={{ color: 'var(--paper-2)', textDecoration: 'none', fontSize: '0.95rem' }} onClick={() => setOpen(false)}>How it works</a>
          </div>
        </div>
      )}
    </>
  );
}
