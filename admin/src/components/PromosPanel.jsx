import { useState, useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import HoverBtn from './HoverBtn.jsx';
import { api } from '../api.js';
import { csvSafe } from '../utils/csv.js';

export default function PromosPanel({ mobile, toast, L }) {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", type: "percent", value: "", minOrder: "", maxUses: "", expiresAt: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    api.getPromos().then(data => setPromos(Array.isArray(data) ? data : [])).catch(() => toast("Failed to load promos", "error")).finally(() => setLoading(false));
  }, []);

  const inputStyle = { ...T.bodySm, width: "100%", padding: "10px 14px", border: `1px solid ${C.lgray}`, background: C.offwhite, color: C.black, outline: "none", fontSize: 13 };

  const save = () => {
    if (!form.code.trim() || !form.value) { toast("Code and value are required", "error"); return; }
    const numValue = Number(form.value);
    if (form.type === "percent") {
      if (numValue < 1 || numValue > 100) { toast("Percent discount must be between 1 and 100", "error"); return; }
    } else {
      if (numValue <= 0) { toast("Fixed discount must be a positive number", "error"); return; }
    }
    api.createPromo({
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      minOrder: form.minOrder ? Number(form.minOrder) : 0,
      maxUses: form.maxUses ? Number(form.maxUses) : 0,
      expiresAt: form.expiresAt || null,
    }).then(res => {
      setPromos(prev => [...prev, { ...res, createdAt: new Date().toISOString(), usedCount: 0 }]);
      toast("Promo created", "success");
      setShowForm(false);
      setForm({ code: "", type: "percent", value: "", minOrder: "", maxUses: "", expiresAt: "" });
    }).catch(err => toast(err?.message || "Failed to create", "error"));
  };

  const toggleActive = (promo) => {
    api.updatePromo(promo.code, { active: !promo.active }).then(updated => {
      setPromos(prev => prev.map(p => p.code === promo.code ? { ...p, active: !p.active } : p));
      toast(promo.active ? "Promo deactivated" : "Promo activated", "success");
    }).catch(() => toast("Failed to update", "error"));
  };

  const deletePromo = (code) => {
    api.deletePromo(code).then(() => {
      setPromos(prev => prev.filter(p => p.code !== code));
      toast("Promo deleted", "success");
      setDeleteConfirm(null);
    }).catch(() => { toast("Failed to delete", "error"); setDeleteConfirm(null); });
  };

  const exportCSV = () => {
    const headers = ["Code", "Type", "Value", "Min Order", "Max Uses", "Used", "Active", "Expires", "Created"];
    const rows = promos.map(p => [csvSafe(p.code), csvSafe(p.type), csvSafe(p.value), csvSafe(p.minOrder || 0), csvSafe(p.maxUses || "∞"), csvSafe(p.usedCount || 0), csvSafe(p.active ? "Yes" : "No"), csvSafe(p.expiresAt || "Never"), csvSafe(p.createdAt?.split("T")[0] || "")]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "promos.csv"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}><p style={{ ...T.bodySm, color: C.gray }}>Loading...</p></div>;

  return (
    <div style={{ background: C.cream, marginBottom: 40, animation: "fadeUp 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.lgray}` }}>
        <p style={{ ...T.label, color: C.black, fontSize: 12 }}>{L?.adminPromoCodes||"Promo Codes"} ({promos.length})</p>
        <div style={{ display: "flex", gap: 8 }}>
          {promos.length > 0 && <HoverBtn onClick={exportCSV} variant="ghost" style={{ padding: "8px 14px", fontSize: 9 }}>{L?.adminExportCSV||"Export CSV"}</HoverBtn>}
          <HoverBtn onClick={() => setShowForm(!showForm)} variant="tan" style={{ padding: "8px 18px", fontSize: 14, fontWeight: "bold" }}>+</HoverBtn>
        </div>
      </div>

      {showForm && (
        <div style={{ padding: 20, borderBottom: `1px solid ${C.lgray}`, background: C.offwhite, animation: "slideDown 0.2s ease" }}>
          <p style={{ ...T.label, color: C.black, fontSize: 11, marginBottom: 16 }}>{L?.adminCreatePromo||"Create Promo Code"}</p>
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminCode||"CODE"} *</label>
              <input style={inputStyle} value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. WELCOME20" />
            </div>
            <div>
              <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminType||"TYPE"}</label>
              <div style={{ display: "flex", gap: 4 }}>
                {["percent", "fixed"].map(t => (
                  <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                    style={{ ...T.labelSm, fontSize: 11, padding: "10px 16px", flex: 1, border: `1px solid ${form.type === t ? C.tan : C.lgray}`, background: form.type === t ? C.tan : "transparent", color: form.type === t ? C.white : C.gray, cursor: "pointer", transition: "all 0.2s" }}>
                    {t === "percent" ? "%" : "GEL"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminValue||"VALUE"} * ({form.type === "percent" ? "%" : "GEL"})</label>
              <input style={inputStyle} type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder="e.g. 20" />
            </div>
            <div>
              <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminMinOrder||"MIN ORDER (GEL)"}</label>
              <input style={inputStyle} type="number" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} placeholder="0 = no minimum" />
            </div>
            <div>
              <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminMaxUses||"MAX USES"}</label>
              <input style={inputStyle} type="number" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} placeholder="0 = unlimited" />
            </div>
            <div>
              <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminExpires||"EXPIRES"}</label>
              <input style={inputStyle} type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <HoverBtn onClick={save} variant="tan" style={{ padding: "10px 28px", fontSize: 9 }}>{L?.adminCreatePromoBtn||"Create Promo"}</HoverBtn>
            <HoverBtn onClick={() => setShowForm(false)} variant="ghost" style={{ padding: "10px 20px", fontSize: 9 }}>{L?.adminCancel||"Cancel"}</HoverBtn>
          </div>
        </div>
      )}

      {promos.length === 0 ? (
        <div style={{ padding: "48px 20px", textAlign: "center" }}>
          <p style={{ ...T.bodySm, color: C.gray, marginBottom: 16 }}>{L?.adminNoPromos||"No promo codes yet"}</p>
          <HoverBtn onClick={() => setShowForm(true)} variant="tan" style={{ padding: "10px 24px", fontSize: 9 }}>{L?.adminCreateFirstPromo||"Create First Promo"}</HoverBtn>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.lgray}`, background: C.offwhite }}>
                {[L?.adminCode||"Code", L?.adminType||"Type", L?.adminValue||"Value", L?.adminMinOrder||"Min Order", L?.adminUses||"Uses", L?.adminStatus||"Status", L?.adminExpires||"Expires", L?.adminActions||"Actions"].map(h => (
                  <th key={h} style={{ ...T.labelSm, color: C.gray, fontSize: 10, padding: "12px 14px", textAlign: "left", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {promos.map(p => (
                <tr key={p.code} style={{ borderBottom: `1px solid ${C.lgray}`, transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ ...T.label, color: C.black, padding: "12px 14px", fontSize: 12 }}>{p.code}</td>
                  <td style={{ ...T.bodySm, color: C.gray, padding: "12px 14px" }}>{p.type === "percent" ? (L?.adminPercent||"Percent") : (L?.adminFixed||"Fixed")}</td>
                  <td style={{ ...T.bodySm, color: C.black, padding: "12px 14px", fontWeight: 500 }}>{p.type === "percent" ? `${p.value}%` : `GEL ${p.value}`}</td>
                  <td style={{ ...T.bodySm, color: C.gray, padding: "12px 14px" }}>{p.minOrder ? `GEL ${p.minOrder}` : "—"}</td>
                  <td style={{ ...T.bodySm, color: C.gray, padding: "12px 14px" }}>{p.usedCount || 0} / {p.maxUses || "∞"}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ ...T.labelSm, fontSize: 9, padding: "3px 10px", background: p.active ? C.tan : C.lgray, color: p.active ? C.white : C.gray }}>
                      {p.active ? (L?.adminActive||"Active") : (L?.adminInactive||"Inactive")}
                    </span>
                  </td>
                  <td style={{ ...T.bodySm, color: C.gray, padding: "12px 14px", fontSize: 11 }}>{p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : (L?.adminNever||"Never")}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <HoverBtn onClick={() => toggleActive(p)} variant="ghost" style={{ padding: "5px 12px", fontSize: 10 }}>{p.active ? (L?.adminDisable||"Disable") : (L?.adminEnable||"Enable")}</HoverBtn>
                      {deleteConfirm === p.code ? (
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          <span style={{ ...T.labelSm, color: C.red, fontSize: 10 }}>{L?.adminSure||"Sure?"}</span>
                          <button onClick={() => deletePromo(p.code)} style={{ background: "none", border: "none", cursor: "pointer", ...T.labelSm, color: C.tan, fontSize: 10 }}>{L?.adminYes||"Yes"}</button>
                          <button onClick={() => setDeleteConfirm(null)} style={{ background: "none", border: "none", cursor: "pointer", ...T.labelSm, color: C.red, fontSize: 10 }}>{L?.adminNo||"No"}</button>
                        </div>
                      ) : (
                        <HoverBtn onClick={() => setDeleteConfirm(p.code)} variant="danger" style={{ padding: "5px 12px", fontSize: 10 }}>{L?.adminDelete||"Delete"}</HoverBtn>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
