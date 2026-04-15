'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResetForm() {
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setDone(true);
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#f87171' }}>Invalid reset link.</p>
        <Link href="/auth/forgot-password" style={{ color: '#a78bfa', marginTop: '12px', display: 'inline-block' }}>
          Request a new one
        </Link>
      </div>
    );
  }

  return done ? (
    <div style={{
      background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '12px', padding: '24px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✓</div>
      <p style={{ color: '#6ee7b7', fontWeight: 600, marginBottom: '8px' }}>Password updated!</p>
      <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Redirecting you to login…</p>
    </div>
  ) : (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px', padding: '12px 16px', color: '#f87171', fontSize: '0.875rem',
        }}>{error}</div>
      )}
      <div>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db' }}>
          New password
        </label>
        <input
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db' }}>
          Confirm password
        </label>
        <input
          type="password"
          placeholder="Repeat your new password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          style={{ width: '100%' }}
        />
      </div>
      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
        style={{ width: '100%', justifyContent: 'center', padding: '13px', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Saving…' : 'Set new password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{
      minHeight: '100vh', background: '#080808', color: '#f9fafb',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '22px', color: 'white',
          }}>I</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Set new password
          </h1>
        </div>
        <Suspense fallback={<p style={{ color: '#6b7280', textAlign: 'center' }}>Loading…</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
