import { useState, useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import { VIDEO_VERIFICATION_GEL } from '../constants/config.js';
import HoverBtn from './HoverBtn.jsx';
import { api } from '../api.js';

const DEFAULTS = {
  storeName: "Alternative — Curated Luxury",
  email: "hello@alternative.ge",
  phone: "+995 555 999 555",
  address: "Tbilisi, Georgia",
  videoPrice: VIDEO_VERIFICATION_GEL,
};

export default function SettingsPanel({ mobile, toast, L }) {
  const [settings, setSettings] = useState({ ...DEFAULTS });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getSettings().then(saved => {
      if (saved) setSettings(s => ({ ...s, ...saved }));
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.saveSettings(settings);
      toast("Settings saved", "success");
      setEditing(false);
    } catch {
      toast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { ...T.bodySm, width: "100%", padding: "10px 14px", border: `1px solid ${C.lgray}`, background: C.offwhite, color: C.black, outline: "none", fontSize: 13 };
  const readOnlyStyle = { ...T.bodySm, color: C.black, padding: "10px 14px", background: C.offwhite, border: `1px solid ${C.lgray}` };

  const fields = [
    { key: "storeName", label: L?.adminStoreName||"Store Name" },
    { key: "email", label: L?.adminEmail||"Email" },
    { key: "phone", label: L?.adminPhone||"Phone" },
    { key: "address", label: L?.adminAddress||"Address" },
  ];

  return (
    <div style={{ marginBottom: 40, animation: "fadeUp 0.3s ease" }}>

      {/* Store Settings */}
      <div style={{ background: C.cream, marginBottom: 3 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.lgray}` }}>
          <p style={{ ...T.label, color: C.black, fontSize: 12 }}>{L?.adminStoreSettings||"Store Settings"}</p>
          {!editing && (
            <HoverBtn onClick={() => setEditing(true)} variant="ghost" style={{ padding: "7px 14px", fontSize: 10 }}>{L?.adminEdit||"Edit"}</HoverBtn>
          )}
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 20 }}>
            {fields.map(f => (
              <div key={f.key}>
                <p style={{ ...T.labelSm, color: C.gray, fontSize: 10, marginBottom: 6 }}>{f.label}</p>
                {editing ? (
                  <input style={inputStyle} value={settings[f.key]} onChange={e => setSettings(s => ({ ...s, [f.key]: e.target.value }))} />
                ) : (
                  <p style={readOnlyStyle}>{settings[f.key]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Video Verification Price */}
          <div style={{ marginTop: 20 }}>
            <p style={{ ...T.labelSm, color: C.gray, fontSize: 10, marginBottom: 6 }}>{L?.adminVideoPrice||"VIDEO VERIFICATION PRICE (GEL)"}</p>
            {editing ? (
              <input style={{ ...inputStyle, maxWidth: 200 }} type="number" value={settings.videoPrice}
                onChange={e => setSettings(s => ({ ...s, videoPrice: e.target.value }))} />
            ) : (
              <p style={{ ...readOnlyStyle, maxWidth: 200 }}>{settings.videoPrice} GEL</p>
            )}
          </div>

          {/* Status indicator */}
          <div style={{ marginTop: 20, padding: 16, background: C.offwhite, border: `1px solid ${C.lgray}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ width: 8, height: 8, background: C.green, display: "inline-block", borderRadius: "50%" }} />
              <p style={{ ...T.bodySm, color: C.green, fontWeight: 500 }}>{L?.adminStoreIsLive||"Store is live"}</p>
            </div>
            <p style={{ ...T.bodySm, color: C.gray, fontSize: 12 }}>
              {L?.adminVideoAddon||"Video verification add-on"}: {settings.videoPrice} GEL {L?.adminPerOrder||"per order"}
            </p>
          </div>

          {/* Save / Cancel */}
          {editing && (
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <HoverBtn onClick={save} variant="tan" style={{ padding: "10px 24px", fontSize: 10 }} disabled={saving}>
                {saving ? (L?.adminSaving||"Saving...") : (L?.adminSaveSettings||"Save Settings")}
              </HoverBtn>
              <HoverBtn onClick={() => { setEditing(false); api.getSettings().then(saved => { if (saved) setSettings(s => ({ ...DEFAULTS, ...saved })); else setSettings({ ...DEFAULTS }); }); }} variant="ghost" style={{ padding: "10px 20px", fontSize: 10 }}>
                {L?.adminCancel||"Cancel"}
              </HoverBtn>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ background: C.cream }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.lgray}` }}>
          <p style={{ ...T.label, color: C.black, fontSize: 12 }}>{L?.adminQuickLinks||"Quick Links"}</p>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(4, 1fr)", gap: 12 }}>
            {[
              { label: L?.adminPrivacyPolicy||"Privacy Policy", path: "/privacy" },
              { label: L?.adminTermsOfService||"Terms of Service", path: "/terms" },
              { label: L?.adminReturnPolicy||"Return Policy", path: "/returns" },
              { label: L?.adminShippingInfo||"Shipping Info", path: "/shipping" },
            ].map(link => (
              <a key={link.path}
                href={`${import.meta.env.VITE_STORE_URL || 'http://localhost:5173'}${link.path}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  ...T.label, fontSize: 11, padding: "16px 20px",
                  background: C.offwhite, border: `1px solid ${C.lgray}`,
                  color: C.black, cursor: "pointer", textDecoration: "none",
                  textAlign: "left", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.tan; e.currentTarget.style.color = C.tan; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.lgray; e.currentTarget.style.color = C.black; }}>
                {link.label}
                <span style={{ float: "right", fontWeight: 300 }}>→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
