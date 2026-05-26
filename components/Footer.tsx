import Link from "next/link";
import { LogoMark, Wordmark } from "./Logo";

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
            <Link className="footer-logo" href="/" aria-label="PeerUp Ana Sayfa">
              <span className="footer-logo-icon">
                <LogoMark size={22} />
              </span>
              <Wordmark
                className="footer-logo-text"
                peerColor="#fff"
                upColor="#FFD580"
              />
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
