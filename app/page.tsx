import Link from 'next/link';
import { getSession } from '@/lib/auth';
import NavClient from './NavClient';

export default async function Home() {
  const session = await getSession();

  return (
    <div style={{ background: 'var(--ink-0)', color: 'var(--paper)', minHeight: '100vh', overflowX: 'hidden' }}>

      <NavClient isLoggedIn={!!session} />

      {/* ── Hero ── */}
      <section className="hero-section" style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

        {/* Single restrained ambient halo (carmine, low chroma) */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <div className="animate-orb" style={{
            position: 'absolute', top: '8%', right: '-6%',
            width: '46vw', height: '46vw', maxWidth: '620px', maxHeight: '620px',
            background: 'radial-gradient(circle, var(--carmine-glow) 0%, transparent 62%)',
            borderRadius: '50%', filter: 'blur(8px)',
          }} />
          {/* Faint paper grain via SVG */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.025 }} xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="var(--paper)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="hero-grid">

          {/* Left: copy */}
          <div>
            <div className="animate-fade-in-up-1" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              border: '1px solid var(--ink-3)',
              borderRadius: '999px', padding: '6px 14px 6px 12px', marginBottom: '32px',
              fontSize: '0.78rem', color: 'var(--paper-2)', fontWeight: 500,
              letterSpacing: '0.02em', textTransform: 'uppercase',
            }}>
              <span className="animate-dot-pulse" style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--carmine)', display: 'inline-block' }} />
              Your ink. Your identity.
            </div>

            <h1 className="animate-fade-in-up-2" style={{
              fontSize: 'clamp(3.2rem, 7vw, 5.4rem)',
              fontWeight: 800, lineHeight: 0.96,
              letterSpacing: '-0.045em', marginBottom: '28px',
              fontVariationSettings: '"opsz" 48, "wdth" 100',
            }}>
              One scan.<br />
              <span style={{
                color: 'var(--carmine)',
                fontStyle: 'italic',
                fontVariationSettings: '"opsz" 96, "wdth" 100',
              }}>Endless you.</span>
            </h1>

            <p className="animate-fade-in-up-3" style={{
              fontSize: '1.08rem', color: 'var(--paper-2)', lineHeight: 1.65,
              maxWidth: '46ch', marginBottom: '36px',
            }}>
              A QR code tattoo linked to a profile you control. Change your links, bio, and look — your ink stays the same.
            </p>

            <div className="animate-fade-in-up-4 hero-buttons" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" className="btn-primary" style={{
                textDecoration: 'none', fontSize: '1rem', padding: '14px 28px',
              }}>
                Get started — free
              </Link>
              <Link href="#how" className="btn-secondary" style={{ textDecoration: 'none', fontSize: '1rem', padding: '14px 28px' }}>
                How it works
              </Link>
            </div>

            <div className="animate-fade-in-up-4 hero-badges" style={{ display: 'flex', gap: '24px', marginTop: '40px', flexWrap: 'wrap' }}>
              {['Free profile', 'Instant updates', 'Ships worldwide'].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--paper-3)' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="var(--carmine)" strokeWidth="1.5"/>
                    <path d="M4.3 7l1.9 1.9L9.7 5" stroke="var(--carmine)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right: hero visual */}
          <div className="hero-visual animate-float">
            <HeroVisual />
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--paper-4)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>Scroll</div>
          <div style={{ width: '1px', height: '36px', background: 'linear-gradient(to bottom, var(--carmine), transparent)' }} />
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ padding: 'clamp(80px, 12vw, 140px) 24px', position: 'relative' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

          <div style={{ marginBottom: '72px', maxWidth: '720px' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--carmine)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '14px' }}>How it works</p>
            <h2 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.0 }}>
              Three steps.<br />
              <span style={{ color: 'var(--paper-3)' }}>One commitment.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1px', background: 'var(--ink-3)', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--ink-3)' }}>
            {[
              { n: '01', visual: <ProfileVisual />, title: 'Build your profile', sub: 'Add links, bio, photo. Make it yours.' },
              { n: '02', visual: <OrderVisual />,   title: 'Order your tattoo', sub: 'We print your unique QR. Pro quality.' },
              { n: '03', visual: <UpdateVisual />,  title: 'Update anytime',    sub: 'Your ink never changes. Your profile can.' },
            ].map((s) => (
              <div key={s.n} style={{
                background: 'var(--ink-0)', padding: '44px 32px 36px',
                display: 'flex', flexDirection: 'column', gap: '24px',
                position: 'relative', overflow: 'hidden',
              }}>
                <div aria-hidden style={{
                  position: 'absolute', top: '14px', right: '20px',
                  fontFamily: 'var(--font-display-stack)',
                  fontSize: '5rem', fontWeight: 800, color: 'var(--ink-2)',
                  lineHeight: 1, userSelect: 'none', letterSpacing: '-0.05em',
                }}>{s.n}</div>
                <div>{s.visual}</div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>{s.title}</h3>
                  <p style={{ color: 'var(--paper-3)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '32ch' }}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Showcase ── */}
      <section style={{
        background: 'var(--ink-1)',
        borderTop: '1px solid var(--ink-3)', borderBottom: '1px solid var(--ink-3)',
        padding: 'clamp(80px, 12vw, 140px) 24px', position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '720px', height: '420px',
          background: 'radial-gradient(ellipse, var(--carmine-glow) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <p style={{ fontSize: '0.78rem', color: 'var(--carmine)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '16px' }}>The profile</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '22px', lineHeight: 1.02 }}>
              Everything about you.<br />
              <span style={{ color: 'var(--carmine)', fontStyle: 'italic' }}>One link.</span>
            </h2>
            <p style={{ color: 'var(--paper-3)', lineHeight: 1.65, marginBottom: '32px', fontSize: '1rem', maxWidth: '42ch' }}>
              Unlimited links. Custom bio. Profile photo. Change it all in seconds — no reprinting, ever.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {['Custom username & vanity URL', 'Unlimited links with drag reorder', 'Instant live updates', 'QR code that never expires'].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: 'var(--paper-2)' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '7px', background: 'var(--carmine-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.4 2.4L8 2.4" stroke="var(--carmine)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: '88px 24px', borderBottom: '1px solid var(--ink-3)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '48px', textAlign: 'left' }}>
          {[
            { val: '∞', label: 'Link updates' },
            { val: '0', label: 'Monthly fee' },
            { val: '1', label: 'Tattoo needed' },
            { val: '↑', label: 'Your control' },
          ].map((s) => (
            <div key={s.label}>
              <div style={{
                fontFamily: 'var(--font-display-stack)',
                fontSize: 'clamp(2.6rem, 4vw, 3.4rem)',
                fontWeight: 700, color: 'var(--carmine)', marginBottom: '4px',
                letterSpacing: '-0.04em', lineHeight: 1,
                fontVariationSettings: '"opsz" 96',
              }}>{s.val}</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--paper-3)', fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who is it for — editorial typographic list ── */}
      <section style={{ padding: 'clamp(80px, 12vw, 140px) 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--carmine)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '20px' }}>Who it's for</p>
          <div style={{
            fontFamily: 'var(--font-display-stack)',
            fontSize: 'clamp(2rem, 5vw, 3.8rem)',
            fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.035em',
            color: 'var(--paper-2)', maxWidth: '20ch',
          }}>
            <span style={{ color: 'var(--paper)' }}>Artists.</span>{' '}
            <span style={{ color: 'var(--paper)' }}>Musicians.</span>{' '}
            <span style={{ color: 'var(--paper-3)' }}>Photographers.</span>{' '}
            <span style={{ color: 'var(--paper-3)' }}>Writers.</span>{' '}
            <span style={{ color: 'var(--paper)' }}>Athletes.</span>{' '}
            <span style={{ color: 'var(--paper-3)' }}>Developers.</span>{' '}
            <span style={{ color: 'var(--carmine)', fontStyle: 'italic' }}>Anyone who commits.</span>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(96px, 14vw, 160px) 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, var(--carmine-glow) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden className="animate-spin-slow" style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '560px', height: '560px',
          border: '1px solid color-mix(in oklch, var(--carmine) 18%, transparent)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', fontWeight: 800,
            letterSpacing: '-0.045em', marginBottom: '24px', lineHeight: 1.0,
          }}>
            Commit to your{' '}
            <span style={{ color: 'var(--carmine)', fontStyle: 'italic' }}>identity.</span>
          </h2>
          <p style={{ color: 'var(--paper-3)', fontSize: '1.05rem', marginBottom: '40px', maxWidth: '44ch', margin: '0 auto 40px', lineHeight: 1.65 }}>
            Free profile. No subscriptions. Order when you&rsquo;re ready.
          </p>
          <Link href="/auth/signup" className="btn-primary" style={{
            textDecoration: 'none', fontSize: '1.05rem', padding: '16px 40px',
          }}>
            Start for free →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--ink-3)', padding: '44px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <LogoMark size={26} />
          <span style={{ fontFamily: 'var(--font-display-stack)', fontWeight: 700, color: 'var(--paper-2)', fontSize: '1rem', letterSpacing: '-0.02em' }}>InkyIdentity</span>
        </div>
        <div style={{ display: 'flex', gap: '28px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          <Link href="/auth/login" style={{ color: 'var(--paper-4)', textDecoration: 'none', fontSize: '0.875rem' }}>Sign in</Link>
          <Link href="/auth/signup" style={{ color: 'var(--paper-4)', textDecoration: 'none', fontSize: '0.875rem' }}>Create account</Link>
        </div>
        <p style={{ color: 'var(--paper-5)', fontSize: '0.78rem', letterSpacing: '0.02em' }}>© {new Date().getFullYear()} InkyIdentity. Built for those who commit.</p>
      </footer>
    </div>
  );
}

/* ── Visuals ── */

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * 0.28),
      background: 'var(--carmine)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: Math.round(size * 0.5), color: 'var(--paper)',
      fontFamily: 'var(--font-display-stack)',
      letterSpacing: '-0.04em',
      flexShrink: 0,
    }}>I</div>
  );
}

function HeroVisual() {
  return (
    <svg width="380" height="420" viewBox="0 0 380 420" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="190" cy="210" rx="160" ry="160" fill="url(#heroGlow)" />

      {/* Arm */}
      <ellipse cx="190" cy="300" rx="90" ry="120" fill="oklch(0.18 0.012 270)" stroke="oklch(0.26 0.014 270)" strokeWidth="1" />
      <ellipse cx="190" cy="290" rx="80" ry="108" fill="oklch(0.21 0.012 270)" />
      <ellipse cx="190" cy="275" rx="68" ry="88" fill="url(#armShade)" opacity="0.6" />

      {/* Tattoo sticker */}
      <rect x="148" y="245" width="84" height="84" rx="8" fill="oklch(0.97 0.008 85)" />
      {/* QR finders */}
      {[[155,252],[201,252],[155,298]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y} width="24" height="24" rx="2" fill="oklch(0.13 0.012 270)" />
          <rect x={x+3} y={y+3} width="18" height="18" rx="1" fill="oklch(0.97 0.008 85)" />
          <rect x={x+6} y={y+6} width="12" height="12" rx="1" fill="oklch(0.13 0.012 270)" />
        </g>
      ))}
      {[[183,252],[189,252],[195,252],[183,258],[195,258],[183,264],[189,264],[195,264],
        [183,276],[189,276],[195,276],[183,282],[183,288],[195,288],[189,294],[195,294],
        [201,282],[207,282],[213,276],[207,288],[213,288],[207,294],[213,294]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="4" height="4" fill="oklch(0.13 0.012 270)" />
      ))}

      {/* Phone */}
      <rect x="260" y="60" width="100" height="180" rx="14" fill="oklch(0.16 0.012 270)" stroke="oklch(0.26 0.014 270)" strokeWidth="1.5" />
      <rect x="266" y="74" width="88" height="152" rx="8" fill="oklch(0.13 0.012 270)" />
      <rect x="296" y="65" width="28" height="7" rx="3.5" fill="oklch(0.20 0.014 270)" />
      <circle cx="310" cy="108" r="18" fill="var(--carmine)" />
      <text x="310" y="113" textAnchor="middle" fontSize="14" fill="oklch(0.97 0.008 85)" fontWeight="700">✦</text>
      <rect x="287" y="132" width="46" height="6" rx="3" fill="oklch(0.26 0.014 270)" />
      <rect x="293" y="142" width="34" height="4" rx="2" fill="oklch(0.20 0.014 270)" />
      {['Portfolio','Instagram','Booking'].map((l, i) => (
        <g key={l}>
          <rect x="274" y={157 + i * 24} width="72" height="18" rx="5" fill="oklch(0.18 0.012 270)" stroke="oklch(0.26 0.014 270)" strokeWidth="0.5" />
          <text x="310" y={169 + i * 24} textAnchor="middle" fontSize="7" fill="oklch(0.83 0.012 85)">{l}</text>
        </g>
      ))}

      {/* Connector */}
      <path d="M 240 290 Q 260 250 265 200" stroke="var(--carmine)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.7" />
      <circle cx="265" cy="200" r="3" fill="var(--carmine)" />

      {/* Floating tags */}
      <g className="animate-float">
        <rect x="10" y="80" width="100" height="34" rx="8" fill="oklch(0.16 0.012 270)" stroke="oklch(0.26 0.014 270)" strokeWidth="1" />
        <text x="26" y="97" fontSize="9" fill="var(--carmine)">⬡</text>
        <text x="36" y="97" fontSize="9" fill="oklch(0.83 0.012 85)" fontWeight="600">Unique QR</text>
        <text x="26" y="108" fontSize="7.5" fill="oklch(0.62 0.014 270)">Never expires</text>
      </g>
      <g className="animate-float" style={{ animationDelay: '1s' }}>
        <rect x="16" y="170" width="106" height="34" rx="8" fill="oklch(0.16 0.012 270)" stroke="oklch(0.26 0.014 270)" strokeWidth="1" />
        <text x="26" y="187" fontSize="9" fill="var(--carmine-soft)">✎</text>
        <text x="38" y="187" fontSize="9" fill="oklch(0.83 0.012 85)" fontWeight="600">Live updates</text>
        <text x="26" y="198" fontSize="7.5" fill="oklch(0.62 0.014 270)">Edit any time</text>
      </g>
      <g className="animate-float" style={{ animationDelay: '2s' }}>
        <rect x="8" y="380" width="120" height="34" rx="8" fill="oklch(0.16 0.012 270)" stroke="oklch(0.26 0.014 270)" strokeWidth="1" />
        <text x="26" y="397" fontSize="9" fill="var(--carmine)">◈</text>
        <text x="38" y="397" fontSize="9" fill="oklch(0.83 0.012 85)" fontWeight="600">Tattoo quality</text>
        <text x="26" y="408" fontSize="7.5" fill="oklch(0.62 0.014 270)">Ships worldwide</text>
      </g>

      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.62 0.21 25)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="oklch(0.13 0.012 270)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="armShade" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="oklch(0.62 0.21 25)" stopOpacity="0.10" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function ProfileVisual() {
  return (
    <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="140" height="100" rx="12" fill="oklch(0.16 0.012 270)" />
      <circle cx="70" cy="32" r="18" fill="var(--carmine)" />
      <text x="70" y="37" textAnchor="middle" fontSize="14" fill="oklch(0.97 0.008 85)" fontWeight="700">✦</text>
      <rect x="44" y="56" width="52" height="7" rx="3.5" fill="oklch(0.26 0.014 270)" />
      <rect x="52" y="67" width="36" height="5" rx="2.5" fill="oklch(0.20 0.014 270)" />
      {['Link 1', 'Link 2'].map((l, i) => (
        <rect key={l} x="28" y={78 + i * 12} width="84" height="9" rx="4" fill="oklch(0.20 0.014 270)" stroke="oklch(0.26 0.014 270)" strokeWidth="0.5" />
      ))}
    </svg>
  );
}

function OrderVisual() {
  return (
    <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="140" height="100" rx="12" fill="oklch(0.16 0.012 270)" />
      <rect x="40" y="16" width="60" height="60" rx="6" fill="oklch(0.97 0.008 85)" />
      {[[45,21],[77,21],[45,53]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y} width="18" height="18" rx="1.5" fill="oklch(0.13 0.012 270)" />
          <rect x={x+2} y={y+2} width="14" height="14" rx="1" fill="oklch(0.97 0.008 85)" />
          <rect x={x+4} y={y+4} width="10" height="10" rx="0.5" fill="oklch(0.13 0.012 270)" />
        </g>
      ))}
      {[[65,21],[71,21],[65,27],[65,33],[71,33],[65,39],[71,39],[77,39],[83,39],[77,45],[83,51],[77,57],[83,57],[65,51],[65,57]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="4" height="4" fill="oklch(0.13 0.012 270)" />
      ))}
      <rect x="30" y="82" width="80" height="12" rx="6" fill="var(--carmine-tint)" />
      <text x="70" y="91" textAnchor="middle" fontSize="7" fill="var(--carmine)" fontWeight="700" letterSpacing="0.5">YOUR UNIQUE CODE</text>
    </svg>
  );
}

function UpdateVisual() {
  return (
    <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="140" height="100" rx="12" fill="oklch(0.16 0.012 270)" />
      <rect x="12" y="20" width="52" height="60" rx="8" fill="oklch(0.18 0.012 270)" stroke="oklch(0.26 0.014 270)" strokeWidth="1" />
      <circle cx="38" cy="38" r="10" fill="oklch(0.26 0.014 270)" />
      <rect x="20" y="52" width="36" height="4" rx="2" fill="oklch(0.26 0.014 270)" />
      <rect x="18" y="60" width="40" height="7" rx="3" fill="oklch(0.20 0.014 270)" />
      <rect x="18" y="70" width="40" height="7" rx="3" fill="oklch(0.20 0.014 270)" />
      <path d="M 68 50 L 76 50" stroke="var(--carmine)" strokeWidth="2" strokeLinecap="round" />
      <path d="M 73 46 L 77 50 L 73 54" stroke="var(--carmine)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="80" y="20" width="52" height="60" rx="8" fill="oklch(0.18 0.012 270)" stroke="var(--carmine)" strokeWidth="1" />
      <circle cx="106" cy="38" r="10" fill="var(--carmine)" />
      <text x="106" y="42" textAnchor="middle" fontSize="9" fill="oklch(0.97 0.008 85)">✦</text>
      <rect x="88" y="52" width="36" height="4" rx="2" fill="oklch(0.26 0.014 270)" />
      {['New link','Portfolio','Booking'].map((l, i) => (
        <rect key={l} x="86" y={60 + i * 9} width="40" height="7" rx="3" fill={i === 0 ? 'var(--carmine-tint)' : 'oklch(0.20 0.014 270)'} />
      ))}
    </svg>
  );
}

function PhoneMockup() {
  return (
    <svg width="240" height="460" viewBox="0 0 240 460" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="232" height="452" rx="36" fill="oklch(0.13 0.012 270)" stroke="oklch(0.26 0.014 270)" strokeWidth="2" />
      <rect x="8" y="8" width="224" height="444" rx="33" fill="oklch(0.13 0.012 270)" stroke="oklch(0.20 0.014 270)" strokeWidth="1" />
      <rect x="12" y="12" width="216" height="436" rx="30" fill="oklch(0.14 0.012 270)" />
      <rect x="84" y="16" width="72" height="22" rx="11" fill="oklch(0.13 0.012 270)" />
      <rect x="0" y="100" width="4" height="40" rx="2" fill="oklch(0.20 0.014 270)" />
      <rect x="0" y="150" width="4" height="60" rx="2" fill="oklch(0.20 0.014 270)" />
      <rect x="236" y="120" width="4" height="70" rx="2" fill="oklch(0.20 0.014 270)" />

      {/* Profile content */}
      <rect x="12" y="12" width="216" height="120" rx="30" fill="url(#phoneHeader)" />

      <circle cx="120" cy="100" r="36" fill="var(--carmine)" />
      <circle cx="120" cy="100" r="36" stroke="oklch(0.13 0.012 270)" strokeWidth="3" />
      <text x="120" y="107" textAnchor="middle" fontSize="24" fill="oklch(0.97 0.008 85)" fontWeight="700">✦</text>

      <text x="120" y="158" textAnchor="middle" fontSize="16" fill="oklch(0.97 0.008 85)" fontWeight="700">@james</text>
      <text x="120" y="174" textAnchor="middle" fontSize="11" fill="oklch(0.62 0.014 270)">Artist &amp; creator · London</text>
      <text x="120" y="196" textAnchor="middle" fontSize="10" fill="oklch(0.46 0.014 270)">Tattoo artist. Visual storyteller.</text>

      {[
        { label: 'Portfolio',     icon: '◈', y: 216 },
        { label: 'Instagram',     icon: '⬡', y: 248 },
        { label: 'Book a session',icon: '◎', y: 280 },
        { label: 'YouTube',       icon: '↗', y: 312 },
      ].map((link) => (
        <g key={link.label}>
          <rect x="28" y={link.y} width="184" height="28" rx="8" fill="oklch(0.16 0.012 270)" stroke="oklch(0.26 0.014 270)" strokeWidth="1" />
          <text x="52" y={link.y + 18} fontSize="10" fill="var(--carmine)">{link.icon}</text>
          <text x="120" y={link.y + 18} textAnchor="middle" fontSize="10" fill="oklch(0.83 0.012 85)" fontWeight="500">{link.label}</text>
        </g>
      ))}

      <rect x="28" y="352" width="184" height="76" rx="10" fill="oklch(0.16 0.012 270)" stroke="oklch(0.26 0.014 270)" strokeWidth="1" />
      <rect x="48" y="362" width="48" height="48" rx="4" fill="oklch(0.97 0.008 85)" />
      {[[50,364],[66,364],[50,378]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y} width="12" height="12" rx="1" fill="oklch(0.13 0.012 270)" />
          <rect x={x+1.5} y={y+1.5} width="9" height="9" rx="0.5" fill="oklch(0.97 0.008 85)" />
          <rect x={x+3} y={y+3} width="6" height="6" rx="0.5" fill="oklch(0.13 0.012 270)" />
        </g>
      ))}
      {[[63,376],[63,380],[63,384],[63,388],[67,376],[71,376],[75,376],[75,380],[71,384],[75,388],[67,384],[67,388],[71,388]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="3" height="3" fill="oklch(0.13 0.012 270)" />
      ))}
      <text x="154" y="384" textAnchor="middle" fontSize="9" fill="oklch(0.83 0.012 85)" fontWeight="600">Scan my tattoo</text>
      <text x="154" y="397" textAnchor="middle" fontSize="8" fill="oklch(0.46 0.014 270)">@james.inkyi.com</text>

      <defs>
        <linearGradient id="phoneHeader" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.62 0.21 25)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="oklch(0.14 0.012 270)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
