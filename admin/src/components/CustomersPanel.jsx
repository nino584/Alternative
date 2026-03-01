import { useState, useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import HoverBtn from './HoverBtn.jsx';
import { api } from '../api.js';

export default function CustomersPanel({ orders, mobile, toast, L }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.getCustomers()
      .then(data => setCustomers(Array.isArray(data) ? data : (data?.customers || data?.users || [])))
      .catch(() => toast("Failed to load customers", "error"))
      .finally(() => setLoading(false));
  }, []);

  // Count orders per user
  const orderCounts = {};
  orders.forEach(o => {
    const uid = o.userId;
    if (uid) orderCounts[uid] = (orderCounts[uid] || 0) + 1;
  });

  const filtered = customers.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (c.name || "").toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q) || (c.phone || "").toLowerCase().includes(q);
  });

  const exportCSV = () => {
    const headers = ["Name","Email","Phone","Role","Registered","Orders"];
    const rows = filtered.map(c => [c.name, c.email, c.phone || "", c.role || "user", c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "", orderCounts[c.id] || 0]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "customers.csv"; a.click();
    toast("Customers exported", "success");
  };

  const thStyle = { ...T.labelSm, color: C.gray, fontSize: 10, padding: "12px 14px", textAlign: "left", fontWeight: 600 };

  return (
    <div style={{ background: C.cream, marginBottom: 40, animation: "fadeUp 0.3s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.lgray}` }}>
        <p style={{ ...T.label, color: C.black, fontSize: 12 }}>{L?.customersLabel||"Customers"} ({customers.length})</p>
        {filtered.length > 0 && <HoverBtn onClick={exportCSV} variant="ghost" style={{ padding: "7px 14px", fontSize: 10 }}>Export CSV</HoverBtn>}
      </div>

      {/* Search */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.lgray}` }}>
        <input type="text" placeholder={L?.searchCustomers||"Search by name, email, or phone..."} value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...T.bodySm, width: "100%", maxWidth: 400, padding: "10px 14px", border: `1px solid ${C.lgray}`, background: C.offwhite, color: C.black, outline: "none", fontSize: 13 }} />
      </div>

      {loading ? (
        <div style={{ padding: "48px 20px", textAlign: "center" }}>
          <p style={{ ...T.bodySm, color: C.gray }}>{L?.loadingText||"Loading..."}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: "48px 20px", textAlign: "center" }}>
          <p style={{ ...T.bodySm, color: C.gray }}>{search ? (L?.noCustomersMatch||"No customers match your search") : (L?.noCustomers||"No customers registered yet")}</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.lgray}`, background: C.offwhite }}>
                {[L?.nameCol||"Name", L?.emailCol||"Email", L?.phoneCol||"Phone", L?.roleCol||"Role", L?.registeredCol||"Registered", L?.ordersCol||"Orders"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${C.lgray}`, transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ ...T.bodySm, color: C.black, padding: "12px 14px", fontWeight: 500 }}>{c.name}</td>
                  <td style={{ ...T.bodySm, color: C.gray, padding: "12px 14px" }}>{c.email}</td>
                  <td style={{ ...T.bodySm, color: C.gray, padding: "12px 14px" }}>{c.phone || "—"}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{
                      ...T.labelSm, fontSize: 10, padding: "4px 10px",
                      background: c.role === "admin" ? C.black : C.tan,
                      color: C.white,
                    }}>
                      {c.role?.toUpperCase() || "USER"}
                    </span>
                  </td>
                  <td style={{ ...T.labelSm, color: C.gray, padding: "12px 14px", fontSize: 11 }}>
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td style={{ ...T.bodySm, color: C.black, padding: "12px 14px", fontWeight: 500 }}>
                    {orderCounts[c.id] || 0}
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
