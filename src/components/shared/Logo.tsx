type LogoProps = { className?: string };

// The Clearstoreys mark: a stack of storeys read bottom-up, from solid and
// grounded into open, transparent outline, capped by a single gold datum dot.
// Built from the brand identity ("Lucid Strata") so it scales crisply.
export function LogoMark({ className }: LogoProps) {
  const bands = [
    { y: 16, solid: false },
    { y: 23, solid: false },
    { y: 30, solid: false },
    { y: 37, solid: true },
    { y: 44, solid: true },
    { y: 51, solid: true },
    { y: 58, solid: true },
  ];

  return (
    <svg
      viewBox="0 0 48 66"
      className={className}
      role="img"
      aria-label="Clearstoreys"
    >
      {/* Gold datum dot */}
      <circle cx="24" cy="6" r="5" className="fill-gold" />
      {bands.map((band) =>
        band.solid ? (
          <rect
            key={band.y}
            x="10"
            y={band.y}
            width="28"
            height="5"
            rx="2.5"
            className="fill-ink"
          />
        ) : (
          <rect
            key={band.y}
            x="11.25"
            y={band.y + 1.25}
            width="25.5"
            height="2.5"
            rx="1.25"
            fill="none"
            strokeWidth="2.5"
            className="stroke-ink"
          />
        )
      )}
    </svg>
  );
}

// Horizontal lockup: mark + Fraunces wordmark with the signature gold full stop.
export function Logo({ className }: LogoProps) {
  return (
    <span className={className}>
      <LogoMark className="h-8 w-auto" />
      <span className="font-serif text-2xl font-semibold tracking-tight text-ink">
        Clearstoreys<span className="text-gold">.</span>
      </span>
    </span>
  );
}
