export default function HeartToAirpods(props) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" {...props}>
      <g className="morph morph--heart">
        <path
          d="M51.04,84.38 C51.04,84.38 10.42,59.58 10.42,33.96 C10.42,21.67 19.79,12.92 31.25,12.92 C39.38,12.92 45.83,17.71 49.17,24.58 C51.67,17.08 58.96,11.88 67.08,11.88 C79.17,11.88 88.54,22.08 88.54,35.42 C88.54,51.25 72.71,66.67 51.04,84.38 Z"
          fill="var(--color-corail)"
        />
        <path
          d="M28.8 30.2C31.8 27.8 35.7 28.2 38.1 31.2"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      <g className="morph morph--airpods">
        <g transform="rotate(-18 35 45)">
          <rect x="29" y="44" width="10" height="32" rx="5" fill="var(--color-white)" stroke="var(--color-ink)" strokeWidth="3" />
          <ellipse cx="35" cy="32" rx="13" ry="15" fill="var(--color-white)" stroke="var(--color-ink)" strokeWidth="3" />
        </g>
        <g transform="rotate(22 62 45)">
          <rect x="56" y="44" width="10" height="32" rx="5" fill="var(--color-white)" stroke="var(--color-ink)" strokeWidth="3" />
          <ellipse cx="62" cy="32" rx="13" ry="15" fill="var(--color-white)" stroke="var(--color-ink)" strokeWidth="3" />
        </g>
      </g>
    </svg>
  );
}
