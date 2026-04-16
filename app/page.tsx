import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function Home() {
  const session = await getSession();

  return (
    <div style={{ background: '#080808', color: '#f9fafb', minHeight: '100vh', overflowX: 'hidden' }}>

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
        background: 'rgba(8,8,8,0.85)',
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '16px',
            boxShadow: '0 0 16px rgba(124,58,237,0.5)',
          }}>I</div>
          <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em' }}>InkyIdentity</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {session ? (
            <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>Dashboard</Link>
          ) : (
            <>
              <Link href="/auth/login" className="btn-secondary" style={{ textDecoration: 'none' }}>Sign in</Link>
              <Link href="/auth/signup" className="btn-primary" style={{ textDecoration: 'none' }}>Get started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center', position: 'relative' }}>

        {/* Background orbs */}
        <div className="animate-orb" style={{
          position: 'absolute', top: '-60px', left: '10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div className="animate-orb" style={{
          position: 'absolute', top: '100px', right: '5%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192,132,252,0.08) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
          animationDelay: '-4s',
        }} />

        {/* Decorative rotating ring */}
        <div className="animate-spin-slow" style={{
          position: 'absolute', top: '40px', right: '8%',
          width: '120px', height: '120px',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: '50%',
          pointerEvents: 'none', zIndex: 0,
        }}>
          <div style={{
            position: 'absolute', top: '-3px', left: '50%', marginLeft: '-3px',
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#7c3aed',
          }} />
        </div>
        <div className="animate-spin-slow" style={{
          position: 'absolute', bottom: '80px', left: '6%',
          width: '80px', height: '80px',
          border: '1px solid rgba(167,139,250,0.15)',
          borderRadius: '50%',
          pointerEvents: 'none', zIndex: 0,
          animationDirection: 'reverse',
          animationDuration: '18s',
        }}>
          <div style={{
            position: 'absolute', top: '-2px', left: '50%', marginLeft: '-2px',
            width: '4px', height: '4px', borderRadius: '50%',
            background: '#a78bfa',
          }} />
        </div>

        {/* Floating dots */}
        {[
          { top: '15%', left: '5%', size: 4, delay: '0s' },
          { top: '35%', left: '2%', size: 3, delay: '1s' },
          { top: '60%', left: '8%', size: 5, delay: '2s' },
          { top: '20%', right: '4%', size: 3, delay: '0.5s' },
          { top: '55%', right: '3%', size: 4, delay: '1.5s' },
        ].map((dot, i) => (
          <div key={i} className="animate-float" style={{
            position: 'absolute',
            top: dot.top,
            left: (dot as { left?: string }).left,
            right: (dot as { right?: string }).right,
            width: `${dot.size}px`, height: `${dot.size}px`,
            borderRadius: '50%',
            background: 'rgba(167,139,250,0.4)',
            pointerEvents: 'none', zIndex: 0,
            animationDelay: dot.delay,
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div className="animate-fade-in-up-1" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '100px', padding: '6px 16px', marginBottom: '32px',
            fontSize: '0.85rem', color: '#a78bfa',
          }}>
            <span className="animate-dot-pulse" style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#a78bfa', display: 'inline-block',
            }} />
            Now live — ink meets identity
          </div>

          <h1 className="animate-fade-in-up-2" style={{
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

          <p className="animate-fade-in-up-3" style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: '#9ca3af',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            Get a QR code tattoo that links to a living profile you control.
            Update your links anytime — your ink never needs changing.
          </p>

          <div className="animate-fade-in-up-4" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
        </div>

        {/* Hero mockup */}
        <div className="animate-float" style={{ marginTop: '80px', position: 'relative', zIndex: 1 }}>
          <div style={{
            background: 'linear-gradient(180deg, rgba(124, 58, 237, 0.15) 0%, transparent 100%)',
            borderRadius: '24px',
            border: '1px solid #1f1f1f',
            padding: '40px 24px',
            maxWidth: '820px',
            margin: '0 auto',
            boxShadow: '0 0 80px rgba(124,58,237,0.1)',
          }}>
            <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>

              {/* Arm + tattoo graphic */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <TattooArmGraphic />
                <div style={{ fontSize: '0.75rem', color: '#4b5563' }}>Tattoo sticker</div>
              </div>

              {/* Arrow with scan animation */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ fontSize: '1.5rem', color: '#4b5563' }}>→</div>
                <div style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 600 }}>SCAN</div>
              </div>

              {/* QR card with scanning animation */}
              <div style={{
                background: '#111', border: '1px solid #2a2a2a',
                borderRadius: '16px', padding: '24px', textAlign: 'center',
                boxShadow: '0 0 40px rgba(124, 58, 237, 0.25)',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Scan line */}
                <div className="animate-scan-line" style={{
                  position: 'absolute', left: 0, right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.8), transparent)',
                  zIndex: 2,
                }} />
                <div style={{
                  width: '160px', height: '160px', background: 'white',
                  borderRadius: '8px', margin: '0 auto 16px', padding: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <QRPlaceholder />
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Scan to view profile</div>
              </div>

              <div style={{ fontSize: '1.5rem', color: '#4b5563' }}>→</div>

              {/* Profile card */}
              <div style={{
                background: '#111', border: '1px solid #2a2a2a',
                borderRadius: '16px', padding: '24px', width: '200px',
              }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                    margin: '0 auto 8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px',
                    boxShadow: '0 0 20px rgba(124,58,237,0.4)',
                  }}>✦</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>@james</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Artist & creator</div>
                </div>
                {['Portfolio', 'Instagram', 'Booking'].map((l) => (
                  <div key={l} style={{
                    background: '#1a1a1a', borderRadius: '8px', padding: '9px 12px',
                    marginBottom: '8px', fontSize: '0.82rem', display: 'flex',
                    alignItems: 'center', gap: '8px',
                    border: '1px solid #222',
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
            { value: 'Yours', label: 'QR code, always' },
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
              icon: <ProfileIcon />,
              title: 'Create your profile',
              desc: 'Sign up free. Add your links, bio, and photo. Customise your profile page exactly how you want it.',
              color: '#7c3aed',
            },
            {
              step: '02',
              icon: <QRIcon />,
              title: 'Order your tattoo',
              desc: 'We generate a unique QR code just for you and send it to Prodigi for professional tattoo-quality printing.',
              color: '#a78bfa',
            },
            {
              step: '03',
              icon: <InfinityIcon />,
              title: 'Update forever',
              desc: 'Your QR is yours. Your profile never has to be. Change links, update your bio, add new content — the QR always works.',
              color: '#c084fc',
            },
          ].map((item, i) => (
            <div key={i} style={{
              background: '#111', border: '1px solid #1f1f1f',
              borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden',
              transition: 'border-color 0.3s, transform 0.3s',
            }}>
              {/* Step number watermark */}
              <div style={{
                position: 'absolute', top: '16px', right: '24px',
                fontSize: '5rem', fontWeight: 900, color: '#161616', lineHeight: 1,
                userSelect: 'none',
              }}>{item.step}</div>
              {/* Gradient accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${item.color}, transparent)`,
                borderRadius: '16px 16px 0 0',
              }} />
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: 'rgba(124, 58, 237, 0.12)', border: '1px solid rgba(124, 58, 237, 0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px',
              }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ color: '#9ca3af', lineHeight: 1.6, fontSize: '0.95rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ background: '#0a0a0a', borderTop: '1px solid #1f1f1f', padding: '100px 24px' }}>
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
              { icon: '⬡', title: 'Unique QR code', desc: 'Every user gets a high error-correction QR code that never expires.', glow: true },
              { icon: '✎', title: 'Editable profile', desc: 'Update your bio, links, and appearance any time — changes go live instantly.' },
              { icon: '◎', title: 'Custom username', desc: 'Choose a clean vanity URL. Share it on social or let people scan your tattoo.' },
              { icon: '↗', title: 'Unlimited links', desc: 'Add as many links as you want. Reorder them by drag. Toggle them on or off.' },
              { icon: '◈', title: 'Tattoo printing', desc: 'Professional-quality printed tattoo stickers via Prodigi, shipped worldwide.' },
              { icon: '⚡', title: 'Fast & reliable', desc: 'Profile pages are cached and served instantly. No slow-loading link trees.' },
            ].map((f, i) => (
              <div key={i} style={{
                background: '#111', border: '1px solid #1f1f1f',
                borderRadius: '12px', padding: '24px',
                transition: 'border-color 0.2s, transform 0.2s',
                position: 'relative', overflow: 'hidden',
              }}>
                {f.glow && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at top left, rgba(124,58,237,0.08), transparent 60%)',
                    pointerEvents: 'none',
                  }} />
                )}
                <div style={{
                  color: '#7c3aed', fontSize: '1.5rem', marginBottom: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '44px', height: '44px',
                  background: 'rgba(124,58,237,0.1)', borderRadius: '10px',
                  border: '1px solid rgba(124,58,237,0.2)',
                }}>{f.icon}</div>
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>{f.title}</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section style={{ borderTop: '1px solid #1f1f1f', borderBottom: '1px solid #1f1f1f', padding: '32px 24px', overflow: 'hidden' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '48px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          {['Artists', 'Musicians', 'Photographers', 'Creators', 'Athletes', 'Designers'].map((label) => (
            <div key={label} style={{
              fontSize: '0.875rem', color: '#4b5563', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#7c3aed', display: 'inline-block' }} />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '120px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '20px' }}>
            Ready to wear your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>identity?</span>
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: '40px', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Sign up free, set up your profile in minutes, and order your tattoo.
            Your QR code is yours — your profile evolves with you.
          </p>
          <Link href="/auth/signup" className="btn-primary animate-pulse-glow" style={{
            textDecoration: 'none', fontSize: '1rem', padding: '16px 40px',
          }}>
            Start for free →
          </Link>
        </div>
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

/* ── SVG Icons ── */

function ProfileIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function QRIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="5" y="5" width="3" height="3" fill="#a78bfa" stroke="none" />
      <rect x="16" y="5" width="3" height="3" fill="#a78bfa" stroke="none" />
      <rect x="5" y="16" width="3" height="3" fill="#a78bfa" stroke="none" />
      <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 17h3" />
    </svg>
  );
}

function InfinityIcon() {
  return (
    <svg width="28" height="24" viewBox="0 0 28 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round">
      <path d="M14 12c-2-4-6-6-8-4s-2 8 0 8 6-8 8-4 6 8 8 4 2-8 0-8-6 4-8 4z" />
    </svg>
  );
}

function TattooArmGraphic() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Arm silhouette */}
      <ellipse cx="80" cy="110" rx="38" ry="52" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1" />
      <ellipse cx="80" cy="110" rx="35" ry="49" fill="#1d1d1d" />
      {/* Skin tone gradient overlay */}
      <ellipse cx="80" cy="98" rx="30" ry="40" fill="url(#skinGrad)" opacity="0.4" />
      {/* Tattoo QR on arm */}
      <g transform="translate(58, 78)">
        <rect width="44" height="44" rx="4" fill="white" opacity="0.95" />
        {/* Mini QR pattern */}
        <rect x="3" y="3" width="14" height="14" rx="1" fill="#1a1a1a" />
        <rect x="5" y="5" width="10" height="10" rx="0.5" fill="white" />
        <rect x="7" y="7" width="6" height="6" rx="0.5" fill="#1a1a1a" />
        <rect x="27" y="3" width="14" height="14" rx="1" fill="#1a1a1a" />
        <rect x="29" y="5" width="10" height="10" rx="0.5" fill="white" />
        <rect x="31" y="7" width="6" height="6" rx="0.5" fill="#1a1a1a" />
        <rect x="3" y="27" width="14" height="14" rx="1" fill="#1a1a1a" />
        <rect x="5" y="29" width="10" height="10" rx="0.5" fill="white" />
        <rect x="7" y="31" width="6" height="6" rx="0.5" fill="#1a1a1a" />
        {/* Data modules */}
        <rect x="19" y="3" width="4" height="4" fill="#1a1a1a" />
        <rect x="19" y="9" width="4" height="4" fill="#1a1a1a" />
        <rect x="3" y="19" width="4" height="4" fill="#1a1a1a" />
        <rect x="9" y="19" width="4" height="4" fill="#1a1a1a" />
        <rect x="19" y="19" width="4" height="4" fill="#1a1a1a" />
        <rect x="25" y="19" width="4" height="4" fill="#1a1a1a" />
        <rect x="31" y="19" width="4" height="4" fill="#1a1a1a" />
        <rect x="37" y="19" width="4" height="4" fill="#1a1a1a" />
        <rect x="19" y="25" width="4" height="4" fill="#1a1a1a" />
        <rect x="25" y="25" width="4" height="4" fill="#1a1a1a" />
        <rect x="31" y="31" width="4" height="4" fill="#1a1a1a" />
        <rect x="37" y="25" width="4" height="4" fill="#1a1a1a" />
        <rect x="37" y="37" width="4" height="4" fill="#1a1a1a" />
        <rect x="19" y="37" width="4" height="4" fill="#1a1a1a" />
        <rect x="25" y="31" width="4" height="4" fill="#1a1a1a" />
      </g>
      {/* Glow around tattoo */}
      <ellipse cx="80" cy="100" rx="25" ry="25" fill="url(#tattooGlow)" />
      <defs>
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tattooGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function QRPlaceholder() {
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
      <rect x="40" y="40" width="4" height="4" fill="#000" />
      <rect x="50" y="40" width="4" height="4" fill="#000" />
      <rect x="60" y="40" width="4" height="4" fill="#000" />
      <rect x="40" y="50" width="4" height="4" fill="#000" />
      <rect x="60" y="50" width="4" height="4" fill="#000" />
      <rect x="45" y="55" width="4" height="4" fill="#000" />
      <rect x="55" y="45" width="4" height="4" fill="#000" />
      <rect x="40" y="60" width="4" height="4" fill="#000" />
      <rect x="55" y="60" width="4" height="4" fill="#000" />
      <rect x="65" y="40" width="4" height="4" fill="#000" />
      <rect x="70" y="50" width="4" height="4" fill="#000" />
      <rect x="75" y="40" width="4" height="4" fill="#000" />
      <rect x="40" y="70" width="4" height="4" fill="#000" />
      <rect x="50" y="75" width="4" height="4" fill="#000" />
      <rect x="60" y="70" width="4" height="4" fill="#000" />
      <rect x="70" y="65" width="4" height="4" fill="#000" />
      <rect x="75" y="75" width="4" height="4" fill="#000" />
    </svg>
  );
}
