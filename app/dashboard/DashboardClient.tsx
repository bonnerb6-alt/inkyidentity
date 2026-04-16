'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { detectPlatform, getPlatformById } from '@/lib/platforms';

function InlinePlatformIcon({ platformId, size = 20 }: { platformId: string; size?: number }) {
  const platform = getPlatformById(platformId);
  const bg = ['#ffffff', '#FFFC00', '#FFDD00'].includes(platform.color) ? '#1a1a1a' : platform.color + '22';
  const iconColor = platform.color === '#000000' ? '#ffffff' : platform.color;
  return (
    <div style={{
      width: size + 8, height: size + 8, borderRadius: '6px', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <svg viewBox="0 0 24 24" width={size} height={size} fill={iconColor}
        dangerouslySetInnerHTML={{ __html: platform.svg }} />
    </div>
  );
}

interface User {
  id: string; display_id: string; username: string; email: string;
  bio: string; avatar_url: string; theme: string;
  whatsapp_number: string; whatsapp_enabled: number;
}
interface LinkItem { id: number; title: string; url: string; icon: string; active: number; position: number; }
interface Order { id: number; size: string; quantity: number; status: string; created_at: number; }

type Tab = 'links' | 'profile' | 'preview' | 'qr' | 'orders';

export default function DashboardClient({
  user: initialUser, initialLinks, orders,
}: {
  user: User; initialLinks: LinkItem[]; orders: Order[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('links');
  const [user, setUser] = useState(initialUser);
  const [links, setLinks] = useState(initialLinks);
  const [qrData, setQrData] = useState<{ dataUrl: string; profileUrl: string } | null>(null);
  const [newLink, setNewLink] = useState({ title: '', url: '', icon: 'website' });
  const [detectedPlatform, setDetectedPlatform] = useState('website');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ title: '', url: '', icon: 'website' });
  const [profileForm, setProfileForm] = useState({
    username: user.username,
    bio: user.bio,
    avatar_url: user.avatar_url || '',
    whatsapp_number: user.whatsapp_number || '',
    whatsapp_enabled: !!user.whatsapp_enabled,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (tab === 'qr' && !qrData) {
      fetch('/api/qr').then(r => r.json()).then(d => setQrData(d));
    }
  }, [tab, qrData]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  function handleUrlChange(url: string) {
    const platform = detectPlatform(url);
    setDetectedPlatform(platform.id);
    const autoTitle = platform.id !== 'website' && !newLink.title ? platform.name : newLink.title;
    setNewLink(prev => ({ ...prev, url, icon: platform.id, title: autoTitle }));
  }

  async function addLink(e: React.FormEvent) {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return;
    const res = await fetch('/api/links', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLink),
    });
    const data = await res.json();
    if (res.ok) {
      setLinks([...links, data.link]);
      setNewLink({ title: '', url: '', icon: 'website' });
      setDetectedPlatform('website');
    } else {
      setMsg(data.error);
    }
  }

  async function deleteLink(id: number) {
    await fetch('/api/links', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setLinks(links.filter(l => l.id !== id));
  }

  async function toggleLink(link: LinkItem) {
    const res = await fetch('/api/links', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: link.id, active: link.active ? 0 : 1 }),
    });
    const data = await res.json();
    if (res.ok) setLinks(links.map(l => l.id === link.id ? data.link : l));
  }

  async function saveEdit(id: number) {
    const res = await fetch('/api/links', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editData }),
    });
    const data = await res.json();
    if (res.ok) {
      setLinks(links.map(l => l.id === id ? data.link : l));
      setEditingId(null);
    }
  }

  function handleAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 200;
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale, h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        setProfileForm(f => ({ ...f, avatar_url: canvas.toDataURL('image/jpeg', 0.85) }));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/profile', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileForm),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setUser(data.user);
      setMsg('Profile saved!');
      setTimeout(() => setMsg(''), 3000);
    } else {
      setMsg(data.error);
    }
  }

  const cardStyle: React.CSSProperties = {
    background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px',
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '0.875rem', fontWeight: 500, border: 'none',
    background: active ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
    color: active ? '#a78bfa' : '#6b7280',
    transition: 'all 0.15s',
  });

  const statusColors: Record<string, string> = {
    pending: '#f59e0b', processing: '#3b82f6',
    shipped: '#10b981', delivered: '#10b981', cancelled: '#ef4444',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#f9fafb' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid #1f1f1f', padding: '0 24px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(10px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '7px',
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '14px', color: 'white',
            }}>I</div>
            <span style={{ color: '#f9fafb', fontWeight: 700, fontSize: '1rem' }}>InkyIdentity</span>
          </Link>
        </div>
        <div className="dash-header-actions">
          <Link
            href={`/u/${user.display_id}`}
            target="_blank"
            className="dash-header-secondary"
            style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none', alignItems: 'center' }}
          >
            ↗ View profile
          </Link>
          <Link
            href="/admin"
            className="dash-header-secondary"
            style={{
              fontSize: '0.75rem', textDecoration: 'none', fontWeight: 700,
              background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171', borderRadius: '6px', padding: '3px 8px', alignItems: 'center',
            }}
          >
            Admin
          </Link>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '14px', cursor: 'pointer', flexShrink: 0,
          }} title={user.username}>
            {user.username[0].toUpperCase()}
          </div>
          <button onClick={logout} style={{
            background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '7px',
            color: '#6b7280', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            Sign out
          </button>
        </div>
      </header>

      {/* Layout */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Welcome */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>
            Hey, @{user.username}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            Manage your links, profile, and QR tattoo.
          </p>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px', marginBottom: '32px',
        }}>
          {[
            { label: 'Profile URL', value: `/u/${user.display_id}`, small: true },
            { label: 'Active links', value: String(links.filter(l => l.active).length) },
            { label: 'Total orders', value: String(orders.length) },
          ].map((s, i) => (
            <div key={i} style={{ ...cardStyle, padding: '16px 20px' }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>{s.label}</div>
              <div style={{
                fontWeight: 700, fontSize: s.small ? '0.9rem' : '1.5rem',
                color: s.small ? '#a78bfa' : '#f9fafb',
              }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tab-bar" style={{ marginBottom: '24px' }}>
          {(['links', 'profile', 'preview', 'qr', 'orders'] as Tab[]).map(t => (
            <button key={t} style={{ ...tabStyle(tab === t), whiteSpace: 'nowrap' }} onClick={() => setTab(t)}>
              {t === 'qr' ? 'QR Code' : t === 'preview' ? '👁 Preview' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {msg && (
          <div style={{
            background: msg.includes('!') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${msg.includes('!') ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: '8px', padding: '10px 16px',
            color: msg.includes('!') ? '#34d399' : '#f87171',
            marginBottom: '20px', fontSize: '0.875rem',
          }}>{msg}</div>
        )}

        {/* LINKS TAB */}
        {tab === 'links' && (
          <div>
            {/* Add link form */}
            <div style={{ ...cardStyle, padding: '24px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Add a link</h2>
              <form onSubmit={addLink}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {/* URL input with auto-detect */}
                  <div style={{ flex: '2', minWidth: '200px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
                      <InlinePlatformIcon platformId={detectedPlatform} size={16} />
                    </div>
                    <input
                      placeholder="Paste a URL — icon auto-detects"
                      value={newLink.url}
                      onChange={e => handleUrlChange(e.target.value)}
                      style={{ paddingLeft: '42px' }}
                      type="url"
                      required
                    />
                  </div>
                  <input
                    placeholder="Label (auto-filled for known platforms)"
                    value={newLink.title}
                    onChange={e => setNewLink({ ...newLink, title: e.target.value })}
                    style={{ flex: '1', minWidth: '160px' }}
                    required
                  />
                  <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                    + Add
                  </button>
                </div>
                {detectedPlatform !== 'website' && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '0.8rem', color: '#a78bfa',
                  }}>
                    <InlinePlatformIcon platformId={detectedPlatform} size={14} />
                    Detected: {getPlatformById(detectedPlatform).name}
                  </div>
                )}
              </form>
            </div>

            {/* Links list */}
            {links.length === 0 ? (
              <div style={{ ...cardStyle, padding: '48px', textAlign: 'center', color: '#4b5563' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>↗</div>
                <p>No links yet. Add your first link above.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map(link => (
                  <div key={link.id} style={{
                    ...cardStyle, padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    opacity: link.active ? 1 : 0.5,
                  }}>
                    {editingId === link.id ? (
                      <div style={{ flex: 1, display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <input
                          value={editData.url}
                          onChange={e => {
                            const p = detectPlatform(e.target.value);
                            setEditData({ ...editData, url: e.target.value, icon: p.id });
                          }}
                          style={{ flex: '2', minWidth: '180px' }}
                          placeholder="URL"
                        />
                        <input
                          value={editData.title}
                          onChange={e => setEditData({ ...editData, title: e.target.value })}
                          style={{ flex: '1', minWidth: '120px' }}
                          placeholder="Label"
                        />
                        <button className="btn-primary" style={{ padding: '8px 16px' }} onClick={() => saveEdit(link.id)}>Save</button>
                        <button className="btn-secondary" style={{ padding: '8px 16px' }} onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        <InlinePlatformIcon platformId={link.icon || 'website'} size={18} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{link.title}</div>
                          <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '2px' }}>
                            {link.url.length > 60 ? link.url.slice(0, 60) + '…' : link.url}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            onClick={() => toggleLink(link)}
                            style={{
                              background: link.active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                              border: `1px solid ${link.active ? 'rgba(16, 185, 129, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`,
                              color: link.active ? '#34d399' : '#6b7280',
                              borderRadius: '6px', padding: '4px 10px',
                              fontSize: '0.75rem', cursor: 'pointer',
                            }}
                          >
                            {link.active ? 'On' : 'Off'}
                          </button>
                          <button
                            onClick={() => { setEditingId(link.id); setEditData({ title: link.title, url: link.url, icon: link.icon || 'website' }); }}
                            style={{
                              background: 'transparent', border: '1px solid #2a2a2a',
                              color: '#9ca3af', borderRadius: '6px', padding: '4px 10px',
                              fontSize: '0.75rem', cursor: 'pointer',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteLink(link.id)}
                            style={{
                              background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#f87171', borderRadius: '6px', padding: '4px 10px',
                              fontSize: '0.75rem', cursor: 'pointer',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div style={{ maxWidth: '520px' }}>
            <form onSubmit={saveProfile}>

              {/* Photo upload */}
              <div style={{ ...cardStyle, padding: '24px', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Profile photo</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Avatar preview */}
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0,
                    background: profileForm.avatar_url ? 'transparent' : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', border: '2px solid #2a2a2a',
                    fontSize: '28px', fontWeight: 700, color: 'white',
                  }}>
                    {profileForm.avatar_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={profileForm.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : user.username[0].toUpperCase()
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px',
                      padding: '9px 16px', cursor: 'pointer', fontSize: '0.875rem',
                      color: '#d1d5db', fontWeight: 500, marginBottom: '8px',
                      transition: 'border-color 0.2s',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M2 11V13H14V11M8 2V10M5 5L8 2L11 5" />
                      </svg>
                      Upload photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFile}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {profileForm.avatar_url && (
                      <button
                        type="button"
                        onClick={() => setProfileForm(f => ({ ...f, avatar_url: '' }))}
                        style={{
                          display: 'block', background: 'transparent', border: 'none',
                          color: '#6b7280', fontSize: '0.78rem', cursor: 'pointer', padding: 0,
                        }}
                      >
                        Remove photo
                      </button>
                    )}
                    <p style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '4px' }}>JPG, PNG or GIF · Auto-cropped to square</p>
                  </div>
                </div>
              </div>

              {/* Username & Bio */}
              <div style={{ ...cardStyle, padding: '24px', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Profile info</h2>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db' }}>
                    Username
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }}>@</span>
                    <input
                      value={profileForm.username}
                      onChange={e => setProfileForm({ ...profileForm, username: e.target.value })}
                      style={{ paddingLeft: '32px' }}
                      minLength={3} maxLength={30}
                      pattern="[a-zA-Z0-9_\-]+"
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db' }}>
                    Bio
                  </label>
                  <textarea
                    value={profileForm.bio}
                    onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                    placeholder="Tell people a little about yourself…"
                    rows={3}
                    maxLength={200}
                    style={{ resize: 'vertical' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '4px' }}>
                    {profileForm.bio.length}/200
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div style={{ ...cardStyle, padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: 'rgba(37, 211, 102, 0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>WhatsApp button</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Show a &quot;Message me&quot; button on your profile</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProfileForm(f => ({ ...f, whatsapp_enabled: !f.whatsapp_enabled }))}
                    style={{
                      width: '44px', height: '24px', borderRadius: '12px', border: 'none',
                      cursor: 'pointer', position: 'relative', flexShrink: 0,
                      background: profileForm.whatsapp_enabled ? '#25D366' : '#2a2a2a',
                      transition: 'background 0.2s',
                    }}
                  >
                    <span style={{
                      position: 'absolute', top: '3px',
                      left: profileForm.whatsapp_enabled ? '23px' : '3px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: 'white', transition: 'left 0.2s', display: 'block',
                    }} />
                  </button>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 500, color: '#d1d5db' }}>
                    WhatsApp number
                  </label>
                  <input
                    type="tel"
                    placeholder="+447911123456"
                    value={profileForm.whatsapp_number}
                    onChange={e => setProfileForm(f => ({ ...f, whatsapp_number: e.target.value }))}
                  />
                  <p style={{ fontSize: '0.72rem', color: '#4b5563', marginTop: '5px' }}>
                    Include country code, e.g. +44 for UK, +1 for US.
                  </p>
                </div>
              </div>

              {/* Profile link */}
              <div style={{ ...cardStyle, padding: '20px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: '#9ca3af' }}>Your profile link</h3>
                <div style={{
                  background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '8px',
                  padding: '10px 14px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#a78bfa',
                }}>
                  /u/{user.display_id}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '8px' }}>
                  This ID never changes. Your username is an alias — update it freely.
                </p>
              </div>

              {/* Save button at bottom */}
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
                style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px', opacity: saving ? 0.7 : 1 }}
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>

            </form>
          </div>
        )}

        {/* PREVIEW TAB */}
        {tab === 'preview' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Profile preview</h2>
                <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>This is exactly what people see when they scan your QR code.</p>
              </div>
              <Link
                href={`/u/${user.display_id}`}
                target="_blank"
                className="btn-secondary"
                style={{ textDecoration: 'none', fontSize: '0.875rem', padding: '8px 16px' }}
              >
                ↗ Open in new tab
              </Link>
            </div>

            {/* Phone frame */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '375px',
                background: '#1a1a1a',
                borderRadius: '44px',
                padding: '14px',
                boxShadow: '0 0 0 1px #2a2a2a, 0 0 60px rgba(124, 58, 237, 0.2), 0 40px 80px rgba(0,0,0,0.6)',
                position: 'relative',
              }}>
                {/* Phone notch */}
                <div style={{
                  width: '120px', height: '28px', background: '#111',
                  borderRadius: '14px', margin: '0 auto 10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2a2a2a' }} />
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#2a2a2a' }} />
                </div>

                {/* Screen */}
                <div style={{
                  borderRadius: '32px', overflow: 'hidden',
                  height: '680px', background: '#080808', position: 'relative',
                }}>
                  <iframe
                    src={`/u/${user.display_id}`}
                    style={{
                      width: '100%', height: '100%',
                      border: 'none', display: 'block',
                    }}
                    title="Profile preview"
                  />
                </div>

                {/* Home indicator */}
                <div style={{
                  width: '120px', height: '4px', background: '#2a2a2a',
                  borderRadius: '2px', margin: '10px auto 0',
                }} />
              </div>
            </div>

            <p style={{ textAlign: 'center', color: '#4b5563', fontSize: '0.8rem', marginTop: '20px' }}>
              Changes to your links and profile update instantly — no QR reprint needed.
            </p>
          </div>
        )}

        {/* QR TAB */}
        {tab === 'qr' && (
          <div style={{ maxWidth: '500px' }}>
            <div style={{ ...cardStyle, padding: '40px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Your QR code</h2>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '32px' }}>
                This QR code is permanent. It will always link to your profile.
              </p>
              {qrData ? (
                <>
                  <div style={{
                    background: 'white', borderRadius: '16px', padding: '20px',
                    display: 'inline-block', marginBottom: '24px',
                    boxShadow: '0 0 40px rgba(124, 58, 237, 0.3)',
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrData.dataUrl} alt="Your QR Code" width={240} height={240} />
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '6px' }}>Links to:</div>
                    <div style={{
                      background: '#0d0d0d', borderRadius: '8px', padding: '8px 14px',
                      fontFamily: 'monospace', fontSize: '0.8rem', color: '#a78bfa', wordBreak: 'break-all',
                    }}>
                      {qrData.profileUrl}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a
                      href={qrData.dataUrl}
                      download={`inkyidentity-qr-${user.display_id}.png`}
                      className="btn-primary"
                      style={{ textDecoration: 'none' }}
                    >
                      ↓ Download PNG
                    </a>
                    <Link href="/order" className="btn-secondary" style={{ textDecoration: 'none' }}>
                      Order tattoo →
                    </Link>
                  </div>
                </>
              ) : (
                <div style={{ padding: '40px', color: '#4b5563' }}>Generating QR code…</div>
              )}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Your orders</h2>
              <Link href="/order" className="btn-primary" style={{ textDecoration: 'none' }}>
                + New order
              </Link>
            </div>
            {orders.length === 0 ? (
              <div style={{ ...cardStyle, padding: '48px', textAlign: 'center', color: '#4b5563' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>◎</div>
                <p style={{ marginBottom: '16px' }}>No orders yet.</p>
                <Link href="/order" className="btn-primary" style={{ textDecoration: 'none' }}>
                  Place your first order
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {orders.map(order => {
                  const productLabels: Record<string, string> = { tattoo: 'QR Tattoo', cap: 'Baseball Cap', tshirt: 'T-Shirt' };
                  const productIcons: Record<string, string> = { tattoo: '⬡', cap: '🧢', tshirt: '👕' };
                  const label = productLabels[(order as { product_type?: string }).product_type || 'tattoo'] || 'Item';
                  const icon = productIcons[(order as { product_type?: string }).product_type || 'tattoo'] || '◎';
                  const variant = (order as { variant?: string }).variant;
                  return (
                    <div key={order.id} style={{ ...cardStyle, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '8px', background: '#1a1a1a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem', flexShrink: 0,
                      }}>{icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '3px' }}>
                          {label} — {order.size}{variant ? ` / ${variant}` : ''} × {order.quantity}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                          Order #{order.id} · {new Date(order.created_at * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <span style={{
                        background: `${statusColors[order.status] || '#6b7280'}20`,
                        border: `1px solid ${statusColors[order.status] || '#6b7280'}50`,
                        color: statusColors[order.status] || '#6b7280',
                        borderRadius: '100px', padding: '4px 12px',
                        fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize',
                      }}>
                        {order.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
