// ── HOVER BUTTON (CSS-class driven with luxury effects) ─────────────────────
export default function HoverBtn({onClick,variant="primary",children,style={},disabled=false,className="",type="button"}) {
  const variantClass = {
    primary:"btn-primary",secondary:"btn-secondary",tan:"btn-tan",
    ghost:"btn-ghost",white:"btn-white",danger:"btn-danger",
    // Luxury effects
    shimmer:"btn-shimmer",spotlight:"btn-spotlight",gradient:"btn-gradient",
    underline:"btn-underline-draw",lines:"btn-lines",
  }[variant]||"btn-primary";

  // Luxury variants don't need base .btn padding/styles for underline & lines
  const isMinimal = variant === "underline" || variant === "lines";

  return (
    <button
      type={type}
      className={`${isMinimal ? '' : 'btn '}${variantClass} ${className}`}
      onClick={disabled?undefined:onClick}
      style={style}
      disabled={disabled}
    >
      {variant === "spotlight" ? <span>{children}</span> : children}
    </button>
  );
}
