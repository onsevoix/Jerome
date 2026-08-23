export default function EnvelopeLoop(props) {
  return (
    <svg viewBox="0 0 100 76" aria-hidden="true" {...props}>
      <rect
        x="8"
        y="14"
        width="84"
        height="56"
        rx="10"
        fill="var(--color-white)"
        stroke="var(--color-ink)"
        strokeWidth="3"
      />
      <path
        className="envelope__heart"
        d="M50,46 C50,46 41,40 41,34.5 C41,31.3 43.4,29 46.3,29 C48.1,29 49.6,29.9 50,31.4 C50.4,29.9 51.9,29 53.7,29 C56.6,29 59,31.3 59,34.5 C59,40 50,46 50,46 Z"
        fill="var(--color-corail)"
      />
      <path
        className="envelope__flap"
        d="M8,14 L92,14 L50,48 Z"
        fill="var(--color-white)"
        stroke="var(--color-ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
