'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { AdminUser, AdminOrder } from './page';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminProduct {
  id: string; name: string; tagline: string; icon_type: string;
  option_label: string; has_colour: number;
  prodigi_sku: string; prodigi_print_location: string;
  enabled: number; sort_order: number;
}
export interface AdminProductOption {
  id: string; product_id: string; label: string;
  detail: string; price_pence: number; prodigi_sku: string; sort_order: number;
}
export interface AdminProductColour {
  id: string; product_id: string; label: string; hex: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', processing: '#3b82f6',
  shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444',
};
const PRODUCT_LABELS: Record<string, string> = { tattoo: 'QR Tattoo', cap: 'Baseball Cap', tshirt: 'T-Shirt' };
const PRODUCT_ICONS: Record<string, string> = { tattoo: '⬡', cap: '🧢', tshirt: '👕' };

type Tab = 'overview' | 'users' | 'orders' | 'products';

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminClient({
  initialUsers, initialOrders, stats, currentUserId,
  initialProducts, initialProductOptions, initialProductColours,
}: {
  initialUsers: AdminUser[];
  initialOrders: AdminOrder[];
  stats: { users: number; orders: number; activeLinks: { n: number }; pendingOrders: number };
  currentUserId: string;
  initialProducts: AdminProduct[];
  initialProductOptions: AdminProductOption[];
  initialProductColours: AdminProductColour[];
}) {
  const [tab, setTab] = useState<Tab>('overview');
  const [users, setUsers] = useState(initialUsers);
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [productOptions, setProductOptions] = useState(initialProductOptions);
  const [productColours] = useState(initialProductColours);
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'ok' | 'err'>('ok');

  // ── Product form state ──
  const [editingOption, setEditingOption] = useState<string | null>(null); // "productId:optionId"
  const [editOptionValues, setEditOptionValues] = useState<{ label: string; detail: string; price: string; prodigi_sku: string }>({ label: '', detail: '', price: '', prodigi_sku: '' });
  const [showAddOption, setShowAddOption] = useState<string | null>(null); // productId
  const [newOption, setNewOption] = useState({ id: '', label: '', detail: '', price: '', prodigi_sku: '' });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ id: '', name: '', tagline: '', icon_type: '◎', option_label: 'Size', has_colour: false, prodigi_sku: '', prodigi_print_location: 'default' });
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editProductValues, setEditProductValues] = useState<Partial<AdminProduct>>({});

  function flash(text: string, type: 'ok' | 'err' = 'ok') {
    setMsg(text); setMsgType(type); setTimeout(() => setMsg(''), 3500);
  }

  // ── Orders ──

  async function updateOrderStatus(orderId: number, status: string) {
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });
    const data = await res.json();
    if (res.ok) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      flash('Status updated');
    } else flash(data.error, 'err');
  }

  // ── Users ──

  async function deleteUser(userId: string, username: string) {
    if (!confirm(`Delete @${username}? This removes all their links and orders too.`)) return;
    const res = await fetch('/api/admin/users', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) { setUsers(users.filter(u => u.id !== userId)); flash(`@${username} deleted`); }
    else { const d = await res.json(); flash(d.error, 'err'); }
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

  // ── Product helpers ──

  async function toggleProductEnabled(p: AdminProduct) {
    const res = await fetch('/api/admin/products', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'product', ...p, enabled: !p.enabled }),
    });
    if (res.ok) { setProducts(products.map(x => x.id === p.id ? { ...x, enabled: x.enabled ? 0 : 1 } : x)); flash(p.enabled ? 'Product hidden from store' : 'Product shown in store'); }
    else { const d = await res.json(); flash(d.error, 'err'); }
  }

  async function saveEditProduct(id: string) {
    const p = { ...products.find(x => x.id === id)!, ...editProductValues };
    const res = await fetch('/api/admin/products', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'product', ...p }),
    });
    if (res.ok) {
      setProducts(products.map(x => x.id === id ? { ...x, ...editProductValues } as AdminProduct : x));
      setEditingProduct(null);
      flash('Product updated');
    } else { const d = await res.json(); flash(d.error, 'err'); }
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Delete product "${name}"? This cannot be undone.`)) return;
    const res = await fetch('/api/admin/products', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'product', id }),
    });
    if (res.ok) { setProducts(products.filter(x => x.id !== id)); flash(`"${name}" deleted`); }
    else { const d = await res.json(); flash(d.error, 'err'); }
  }

  async function saveEditOption(productId: string, optionId: string) {
    const pricePence = Math.round(parseFloat(editOptionValues.price) * 100);
    if (isNaN(pricePence) || pricePence <= 0) { flash('Enter a valid price', 'err'); return; }
    const res = await fetch('/api/admin/products', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'option', id: optionId, product_id: productId, label: editOptionValues.label, detail: editOptionValues.detail, price_pence: pricePence, prodigi_sku: editOptionValues.prodigi_sku }),
    });
    if (res.ok) {
      setProductOptions(productOptions.map(o => o.id === optionId && o.product_id === productId
        ? { ...o, label: editOptionValues.label, detail: editOptionValues.detail, price_pence: pricePence, prodigi_sku: editOptionValues.prodigi_sku }
        : o
      ));
      setEditingOption(null);
      flash('Option saved');
    } else { const d = await res.json(); flash(d.error, 'err'); }
  }

  async function deleteOption(productId: string, optionId: string) {
    if (!confirm(`Delete option "${optionId}"?`)) return;
    const res = await fetch('/api/admin/products', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'option', id: optionId, product_id: productId }),
    });
    if (res.ok) { setProductOptions(productOptions.filter(o => !(o.id === optionId && o.product_id === productId))); flash('Option deleted'); }
    else { const d = await res.json(); flash(d.error, 'err'); }
  }

  async function addOption(productId: string) {
    const pricePence = Math.round(parseFloat(newOption.price) * 100);
    if (!newOption.id || !newOption.label || isNaN(pricePence) || pricePence <= 0) { flash('Fill in all required fields with a valid price', 'err'); return; }
    const res = await fetch('/api/admin/products', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'option', id: newOption.id, product_id: productId, label: newOption.label, detail: newOption.detail, price_pence: pricePence, prodigi_sku: newOption.prodigi_sku }),
    });
    if (res.ok) {
      const maxSort = Math.max(0, ...productOptions.filter(o => o.product_id === productId).map(o => o.sort_order));
      setProductOptions([...productOptions, { id: newOption.id, product_id: productId, label: newOption.label, detail: newOption.detail, price_pence: pricePence, prodigi_sku: newOption.prodigi_sku, sort_order: maxSort + 1 }]);
      setNewOption({ id: '', label: '', detail: '', price: '', prodigi_sku: '' });
      setShowAddOption(null);
      flash('Option added');
    } else { const d = await res.json(); flash(d.error, 'err'); }
  }

  async function addProduct() {
    if (!newProduct.id || !newProduct.name) { flash('ID and name are required', 'err'); return; }
    const res = await fetch('/api/admin/products', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'product', ...newProduct }),
    });
    if (res.ok) {
      setProducts([...products, { ...newProduct, has_colour: newProduct.has_colour ? 1 : 0, enabled: 1, sort_order: products.length }]);
      setNewProduct({ id: '', name: '', tagline: '', icon_type: '◎', option_label: 'Size', has_colour: false, prodigi_sku: '', prodigi_print_location: 'default' });
      setShowAddProduct(false);
      flash('Product created — now add options to it below');
    } else { const d = await res.json(); flash(d.error, 'err'); }
  }

  // ── Filters ──

  const filteredUsers = users.filter(u =>
    !userSearch || u.username.includes(userSearch) || u.email.includes(userSearch)
  );
  const filteredOrders = orders.filter(o =>
    (statusFilter === 'all' || o.status === statusFilter) &&
    (!orderSearch || o.username.includes(orderSearch) || o.email.includes(orderSearch) || String(o.id).includes(orderSearch))
  );

  // ── Shared styles ──

  const card: React.CSSProperties = { background: 'var(--ink-1)', border: '1px solid var(--ink-3)', borderRadius: '12px' };
  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '0.875rem', fontWeight: 500, border: 'none',
    background: active ? 'var(--carmine-tint)' : 'transparent',
    color: active ? 'var(--carmine-soft)' : 'var(--paper-3)', transition: 'all 0.15s',
  });
  const inputSmall: React.CSSProperties = {
    background: 'var(--ink-1)', border: '1px solid var(--ink-3)', borderRadius: '6px',
    color: 'var(--paper)', padding: '6px 10px', fontSize: '0.82rem', width: '100%',
  };
  const btnSm = (variant: 'purple' | 'red' | 'ghost'): React.CSSProperties => ({
    padding: '5px 12px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600,
    background: variant === 'purple' ? 'var(--carmine-tint)' : variant === 'red' ? 'rgba(239,68,68,0.1)' : 'transparent',
    border: `1px solid ${variant === 'purple' ? 'var(--carmine-glow)' : variant === 'red' ? 'rgba(239,68,68,0.3)' : 'var(--ink-3)'}`,
    color: variant === 'purple' ? 'var(--carmine-soft)' : variant === 'red' ? '#f87171' : 'var(--paper-2)',
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-0)', color: 'var(--paper)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--ink-3)', padding: '0 24px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(10px)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '7px',
              background: 'var(--carmine)',
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
        <Link href="/dashboard" style={{ color: 'var(--paper-3)', fontSize: '0.875rem', textDecoration: 'none' }}>
          ← Dashboard
        </Link>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>Admin panel</h1>
          <p style={{ color: 'var(--paper-3)', fontSize: '0.875rem' }}>Manage users, orders, products and platform data.</p>
        </div>

        {/* Flash message */}
        {msg && (
          <div style={{
            background: msgType === 'ok' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${msgType === 'ok' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            borderRadius: '8px', padding: '10px 16px',
            color: msgType === 'ok' ? '#34d399' : '#f87171',
            marginBottom: '20px', fontSize: '0.875rem',
          }}>{msg}</div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '28px',
          background: 'var(--ink-1)', padding: '4px', borderRadius: '10px',
          border: '1px solid var(--ink-3)', width: 'fit-content', flexWrap: 'wrap',
        }}>
          {(['overview', 'users', 'orders', 'products'] as Tab[]).map(t => (
            <button key={t} style={tabStyle(tab === t)} onClick={() => setTab(t)}>
              {t === 'overview'  ? '◈ Overview'
               : t === 'users'   ? `👤 Users (${users.length})`
               : t === 'orders'  ? `📦 Orders (${orders.length})`
               :                   `🛍 Products (${products.length})`}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Total users',     value: stats.users,           color: 'var(--carmine-soft)' },
                { label: 'Total orders',    value: stats.orders,          color: '#34d399' },
                { label: 'Active links',    value: stats.activeLinks.n,   color: '#60a5fa' },
                { label: 'Pending orders',  value: stats.pendingOrders,   color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} style={{ ...card, padding: '20px 24px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--paper-3)', marginBottom: '8px' }}>{s.label}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Recent orders</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {orders.slice(0, 5).map(o => (
                  <div key={o.id} style={{ ...card, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.2rem' }}>{PRODUCT_ICONS[o.product_type] || '◎'}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {PRODUCT_LABELS[o.product_type] || o.product_type} — {o.size}{o.variant ? ` / ${o.variant}` : ''} × {o.quantity}
                      </span>
                      <span style={{ color: 'var(--paper-3)', fontSize: '0.8rem', marginLeft: '8px' }}>by @{o.username}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--paper-3)' }}>
                      {new Date(o.created_at * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                    <span style={{
                      background: `${STATUS_COLORS[o.status] || 'var(--paper-3)'}20`,
                      border: `1px solid ${STATUS_COLORS[o.status] || 'var(--paper-3)'}50`,
                      color: STATUS_COLORS[o.status] || 'var(--paper-3)',
                      borderRadius: '100px', padding: '3px 10px',
                      fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize',
                    }}>{o.status}</span>
                  </div>
                ))}
              </div>
              {orders.length > 5 && (
                <button onClick={() => setTab('orders')} style={{ background: 'none', border: 'none', color: 'var(--carmine-soft)', cursor: 'pointer', marginTop: '10px', fontSize: '0.875rem' }}>
                  View all {orders.length} orders →
                </button>
              )}
            </div>

            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Recent signups</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {users.slice(0, 5).map(u => (
                  <div key={u.id} style={{ ...card, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                      background: 'var(--carmine)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '14px',
                    }}>{u.username[0].toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>@{u.username}</span>
                      <span style={{ color: 'var(--paper-3)', fontSize: '0.8rem', marginLeft: '8px' }}>{u.email}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--paper-3)' }}>
                      {new Date(u.created_at * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--paper-4)' }}>{u.link_count} links · {u.order_count} orders</span>
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
              <input placeholder="Search by username or email…" value={userSearch} onChange={e => setUserSearch(e.target.value)} style={{ flex: 1, minWidth: '220px' }} />
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--paper-3)', marginBottom: '12px' }}>{filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredUsers.map(u => (
                <div key={u.id} style={{ ...card, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', flexWrap: 'wrap' }}
                    onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, background: u.is_admin ? 'linear-gradient(135deg, #ef4444, #f97316)' : 'var(--carmine)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px' }}>{u.username[0].toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>@{u.username}</span>
                        {u.is_admin ? <span style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '4px', padding: '1px 6px', fontSize: '0.68rem', fontWeight: 700 }}>ADMIN</span> : null}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--paper-3)' }}>{u.email}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--paper-3)', flexWrap: 'wrap' }}>
                      <span>{u.link_count} links</span><span>{u.order_count} orders</span>
                      <span>{new Date(u.created_at * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <span style={{ color: 'var(--paper-4)', fontSize: '0.75rem', transition: 'transform 0.15s', transform: expandedUser === u.id ? 'rotate(180deg)' : 'none' }}>▼</span>
                  </div>
                  {expandedUser === u.id && (
                    <div style={{ borderTop: '1px solid var(--ink-3)', padding: '20px', background: 'var(--ink-1)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                        {[{ label: 'Display ID', value: `/u/${u.display_id}` }, { label: 'Bio', value: u.bio || '—' }, { label: 'WhatsApp', value: u.whatsapp_enabled && u.whatsapp_number ? `${u.whatsapp_number} (on)` : u.whatsapp_number || '—' }, { label: 'Joined', value: new Date(u.created_at * 1000).toLocaleString('en-GB') }].map(f => (
                          <div key={f.label}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--paper-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{f.label}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--paper-2)', wordBreak: 'break-all' }}>{f.value}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <Link href={`/u/${u.display_id}`} target="_blank" style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--ink-3)', color: 'var(--paper-2)', textDecoration: 'none' }}>↗ View profile</Link>
                        {u.id !== currentUserId && (
                          <>
                            <button onClick={() => toggleAdmin(u)} style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem', cursor: 'pointer', background: u.is_admin ? 'rgba(239,68,68,0.1)' : 'var(--carmine-tint)', border: `1px solid ${u.is_admin ? 'rgba(239,68,68,0.3)' : 'color-mix(in oklch, var(--carmine) 30%, transparent)'}`, color: u.is_admin ? '#f87171' : 'var(--carmine-soft)' }}>
                              {u.is_admin ? 'Remove admin' : 'Make admin'}
                            </button>
                            <button onClick={() => deleteUser(u.id, u.username)} style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem', cursor: 'pointer', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>Delete user</button>
                          </>
                        )}
                        {u.id === currentUserId && <span style={{ fontSize: '0.75rem', color: 'var(--paper-4)', alignSelf: 'center' }}>— that&apos;s you</span>}
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
              <input placeholder="Search by username, email, or order ID…" value={orderSearch} onChange={e => setOrderSearch(e.target.value)} style={{ flex: 1, minWidth: '220px' }} />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
                <option value="all">All statuses</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--paper-3)', marginBottom: '12px' }}>{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredOrders.map(o => (
                <div key={o.id} style={{ ...card, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flexWrap: 'wrap' }} onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>
                    <span style={{ fontSize: '1.3rem' }}>{PRODUCT_ICONS[o.product_type] || '◎'}</span>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>#{o.id} — {PRODUCT_LABELS[o.product_type] || o.product_type} {o.size}{o.variant ? ` / ${o.variant}` : ''} × {o.quantity}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--paper-3)' }}>@{o.username} · {o.email}</div>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--paper-3)' }}>{new Date(o.created_at * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <select value={o.status} onChange={e => { e.stopPropagation(); updateOrderStatus(o.id, e.target.value); }} onClick={e => e.stopPropagation()} style={{ background: `${STATUS_COLORS[o.status] || 'var(--paper-3)'}18`, border: `1px solid ${STATUS_COLORS[o.status] || 'var(--paper-3)'}50`, color: STATUS_COLORS[o.status] || 'var(--paper-3)', borderRadius: '8px', padding: '5px 10px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', width: 'auto' }}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: 'var(--ink-1)', color: 'var(--paper)' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                    <span style={{ color: 'var(--paper-4)', fontSize: '0.75rem' }}>▼</span>
                  </div>
                  {expandedOrder === o.id && (
                    <div style={{ borderTop: '1px solid var(--ink-3)', padding: '20px', background: 'var(--ink-1)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                        {[{ label: 'Customer', value: `@${o.username} (${o.email})` }, { label: 'Product', value: `${PRODUCT_LABELS[o.product_type] || o.product_type} · ${o.size}${o.variant ? ' / ' + o.variant : ''} · qty ${o.quantity}` }, { label: 'Address', value: [o.address_line1, o.address_line2, o.city, o.postcode, o.country].filter(Boolean).join(', ') }, { label: 'Ordered', value: new Date(o.created_at * 1000).toLocaleString('en-GB') }].map(f => (
                          <div key={f.label}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--paper-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{f.label}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--paper-2)' }}>{f.value}</div>
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

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <p style={{ color: 'var(--paper-3)', fontSize: '0.875rem', margin: 0 }}>
                Changes take effect immediately for new orders.
              </p>
              <button onClick={() => { setShowAddProduct(!showAddProduct); setEditingProduct(null); }} style={{ ...btnSm('purple'), padding: '8px 16px', fontSize: '0.85rem' }}>
                {showAddProduct ? 'Cancel' : '+ Add product'}
              </button>
            </div>

            {/* ── Add product form ── */}
            {showAddProduct && (
              <div style={{ ...card, padding: '24px', marginBottom: '24px', borderColor: 'color-mix(in oklch, var(--carmine) 30%, transparent)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--carmine-soft)' }}>New product</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: 'var(--paper-2)' }}>
                    ID (lowercase, no spaces) *
                    <input style={inputSmall} placeholder="e.g. hoodie" value={newProduct.id} onChange={e => setNewProduct(p => ({ ...p, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g,'') }))} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: 'var(--paper-2)' }}>
                    Name *
                    <input style={inputSmall} placeholder="e.g. Hoodie" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: 'var(--paper-2)' }}>
                    Tagline
                    <input style={inputSmall} placeholder="One-line description" value={newProduct.tagline} onChange={e => setNewProduct(p => ({ ...p, tagline: e.target.value }))} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: 'var(--paper-2)' }}>
                    Icon (emoji)
                    <input style={inputSmall} placeholder="e.g. 🧥" value={newProduct.icon_type} onChange={e => setNewProduct(p => ({ ...p, icon_type: e.target.value }))} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: 'var(--paper-2)' }}>
                    Option label
                    <input style={inputSmall} placeholder="Size" value={newProduct.option_label} onChange={e => setNewProduct(p => ({ ...p, option_label: e.target.value }))} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: 'var(--paper-2)' }}>
                    Prodigi SKU
                    <input style={inputSmall} placeholder="e.g. GLOBAL-MUG" value={newProduct.prodigi_sku} onChange={e => setNewProduct(p => ({ ...p, prodigi_sku: e.target.value }))} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: 'var(--paper-2)' }}>
                    Print location
                    <input style={inputSmall} placeholder="default" value={newProduct.prodigi_print_location} onChange={e => setNewProduct(p => ({ ...p, prodigi_print_location: e.target.value }))} />
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={addProduct} style={{ ...btnSm('purple'), padding: '8px 18px' }}>Create product</button>
                  <button onClick={() => setShowAddProduct(false)} style={btnSm('ghost')}>Cancel</button>
                </div>
              </div>
            )}

            {/* ── Product list ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {products.map(p => {
                const opts = productOptions.filter(o => o.product_id === p.id);
                const isExpanded = expandedProduct === p.id;
                const isEditingP = editingProduct === p.id;

                return (
                  <div key={p.id} style={{ ...card, overflow: 'hidden', opacity: p.enabled ? 1 : 0.6 }}>
                    {/* Product header row */}
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '28px', width: '40px', textAlign: 'center', flexShrink: 0 }}>{p.icon_type}</div>
                      <div style={{ flex: 1, minWidth: '160px', cursor: 'pointer' }} onClick={() => setExpandedProduct(isExpanded ? null : p.id)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <span style={{ fontWeight: 700 }}>{p.name}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--paper-4)', fontFamily: 'monospace' }}>{p.id}</span>
                          {!p.enabled && <span style={{ fontSize: '0.68rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '4px', padding: '1px 6px', fontWeight: 700 }}>HIDDEN</span>}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--paper-3)' }}>{p.tagline || '—'} · {opts.length} option{opts.length !== 1 ? 's' : ''} · from £{opts.length ? (Math.min(...opts.map(o => o.price_pence)) / 100).toFixed(2) : '?'}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button onClick={() => { setEditingProduct(isEditingP ? null : p.id); setEditProductValues({ name: p.name, tagline: p.tagline, option_label: p.option_label, has_colour: p.has_colour, prodigi_sku: p.prodigi_sku, prodigi_print_location: p.prodigi_print_location, enabled: p.enabled }); setExpandedProduct(p.id); }} style={btnSm('ghost')}>
                          {isEditingP ? 'Cancel edit' : 'Edit'}
                        </button>
                        <button onClick={() => toggleProductEnabled(p)} style={btnSm(p.enabled ? 'ghost' : 'purple')}>
                          {p.enabled ? 'Hide' : 'Show'}
                        </button>
                        <button onClick={() => deleteProduct(p.id, p.name)} style={btnSm('red')}>Delete</button>
                        <button onClick={() => setExpandedProduct(isExpanded ? null : p.id)} style={{ ...btnSm('ghost'), fontSize: '0.7rem' }}>
                          {isExpanded ? '▲' : '▼'}
                        </button>
                      </div>
                    </div>

                    {/* Expanded section */}
                    {isExpanded && (
                      <div style={{ borderTop: '1px solid var(--ink-3)', background: 'var(--ink-1)', padding: '20px' }}>

                        {/* Edit product fields */}
                        {isEditingP && (
                          <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--ink-1)', borderRadius: '8px', border: '1px solid var(--carmine-tint)' }}>
                            <div style={{ fontSize: '0.78rem', color: 'var(--carmine-soft)', fontWeight: 700, marginBottom: '12px' }}>Edit product</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                              {([
                                ['name', 'Name *'], ['tagline', 'Tagline'], ['option_label', 'Option label'],
                                ['prodigi_sku', 'Prodigi SKU'], ['prodigi_print_location', 'Print location'],
                              ] as [keyof AdminProduct, string][]).map(([field, label]) => (
                                <label key={field} style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: 'var(--paper-2)' }}>
                                  {label}
                                  <input style={inputSmall} value={String(editProductValues[field] ?? '')} onChange={e => setEditProductValues(v => ({ ...v, [field]: e.target.value }))} />
                                </label>
                              ))}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => saveEditProduct(p.id)} style={{ ...btnSm('purple'), padding: '7px 16px' }}>Save changes</button>
                              <button onClick={() => setEditingProduct(null)} style={btnSm('ghost')}>Cancel</button>
                            </div>
                          </div>
                        )}

                        {/* Options list */}
                        <div style={{ fontSize: '0.75rem', color: 'var(--paper-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
                          {p.option_label} options
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                          {opts.map(opt => {
                            const key = `${p.id}:${opt.id}`;
                            const isEditingOpt = editingOption === key;
                            return (
                              <div key={opt.id} style={{ background: 'var(--ink-1)', borderRadius: '8px', border: '1px solid var(--ink-3)', padding: '12px 16px' }}>
                                {isEditingOpt ? (
                                  <div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '10px' }}>
                                      <label style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.75rem', color: 'var(--paper-2)' }}>
                                        Label
                                        <input style={inputSmall} value={editOptionValues.label} onChange={e => setEditOptionValues(v => ({ ...v, label: e.target.value }))} />
                                      </label>
                                      <label style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.75rem', color: 'var(--paper-2)' }}>
                                        Detail
                                        <input style={inputSmall} value={editOptionValues.detail} onChange={e => setEditOptionValues(v => ({ ...v, detail: e.target.value }))} />
                                      </label>
                                      <label style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.75rem', color: 'var(--paper-2)' }}>
                                        Price (£)
                                        <input style={inputSmall} type="number" step="0.01" min="0" value={editOptionValues.price} onChange={e => setEditOptionValues(v => ({ ...v, price: e.target.value }))} />
                                      </label>
                                      <label style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.75rem', color: 'var(--paper-2)' }}>
                                        Prodigi SKU override
                                        <input style={inputSmall} value={editOptionValues.prodigi_sku} onChange={e => setEditOptionValues(v => ({ ...v, prodigi_sku: e.target.value }))} />
                                      </label>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                      <button onClick={() => saveEditOption(p.id, opt.id)} style={{ ...btnSm('purple'), padding: '5px 14px' }}>Save</button>
                                      <button onClick={() => setEditingOption(null)} style={btnSm('ghost')}>Cancel</button>
                                    </div>
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--paper-3)', minWidth: '70px' }}>{opt.id}</span>
                                    <span style={{ fontWeight: 600, fontSize: '0.875rem', flex: 1 }}>{opt.label}</span>
                                    {opt.detail && <span style={{ fontSize: '0.78rem', color: 'var(--paper-3)' }}>{opt.detail}</span>}
                                    <span style={{ fontWeight: 700, color: 'var(--carmine-soft)', minWidth: '56px', textAlign: 'right' }}>£{(opt.price_pence / 100).toFixed(2)}</span>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                      <button onClick={() => { setEditingOption(key); setEditOptionValues({ label: opt.label, detail: opt.detail, price: (opt.price_pence / 100).toFixed(2), prodigi_sku: opt.prodigi_sku }); }} style={btnSm('ghost')}>Edit</button>
                                      <button onClick={() => deleteOption(p.id, opt.id)} style={btnSm('red')}>×</button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Add option form */}
                        {showAddOption === p.id ? (
                          <div style={{ background: 'var(--ink-1)', borderRadius: '8px', border: '1px solid var(--carmine-tint)', padding: '14px', marginBottom: '8px' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--carmine-soft)', fontWeight: 700, marginBottom: '10px' }}>Add option</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '10px' }}>
                              <label style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.75rem', color: 'var(--paper-2)' }}>
                                ID *
                                <input style={inputSmall} placeholder="e.g. L" value={newOption.id} onChange={e => setNewOption(o => ({ ...o, id: e.target.value }))} />
                              </label>
                              <label style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.75rem', color: 'var(--paper-2)' }}>
                                Label *
                                <input style={inputSmall} placeholder="e.g. Large" value={newOption.label} onChange={e => setNewOption(o => ({ ...o, label: e.target.value }))} />
                              </label>
                              <label style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.75rem', color: 'var(--paper-2)' }}>
                                Detail
                                <input style={inputSmall} placeholder="e.g. Chest 41–43&quot;" value={newOption.detail} onChange={e => setNewOption(o => ({ ...o, detail: e.target.value }))} />
                              </label>
                              <label style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.75rem', color: 'var(--paper-2)' }}>
                                Price (£) *
                                <input style={inputSmall} type="number" step="0.01" min="0" placeholder="0.00" value={newOption.price} onChange={e => setNewOption(o => ({ ...o, price: e.target.value }))} />
                              </label>
                              <label style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.75rem', color: 'var(--paper-2)' }}>
                                Prodigi SKU override
                                <input style={inputSmall} placeholder="leave blank to inherit" value={newOption.prodigi_sku} onChange={e => setNewOption(o => ({ ...o, prodigi_sku: e.target.value }))} />
                              </label>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button onClick={() => addOption(p.id)} style={{ ...btnSm('purple'), padding: '6px 16px' }}>Add option</button>
                              <button onClick={() => setShowAddOption(null)} style={btnSm('ghost')}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => { setShowAddOption(p.id); setNewOption({ id: '', label: '', detail: '', price: '', prodigi_sku: '' }); }} style={{ ...btnSm('ghost'), width: '100%', justifyContent: 'center', padding: '8px' }}>
                            + Add option
                          </button>
                        )}

                        {/* Colours info */}
                        {!!p.has_colour && (
                          <div style={{ marginTop: '16px', padding: '10px 14px', background: 'var(--ink-1)', borderRadius: '8px', border: '1px solid var(--ink-2)' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--paper-3)', marginBottom: '6px' }}>Colours (edit via database — colours support coming soon)</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {productColours.filter(c => c.product_id === p.id).map(c => (
                                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--paper-2)' }}>
                                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: c.hex, border: '1px solid #3a3a3a', flexShrink: 0 }} />
                                  {c.label}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
