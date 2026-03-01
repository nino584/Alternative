import { C, T } from '../constants/theme.js';
import HoverBtn from './HoverBtn.jsx';

const STATUS_COLOR = {
  reserved: C.brown, sourcing: C.tan, confirmed: "#1a5c8b", shipped: C.green, delivered: C.gray,
};

export default function DashboardOverview({ orders, products, mobile, setTab, L }) {
  const totalRevenue = orders.reduce((s, o) => s + (o.depositPaid || o.price || 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const ordersToday = orders.filter(o => o.createdAt?.slice(0, 10) === today).length;
  const pendingOrders = orders.filter(o => ["reserved", "sourcing"].includes(o.status)).length;
  const videoOrders = orders.filter(o => o.wantVideo).length;
  const videoRate = orders.length > 0 ? Math.round((videoOrders / orders.length) * 100) : 0;

  const kpis = [
    { label: L?.totalRevLabel||"TOTAL REVENUE", value: `GEL ${totalRevenue.toLocaleString()}`, accent: C.tan, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
    { label: L?.ordersTodayLabel||"ORDERS TODAY", value: ordersToday, accent: "#1a5c8b", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a5c8b" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { label: L?.pendingLabel||"PENDING", value: pendingOrders, accent: C.red, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { label: L?.videoRateLabel||"VIDEO RATE", value: `${videoRate}%`, accent: C.green, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> },
  ];

  // Recent orders (last 5)
  const recent = [...orders].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, 5);

  // Revenue last 7 days
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString("en", { weekday: "short" });
    const rev = orders.filter(o => o.createdAt?.slice(0, 10) === key).reduce((s, o) => s + (o.depositPaid || o.price || 0), 0);
    last7.push({ key, dayLabel, rev });
  }
  const maxRev = Math.max(...last7.map(d => d.rev), 1);

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? (L?.goodMorning||"Good morning") : hour < 18 ? (L?.goodAfternoon||"Good afternoon") : (L?.goodEvening||"Good evening");

  return (
    <div style={{ animation: "fadeUp 0.3s ease" }}>

      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Alido',serif", fontSize: mobile ? 24 : 30, fontWeight: 400, color: C.black, marginBottom: 6 }}>{greeting}</h1>
        <p style={{ ...T.bodySm, color: C.gray }}>{L?.storeToday||"Here's what's happening with your store today."}</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: mobile ? 8 : 16, marginBottom: 28 }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{
            padding: mobile ? "18px 16px" : "24px 22px", background: C.white,
            border: `1px solid ${C.lgray}`, position: "relative", overflow: "hidden",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <p style={{ ...T.labelSm, color: C.gray, fontSize: 10, letterSpacing: "0.16em" }}>{kpi.label}</p>
              <div style={{ opacity: 0.6 }}>{kpi.icon}</div>
            </div>
            <p style={{ fontFamily: "'Alido',serif", fontSize: mobile ? 26 : 34, fontWeight: 300, color: C.black, lineHeight: 1 }}>{kpi.value}</p>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: kpi.accent }} />
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "5fr 2fr", gap: 16, marginBottom: 28 }}>
        {/* Revenue Last 7 Days */}
        <div style={{ background: C.white, border: `1px solid ${C.lgray}`, padding: mobile ? 18 : 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <p style={{ ...T.label, color: C.black, fontSize: 12 }}>{L?.revenueLast7||"Revenue — Last 7 Days"}</p>
            <p style={{ fontFamily: "'Alido',serif", fontSize: 18, color: C.tan }}>GEL {last7.reduce((s, d) => s + d.rev, 0).toLocaleString()}</p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: mobile ? 6 : 12, height: 140 }}>
            {last7.map(d => (
              <div key={d.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ ...T.labelSm, fontSize: 9, color: C.gray }}>{d.rev > 0 ? d.rev : ""}</span>
                <div style={{
                  width: "100%", maxWidth: 48, borderRadius: "2px 2px 0 0",
                  height: `${Math.max(6, (d.rev / maxRev) * 85)}%`,
                  background: d.rev > 0 ? C.tan : C.lgray,
                  transition: "height 0.6s ease",
                }} />
                <span style={{ ...T.labelSm, fontSize: 10, color: C.gray }}>{d.dayLabel}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: C.white, border: `1px solid ${C.lgray}`, padding: mobile ? 18 : 28, display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ ...T.label, color: C.black, fontSize: 12, marginBottom: 4 }}>{L?.quickActions||"Quick Actions"}</p>
          <HoverBtn onClick={() => setTab("products")} variant="tan" style={{ padding: "13px 20px", fontSize: 10, width: "100%" }}>
            {L?.addProduct||"+ Add Product"}
          </HoverBtn>
          <HoverBtn onClick={() => setTab("orders")} variant="ghost" style={{ padding: "13px 20px", fontSize: 10, width: "100%" }}>
            {L?.viewAllOrders||"View All Orders →"}
          </HoverBtn>
          <HoverBtn onClick={() => setTab("customers")} variant="ghost" style={{ padding: "13px 20px", fontSize: 10, width: "100%" }}>
            {L?.navCustomers||"Customers"}
          </HoverBtn>
          <div style={{ marginTop: "auto", padding: 16, background: C.offwhite, border: `1px solid ${C.lgray}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ ...T.bodySm, color: C.gray, fontSize: 11 }}>{L?.navProducts||"Products"}</span>
              <span style={{ ...T.bodySm, color: C.black, fontSize: 11, fontWeight: 500 }}>{products.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ ...T.bodySm, color: C.gray, fontSize: 11 }}>{L?.totalOrders||"Total Orders"}</span>
              <span style={{ ...T.bodySm, color: C.black, fontSize: 11, fontWeight: 500 }}>{orders.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ background: C.white, border: `1px solid ${C.lgray}`, marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: `1px solid ${C.lgray}` }}>
          <p style={{ ...T.label, color: C.black, fontSize: 12 }}>{L?.recentOrdersLabel||"Recent Orders"}</p>
          <button onClick={() => setTab("orders")} style={{ background: "none", border: "none", ...T.labelSm, color: C.tan, fontSize: 10, cursor: "pointer", transition: "opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            {L?.viewAllOrders||"View All →"}
          </button>
        </div>
        {recent.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.lgray} strokeWidth="1.5" style={{ marginBottom: 12 }}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
            <p style={{ ...T.bodySm, color: C.gray }}>{L?.noRecentOrders||"No orders yet"}</p>
            <p style={{ ...T.bodySm, color: C.lgray, fontSize: 12, marginTop: 4 }}>Orders will appear here once customers start purchasing.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.lgray}` }}>
                  {[L?.orderID||"Order ID", L?.customer||"Customer", L?.itemCol||"Item", L?.statusCol||"Status", L?.amountCol||"Amount", L?.dateCol||"Date"].map(h => (
                    <th key={h} style={{ ...T.labelSm, color: C.gray, fontSize: 10, padding: "12px 16px", textAlign: "left", fontWeight: 600, background: C.offwhite }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((o, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.lgray}`, transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ ...T.labelSm, color: C.tan, padding: "12px 16px", fontSize: 11 }}>{o.orderId || "—"}</td>
                    <td style={{ ...T.bodySm, color: C.black, padding: "12px 16px", fontWeight: 400 }}>{o.customerName || "Customer"}</td>
                    <td style={{ ...T.bodySm, color: C.black, padding: "12px 16px", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.productName || o.name || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ ...T.labelSm, fontSize: 10, padding: "4px 10px", background: STATUS_COLOR[o.status] || C.gray, color: C.white, borderRadius: 1 }}>{o.status || "—"}</span>
                    </td>
                    <td style={{ ...T.bodySm, color: C.black, padding: "12px 16px", fontWeight: 500 }}>GEL {o.depositPaid || o.price || 0}</td>
                    <td style={{ ...T.labelSm, color: C.gray, padding: "12px 16px", fontSize: 11 }}>{o.createdAt?.slice(0, 10) || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
