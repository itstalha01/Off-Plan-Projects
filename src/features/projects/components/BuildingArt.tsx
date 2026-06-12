type SvgProps = { className?: string };

// A tall, slender high-rise rendered as flat vector art. A handful of windows
// are lit in gold to echo the brand accent.
export function Tower({ className }: SvgProps) {
  const floors = 18;
  const litWindows = new Set(["2-1", "4-2", "7-0", "9-2", "12-1", "15-2", "16-0"]);

  return (
    <svg
      viewBox="0 0 200 460"
      className={className}
      role="img"
      aria-label="Illustration of a high-rise residential tower"
    >
      {/* Roof crown */}
      <rect x="86" y="6" width="6" height="34" rx="2" className="fill-ink/70" />
      <rect x="58" y="34" width="84" height="18" rx="3" className="fill-ink/85" />

      {/* Main shaft */}
      <rect x="48" y="52" width="104" height="384" rx="4" className="fill-ink/90" />
      {/* Side setback */}
      <rect x="148" y="92" width="26" height="344" rx="3" className="fill-ink/70" />

      {/* Window grid on main shaft */}
      {Array.from({ length: floors }).map((_, row) =>
        Array.from({ length: 3 }).map((__, col) => {
          const lit = litWindows.has(`${row}-${col}`);
          return (
            <rect
              key={`${row}-${col}`}
              x={60 + col * 28}
              y={66 + row * 20}
              width="18"
              height="12"
              rx="1.5"
              className={lit ? "fill-gold" : "fill-paper/25"}
            />
          );
        })
      )}

      {/* Setback windows */}
      {Array.from({ length: floors - 2 }).map((_, row) => (
        <rect
          key={`s-${row}`}
          x={156}
          y={106 + row * 20}
          width="11"
          height="12"
          rx="1.5"
          className="fill-paper/15"
        />
      ))}

      {/* Ground entrance */}
      <rect x="86" y="408" width="28" height="28" rx="2" className="fill-gold/80" />
    </svg>
  );
}

// Small skyline thumbnails used as decorative facade chips.
export function Facade({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden>
      <rect x="6" y="24" width="30" height="50" rx="2" className="fill-ink/15" />
      <rect x="44" y="8" width="32" height="66" rx="2" className="fill-ink/25" />
      <rect x="84" y="32" width="30" height="42" rx="2" className="fill-ink/15" />
      {[0, 1, 2].map((c) =>
        [0, 1, 2, 3].map((r) => (
          <rect
            key={`f-${c}-${r}`}
            x={49 + c * 8}
            y={16 + r * 13}
            width="5"
            height="7"
            rx="0.8"
            className={c === 1 && r === 1 ? "fill-gold" : "fill-paper/60"}
          />
        ))
      )}
    </svg>
  );
}

// A spiky/scalloped gold sun used as a playful decorative mark.
export function Sunburst({ className }: SvgProps) {
  const spikes = 16;
  const cx = 50;
  const cy = 50;
  const outer = 48;
  const inner = 34;
  const points: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / spikes) * i - Math.PI / 2;
    points.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <polygon points={points.join(" ")} className="fill-gold" />
      <circle cx={cx} cy={cy} r={20} className="fill-ink" />
    </svg>
  );
}

export function Plus({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 3v18M3 12h18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
