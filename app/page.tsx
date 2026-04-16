import Link from 'next/link';
import { getSession } from '@/lib/auth';
import NavClient from './NavClient';

export default async function Home() {
  const session = await getSession();

  return (
    <div style={{ background: '#080808', color: '#f9fafb', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Nav ── */}
      <NavClient isLoggedIn={!!session} />

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

        {/* Mesh background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <div style={{
            position: 'absolute', top: '-20%', left: '-10%',
            width: '70vw', height: '70vw', maxWidth: '800px', maxHeight: '800px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)',
            borderRadius: '50%',
          }} className="animate-orb" />
          <div style={{
            position: 'absolute', bottom: '-10%', right: '-5%',
            width: '50vw', height: '50vw', maxWidth: '600px', maxHeight: '600px',
            background: 'radial-gradient(circle, rgba(192,132,252,0.1) 0%, transparent 65%)',
            borderRadius: '50%',
          }} className="animate-orb" />
          {/* Grid lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '80px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>

          {/* Left: copy */}
          <div>
            <div className="animate-fade-in-up-1" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.35)',
              borderRadius: '100px', padding: '5px 14px', marginBottom: '28px',
              fontSize: '0.8rem', color: '#a78bfa', fontWeight: 500,
            }}>
              <span className="animate-dot-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} />
              Your ink. Your identity.
            </div>

            <h1 className="animate-fade-in-up-2" style={{
              fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
              fontWeight: 900, lineHeight: 1.0,
              letterSpacing: '-0.04em', marginBottom: '24px',
            }}>
              One scan.<br />
              <span style={{
                background: 'linear-gradient(135deg, #c084fc, #7c3aed)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Endless you.</span>
            </h1>

            <p className="animate-fade-in-up-3" style={{
              fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7,
              maxWidth: '440px', marginBottom: '36px',
            }}>
              A QR code tattoo linked to a profile you control. Change your links, bio, and look — your ink stays the same.
            </p>

            <div className="animate-fade-in-up-4" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" className="btn-primary" style={{
                textDecoration: 'none', fontSize: '1rem', padding: '14px 28px',
                boxShadow: '0 0 40px rgba(124,58,237,0.5)',
              }}>
                Get started — free
              </Link>
              <Link href="#how" className="btn-secondary" style={{ textDecoration: 'none', fontSize: '1rem', padding: '14px 28px' }}>
                How it works ↓
              </Link>
            </div>

            {/* Trust badges */}
            <div className="animate-fade-in-up-4" style={{ display: 'flex', gap: '24px', marginTop: '40px', flexWrap: 'wrap' }}>
              {['Free profile', 'Instant updates', 'Ships worldwide'].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#6b7280' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="#7c3aed" strokeWidth="1.5"/>
                    <path d="M4.5 7l1.8 1.8L9.5 5" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right: hero visual */}
          <div className="animate-float" style={{ display: 'flex', justifyContent: 'center' }}>
            <HeroVisual />
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{ fontSize: '0.7rem', color: '#4b5563', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</div>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, #7c3aed, transparent)' }} className="animate-pulse-glow" />
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ padding: '120px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <p style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>How it works</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em' }}>Three steps.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2px', background: '#111', borderRadius: '20px', overflow: 'hidden', border: '1px solid #1a1a1a' }}>
            {[
              {
                n: '01',
                visual: <ProfileVisual />,
                title: 'Build your profile',
                sub: 'Add links, bio, photo. Make it yours.',
              },
              {
                n: '02',
                visual: <OrderVisual />,
                title: 'Order your tattoo',
                sub: 'We print your unique QR. Pro quality.',
              },
              {
                n: '03',
                visual: <UpdateVisual />,
                title: 'Update anytime',
                sub: 'Your ink never changes. Your profile can.',
              },
            ].map((s, i) => (
              <div key={i} style={{
                background: '#080808', padding: '48px 32px',
                display: 'flex', flexDirection: 'column', gap: '24px',
                borderRight: i < 2 ? '1px solid #111' : 'none',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: '20px', right: '24px',
                  fontSize: '4.5rem', fontWeight: 900, color: '#0f0f0f',
                  lineHeight: 1, userSelect: 'none',
                }}>{s.n}</div>
                <div>{s.visual}</div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>{s.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6 }}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Showcase ── */}
      <section style={{ background: '#050505', borderTop: '1px solid #111', borderBottom: '1px solid #111', padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '800px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>The profile</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '20px', lineHeight: 1.1 }}>
              Everything about you.<br />
              <span style={{ color: '#7c3aed' }}>One link.</span>
            </h2>
            <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: '32px', fontSize: '0.95rem', maxWidth: '380px' }}>
              Unlimited links. Custom bio. Profile photo. Change it all in seconds — no reprinting ever.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Custom username & vanity URL', 'Unlimited links with drag reorder', 'Instant live updates', 'QR code that never expires'].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#d1d5db' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 2.5" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
      <section style={{ padding: '80px 24px', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '48px', textAlign: 'center' }}>
          {[
            { val: '∞', label: 'Link updates' },
            { val: '0', label: 'Monthly fee' },
            { val: '1', label: 'Tattoo needed' },
            { val: '↑', label: 'Your control' },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#a78bfa', marginBottom: '6px', letterSpacing: '-0.02em' }}>{s.val}</div>
              <div style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who is it for ── */}
      <section style={{ padding: '120px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Who it's for</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em' }}>Built for creators.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🎨', label: 'Artists' },
              { icon: '🎵', label: 'Musicians' },
              { icon: '📸', label: 'Photographers' },
              { icon: '✍️', label: 'Writers' },
              { icon: '🏋️', label: 'Athletes' },
              { icon: '💻', label: 'Developers' },
            ].map((c) => (
              <div key={c.label} style={{
                background: '#0e0e0e', border: '1px solid #1a1a1a',
                borderRadius: '16px', padding: '28px 16px',
                textAlign: 'center', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '10px',
                transition: 'border-color 0.2s',
              }}>
                <span style={{ fontSize: '2rem' }}>{c.icon}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#d1d5db' }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '120px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        {/* Decorative rings */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px', height: '500px',
          border: '1px solid rgba(124,58,237,0.08)',
          borderRadius: '50%', pointerEvents: 'none',
        }} className="animate-spin-slow" />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px', height: '700px',
          border: '1px solid rgba(124,58,237,0.05)',
          borderRadius: '50%', pointerEvents: 'none',
        }} className="animate-spin-slow" />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '20px', lineHeight: 1.05 }}>
            Commit to your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>identity.</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1.05rem', marginBottom: '40px', maxWidth: '400px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Free profile. No subscriptions. Order when you're ready.
          </p>
          <Link href="/auth/signup" className="btn-primary animate-pulse-glow" style={{
            textDecoration: 'none', fontSize: '1.05rem', padding: '16px 44px',
          }}>
            Start for free →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid #111', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <div style={{
            width: '26px', height: '26px', borderRadius: '7px',
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '13px', color: 'white',
          }}>I</div>
          <span style={{ fontWeight: 700, color: '#9ca3af', fontSize: '0.95rem' }}>InkyIdentity</span>
        </div>
        <div style={{ display: 'flex', gap: '28px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          <Link href="/auth/login" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.875rem' }}>Sign in</Link>
          <Link href="/auth/signup" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.875rem' }}>Create account</Link>
        </div>
        <p style={{ color: '#2a2a2a', fontSize: '0.8rem' }}>© {new Date().getFullYear()} InkyIdentity. Built for those who commit.</p>
      </footer>
    </div>
  );
}

/* ── Visuals ── */

function HeroVisual() {
  return (
    <svg width="380" height="420" viewBox="0 0 380 420" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glow backdrop */}
      <ellipse cx="190" cy="210" rx="160" ry="160" fill="url(#heroGlow)" />

      {/* Arm */}
      <ellipse cx="190" cy="300" rx="90" ry="120" fill="#141414" stroke="#222" strokeWidth="1" />
      <ellipse cx="190" cy="290" rx="80" ry="108" fill="#181818" />
      <ellipse cx="190" cy="275" rx="68" ry="88" fill="url(#armShade)" opacity="0.5" />

      {/* Tattoo sticker on arm */}
      <rect x="148" y="245" width="84" height="84" rx="8" fill="white" opacity="0.97" />
      <rect x="150" y="247" width="84" height="84" rx="7" fill="white" />
      {/* QR finders */}
      <rect x="155" y="252" width="24" height="24" rx="2" fill="#111" />
      <rect x="158" y="255" width="18" height="18" rx="1" fill="white" />
      <rect x="161" y="258" width="12" height="12" rx="1" fill="#111" />
      <rect x="201" y="252" width="24" height="24" rx="2" fill="#111" />
      <rect x="204" y="255" width="18" height="18" rx="1" fill="white" />
      <rect x="207" y="258" width="12" height="12" rx="1" fill="#111" />
      <rect x="155" y="298" width="24" height="24" rx="2" fill="#111" />
      <rect x="158" y="301" width="18" height="18" rx="1" fill="white" />
      <rect x="161" y="304" width="12" height="12" rx="1" fill="#111" />
      {/* Data dots */}
      {[[183,252],[189,252],[195,252],[183,258],[195,258],[183,264],[189,264],[195,264],
        [183,276],[189,276],[195,276],[183,282],[183,288],[195,288],[189,294],[195,294],
        [201,282],[207,282],[213,276],[207,288],[213,288],[207,294],[213,294]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="4" height="4" fill="#111" />
      ))}

      {/* Scan line on tattoo */}
      <rect x="148" y="245" width="84" height="2" rx="1" fill="url(#scanGrad)" opacity="0.8" className="animate-scan-line" style={{ position: 'absolute' }} />

      {/* Phone mockup */}
      <rect x="260" y="60" width="100" height="180" rx="14" fill="#111" stroke="#2a2a2a" strokeWidth="1.5" />
      <rect x="266" y="74" width="88" height="152" rx="8" fill="#0a0a0a" />
      {/* Notch */}
      <rect x="296" y="65" width="28" height="7" rx="3.5" fill="#1a1a1a" />
      {/* Profile content on phone */}
      <circle cx="310" cy="108" r="18" fill="url(#profileGrad)" />
      <text x="310" y="113" textAnchor="middle" fontSize="14" fill="white" fontWeight="700">✦</text>
      <rect x="287" y="132" width="46" height="6" rx="3" fill="#222" />
      <rect x="293" y="142" width="34" height="4" rx="2" fill="#1a1a1a" />
      {['Portfolio','Instagram','Booking'].map((l, i) => (
        <g key={l}>
          <rect x="274" y={157 + i * 24} width="72" height="18" rx="5" fill="#161616" stroke="#222" strokeWidth="0.5" />
          <text x="310" y={169 + i * 24} textAnchor="middle" fontSize="7" fill="#9ca3af">{l}</text>
        </g>
      ))}

      {/* Arrow connecting tattoo to phone */}
      <path d="M 240 290 Q 260 250 265 200" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.6" />
      <circle cx="265" cy="200" r="3" fill="#7c3aed" opacity="0.8" />

      {/* Floating tags */}
      <g className="animate-float">
        <rect x="10" y="80" width="100" height="34" rx="8" fill="#111" stroke="#2a2a2a" strokeWidth="1" />
        <text x="26" y="97" fontSize="9" fill="#7c3aed">⬡</text>
        <text x="36" y="97" fontSize="9" fill="#d1d5db" fontWeight="600">Unique QR</text>
        <text x="26" y="108" fontSize="7.5" fill="#4b5563">Never expires</text>
      </g>
      <g className="animate-float" style={{ animationDelay: '1s' }}>
        <rect x="16" y="170" width="106" height="34" rx="8" fill="#111" stroke="#2a2a2a" strokeWidth="1" />
        <text x="26" y="187" fontSize="9" fill="#a78bfa">✎</text>
        <text x="38" y="187" fontSize="9" fill="#d1d5db" fontWeight="600">Live updates</text>
        <text x="26" y="198" fontSize="7.5" fill="#4b5563">Edit any time</text>
      </g>
      <g className="animate-float" style={{ animationDelay: '2s' }}>
        <rect x="8" y="380" width="120" height="34" rx="8" fill="#111" stroke="#2a2a2a" strokeWidth="1" />
        <text x="26" y="397" fontSize="9" fill="#c084fc">◈</text>
        <text x="38" y="397" fontSize="9" fill="#d1d5db" fontWeight="600">Tattoo quality</text>
        <text x="26" y="408" fontSize="7.5" fill="#4b5563">Ships worldwide</text>
      </g>

      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#080808" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="armShade" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.12" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.9" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ProfileVisual() {
  return (
    <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="140" height="100" rx="12" fill="#0e0e0e" />
      <circle cx="70" cy="32" r="18" fill="url(#pvGrad)" />
      <text x="70" y="37" textAnchor="middle" fontSize="14" fill="white" fontWeight="700">✦</text>
      <rect x="44" y="56" width="52" height="7" rx="3.5" fill="#1f1f1f" />
      <rect x="52" y="67" width="36" height="5" rx="2.5" fill="#161616" />
      {['Link 1', 'Link 2'].map((l, i) => (
        <rect key={l} x="28" y={78 + i * 12} width="84" height="9" rx="4" fill="#161616" stroke="#222" strokeWidth="0.5" />
      ))}
      <defs>
        <linearGradient id="pvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function OrderVisual() {
  return (
    <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="140" height="100" rx="12" fill="#0e0e0e" />
      {/* QR code */}
      <rect x="40" y="16" width="60" height="60" rx="6" fill="white" opacity="0.95" />
      <rect x="45" y="21" width="18" height="18" rx="1.5" fill="#111" />
      <rect x="47" y="23" width="14" height="14" rx="1" fill="white" />
      <rect x="49" y="25" width="10" height="10" rx="0.5" fill="#111" />
      <rect x="77" y="21" width="18" height="18" rx="1.5" fill="#111" />
      <rect x="79" y="23" width="14" height="14" rx="1" fill="white" />
      <rect x="81" y="25" width="10" height="10" rx="0.5" fill="#111" />
      <rect x="45" y="53" width="18" height="18" rx="1.5" fill="#111" />
      <rect x="47" y="55" width="14" height="14" rx="1" fill="white" />
      <rect x="49" y="57" width="10" height="10" rx="0.5" fill="#111" />
      {[[65,21],[71,21],[65,27],[65,33],[71,33],[65,39],[71,39],[77,39],[83,39],[77,45],[83,51],[77,57],[83,57],[65,51],[65,57]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="4" height="4" fill="#111" />
      ))}
      {/* Label */}
      <rect x="30" y="82" width="80" height="12" rx="6" fill="rgba(124,58,237,0.15)" />
      <text x="70" y="92" textAnchor="middle" fontSize="7" fill="#a78bfa" fontWeight="700">YOUR UNIQUE CODE</text>
    </svg>
  );
}

function UpdateVisual() {
  return (
    <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="140" height="100" rx="12" fill="#0e0e0e" />
      {/* Before */}
      <rect x="12" y="20" width="52" height="60" rx="8" fill="#111" stroke="#1f1f1f" strokeWidth="1" />
      <circle cx="38" cy="38" r="10" fill="#1f1f1f" />
      <rect x="20" y="52" width="36" height="4" rx="2" fill="#1f1f1f" />
      <rect x="18" y="60" width="40" height="7" rx="3" fill="#161616" />
      <rect x="18" y="70" width="40" height="7" rx="3" fill="#161616" />
      {/* Arrow */}
      <path d="M 68 50 L 76 50" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      <path d="M 73 46 L 77 50 L 73 54" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* After */}
      <rect x="80" y="20" width="52" height="60" rx="8" fill="#111" stroke="#7c3aed" strokeWidth="1" />
      <circle cx="106" cy="38" r="10" fill="url(#upGrad)" />
      <text x="106" y="42" textAnchor="middle" fontSize="9" fill="white">✦</text>
      <rect x="88" y="52" width="36" height="4" rx="2" fill="#1f1f1f" />
      {['New link','Portfolio','Booking'].map((l, i) => (
        <rect key={l} x="86" y={60 + i * 9} width="40" height="7" rx="3" fill={i === 0 ? 'rgba(124,58,237,0.25)' : '#161616'} />
      ))}
      <defs>
        <linearGradient id="upGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PhoneMockup() {
  return (
    <svg width="240" height="460" viewBox="0 0 240 460" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Phone shell */}
      <rect x="4" y="4" width="232" height="452" rx="36" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="2" />
      <rect x="8" y="8" width="224" height="444" rx="33" fill="#080808" stroke="#1a1a1a" strokeWidth="1" />
      {/* Screen */}
      <rect x="12" y="12" width="216" height="436" rx="30" fill="#0d0d0d" />
      {/* Notch */}
      <rect x="84" y="16" width="72" height="22" rx="11" fill="#0a0a0a" />
      {/* Side buttons */}
      <rect x="0" y="100" width="4" height="40" rx="2" fill="#1a1a1a" />
      <rect x="0" y="150" width="4" height="60" rx="2" fill="#1a1a1a" />
      <rect x="236" y="120" width="4" height="70" rx="2" fill="#1a1a1a" />

      {/* Profile screen content */}
      {/* Header gradient */}
      <rect x="12" y="12" width="216" height="120" rx="30" fill="url(#phoneHeader)" />
      <rect x="12" y="110" width="216" height="32" fill="url(#phoneFade)" />

      {/* Avatar */}
      <circle cx="120" cy="100" r="36" fill="url(#phoneAvatar)" />
      <circle cx="120" cy="100" r="36" stroke="#080808" strokeWidth="3" />
      <text x="120" y="107" textAnchor="middle" fontSize="24" fill="white" fontWeight="700">✦</text>

      {/* Name */}
      <text x="120" y="158" textAnchor="middle" fontSize="16" fill="white" fontWeight="800">@james</text>
      <text x="120" y="174" textAnchor="middle" fontSize="11" fill="#6b7280">Artist &amp; creator · London</text>

      {/* Bio */}
      <text x="120" y="196" textAnchor="middle" fontSize="10" fill="#4b5563">Tattoo artist. Visual storyteller.</text>

      {/* Links */}
      {[
        { label: 'Portfolio', icon: '◈', y: 216 },
        { label: 'Instagram', icon: '⬡', y: 248 },
        { label: 'Book a session', icon: '◎', y: 280 },
        { label: 'YouTube', icon: '↗', y: 312 },
      ].map((link) => (
        <g key={link.label}>
          <rect x="28" y={link.y} width="184" height="28" rx="8" fill="#111" stroke="#1f1f1f" strokeWidth="1" />
          <text x="52" y={link.y + 18} fontSize="10" fill="#7c3aed">{link.icon}</text>
          <text x="120" y={link.y + 18} textAnchor="middle" fontSize="10" fill="#d1d5db" fontWeight="500">{link.label}</text>
        </g>
      ))}

      {/* QR section */}
      <rect x="28" y="352" width="184" height="76" rx="10" fill="#0e0e0e" stroke="#1a1a1a" strokeWidth="1" />
      <rect x="48" y="362" width="48" height="48" rx="4" fill="white" opacity="0.95" />
      {/* Mini QR */}
      <rect x="50" y="364" width="12" height="12" rx="1" fill="#111" />
      <rect x="51.5" y="365.5" width="9" height="9" rx="0.5" fill="white" />
      <rect x="53" y="367" width="6" height="6" rx="0.5" fill="#111" />
      <rect x="66" y="364" width="12" height="12" rx="1" fill="#111" />
      <rect x="67.5" y="365.5" width="9" height="9" rx="0.5" fill="white" />
      <rect x="69" y="367" width="6" height="6" rx="0.5" fill="#111" />
      <rect x="50" y="378" width="12" height="12" rx="1" fill="#111" />
      <rect x="51.5" y="379.5" width="9" height="9" rx="0.5" fill="white" />
      <rect x="53" y="381" width="6" height="6" rx="0.5" fill="#111" />
      {[[63,376],[63,380],[63,384],[63,388],[67,376],[71,376],[75,376],[75,380],[71,384],[75,388],[67,384],[67,388],[71,388]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="3" height="3" fill="#111" />
      ))}
      <text x="154" y="384" textAnchor="middle" fontSize="9" fill="#d1d5db" fontWeight="600">Scan my tattoo</text>
      <text x="154" y="397" textAnchor="middle" fontSize="8" fill="#4b5563">@james.inkyi.com</text>

      <defs>
        <linearGradient id="phoneHeader" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#080808" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="phoneFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0d0d0d" stopOpacity="0" />
          <stop offset="100%" stopColor="#0d0d0d" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="phoneAvatar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
}
