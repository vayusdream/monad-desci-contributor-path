export function BadgePreview({
  trackName,
  accent,
  tokenId,
}: {
  trackName: string;
  accent: string;
  tokenId?: string;
}) {
  return (
    <svg
      viewBox="0 0 480 480"
      className="w-full max-w-xs rounded-lg border border-line"
    >
      <rect width="480" height="480" fill="#f5f2ea" />
      <rect
        x="16"
        y="16"
        width="448"
        height="448"
        fill="none"
        stroke={accent}
        strokeWidth={2}
      />
      <text
        x="40"
        y="72"
        fontFamily="monospace"
        fontSize="13"
        letterSpacing="1"
        fill="#57534a"
      >
        DESCI CONTRIBUTOR CREDENTIAL
      </text>
      <circle cx="424" cy="56" r="8" fill={accent} />
      <text
        x="40"
        y="250"
        fontFamily="Georgia, serif"
        fontSize="52"
        fontWeight={700}
        fill={accent}
      >
        {trackName}
      </text>
      <text x="40" y="286" fontFamily="monospace" fontSize="13" fill="#57534a">
        TOKEN #{tokenId ?? "—"}
      </text>
      <line x1="40" y1="400" x2="440" y2="400" stroke="#ddd6c7" strokeWidth={1} />
      <text x="40" y="430" fontFamily="monospace" fontSize="12" fill="#57534a">
        MINTED ON MONAD
      </text>
    </svg>
  );
}
