const BASE = import.meta.env.BASE_URL;

// ── LOGO ──────────────────────────────────────────────────────────────────────
export const LogoMark = ({size=1}) => (
  <img
    src={`${BASE}images/logo.png`}
    alt="Alternative"
    style={{ height: 22 * size, width: "auto", display: "block" }}
  />
);

export const Logo = ({size=1, variant="dark"}) => (
  <img
    src={`${BASE}images/${variant === "white" ? "logo-white" : "logo"}.png`}
    alt="Alternative"
    style={{ height: 28 * size, width: "auto", display: "block" }}
  />
);
