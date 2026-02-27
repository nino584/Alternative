import { C, T } from '../../constants/theme.js';

// ── HOVER BUTTON (CSS-class driven, proper states) ───────────────────────────
export default function HoverBtn({onClick,variant="primary",children,style={},disabled=false,className=""}) {
  const variantClass = {
    primary:"btn-primary",secondary:"btn-secondary",tan:"btn-tan",
    ghost:"btn-ghost",white:"btn-white",danger:"btn-danger",
  }[variant]||"btn-primary";

  return (
    <button
      className={`btn ${variantClass} ${className}`}
      onClick={disabled?undefined:onClick}
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
