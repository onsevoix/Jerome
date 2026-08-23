export default function WritingLoop(props) {
  return (
    <svg viewBox="0 0 100 80" aria-hidden="true" {...props}>
      <rect
        x="15"
        y="8"
        width="70"
        height="64"
        rx="6"
        fill="var(--color-white)"
        stroke="var(--color-ink)"
        strokeWidth="3"
      />

      <rect className="write-line write-line--1" x="26" y="24.5" width="46" height="3" rx="1.5" fill="var(--color-ink)" opacity="0.85" />
      <rect className="write-line write-line--2" x="26" y="38.5" width="38" height="3" rx="1.5" fill="var(--color-ink)" opacity="0.85" />
      <rect className="write-line write-line--3" x="26" y="52.5" width="24" height="3" rx="1.5" fill="var(--color-ink)" opacity="0.85" />

      <g className="write-hand">
        <g transform="rotate(-25)">
          <rect x="-1.6" y="-16" width="3.2" height="16" rx="1.6" fill="var(--color-corail)" stroke="var(--color-ink)" strokeWidth="1.6" />
          <ellipse cx="3.5" cy="-15.5" rx="7.5" ry="6.2" fill="var(--color-white)" stroke="var(--color-ink)" strokeWidth="2.2" />
        </g>
      </g>
    </svg>
  );
}
