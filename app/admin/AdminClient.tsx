'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { AdminUser, AdminOrder } from './page';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', processing: '#3b82f6',
  shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444',
};
const PRODUCT_LABELS: Record<string, string> = { tattoo: 'QR Tattoo', cap: 'Baseball Cap', tshirt: 'T-Shirt' };
const PRODUCT_ICONS: Record<string, string> = { tattoo: '⬡', cap: '🧢', tshirt: '👕' };

type Tab = 'overview' | 'users' | 'orders';

export default function AdminClient({
  initialUsers, initialOrders, stats, currentUserId,
}: {
  initialUsers: AdminUser[];
  initialOrders: AdminOrder[];
  stats: { users: number; orders: number; activeLinks: { n: number }; pendingOrders: number };
  currentUserId: string;
}) {
  const [tab, setTab] = useState<Tab>('overview');
  const [users, setUsers] = useState(initialUsers);
  const [orders, setOrders] = useState(initialOrders);
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [msg, setMsg] = useState('');

  function flash(text: string) { setMsg(text); setTimeout(() => setMsg(''), 3000); }

  async function updateOrderStatus(orderId: number, status: string) {
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });
    const data = await res.json();
    if (res.ok) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      flash('Status updated');
    } else { flash(data.error); }
  }

  async function deleteUser(userId: string, username: string) {
    if (!confirm(`Delete @${username}? This removes all their links and orders too.`)) return;
    const res = await fetch('/api/admin/users', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      setUsers(users.filter(u => u.id !== userId));
      flash(`@${username} deleted`);
    } else {
      const d = await res.json(); flash(d.error);
    }
  }

  async function toggleAdmin(user: AdminUser) {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, is_admin: !user.is_admin }),
    });
    if (res.ok) {
      setUsers(users.map(u => u.id === user.id ? { ...u, is_admin: user.is_admin ? 0 : 1 } : u));
      flash(`@${user.username} ${user.is_admin ? 'removed from' : 'made'} admin`);
    }
  }

  const filteredUsers = users.filter(u =>
    !userSearch || u.username.includes(userSearch) || u.email.includes(userSearch)
  );
  const filteredOrders = orders.filter(o =>
    (statusFilter === 'all' || o.status === statusFilter) &&
    (!orderSearch || o.username.includes(orderSearch) || o.email.includes(orderSearch) || String(o.id).includes(orderSearch))
  );

  const card: React.CSSProperties = {
    background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px',
  };
  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '0.875rem', fontWeight: 500, border: 'none',
    background: active ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
    color: active ? '#a78bfa' : '#6b7280', transition: 'all 0.15s',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#f9fafb' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid #1f1f1f', padding: '0 24px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(10px)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '7px',
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '14px', color: 'white',
            }}>I</div>
            <span style={{ fontWeight: 700 }}>InkyIdentity</span>
          </Link>
          <span style={{
            background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171', borderRadius: '6px', padding: '2px 8px',
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em',
          }}>ADMIN</span>
        </div>
        <Link href="/dashboard" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
          ← Dashboard
        </Link>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Title */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>
            Admin panel
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Manage users, orders, and platform data.</p>
        </div>

        {/* Flash message */}
        {msg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px', padding: '10px 16px', color: '#34d399',
            marginBottom: '20px', fontSize: '0.875rem',
          }}>{msg}</div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '28px',
          background: '#0d0d0d', padding: '4px', borderRadius: '10px',
          border: '1px solid #1f1f1f', width: 'fit-content',
        }}>
          {(['overview', 'users', 'orders'] as Tab[]).map(t => (
            <button key={t} style={tabStyle(tab === t)} onClick={() => setTab(t)}>
              {t === 'overview' ? '◈ Overview' : t === 'users' ? `👤 Users (${users.length})` : `📦 Orders (${orders.length})`}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div>
            {/* Stat cards */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px', marginBottom: '32px',
            }}>
              {[
                { label: 'Total users',     value: stats.users,              color: '#a78bfa' },
                { label: 'Total orders',    value: stats.orders,             color: '#34d399' },
                { label: 'Active links',    value: stats.activeLinks.n,      color: '#60a5fa' },
                { label: 'Pending orders',  value: stats.pendingOrders,      color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} style={{ ...card, padding: '20px 24px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '8px' }}>{s.label}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Recent orders</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {orders.slice(0, 5).map(o => (
                  <div key={o.id} style={{ ...card, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.2rem' }}>{PRODUCT_ICONS[o.product_type] || '◎'}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {PRODUCT_LABELS[o.product_type] || o.product_type} — {o.size}
                        {o.variant ? ` / ${o.variant}` : ''} × {o.quantity}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '0.8rem', marginLeft: '8px' }}>by @{o.username}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {new Date(o.created_at * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                    <span style={{
                      background: `${STATUS_COLORS[o.status] || '#6b7280'}20`,
                      border: `1px solid ${STATUS_COLORS[o.status] || '#6b7280'}50`,
                      color: STATUS_COLORS[o.status] || '#6b7280',
                      borderRadius: '100px', padding: '3px 10px',
                      fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize',
                    }}>{o.status}</span>
                  </div>
                ))}
              </div>
              {orders.length > 5 && (
                <button onClick={() => setTab('orders')} style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', marginTop: '10px', fontSize: '0.875rem' }}>
                  View all {orders.length} orders →
                </button>
              )}
            </div>

            {/* Recent signups */}
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Recent signups</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {users.slice(0, 5).map(u => (
                  <div key={u.id} style={{ ...card, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '14px', flexShrink: 0,
                    }}>{u.username[0].toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>@{u.username}</span>
                      <span style={{ color: '#6b7280', fontSize: '0.8rem', marginLeft: '8px' }}>{u.email}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {new Date(u.created_at * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>{u.link_count} links · {u.order_count} orders</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input
                placeholder="Search by username or email…"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                style={{ flex: 1, minWidth: '220px' }}
              />
            </div>

            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '12px' }}>
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredUsers.map(u => (
                <div key={u.id} style={{ ...card, overflow: 'hidden' }}>
                  {/* Row */}
                  <div
                    style={{
                      padding: '16px 20px', display: 'flex', alignItems: 'center',
                      gap: '14px', cursor: 'pointer', flexWrap: 'wrap',
                    }}
                    onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                  >
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                      background: u.is_admin ? 'linear-gradient(135deg, #ef4444, #f97316)' : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '16px',
                    }}>{u.username[0].toUpperCase()}</div>

                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>@{u.username}</span>
                        {u.is_admin ? (
                          <span style={{
                            background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#f87171', borderRadius: '4px', padding: '1px 6px',
                            fontSize: '0.68rem', fontWeight: 700,
                          }}>ADMIN</span>
                        ) : null}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{u.email}</div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#6b7280', flexWrap: 'wrap' }}>
                      <span>{u.link_count} links</span>
                      <span>{u.order_count} orders</span>
                      <span>{new Date(u.created_at * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>

                    <span style={{ color: '#4b5563', fontSize: '0.75rem', transition: 'transform 0.15s', transform: expandedUser === u.id ? 'rotate(180deg)' : 'none' }}>
                      ▼
                    </span>
                  </div>

                  {/* Expanded */}
                  {expandedUser === u.id && (
                    <div style={{ borderTop: '1px solid #1f1f1f', padding: '20px', background: '#0d0d0d' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                        {[
                          { label: 'Display ID', value: `/u/${u.display_id}` },
                          { label: 'Bio', value: u.bio || '—' },
                          { label: 'WhatsApp', value: u.whatsapp_enabled && u.whatsapp_number ? `${u.whatsapp_number} (on)` : u.whatsapp_number || '—' },
                          { label: 'Joined', value: new Date(u.created_at * 1000).toLocaleString('en-GB') },
                        ].map(f => (
                          <div key={f.label}>
                            <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{f.label}</div>
                            <div style={{ fontSize: '0.85rem', color: '#d1d5db', wordBreak: 'break-all' }}>{f.value}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <Link
                          href={`/u/${u.display_id}`}
                          target="_blank"
                          style={{
                            padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem',
                            background: 'transparent', border: '1px solid #2a2a2a',
                            color: '#9ca3af', textDecoration: 'none',
                          }}
                        >
                          ↗ View profile
                        </Link>
                        {u.id !== currentUserId && (
                          <>
                            <button
                              onClick={() => toggleAdmin(u)}
                              style={{
                                padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem', cursor: 'pointer',
                                background: u.is_admin ? 'rgba(239, 68, 68, 0.1)' : 'rgba(124, 58, 237, 0.1)',
                                border: `1px solid ${u.is_admin ? 'rgba(239, 68, 68, 0.3)' : 'rgba(124, 58, 237, 0.3)'}`,
                                color: u.is_admin ? '#f87171' : '#a78bfa',
                              }}
                            >
                              {u.is_admin ? 'Remove admin' : 'Make admin'}
                            </button>
                            <button
                              onClick={() => deleteUser(u.id, u.username)}
                              style={{
                                padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem', cursor: 'pointer',
                                background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)',
                                color: '#f87171',
                              }}
                            >
                              Delete user
                            </button>
                          </>
                        )}
                        {u.id === currentUserId && (
                          <span style={{ fontSize: '0.75rem', color: '#4b5563', alignSelf: 'center' }}>— that&apos;s you</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input
                placeholder="Search by username, email, or order ID…"
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                style={{ flex: 1, minWidth: '220px' }}
              />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="all">All statuses</option>
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '12px' }}>
              {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredOrders.map(o => (
                <div key={o.id} style={{ ...card, overflow: 'hidden' }}>
                  {/* Row */}
                  <div
                    style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flexWrap: 'wrap' }}
                    onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{PRODUCT_ICONS[o.product_type] || '◎'}</span>

                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>
                        #{o.id} — {PRODUCT_LABELS[o.product_type] || o.product_type}
                        {' '}{o.size}{o.variant ? ` / ${o.variant}` : ''} × {o.quantity}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                        @{o.username} · {o.email}
                      </div>
                    </div>

                    <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                      {new Date(o.created_at * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>

                    {/* Inline status changer */}
                    <select
                      value={o.status}
                      onChange={e => { e.stopPropagation(); updateOrderStatus(o.id, e.target.value); }}
                      onClick={e => e.stopPropagation()}
                      style={{
                        background: `${STATUS_COLORS[o.status] || '#6b7280'}18`,
                        border: `1px solid ${STATUS_COLORS[o.status] || '#6b7280'}50`,
                        color: STATUS_COLORS[o.status] || '#6b7280',
                        borderRadius: '8px', padding: '5px 10px',
                        fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                        width: 'auto',
                      }}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s} style={{ background: '#111', color: '#f9fafb' }}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>

                    <span style={{ color: '#4b5563', fontSize: '0.75rem' }}>▼</span>
                  </div>

                  {/* Expanded — full address */}
                  {expandedOrder === o.id && (
                    <div style={{ borderTop: '1px solid #1f1f1f', padding: '20px', background: '#0d0d0d' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                        {[
                          { label: 'Customer',  value: `@${o.username} (${o.email})` },
                          { label: 'Product',   value: `${PRODUCT_LABELS[o.product_type] || o.product_type} · ${o.size}${o.variant ? ' / ' + o.variant : ''} · qty ${o.quantity}` },
                          { label: 'Address',   value: [o.address_line1, o.address_line2, o.city, o.postcode, o.country].filter(Boolean).join(', ') },
                          { label: 'Ordered',   value: new Date(o.created_at * 1000).toLocaleString('en-GB') },
                        ].map(f => (
                          <div key={f.label}>
                            <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{f.label}</div>
                            <div style={{ fontSize: '0.85rem', color: '#d1d5db' }}>{f.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
