/**
 * Inline SVG diagrams illustrating the four key astronomical variables
 * used in crescent-visibility models:
 *   h  — moon altitude above the horizon at sunset
 *   Δ  — moon–sun elongation (angular separation)
 *   A  — moon age since last conjunction (new moon)
 *   L  — moonset lag (time between sunset and moonset)
 */

/* ------------------------------------------------------------------ */
/*  1.  Moon Altitude (h)                                              */
/* ------------------------------------------------------------------ */
export function AltitudeDiagram({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 140"
      className={className}
      role="img"
      aria-label="Moon altitude diagram"
    >
      {/* sky gradient */}
      <defs>
        <linearGradient id="alt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#4a90c4" />
        </linearGradient>
      </defs>
      <rect width="220" height="90" fill="url(#alt-sky)" rx="4" />
      {/* ground */}
      <rect y="90" width="220" height="50" fill="#5b4a2e" rx="0" />
      {/* horizon line */}
      <line x1="0" y1="90" x2="220" y2="90" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="8" y="86" fill="#e2e8f0" fontSize="8" fontFamily="sans-serif">
        Horizon
      </text>

      {/* observer */}
      <circle cx="40" cy="90" r="3" fill="#f8fafc" />
      <line x1="40" y1="90" x2="40" y2="100" stroke="#f8fafc" strokeWidth="1.5" />
      <text x="30" y="112" fill="#d1c9b8" fontSize="7" fontFamily="sans-serif">
        Observer
      </text>

      {/* sightline to horizon (reference) */}
      <line x1="40" y1="90" x2="190" y2="90" stroke="#94a3b8" strokeWidth="0.7" strokeDasharray="2 2" />

      {/* sightline to moon */}
      <line x1="40" y1="90" x2="160" y2="35" stroke="#fef08a" strokeWidth="0.8" strokeDasharray="3 2" />

      {/* altitude arc */}
      <path
        d="M 80,90 A 40,40 0 0,1 72,70"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="1.5"
      />
      <text x="82" y="80" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
        h
      </text>

      {/* moon */}
      <circle cx="160" cy="35" r="10" fill="#fef9c3" />
      <circle cx="164" cy="32" r="8" fill="#1e3a5f" opacity="0.7" />
      <text x="173" y="38" fill="#fef9c3" fontSize="8" fontFamily="sans-serif">
        Moon
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  2.  Moon–Sun Elongation (Δ)                                        */
/* ------------------------------------------------------------------ */
export function ElongationDiagram({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 140"
      className={className}
      role="img"
      aria-label="Moon–sun elongation diagram"
    >
      <defs>
        <linearGradient id="elong-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="80%" stopColor="#c4680a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect width="220" height="100" fill="url(#elong-sky)" rx="4" />
      <rect y="100" width="220" height="40" fill="#5b4a2e" />
      <line x1="0" y1="100" x2="220" y2="100" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* observer */}
      <circle cx="40" cy="100" r="3" fill="#f8fafc" />
      <line x1="40" y1="100" x2="40" y2="110" stroke="#f8fafc" strokeWidth="1.5" />

      {/* sun (below/at horizon) */}
      <circle cx="170" cy="96" r="11" fill="#fbbf24" opacity="0.9" />
      <text x="160" y="118" fill="#d1c9b8" fontSize="7" fontFamily="sans-serif">
        Sun
      </text>

      {/* moon */}
      <circle cx="130" cy="40" r="9" fill="#fef9c3" />
      <circle cx="133" cy="37" r="7" fill="#1e3a5f" opacity="0.6" />
      <text x="141" y="44" fill="#fef9c3" fontSize="7" fontFamily="sans-serif">
        Moon
      </text>

      {/* lines from observer */}
      <line x1="40" y1="100" x2="170" y2="96" stroke="#fbbf24" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6" />
      <line x1="40" y1="100" x2="130" y2="40" stroke="#fef08a" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6" />

      {/* elongation arc */}
      <path
        d="M 100,97 A 62,62 0 0,1 84,68"
        fill="none"
        stroke="#fb923c"
        strokeWidth="2"
      />
      <text x="96" y="86" fill="#fb923c" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
        Δ
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  3.  Moon Age (A)                                                   */
/* ------------------------------------------------------------------ */
export function MoonAgeDiagram({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 110"
      className={className}
      role="img"
      aria-label="Moon age timeline diagram"
    >
      <rect width="220" height="110" fill="#0f172a" rx="4" />

      {/* timeline arrow */}
      <line x1="20" y1="60" x2="200" y2="60" stroke="#64748b" strokeWidth="1.5" />
      <polygon points="200,56 210,60 200,64" fill="#64748b" />

      {/* conjunction tick */}
      <line x1="35" y1="50" x2="35" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
      {/* new moon (fully dark circle) */}
      <circle cx="35" cy="36" r="8" fill="#1e293b" stroke="#475569" strokeWidth="1" />
      <text x="18" y="82" fill="#94a3b8" fontSize="7" fontFamily="sans-serif">
        Conjunction
      </text>
      <text x="22" y="90" fill="#94a3b8" fontSize="6" fontFamily="sans-serif">
        (New Moon)
      </text>

      {/* young crescent tick */}
      <line x1="100" y1="50" x2="100" y2="70" stroke="#fbbf24" strokeWidth="1.5" />
      {/* thin crescent */}
      <circle cx="100" cy="36" r="8" fill="#fef9c3" />
      <circle cx="103" cy="36" r="7" fill="#0f172a" />
      <text x="78" y="82" fill="#fbbf24" fontSize="7" fontFamily="sans-serif">
        Young crescent
      </text>
      <text x="81" y="90" fill="#fbbf24" fontSize="6" fontFamily="sans-serif">
        (~15–20 hours)
      </text>

      {/* older crescent tick */}
      <line x1="165" y1="50" x2="165" y2="70" stroke="#94a3b8" strokeWidth="1" />
      {/* wider crescent */}
      <circle cx="165" cy="36" r="8" fill="#fef9c3" />
      <circle cx="170" cy="36" r="7" fill="#0f172a" />
      <text x="145" y="82" fill="#94a3b8" fontSize="7" fontFamily="sans-serif">
        Older crescent
      </text>
      <text x="148" y="90" fill="#94a3b8" fontSize="6" fontFamily="sans-serif">
        (~24–48 hours)
      </text>

      {/* age bracket */}
      <line x1="35" y1="99" x2="100" y2="99" stroke="#fbbf24" strokeWidth="1" />
      <line x1="35" y1="96" x2="35" y2="102" stroke="#fbbf24" strokeWidth="1" />
      <line x1="100" y1="96" x2="100" y2="102" stroke="#fbbf24" strokeWidth="1" />
      <text x="50" y="107" fill="#fbbf24" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
        A (hours)
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  4.  Moonset Lag (L)                                                */
/* ------------------------------------------------------------------ */
export function MoonsetLagDiagram({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 120"
      className={className}
      role="img"
      aria-label="Moonset lag diagram"
    >
      <defs>
        <linearGradient id="lag-sky" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c4680a" />
          <stop offset="40%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="220" height="80" fill="url(#lag-sky)" rx="4" />
      <rect y="80" width="220" height="40" fill="#5b4a2e" />
      <line x1="0" y1="80" x2="220" y2="80" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* sun going below horizon */}
      <circle cx="55" cy="82" r="10" fill="#fbbf24" opacity="0.85" />
      <line x1="55" y1="68" x2="55" y2="96" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="1 2" opacity="0.4" />

      {/* sunset tick on timeline */}
      <line x1="55" y1="96" x2="55" y2="106" stroke="#fbbf24" strokeWidth="1.5" />
      <text x="38" y="115" fill="#d1c9b8" fontSize="7" fontFamily="sans-serif">
        Sunset
      </text>

      {/* moon still above horizon, about to set */}
      <circle cx="145" cy="72" r="8" fill="#fef9c3" />
      <circle cx="148" cy="69" r="6" fill="#1e3a5f" opacity="0.6" />
      <line x1="145" y1="82" x2="145" y2="96" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="1 2" opacity="0.4" />

      {/* moonset tick on timeline */}
      <line x1="145" y1="96" x2="145" y2="106" stroke="#e2e8f0" strokeWidth="1.5" />
      <text x="125" y="115" fill="#d1c9b8" fontSize="7" fontFamily="sans-serif">
        Moonset
      </text>

      {/* lag bracket */}
      <path
        d="M 55,102 L 55,105 L 145,105 L 145,102"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="1.5"
      />
      <text x="82" y="104" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
        L (min)
      </text>
    </svg>
  );
}
