'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--ink-0)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'var(--carmine)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '20px', color: 'white',
            }}>I</div>
            <span style={{ color: 'var(--paper)', fontWeight: 700, fontSize: '1.25rem' }}>InkyIdentity</span>
          </Link>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--ink-1)', border: '1px solid var(--ink-3)',
          borderRadius: '16px', padding: '40px',
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.03em' }}>
            Create your identity
          </h1>
          <p style={{ color: 'var(--paper-3)', marginBottom: '32px', fontSize: '0.9rem' }}>
            Free forever. Your profile, your links, your tattoo.
          </p>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px', padding: '12px 16px', color: '#f87171',
              marginBottom: '20px', fontSize: '0.875rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--paper-2)' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--paper-4)', pointerEvents: 'none',
                }}>@</span>
                <input
                  type="text"
                  required
                  placeholder="yourname"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  style={{ paddingLeft: '32px' }}
                  minLength={3}
                  maxLength={30}
                  pattern="[a-zA-Z0-9_\-]+"
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--paper-4)', marginTop: '6px' }}>
                Letters, numbers, _ and - only. 3–30 characters.
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--paper-2)' }}>
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--paper-2)' }}>
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p style={{ fontSize: '0.75rem', color: 'var(--paper-4)', textAlign: 'center', marginTop: '16px' }}>
            By signing up you agree to our terms. No credit card required.
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--paper-3)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: 'var(--carmine-soft)', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
