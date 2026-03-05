import { useState, useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import HoverBtn from './HoverBtn.jsx';
import { api } from '../api.js';

const STATUS_COLORS = { pending: C.tan, approved: "#1a6b3a", rejected: C.red, completed: C.black };
const STATUSES = ["pending", "approved", "rejected", "completed"];

export default function ReturnsPanel({ mobile, toast, L }) {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReturns().then(data => setReturns(Array.isArray(data) ? data : [])).catch(() => toast("Failed to load returns", "error")).finally(() => setLoading(false));
  }, []);

  const updateStatus = (id, status) => {
    api.updateReturn(id, { status }).then(updated => {
      setReturns(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      toast(`Return ${status}`, "success");
    }).catch(() => toast("Failed to update", "error"));
  };

  const exportCSV = () => {
    const headers = ["ID", "Order ID", "User", "Reason", "Status", "Created"];
    const rows = returns.map(r => [r.id, r.orderId, r.userId, `"${(r.reason || "").replace(/"/g, '""')}"`, r.status, r.createdAt?.split("T")[0] || ""]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "returns.csv"; a.click();
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}><p style={{ ...T.bodySm, color: C.gray }}>Loading...</p></div>;

  return (
    <div style={{ background: C.cream, marginBottom: 40, animation: "fadeUp 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.lgray}` }}>
        <p style={{ ...T.label, color: C.black, fontSize: 12 }}>{L?.adminReturnRequests||"Return Requests"} ({returns.length})</p>
        {returns.length > 0 && <HoverBtn onClick={exportCSV} variant="ghost" style={{ padding: "8px 14px", fontSize: 9 }}>{L?.adminExportCSV||"Export CSV"}</HoverBtn>}
      </div>

      {returns.length === 0 ? (
        <div style={{ padding: "48px 20px", textAlign: "center" }}>
          <p style={{ ...T.bodySm, color: C.gray }}>{L?.adminNoReturns||"No return requests yet"}</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.lgray}`, background: C.offwhite }}>
                {["ID", L?.adminOrder||"Order", L?.adminReason||"Reason", L?.adminStatus||"Status", L?.adminDate||"Date", L?.adminActions||"Actions"].map(h => (
                  <th key={h} style={{ ...T.labelSm, color: C.gray, fontSize: 10, padding: "12px 14px", textAlign: "left", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {returns.map(r => (
                <tr key={r.id} style={{ borderBottom: `1px solid ${C.lgray}` }}
                  onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ ...T.bodySm, color: C.gray, padding: "12px 14px", fontSize: 11 }}>{r.id}</td>
                  <td style={{ ...T.bodySm, color: C.black, padding: "12px 14px", fontSize: 12 }}>{r.orderId}</td>
                  <td style={{ ...T.bodySm, color: C.gray, padding: "12px 14px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.reason}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ ...T.labelSm, fontSize: 9, padding: "3px 10px", background: STATUS_COLORS[r.status] || C.lgray, color: C.white }}>
                      {r.status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...T.bodySm, color: C.gray, padding: "12px 14px", fontSize: 11 }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {STATUSES.filter(s => s !== r.status).map(s => (
                        <button key={s} onClick={() => updateStatus(r.id, s)}
                          style={{ ...T.labelSm, fontSize: 8, padding: "4px 8px", border: `1px solid ${STATUS_COLORS[s]}`, background: "transparent", color: STATUS_COLORS[s], cursor: "pointer", transition: "all 0.15s" }}>
                          {s}
                        </button>
                      ))}
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
