import { notFound } from 'next/navigation';
import getDb from '@/lib/db';
import type { Metadata } from 'next';
import Link from 'next/link';
import PlatformIcon from '@/components/PlatformIcon';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const db = getDb();
  const user = db.prepare('SELECT username, bio FROM users WHERE display_id = ?').get(id) as {
    username: string; bio: string;
  } | undefined;

  if (!user) return { title: 'Profile not found — InkyIdentity' };
  return {
    title: `@${user.username} — InkyIdentity`,
    description: user.bio || `${user.username}'s digital identity. Powered by InkyIdentity.`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const db = getDb();

  const user = db.prepare(
    'SELECT display_id, username, bio, avatar_url, theme, whatsapp_number, whatsapp_enabled FROM users WHERE display_id = ?'
  ).get(id) as {
    display_id: string; username: string; bio: string; avatar_url: string; theme: string;
    whatsapp_number: string; whatsapp_enabled: number;
  } | undefined;

  if (!user) notFound();

  const links = db.prepare(
    'SELECT id, title, url, icon FROM links WHERE user_id = (SELECT id FROM users WHERE display_id = ?) AND active = 1 ORDER BY position ASC, id ASC'
  ).all(id) as { id: number; title: string; url: string; icon: string }[];

  const initial = user.username[0].toUpperCase();

  return (
    <>
      <style>{`
        .profile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--ink-1);
          border: 1px solid var(--ink-3);
          border-radius: 12px;
          padding: 16px 20px;
          text-decoration: none;
          color: var(--paper);
          transition: border-color 0.2s, background 0.2s, transform 0.15s, box-shadow 0.15s;
          font-weight: 600;
          font-size: 0.95rem;
        }
        .profile-link:hover {
          border-color: var(--carmine);
          background: var(--ink-1);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px var(--carmine-tint);
        }
        .whatsapp-btn:hover {
          background: rgba(37, 211, 102, 0.2);
          border-color: rgba(37, 211, 102, 0.6);
          transform: translateY(-2px);
        }
      `}</style>
      <div style={{
        minHeight: '100vh', background: 'var(--ink-0)', color: 'var(--paper)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '60px 16px 80px',
      }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          {/* Avatar */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt={user.username}
                width={88}
                height={88}
                style={{ borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--carmine)' }}
              />
            ) : (
              <div style={{
                width: '88px', height: '88px', borderRadius: '50%',
                background: 'var(--carmine)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 800, margin: '0 auto',
                boxShadow: '0 0 30px var(--carmine-glow)',
              }}>
                {initial}
              </div>
            )}

            <h1 style={{
              fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em',
              marginTop: '16px', marginBottom: '8px',
            }}>
              @{user.username}
            </h1>

            {user.bio && (
              <p style={{
                color: 'var(--paper-2)', fontSize: '0.95rem', lineHeight: 1.6,
                maxWidth: '360px', margin: '0 auto',
              }}>
                {user.bio}
              </p>
            )}
          </div>

          {/* WhatsApp button */}
          {user.whatsapp_enabled && user.whatsapp_number && (
            <a
              href={`https://wa.me/${user.whatsapp_number.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                background: 'rgba(37, 211, 102, 0.12)',
                border: '1.5px solid rgba(37, 211, 102, 0.35)',
                borderRadius: '12px', padding: '14px 20px',
                textDecoration: 'none', color: 'var(--paper)',
                fontWeight: 700, fontSize: '0.95rem',
                marginBottom: '20px',
                transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
              }}
              className="whatsapp-btn"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#25D366" style={{ flexShrink: 0 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Message me on WhatsApp
            </a>
          )}

          {/* Links */}
          {links.length === 0 ? (
            <div style={{
              textAlign: 'center', color: 'var(--paper-4)', padding: '40px',
              background: 'var(--ink-1)', borderRadius: '12px', border: '1px solid var(--ink-3)',
            }}>
              No links added yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {links.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-link"
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <PlatformIcon platformId={link.icon || 'website'} size={18} />
                    {link.title}
                  </span>
                  <span style={{ color: 'var(--carmine)', fontSize: '1rem' }}>↗</span>
                </a>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              textDecoration: 'none', color: 'var(--paper-4)', fontSize: '0.8rem',
            }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '4px',
                background: 'var(--carmine)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '10px', color: 'white',
              }}>I</div>
              Powered by InkyIdentity
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
