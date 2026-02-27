/**
 * A small SVG "horizon diagram" showing:
 *  – a horizon line
 *  – the sun below the horizon (at sunset, altitude is ~0° or slightly negative)
 *  – the moon above the horizon at its measured altitude
 *  – an arc label for the angular separation (ARCV / elongation)
 *
 * All values are in degrees.  The diagram fits in a compact box (default 160×100).
 */

interface HorizonDiagramProps {
  /** Moon altitude in degrees above the horizon at sunset (can be negative) */
  moonAltitudeDeg: number;
  /** Sun altitude in degrees (usually ≤ 0 at sunset; default -1) */
  sunAltitudeDeg?: number;
  /** Arc of Vision (ARCV) or elongation in degrees – shown as label */
  arcDeg?: number;
  /** Lag time in minutes (moonset − sunset) */
  lagMinutes?: number;
  /** Width in px */
  width?: number;
  /** Height in px */
  height?: number;
  className?: string;
}

export default function HorizonDiagram({
  moonAltitudeDeg,
  sunAltitudeDeg = -1,
  arcDeg,
  lagMinutes,
  width = 160,
  height = 100,
  className,
}: HorizonDiagramProps) {
  // Layout constants
  const horizonY = height * 0.62;          // horizon line y
  const degScale = (height * 0.45) / 20;   // pixels per degree (20° fills ~45% of height)
  const sunX = width * 0.3;
  const moonX = width * 0.7;

  // Clamp altitudes for visual sanity
  const clampAlt = (d: number) => Math.max(-10, Math.min(25, d));
  const sunY = horizonY - clampAlt(sunAltitudeDeg) * degScale;
  const moonY = horizonY - clampAlt(moonAltitudeDeg) * degScale;

  const sunR = 7;
  const moonR = 5;

  // Determine colors for moon based on altitude
  const moonFill = moonAltitudeDeg > 0 ? '#fbbf24' : '#94a3b8';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-label={`Horizon diagram: moon at ${moonAltitudeDeg.toFixed(1)}°`}
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={width} height={horizonY} fill="url(#sky)" rx={4} />

      {/* Ground */}
      <rect x={0} y={horizonY} width={width} height={height - horizonY} fill="#1e293b" rx={0} />

      {/* Horizon line */}
      <line x1={0} y1={horizonY} x2={width} y2={horizonY} stroke="#64748b" strokeWidth={1} strokeDasharray="4 2" />
      <text x={4} y={horizonY - 3} fill="#94a3b8" fontSize={8} fontFamily="system-ui">
        0°
      </text>

      {/* Sun (below horizon) */}
      <circle cx={sunX} cy={sunY} r={sunR} fill="#f97316" opacity={0.85} />
      <text x={sunX} y={sunY + sunR + 10} textAnchor="middle" fill="#f97316" fontSize={8} fontFamily="system-ui">
        ☉
      </text>

      {/* Moon */}
      <circle cx={moonX} cy={moonY} r={moonR} fill={moonFill} />
      {/* Moon altitude label */}
      <text x={moonX + moonR + 3} y={moonY + 3} fill="#fbbf24" fontSize={8} fontFamily="system-ui">
        {moonAltitudeDeg.toFixed(1)}°
      </text>
      <text x={moonX} y={moonY - moonR - 3} textAnchor="middle" fill="#e2e8f0" fontSize={8} fontFamily="system-ui">
        ☽
      </text>

      {/* Dashed line between sun and moon with arc label */}
      <line x1={sunX} y1={sunY} x2={moonX} y2={moonY} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="3 2" />
      {typeof arcDeg === 'number' && (
        <text
          x={(sunX + moonX) / 2}
          y={Math.min(sunY, moonY) - 6}
          textAnchor="middle"
          fill="#cbd5e1"
          fontSize={9}
          fontFamily="system-ui"
          fontWeight="bold"
        >
          {arcDeg.toFixed(1)}°
        </text>
      )}

      {/* Lag label at bottom */}
      {typeof lagMinutes === 'number' && (
        <text
          x={width / 2}
          y={height - 4}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize={8}
          fontFamily="system-ui"
        >
          lag {Math.round(lagMinutes)} min
        </text>
      )}
    </svg>
  );
}
