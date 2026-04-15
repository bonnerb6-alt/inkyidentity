import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function Home() {
  const session = await getSession();

  return (
    <div style={{ background: '#080808', color: '#f9fafb', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid #1f1f1f',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(8,8,8,0.9)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '16px'
          }}>I</div>
          <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em' }}>InkyIdentity</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {session ? (
            <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="btn-secondary" style={{ textDecoration: 'none' }}>
                Sign in
              </Link>
              <Link href="/auth/signup" className="btn-primary" style={{ textDecoration: 'none' }}>
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.3)',
          borderRadius: '100px', padding: '6px 16px', marginBottom: '32px',
          fontSize: '0.85rem', color: '#a78bfa',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }}></span>
          Now available — permanent digital identity
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.04em',
          marginBottom: '24px',
        }}>
          Your tattoo.{' '}
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa, #7c3aed, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Your world.
          </span>
          <br />One scan.
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: '#9ca3af',
          maxWidth: '600px',
          margin: '0 auto 40px',
          lineHeight: 1.7,
        }}>
          Get a permanent QR code tattoo that links to a profile you control.
          Update your links anytime — your ink never needs reprinting.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/signup" className="btn-primary" style={{
            textDecoration: 'none',
            fontSize: '1rem',
            padding: '14px 32px',
            boxShadow: '0 0 40px rgba(124, 58, 237, 0.4)',
          }}>
            Create your profile — free
          </Link>
          <Link href="#how-it-works" className="btn-secondary" style={{ textDecoration: 'none', fontSize: '1rem', padding: '14px 32px' }}>
            See how it works
          </Link>
        </div>

        {/* Preview mockup */}
        <div style={{ marginTop: '80px', position: 'relative' }}>
          <div style={{
            background: 'linear-gradient(180deg, rgba(124, 58, 237, 0.15) 0%, transparent 100%)',
            borderRadius: '24px',
            border: '1px solid #1f1f1f',
            padding: '40px 24px',
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* QR card */}
              <div style={{
                background: '#111', border: '1px solid #2a2a2a',
                borderRadius: '16px', padding: '24px', textAlign: 'center',
                boxShadow: '0 0 40px rgba(124, 58, 237, 0.25)',
              }}>
                <div style={{
                  width: '160px', height: '160px', background: 'white',
                  borderRadius: '8px', margin: '0 auto 16px', padding: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <QRPlaceholder />
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Scan to view profile</div>
              </div>

              {/* Arrow */}
              <div style={{ fontSize: '2rem', color: '#4b5563' }}>→</div>

              {/* Profile card */}
              <div style={{
                background: '#111', border: '1px solid #2a2a2a',
                borderRadius: '16px', padding: '24px', width: '220px',
              }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                    margin: '0 auto 8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px',
                  }}>✦</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>@james</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Artist & creator</div>
                </div>
                {['Portfolio', 'Instagram', 'Booking'].map((l) => (
                  <div key={l} style={{
                    background: '#1a1a1a', borderRadius: '8px', padding: '10px 14px',
                    marginBottom: '8px', fontSize: '0.85rem', display: 'flex',
                    alignItems: 'center', gap: '8px',
                  }}>
                    <span style={{ color: '#7c3aed' }}>↗</span> {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: '1px solid #1f1f1f', borderBottom: '1px solid #1f1f1f', padding: '48px 24px' }}>
        <div style={{
          maxWidth: '800px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '32px', textAlign: 'center',
        }}>
          {[
            { value: 'Permanent', label: 'QR code, for life' },
            { value: 'Instant', label: 'Profile updates' },
            { value: 'Free', label: 'Profile forever' },
            { value: 'Tattoo', label: 'quality printing' },
          ].map((s) => (
            <div key={s.value}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#a78bfa', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ fontSize: '0.85rem', color: '#7c3aed', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            How it works
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Three steps to forever
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            {
              step: '01',
              icon: '◈',
              title: 'Create your profile',
              desc: 'Sign up free. Add your links, bio, and photo. Customise your profile page exactly how you want it.',
            },
            {
              step: '02',
              icon: '⬡',
              title: 'Order your tattoo',
              desc: 'We generate a unique QR code just for you and send it to Prodigi for professional tattoo-quality printing.',
            },
            {
              step: '03',
              icon: '∞',
              title: 'Update forever',
              desc: 'Your QR is permanent. Your profile never is. Change links, update your bio, add new content — the QR always works.',
            },
          ].map((item, i) => (
            <div key={i} style={{
              background: '#111', border: '1px solid #1f1f1f',
              borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: '24px', right: '24px',
                fontSize: '4rem', fontWeight: 900, color: '#1a1a1a', lineHeight: 1,
              }}>{item.step}</div>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', color: '#a78bfa', marginBottom: '20px',
              }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ color: '#9ca3af', lineHeight: 1.6, fontSize: '0.95rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ background: '#0d0d0d', borderTop: '1px solid #1f1f1f', padding: '100px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontSize: '0.85rem', color: '#7c3aed', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Features
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Everything you need
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              { icon: '⬡', title: 'Unique QR code', desc: 'Every user gets a permanent, high error-correction QR code that never expires.' },
              { icon: '✎', title: 'Editable profile', desc: 'Update your bio, links, and appearance any time — changes go live instantly.' },
              { icon: '⬡', title: 'Custom username', desc: 'Choose a clean vanity URL. Share it on social or let people scan your tattoo.' },
              { icon: '↗', title: 'Unlimited links', desc: 'Add as many links as you want. Reorder them by drag. Toggle them on or off.' },
              { icon: '◎', title: 'Tattoo printing', desc: 'Professional-quality printed tattoo stickers via Prodigi, shipped worldwide.' },
              { icon: '⚡', title: 'Fast & reliable', desc: 'Profile pages are cached and served instantly. No slow-loading link trees.' },
            ].map((f, i) => (
              <div key={i} style={{
                background: '#111', border: '1px solid #1f1f1f',
                borderRadius: '12px', padding: '24px',
                transition: 'border-color 0.2s',
              }}>
                <div style={{ color: '#7c3aed', fontSize: '1.5rem', marginBottom: '12px' }}>{f.icon}</div>
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>{f.title}</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '20px' }}>
          Ready to wear your{' '}
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>identity?</span>
        </h2>
        <p style={{ color: '#9ca3af', marginBottom: '40px', fontSize: '1.1rem', lineHeight: 1.7 }}>
          Sign up free, set up your profile in minutes, and order your first tattoo.
          Your QR code is permanent — your profile never has to be.
        </p>
        <Link href="/auth/signup" className="btn-primary" style={{
          textDecoration: 'none', fontSize: '1rem', padding: '16px 40px',
          boxShadow: '0 0 50px rgba(124, 58, 237, 0.5)',
        }}>
          Start for free →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #1f1f1f', padding: '40px 24px',
        textAlign: 'center', color: '#4b5563', fontSize: '0.875rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '6px',
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '12px', color: 'white',
          }}>I</div>
          <span style={{ color: '#6b7280', fontWeight: 600 }}>InkyIdentity</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          <Link href="/auth/login" style={{ color: '#6b7280', textDecoration: 'none' }}>Sign in</Link>
          <Link href="/auth/signup" style={{ color: '#6b7280', textDecoration: 'none' }}>Create account</Link>
        </div>
        <p>© {new Date().getFullYear()} InkyIdentity. Built for those who commit.</p>
      </footer>
    </div>
  );
}

function QRPlaceholder() {
  // Simple SVG QR-like pattern for the mockup
  return (
    <svg viewBox="0 0 100 100" width="140" height="140" xmlns="http://www.w3.org/2000/svg">
      {/* Top-left finder */}
      <rect x="5" y="5" width="30" height="30" rx="2" fill="#000" />
      <rect x="9" y="9" width="22" height="22" rx="1" fill="white" />
      <rect x="13" y="13" width="14" height="14" rx="1" fill="#000" />
      {/* Top-right finder */}
      <rect x="65" y="5" width="30" height="30" rx="2" fill="#000" />
      <rect x="69" y="9" width="22" height="22" rx="1" fill="white" />
      <rect x="73" y="13" width="14" height="14" rx="1" fill="#000" />
      {/* Bottom-left finder */}
      <rect x="5" y="65" width="30" height="30" rx="2" fill="#000" />
      <rect x="9" y="69" width="22" height="22" rx="1" fill="white" />
      <rect x="13" y="73" width="14" height="14" rx="1" fill="#000" />
      {/* Data modules */}
      {[40,45,50,55,60].map(x => [40,45,50,55,60].map(y => (
        Math.random() > 0.5 && <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" fill="#000" />
      )))}
      <rect x="40" y="40" width="4" height="4" fill="#000" />
      <rect x="50" y="40" width="4" height="4" fill="#000" />
      <rect x="40" y="50" width="4" height="4" fill="#000" />
      <rect x="60" y="50" width="4" height="4" fill="#000" />
      <rect x="45" y="55" width="4" height="4" fill="#000" />
      <rect x="55" y="45" width="4" height="4" fill="#000" />
      <rect x="40" y="60" width="4" height="4" fill="#000" />
      <rect x="55" y="60" width="4" height="4" fill="#000" />
      <rect x="65" y="40" width="4" height="4" fill="#000" />
      <rect x="70" y="45" width="4" height="4" fill="#000" />
      <rect x="75" y="40" width="4" height="4" fill="#000" />
      <rect x="40" y="70" width="4" height="4" fill="#000" />
      <rect x="50" y="75" width="4" height="4" fill="#000" />
      <rect x="60" y="70" width="4" height="4" fill="#000" />
    </svg>
  );
}
