import { useState, useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import { api } from '../api.js';

const STATUS_COLORS = {
  pending: { bg: 'rgba(201,169,110,0.15)', color: '#b19a7a' },
  approved: { bg: 'rgba(46,125,50,0.12)', color: '#2e7d32' },
  rejected: { bg: 'rgba(198,40,40,0.12)', color: '#c62828' },
  suspended: { bg: 'rgba(100,100,100,0.12)', color: '#666' },
};

const PRODUCT_STATUS_COLORS = {
  pending: { bg: 'rgba(201,169,110,0.15)', color: '#b19a7a' },
  approved: { bg: 'rgba(46,125,50,0.12)', color: '#2e7d32' },
  rejected: { bg: 'rgba(198,40,40,0.12)', color: '#c62828' },
};

const TAKEDOWN_STEPS = ['notice_received', 'receipt_confirmed', 'under_review', 'seller_notified', 'seller_responded', 'resolved_removed', 'resolved_kept'];
const TAKEDOWN_LABELS = {
  notice_received: 'Notice Received',
  receipt_confirmed: 'Receipt Confirmed',
  under_review: 'Under Review',
  seller_notified: 'Seller Notified',
  seller_responded: 'Seller Responded',
  resolved_removed: 'Removed',
  resolved_kept: 'Kept',
};

export default function SuppliersPanel({ toast, L, mobile }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [showPending, setShowPending] = useState(false);
  const [takedowns, setTakedowns] = useState([]);
  const [showTakedowns, setShowTakedowns] = useState(false);
  const [tdForm, setTdForm] = useState({ productId: '', reason: '', noticeDetails: '' });
  const [showTdForm, setShowTdForm] = useState(false);
  const [inviteLink, setInviteLink] = useState(null);

  const loadSuppliers = () => {
    api.getSuppliers()
      .then(data => setSuppliers(data?.suppliers || []))
      .catch(() => toast?.('Failed to load suppliers', 'error'))
      .finally(() => setLoading(false));
  };

  const loadTakedowns = () => {
    api.getTakedowns()
      .then(data => setTakedowns(data?.takedowns || []))
      .catch(() => {});
  };

  useEffect(() => { loadSuppliers(); loadTakedowns(); }, []);

  // Load pending products from all suppliers
  useEffect(() => {
    const approved = suppliers.filter(s => s.status === 'approved');
    if (approved.length === 0) return;
    Promise.all(approved.map(s => api.getSupplierProducts(s.id).catch(() => ({ products: [] }))))
      .then(results => {
        const all = results.flatMap((r, i) => (r.products || []).map(p => ({ ...p, _supplierName: approved[i].companyName })));
        setPendingProducts(all.filter(p => p.productStatus === 'pending'));
      });
  }, [suppliers]);

  const handleStatus = (id, status) => {
    api.updateSupplierStatus(id, status)
      .then(data => {
        setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...data.supplier } : s));
        if (data.inviteToken) {
          const link = `${window.location.origin}?invite=${data.inviteToken}`;
          setInviteLink(link);
        }
        toast?.(`Supplier ${status}`, 'success');
      })
      .catch(err => toast?.(err.message || 'Failed to update status', 'error'));
  };

  const handlePayout = (id) => {
    const sup = suppliers.find(s => s.id === id);
    api.payoutSupplier(id)
      .then(data => {
        setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...data.supplier } : s));
        toast?.(`Payout completed for ${sup?.companyName || 'supplier'}`, 'success');
      })
      .catch(() => toast?.('Payout failed', 'error'));
  };

  const handleProductApproval = (productId, productStatus) => {
    api.approveProduct(productId, productStatus)
      .then(() => {
        setPendingProducts(prev => prev.filter(p => p.id !== productId));
        toast?.(`Product ${productStatus}`, 'success');
      })
      .catch(() => toast?.('Failed to update product', 'error'));
  };

  const handleInitiateTakedown = () => {
    const productId = parseInt(tdForm.productId, 10);
    if (!productId || !tdForm.reason.trim()) { toast?.('Product ID and reason are required', 'error'); return; }
    api.initiateTakedown({ productId, reason: tdForm.reason, noticeDetails: tdForm.noticeDetails })
      .then(() => {
        toast?.('Takedown initiated — product set to under review', 'success');
        setTdForm({ productId: '', reason: '', noticeDetails: '' });
        setShowTdForm(false);
        loadTakedowns();
      })
      .catch(err => toast?.(err.message || 'Failed to initiate takedown', 'error'));
  };

  const handleTakedownStep = (id, step) => {
    api.updateTakedown(id, { step })
      .then(() => {
        toast?.(`Takedown updated: ${TAKEDOWN_LABELS[step]}`, 'success');
        loadTakedowns();
      })
      .catch(err => toast?.(err.message || 'Failed to update takedown', 'error'));
  };

  const activeTakedowns = takedowns.filter(t => !t.status.startsWith('resolved_'));

  const filtered = suppliers
    .filter(s => statusFilter === 'all' || s.status === statusFilter)
    .filter(s => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (s.companyName || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q) || (s.contactName || '').toLowerCase().includes(q);
    });

  const badge = (status, colors = STATUS_COLORS) => {
    const s = colors[status] || colors.pending;
    return (
      <span style={{ ...T.labelSm, fontSize: 9, padding: '4px 10px', background: s.bg, color: s.color, letterSpacing: '0.08em' }}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) return <p style={{ ...T.bodySm, color: C.gray, padding: 40 }}>Loading suppliers...</p>;

  return (
    <div>
      {/* Invite Link Modal */}
      {inviteLink && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          onClick={() => setInviteLink(null)}>
          <div style={{ background: C.white, padding: mobile ? '28px 20px' : '36px 32px', maxWidth: 500, width: '90%' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ ...T.heading, color: C.black, fontSize: 16, marginBottom: 8 }}>
              {L?.inviteLinkTitle || 'Supplier Invite Link'}
            </h3>
            <p style={{ ...T.bodySm, color: C.gray, fontSize: 12, marginBottom: 16 }}>
              {L?.inviteLinkDesc || 'Send this link to the supplier. They will use it to set their password and access the dashboard.'}
            </p>
            <div style={{ background: 'rgba(88,70,56,0.04)', border: `1px solid ${C.lgray}`, padding: '12px 14px', marginBottom: 16, wordBreak: 'break-all' }}>
              <code style={{ fontSize: 12, color: C.black }}>{inviteLink}</code>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { navigator.clipboard.writeText(inviteLink); toast?.('Link copied!', 'success'); }}
                style={{ ...T.labelSm, fontSize: 10, padding: '10px 20px', cursor: 'pointer', border: 'none', background: C.black, color: C.white, letterSpacing: '0.06em' }}>
                COPY LINK
              </button>
              <button onClick={() => setInviteLink(null)}
                style={{ ...T.labelSm, fontSize: 10, padding: '10px 20px', cursor: 'pointer', border: `1px solid ${C.lgray}`, background: 'none', color: C.gray, letterSpacing: '0.06em' }}>
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ ...T.heading, color: C.black, fontSize: 18 }}>{L?.navSuppliers || 'Suppliers'} ({filtered.length})</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {pendingProducts.length > 0 && (
            <button onClick={() => { setShowPending(!showPending); setShowTakedowns(false); }}
              style={{ ...T.labelSm, fontSize: 10, padding: '8px 16px', cursor: 'pointer', border: 'none', background: '#b19a7a', color: C.white, letterSpacing: '0.06em' }}>
              {pendingProducts.length} PENDING PRODUCT{pendingProducts.length > 1 ? 'S' : ''}
            </button>
          )}
          <button onClick={() => { setShowTakedowns(!showTakedowns); setShowPending(false); }}
            style={{ ...T.labelSm, fontSize: 10, padding: '8px 16px', cursor: 'pointer', border: 'none', background: showTakedowns ? C.black : 'rgba(198,40,40,0.1)', color: showTakedowns ? C.white : '#c62828', letterSpacing: '0.06em' }}>
            IP TAKEDOWNS{activeTakedowns.length > 0 ? ` (${activeTakedowns.length})` : ''}
          </button>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search company, email..."
            style={{ padding: '10px 14px', border: `1px solid ${C.lgray}`, background: C.offwhite, color: C.black, fontSize: 13, fontFamily: "'TT Interphases Pro',sans-serif", outline: 'none', minWidth: 220 }} />
        </div>
      </div>

      {/* Pending products review section */}
      {showPending && pendingProducts.length > 0 && (
        <div style={{ background: 'rgba(201,169,110,0.08)', padding: 20, marginBottom: 24, borderLeft: `3px solid ${C.tan}` }}>
          <h3 style={{ ...T.label, fontSize: 13, color: C.black, marginBottom: 16 }}>Products Pending Review</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'TT Interphases Pro',sans-serif" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.lgray}` }}>
                  {['Product', 'Supplier', 'Category', 'Price', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Actions' ? 'right' : 'left', padding: '10px 12px', ...T.labelSm, fontSize: 9, color: C.gray }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pendingProducts.map(p => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${C.lgray}` }}>
                    <td style={{ padding: '12px', color: C.black, fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {p.img && <img src={p.img} alt="" style={{ width: 36, height: 36, objectFit: 'cover' }} />}
                        <div>
                          <p style={{ fontWeight: 500, fontSize: 13 }}>{p.name}</p>
                          <p style={{ fontSize: 11, color: C.gray }}>{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: C.gray, fontSize: 12 }}>{p._supplierName}</td>
                    <td style={{ padding: '12px', color: C.gray, fontSize: 12 }}>{p.section} / {p.cat}</td>
                    <td style={{ padding: '12px', color: C.black, fontWeight: 500 }}>GEL {p.sale || p.price}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button onClick={() => handleProductApproval(p.id, 'approved')}
                          style={{ ...T.labelSm, fontSize: 9, padding: '6px 12px', background: 'rgba(46,125,50,0.1)', color: '#2e7d32', border: 'none', cursor: 'pointer' }}>
                          APPROVE
                        </button>
                        <button onClick={() => handleProductApproval(p.id, 'rejected')}
                          style={{ ...T.labelSm, fontSize: 9, padding: '6px 12px', background: 'rgba(198,40,40,0.08)', color: '#c62828', border: 'none', cursor: 'pointer' }}>
                          REJECT
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Takedown management section */}
      {showTakedowns && (
        <div style={{ background: 'rgba(198,40,40,0.04)', padding: 20, marginBottom: 24, borderLeft: '3px solid #c62828' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ ...T.label, fontSize: 13, color: C.black }}>IP Takedowns</h3>
            <button onClick={() => setShowTdForm(!showTdForm)}
              style={{ ...T.labelSm, fontSize: 10, padding: '8px 16px', cursor: 'pointer', border: 'none', background: '#c62828', color: C.white, letterSpacing: '0.06em' }}>
              {showTdForm ? 'CANCEL' : '+ INITIATE TAKEDOWN'}
            </button>
          </div>

          {showTdForm && (
            <div style={{ background: C.white, padding: 20, marginBottom: 16, display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 2fr', gap: 12, alignItems: 'end' }}>
              <div>
                <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>PRODUCT ID</label>
                <input type="number" value={tdForm.productId} onChange={e => setTdForm(p => ({ ...p, productId: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.lgray}`, fontSize: 13, color: C.black, outline: 'none', fontFamily: "'TT Interphases Pro',sans-serif" }} />
              </div>
              <div>
                <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>REASON (from brand/rights holder)</label>
                <input value={tdForm.reason} onChange={e => setTdForm(p => ({ ...p, reason: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.lgray}`, fontSize: 13, color: C.black, outline: 'none', fontFamily: "'TT Interphases Pro',sans-serif" }} />
              </div>
              <div style={{ gridColumn: mobile ? '1' : '1 / -1' }}>
                <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>NOTICE DETAILS (optional)</label>
                <textarea value={tdForm.noticeDetails} onChange={e => setTdForm(p => ({ ...p, noticeDetails: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.lgray}`, fontSize: 13, color: C.black, outline: 'none', fontFamily: "'TT Interphases Pro',sans-serif", minHeight: 60, resize: 'vertical' }} />
              </div>
              <button onClick={handleInitiateTakedown}
                style={{ ...T.labelSm, fontSize: 10, padding: '10px 20px', cursor: 'pointer', border: 'none', background: '#c62828', color: C.white, letterSpacing: '0.06em' }}>
                SUBMIT TAKEDOWN
              </button>
            </div>
          )}

          {takedowns.length === 0 ? (
            <p style={{ ...T.bodySm, color: C.gray, fontSize: 13 }}>No takedown records</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'TT Interphases Pro',sans-serif" }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${C.lgray}` }}>
                    {['Product ID', 'Vendor', 'Reason', 'Status', 'Created', 'Actions'].map(h => (
                      <th key={h} style={{ textAlign: h === 'Actions' ? 'right' : 'left', padding: '10px 12px', ...T.labelSm, fontSize: 9, color: C.gray }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {takedowns.map(td => {
                    const currentIdx = TAKEDOWN_STEPS.indexOf(td.status);
                    const nextStep = TAKEDOWN_STEPS[currentIdx + 1];
                    const isResolved = td.status.startsWith('resolved_');
                    return (
                      <tr key={td.id} style={{ borderBottom: `1px solid ${C.lgray}` }}>
                        <td style={{ padding: '12px', color: C.black, fontWeight: 500 }}>#{td.productId}</td>
                        <td style={{ padding: '12px', color: C.gray, fontSize: 12 }}>{td.vendorId}</td>
                        <td style={{ padding: '12px', color: C.gray, fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{td.reason}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            ...T.labelSm, fontSize: 9, padding: '4px 10px', letterSpacing: '0.08em',
                            background: isResolved ? (td.status === 'resolved_removed' ? 'rgba(198,40,40,0.12)' : 'rgba(46,125,50,0.12)') : 'rgba(201,169,110,0.15)',
                            color: isResolved ? (td.status === 'resolved_removed' ? '#c62828' : '#2e7d32') : '#b19a7a',
                          }}>
                            {(TAKEDOWN_LABELS[td.status] || td.status).toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: C.gray, fontSize: 12 }}>{new Date(td.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          {!isResolved && (
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                              {nextStep && !nextStep.startsWith('resolved_') && (
                                <button onClick={() => handleTakedownStep(td.id, nextStep)}
                                  style={{ ...T.labelSm, fontSize: 9, padding: '6px 12px', background: 'rgba(201,169,110,0.15)', color: '#b19a7a', border: 'none', cursor: 'pointer' }}>
                                  {TAKEDOWN_LABELS[nextStep]?.toUpperCase()}
                                </button>
                              )}
                              <button onClick={() => handleTakedownStep(td.id, 'resolved_removed')}
                                style={{ ...T.labelSm, fontSize: 9, padding: '6px 12px', background: 'rgba(198,40,40,0.08)', color: '#c62828', border: 'none', cursor: 'pointer' }}>
                                REMOVE
                              </button>
                              <button onClick={() => handleTakedownStep(td.id, 'resolved_kept')}
                                style={{ ...T.labelSm, fontSize: 9, padding: '6px 12px', background: 'rgba(46,125,50,0.1)', color: '#2e7d32', border: 'none', cursor: 'pointer' }}>
                                KEEP
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'pending', 'approved', 'suspended', 'rejected'].map(s => (
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
        <p style={{ ...T.bodySm, color: C.gray, padding: '40px 0' }}>No suppliers found</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'TT Interphases Pro',sans-serif" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.lgray}` }}>
                {['Company', 'Contact', 'Email', 'Status', 'Products', 'Orders', 'Commission', 'Pending', 'Paid', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: h === 'Actions' ? 'right' : 'left', padding: '10px 12px', ...T.labelSm, fontSize: 9, color: C.gray }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} style={{ borderBottom: `1px solid ${C.lgray}`, cursor: 'pointer', background: expanded === s.id ? C.offwhite : 'transparent' }}
                  onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                  <td style={{ padding: '12px', color: C.black, fontWeight: 500 }}>{s.companyName}</td>
                  <td style={{ padding: '12px', color: C.gray, fontSize: 12 }}>{s.contactName}</td>
                  <td style={{ padding: '12px', color: C.gray, fontSize: 12 }}>{s.email}</td>
                  <td style={{ padding: '12px' }}>{badge(s.status)}</td>
                  <td style={{ padding: '12px', color: C.black }}>
                    {s.approvedProducts || 0}
                    {(s.pendingProducts || 0) > 0 && <span style={{ color: C.tan, fontSize: 11 }}> +{s.pendingProducts} pending</span>}
                  </td>
                  <td style={{ padding: '12px', color: C.black }}>{s.orderCount || 0}</td>
                  <td style={{ padding: '12px', color: C.black }}>{s.commissionRate}%</td>
                  <td style={{ padding: '12px', color: C.tan, fontWeight: 500 }}>GEL {s.pendingEarnings || 0}</td>
                  <td style={{ padding: '12px', color: C.gray }}>GEL {s.paidEarnings || 0}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      {s.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatus(s.id, 'approved')}
                            style={{ ...T.labelSm, fontSize: 9, padding: '6px 12px', background: 'rgba(46,125,50,0.1)', color: '#2e7d32', border: 'none', cursor: 'pointer' }}>
                            APPROVE
                          </button>
                          <button onClick={() => handleStatus(s.id, 'rejected')}
                            style={{ ...T.labelSm, fontSize: 9, padding: '6px 12px', background: 'rgba(198,40,40,0.08)', color: '#c62828', border: 'none', cursor: 'pointer' }}>
                            REJECT
                          </button>
                        </>
                      )}
                      {s.status === 'approved' && (
                        <>
                          {(s.pendingEarnings || 0) > 0 && (
                            <button onClick={() => handlePayout(s.id)}
                              style={{ ...T.labelSm, fontSize: 9, padding: '6px 12px', background: C.tan, color: C.white, border: 'none', cursor: 'pointer' }}>
                              PAY GEL {s.pendingEarnings}
                            </button>
                          )}
                          <button onClick={() => handleStatus(s.id, 'suspended')}
                            style={{ ...T.labelSm, fontSize: 9, padding: '6px 12px', background: 'rgba(100,100,100,0.1)', color: '#666', border: 'none', cursor: 'pointer' }}>
                            SUSPEND
                          </button>
                        </>
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
        const s = suppliers.find(x => x.id === expanded);
        if (!s) return null;
        return (
          <div style={{ background: C.offwhite, padding: '24px', marginTop: 8, borderLeft: `3px solid ${C.tan}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <p style={{ ...T.labelSm, fontSize: 9, color: C.gray, marginBottom: 4 }}>PHONE</p>
                <p style={{ color: C.black, fontSize: 13 }}>{s.phone || '—'}</p>
              </div>
              <div>
                <p style={{ ...T.labelSm, fontSize: 9, color: C.gray, marginBottom: 4 }}>INSTAGRAM</p>
                <p style={{ color: C.black, fontSize: 13 }}>{s.instagram || '—'}</p>
              </div>
              <div>
                <p style={{ ...T.labelSm, fontSize: 9, color: C.gray, marginBottom: 4 }}>WEBSITE</p>
                <p style={{ color: C.black, fontSize: 13 }}>{s.website || '—'}</p>
              </div>
              <div>
                <p style={{ ...T.labelSm, fontSize: 9, color: C.gray, marginBottom: 4 }}>COMMISSION RATE</p>
                <p style={{ color: C.black, fontSize: 13 }}>{s.commissionRate}%</p>
              </div>
              <div>
                <p style={{ ...T.labelSm, fontSize: 9, color: C.gray, marginBottom: 4 }}>APPLIED</p>
                <p style={{ color: C.black, fontSize: 13 }}>{new Date(s.createdAt).toLocaleDateString()}</p>
              </div>
              {s.approvedAt && (
                <div>
                  <p style={{ ...T.labelSm, fontSize: 9, color: C.gray, marginBottom: 4 }}>APPROVED</p>
                  <p style={{ color: C.black, fontSize: 13 }}>{new Date(s.approvedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            {s.description && (
              <div>
                <p style={{ ...T.labelSm, fontSize: 9, color: C.gray, marginBottom: 4 }}>DESCRIPTION</p>
                <p style={{ color: C.black, fontSize: 13, lineHeight: 1.6 }}>{s.description}</p>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
