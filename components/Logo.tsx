// PeerUp_Minimal_Kit_v2 ile aynı logo işareti.
// İki kullanıcı silüeti (mor zeminde beyaz) + sarı yukarı ok.

type LogoMarkProps = {
  size?: number;
  /** Ana stroke/fill rengi — beyaz silüet */
  color?: string;
  /** Vurgu (üst ok) rengi */
  accent?: string;
};

export function LogoMark({
  size = 24,
  color = "#fff",
  accent = "#FFAD33",
}: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 58 58"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="18" cy="20" r="7" fill={color} />
      <circle cx="40" cy="20" r="7" fill={color} opacity="0.45" />
      <path
        d="M8 38C8 30 13 26 18 26C23 26 28 30 28 38"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M30 38C30 30 35 26 40 26C45 26 50 30 50 38"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.45"
        fill="none"
      />
      <path
        d="M34 14L40 8L46 14"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line
        x1="40"
        y1="8"
        x2="40"
        y2="18"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

type WordmarkProps = {
  /** "Peer" rengi */
  peerColor?: string;
  /** "Up" vurgu rengi */
  upColor?: string;
  className?: string;
};

export function Wordmark({
  peerColor,
  upColor,
  className,
}: WordmarkProps) {
  return (
    <span className={className} style={{ color: peerColor }}>
      Peer<span style={{ color: upColor }}>Up</span>
    </span>
  );
}
