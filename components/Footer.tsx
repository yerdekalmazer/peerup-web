import Link from "next/link";

const LogoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M17 7C17 9.76142 14.7614 12 12 12C9.23858 12 7 9.76142 7 7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7Z" fill="white" />
    <path d="M21 17C21 19.7614 18.7614 22 16 22C13.2386 22 11 19.7614 11 17C11 14.2386 13.2386 12 16 12C18.7614 12 21 14.2386 21 17Z" fill="rgba(255,255,255,0.6)" />
    <path d="M13 17C13 19.7614 10.7614 22 8 22C5.23858 22 3 19.7614 3 17C3 14.2386 5.23858 12 8 12C10.7614 12 13 14.2386 13 17Z" fill="rgba(255,255,255,0.35)" />
  </svg>
);

const PLATFORM_LINKS = [
  { label: "Nasıl Çalışır", href: "#nasil-calisir" },
  { label: "Özellikler", href: "#ozellikler" },
  { label: "Öğretmenler", href: "#ogretmenler" },
  { label: "SkillCoin", href: "#" },
];

const SUPPORT_LINKS = [
  { label: "Yardım Merkezi", href: "#" },
  { label: "Güvenlik", href: "#" },
  { label: "Topluluk", href: "#" },
  { label: "Bize Ulaş", href: "#" },
];

const LEGAL_LINKS = [
  { label: "Gizlilik Politikası", href: "#" },
  { label: "Kullanım Koşulları", href: "#" },
  { label: "KVKK", href: "#" },
  { label: "Çerez Politikası", href: "#" },
];

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="footer-logo" href="/" aria-label="PeerUP Ana Sayfa">
              <div className="footer-logo-icon">
                <LogoIcon />
              </div>
              <span className="footer-logo-text">PeerUP</span>
            </Link>
            <p className="footer-desc">
              Peer-to-peer beceri takası platformu. Becerini öğret, SkillCoin
              kazan, yeni yetenekler edin.
            </p>
          </div>

          <div>
            <div className="footer-col-title">Platform</div>
            <ul className="footer-links" role="list">
              {PLATFORM_LINKS.map((l) => (
                <li key={l.label}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Destek</div>
            <ul className="footer-links" role="list">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.label}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Yasal</div>
            <ul className="footer-links" role="list">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2026 PeerUP. Tüm hakları saklıdır.</p>
          <div className="footer-socials" aria-label="Sosyal medya bağlantıları">
            <a href="#" className="social-btn" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>
            <a href="#" className="social-btn" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="social-btn" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
