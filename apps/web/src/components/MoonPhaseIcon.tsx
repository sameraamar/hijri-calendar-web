/**
 * Renders a moon phase SVG based on illumination fraction.
 *
 * Approach: start with a bright yellow disc (fully-lit moon surface), then
 * draw a dark overlay for the UNLIT portion.  This ensures 100 % → full
 * yellow, 0 % → full dark, and everything in between scales naturally.
 *
 * The lit crescent stays on the RIGHT (waxing crescent, Northern-Hemisphere
 * convention).
 *
 * @param illumination – 0 (new moon) to 1 (full moon).
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

  // Dark (unlit) fraction
  const dark = 1 - ill;

  // Terminator ellipse x-radius:
  //   dark=0   → no shadow path needed (full moon)
  //   dark=0.5 → terminator is a straight vertical line (rx=0)
  //   dark=1   → shadow covers entire disc (new moon)
  const rx = Math.abs(2 * dark - 1) * r;

  // Inner-arc sweep direction flips at the halfway mark so the shadow area
  // expands correctly from a thin left crescent to full cover.
  const innerSweep = dark < 0.5 ? 1 : 0;

  // Path: outer LEFT arc (sweep=0 = counter-clockwise) from top to bottom,
  // then inner arc (terminator) back from bottom to top.
  // The dark overlay sits on the LEFT, keeping the lit crescent on the RIGHT.
  const d = [
    `M ${cx} ${cy - r}`,
    // outer arc – left half of disc (sweep=0 = CCW)
    `A ${r} ${r} 0 0 0 ${cx} ${cy + r}`,
    // inner arc – the terminator line
    `A ${rx} ${r} 0 0 ${innerSweep} ${cx} ${cy - r}`,
    'Z',
  ].join(' ');

  const pct = Math.round(ill * 100);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`transition-transform duration-200 hover:scale-[2.5] hover:z-50 ${className ?? ''}`}
      style={{ transformOrigin: 'center' }}
      aria-label={`Moon illumination ${pct}%`}
    >
      {/* Bright moon surface (fully-lit baseline) */}
      <circle cx={cx} cy={cy} r={r - 0.5} fill="#fef9c3" stroke="#94a3b8" strokeWidth={0.5} />
      {/* Dark shadow overlay for the unlit portion */}
      {dark > 0.005 && (
        <path d={d} fill="#334155" />
      )}
      {/* Percentage label – outlined for readability on both dark & light */}
      <text
        x={cx}
        y={cy + size * 0.13}
        textAnchor="middle"
        fill="#ffffff"
        stroke="#1e293b"
        strokeWidth={size * 0.04}
        paintOrder="stroke"
        fontSize={size * 0.38}
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        {pct}%
      </text>
    </svg>
  );
}
