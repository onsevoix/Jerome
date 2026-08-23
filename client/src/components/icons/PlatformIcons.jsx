export function SpotifyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5 9.3C9.2 7.4 15 7.4 19 9.5"
        stroke="#1DB954"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M6 13.1C9.7 11.5 14.6 11.5 18 13.2"
        stroke="#1DB954"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M7.3 16.6C10 15.4 14.1 15.4 16.7 16.6"
        stroke="#1DB954"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ApplePodcastsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <defs>
        <linearGradient id="applepodcasts-grad" x1="4" y1="2" x2="20" y2="22">
          <stop offset="0%" stopColor="#C650E0" />
          <stop offset="100%" stopColor="#912DC2" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="7" r="2.5" fill="url(#applepodcasts-grad)" />
      <path
        d="M8.4 11.2C10.4 15 13.6 15 15.6 11.2"
        stroke="url(#applepodcasts-grad)"
        strokeWidth="1.9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M6.3 9.4C9.2 15.6 14.8 15.6 17.7 9.4"
        stroke="url(#applepodcasts-grad)"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M11.1 14.6L10.3 19.5C10.2 20.2 10.7 20.7 11.4 20.7H12.6C13.3 20.7 13.8 20.2 13.7 19.5L12.9 14.6Z"
        fill="url(#applepodcasts-grad)"
      />
    </svg>
  );
}

export function DeezerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <defs>
        <linearGradient id="deezer-grad" x1="1" y1="18" x2="23" y2="4">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#F0439D" />
          <stop offset="100%" stopColor="#FFA23D" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="13.5" width="3" height="4.5" rx="1" fill="url(#deezer-grad)" opacity="0.5" />
      <rect x="6" y="10.5" width="3" height="7.5" rx="1" fill="url(#deezer-grad)" opacity="0.68" />
      <rect x="10.5" y="7.5" width="3" height="10.5" rx="1" fill="url(#deezer-grad)" opacity="0.84" />
      <rect x="15" y="4.5" width="3" height="13.5" rx="1" fill="url(#deezer-grad)" />
      <rect x="19.5" y="2" width="3" height="16" rx="1" fill="url(#deezer-grad)" />
    </svg>
  );
}
