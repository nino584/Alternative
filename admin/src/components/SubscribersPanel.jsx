import { useState, useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import HoverBtn from './HoverBtn.jsx';
import { api } from '../api.js';
import { csvSafe } from '../utils/csv.js';

export default function SubscribersPanel({ mobile, toast, L }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);

  const loadSubscribers = () => {
    setLoading(true);
    setError(false);
    api.getSubscribers()
      .then(data => setSubs(Array.isArray(data) ? data : (data?.data || data?.subscribers || [])))
      .catch(() => { setError(true); toast("Failed to load subscribers", "error"); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadSubscribers(); }, []);

  const filtered = subs.filter(s => !search.trim() || s.email?.toLowerCase().includes(search.toLowerCase()));

  const exportCSV = () => {
    const headers = ["Email","Subscribed At"];
    const rows = filtered.map(s => [csvSafe(s.email), csvSafe(s.subscribedAt || "")]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "subscribers.csv"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Subscribers exported", "success");
  };

  const thStyle = { ...T.labelSm, color: C.gray, fontSize: 10, padding: "12px 14px", textAlign: "left", fontWeight: 600 };

  return (
    <div style={{ background: C.cream, marginBottom: 40, animation: "fadeUp 0.3s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.lgray}` }}>
        <p style={{ ...T.label, color: C.black, fontSize: 12 }}>{L?.newsletterSubs||"Newsletter Subscribers"} ({subs.length})</p>
        <HoverBtn onClick={exportCSV} variant="ghost" style={{ padding: "7px 14px", fontSize: 10 }}>{L?.exportCSV||"Export CSV"}</HoverBtn>
      </div>

      {/* Search */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.lgray}` }}>
        <input type="text" placeholder={L?.searchEmail||"Search by email..."} value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...T.bodySm, width: "100%", maxWidth: 400, padding: "10px 14px", border: `1px solid ${C.lgray}`, background: C.offwhite, color: C.black, outline: "none", fontSize: 13 }} />
      </div>

      {loading ? (
        <div style={{ padding: "48px 20px", textAlign: "center" }}>
          <p style={{ ...T.bodySm, color: C.gray }}>{L?.loadingText||"Loading..."}</p>
        </div>
      ) : error ? (
        <div style={{ padding: "48px 20px", textAlign: "center" }}>
          <p style={{ ...T.bodySm, color: C.gray, marginBottom: 12 }}>{L?.couldNotLoad||"Could not load"}</p>
          <HoverBtn onClick={loadSubscribers} variant="ghost" style={{ padding: "7px 14px", fontSize: 10 }}>{L?.retryText||"Retry"}</HoverBtn>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: "48px 20px", textAlign: "center" }}>
          <p style={{ ...T.bodySm, color: C.gray }}>{search ? (L?.noSubscribersMatch||"No subscribers match your search") : (L?.noSubscribers||"No subscribers yet")}</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.lgray}`, background: C.offwhite }}>
                {["#", L?.emailCol||"Email", L?.subscribedDate||"Subscribed Date"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.email} style={{ borderBottom: `1px solid ${C.lgray}`, transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ ...T.bodySm, color: C.gray, padding: "12px 14px", fontSize: 12 }}>{i + 1}</td>
                  <td style={{ ...T.bodySm, color: C.black, padding: "12px 14px" }}>{s.email}</td>
                  <td style={{ ...T.labelSm, color: C.gray, padding: "12px 14px", fontSize: 11 }}>
                    {s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString() : "—"}
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
