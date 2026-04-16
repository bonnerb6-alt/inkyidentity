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
        background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '9px',
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '17px', color: 'white',
            boxShadow: '0 0 20px rgba(124,58,237,0.6)', flexShrink: 0,
          }}>I</div>
          <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em', color: '#f9fafb' }}>InkyIdentity</span>
        </Link>

        {/* Desktop buttons */}
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

        {/* Mobile hamburger */}
        <button
          className="nav-mobile"
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
          style={{
            background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '8px',
            width: '40px', height: '40px', cursor: 'pointer', color: '#f9fafb',
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

      {/* Mobile dropdown */}
      {open && (
        <div className="nav-mobile" style={{
          position: 'fixed', top: '64px', left: 0, right: 0,
          background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #1f1f1f',
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
          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <a href="#how" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.95rem' }} onClick={() => setOpen(false)}>How it works</a>
          </div>
        </div>
      )}
    </>
  );
}
