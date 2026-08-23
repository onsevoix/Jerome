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
        <g transform="rotate(-30)">
          <path
            d="M0,0 L-2.4,-4.5 L-2.4,-17 C-2.4,-18.7 -1.3,-20 0,-20 C1.3,-20 2.4,-18.7 2.4,-17 L2.4,-4.5 Z"
            fill="var(--color-corail)"
            stroke="var(--color-ink)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <line x1="-2.4" y1="-4.5" x2="2.4" y2="-4.5" stroke="var(--color-ink)" strokeWidth="1.4" />
        </g>
      </g>
    </svg>
  );
}
