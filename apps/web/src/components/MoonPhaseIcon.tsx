/**
 * Renders a moon phase SVG based on illumination fraction.
 *
 * @param illumination – 0 (new moon) to 1 (full moon).  Values represent the
 *   waxing crescent through full cycle.  For simplicity we always draw a
 *   waxing crescent/gibbous (right-lit) since the data tracks "how lit is the
 *   moon right now".
 * @param size – pixel width/height (default 24).
 */

interface MoonPhaseIconProps {
  /** 0 = new moon, 1 = full moon */
  illumination: number;
  /** px, default 24 */
  size?: number;
  className?: string;
}

export default function MoonPhaseIcon({ illumination, size = 24, className }: MoonPhaseIconProps) {
  const r = size / 2;
  const cx = r;
  const cy = r;

  // Clamp
  const ill = Math.max(0, Math.min(1, illumination));

  // The terminator is drawn as two vertical arcs from top to bottom of the
  // disc.  We vary the x-radius of an inner ellipse to produce the correct
  // lit fraction.
  //
  // ill = 0   → new moon (all dark)
  // ill = 0.5 → first quarter (half lit, terminator is a straight line)
  // ill = 1   → full moon (all lit)
  //
  // The "sweep" of the inner arc flips at the halfway mark so the lit area
  // grows correctly from crescent → gibbous → full.

  // How far across the disc the terminator sits, mapped to an ellipse rx.
  // At ill=0 the terminator hugs the right edge (rx=r, sweep same as outer)
  // At ill=0.5 terminator is a straight line (rx=0)
  // At ill=1 terminator hugs the left edge (rx=r, sweep opposite outer)
  const rx = Math.abs(2 * ill - 1) * r;

  // For ill < 0.5 the dark side is larger – inner arc sweeps the same way.
  // For ill >= 0.5 the lit side is larger – inner arc sweeps the opposite way.
  const innerSweep = ill < 0.5 ? 1 : 0;

  // Path: outer right arc (always sweep=1) from top-centre to bottom-centre,
  // then inner arc (terminator) back from bottom to top.
  const d = [
    `M ${cx} ${cy - r}`,
    // outer arc – right half of disc (always the lit edge for waxing)
    `A ${r} ${r} 0 0 1 ${cx} ${cy + r}`,
    // inner arc – the terminator line
    `A ${rx} ${r} 0 0 ${innerSweep} ${cx} ${cy - r}`,
    'Z',
  ].join(' ');

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label={`Moon illumination ${Math.round(ill * 100)}%`}
    >
      {/* Dark background disc */}
      <circle cx={cx} cy={cy} r={r - 0.5} fill="#334155" stroke="#94a3b8" strokeWidth={0.5} />
      {/* Lit portion */}
      {ill > 0.005 && (
        <path d={d} fill="#fef9c3" />
      )}
    </svg>
  );
}
