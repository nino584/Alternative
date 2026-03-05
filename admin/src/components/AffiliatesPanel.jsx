import { useState, useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import { api } from '../api.js';
import HoverBtn from './HoverBtn.jsx';

const STATUS_COLORS = {
  pending: { bg: 'rgba(201,169,110,0.15)', color: '#b19a7a' },
  approved: { bg: 'rgba(46,125,50,0.12)', color: '#2e7d32' },
  rejected: { bg: 'rgba(198,40,40,0.12)', color: '#c62828' },
};

export default function AffiliatesPanel({ toast, L, mobile }) {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.getAffiliates()
      .then(data => setAffiliates(Array.isArray(data) ? data : (data?.affiliates || [])))
      .catch(() => toast?.('Failed to load affiliates', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = (id, status) => {
    api.updateAffiliateStatus(id, status)
      .then(data => {
        const updated = data.affiliate || data;
        setAffiliates(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
        toast?.(`Affiliate ${status}`, 'success');
      })
      .catch(() => toast?.('Failed to update status', 'error'));
  };

  const handlePayout = (id) => {
    api.payoutAffiliate(id)
      .then(data => {
        const updated = data.affiliate || data;
        setAffiliates(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
        toast?.(`Payout of GEL ${data.paidAmount} completed`, 'success');
      })
      .catch(() => toast?.('Payout failed', 'error'));
  };

  const filtered = affiliates
    .filter(a => statusFilter === 'all' || a.status === statusFilter)
    .filter(a => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (a.name || '').toLowerCase().includes(q) || (a.email || '').toLowerCase().includes(q) || (a.code || '').toLowerCase().includes(q);
    });

  const badge = (status) => {
    const s = STATUS_COLORS[status] || STATUS_COLORS.pending;
    return (
      <span style={{ ...T.labelSm, fontSize: 9, padding: '4px 10px', background: s.bg, color: s.color, letterSpacing: '0.08em' }}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) return <p style={{ ...T.bodySm, color: C.gray, padding: 40 }}>Loading affiliates...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ ...T.heading, color: C.black, fontSize: 18 }}>{L?.navAffiliates || 'Affiliates'} ({filtered.length})</h2>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, code..."
          style={{ padding: '10px 14px', border: `1px solid ${C.lgray}`, background: C.offwhite, color: C.black, fontSize: 13, fontFamily: "'TT Interphases Pro',sans-serif", outline: 'none', minWidth: 220 }} />
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'pending', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            style={{
              ...T.labelSm, fontSize: 10, padding: '8px 16px', cursor: 'pointer', border: 'none', letterSpacing: '0.08em',
              background: statusFilter === s ? C.black : C.offwhite,
              color: statusFilter === s ? C.white : C.gray,
              transition: 'all 0.15s',
            }}>
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ ...T.bodySm, color: C.gray, padding: '40px 0' }}>No affiliates found</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'TT Interphases Pro',sans-serif" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.lgray}` }}>
                {['Name', 'Email', 'Code', 'Status', 'Clicks', 'Conversions', 'Pending', 'Paid', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: h === 'Actions' ? 'right' : 'left', padding: '10px 12px', ...T.labelSm, fontSize: 9, color: C.gray }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} style={{ borderBottom: `1px solid ${C.lgray}`, cursor: 'pointer', background: expanded === a.id ? C.offwhite : 'transparent' }}
                  onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                  <td style={{ padding: '12px', color: C.black, fontWeight: 500 }}>{a.name}</td>
                  <td style={{ padding: '12px', color: C.gray, fontSize: 12 }}>{a.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ background: C.black, color: C.tan, padding: '3px 10px', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em' }}>{a.code}</span>
                  </td>
                  <td style={{ padding: '12px' }}>{badge(a.status)}</td>
                  <td style={{ padding: '12px', color: C.black }}>{a.clickCount || 0}</td>
                  <td style={{ padding: '12px', color: C.black }}>{a.conversionCount || 0}</td>
                  <td style={{ padding: '12px', color: C.tan, fontWeight: 500 }}>GEL {a.pending_earnings || 0}</td>
                  <td style={{ padding: '12px', color: C.gray }}>GEL {a.paid_earnings || 0}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      {a.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatus(a.id, 'approved')}
                            style={{ ...T.labelSm, fontSize: 9, padding: '6px 12px', background: 'rgba(46,125,50,0.1)', color: '#2e7d32', border: 'none', cursor: 'pointer' }}>
                            APPROVE
                          </button>
                          <button onClick={() => handleStatus(a.id, 'rejected')}
                            style={{ ...T.labelSm, fontSize: 9, padding: '6px 12px', background: 'rgba(198,40,40,0.08)', color: '#c62828', border: 'none', cursor: 'pointer' }}>
                            REJECT
                          </button>
                        </>
                      )}
                      {a.status === 'approved' && (a.pending_earnings || 0) > 0 && (
                        <button onClick={() => handlePayout(a.id)}
                          style={{ ...T.labelSm, fontSize: 9, padding: '6px 12px', background: C.tan, color: C.white, border: 'none', cursor: 'pointer' }}>
                          PAY GEL {a.pending_earnings}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (() => {
        const a = affiliates.find(x => x.id === expanded);
        if (!a) return null;
        return (
          <div style={{ background: C.offwhite, padding: '24px', marginTop: 8, borderLeft: `3px solid ${C.tan}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <p style={{ ...T.labelSm, fontSize: 9, color: C.gray, marginBottom: 4 }}>INSTAGRAM</p>
                <p style={{ color: C.black, fontSize: 13 }}>{a.instagram || '—'}</p>
              </div>
              <div>
                <p style={{ ...T.labelSm, fontSize: 9, color: C.gray, marginBottom: 4 }}>COMMISSION RATE</p>
                <p style={{ color: C.black, fontSize: 13 }}>{a.commission_rate}%</p>
              </div>
              <div>
                <p style={{ ...T.labelSm, fontSize: 9, color: C.gray, marginBottom: 4 }}>APPLIED</p>
                <p style={{ color: C.black, fontSize: 13 }}>{new Date(a.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            {a.description && (
              <div>
                <p style={{ ...T.labelSm, fontSize: 9, color: C.gray, marginBottom: 4 }}>DESCRIPTION</p>
                <p style={{ color: C.black, fontSize: 13, lineHeight: 1.6 }}>{a.description}</p>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
