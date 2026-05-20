"use client";

import { useState } from "react";
import Link from "next/link";

const LogoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M17 7C17 9.76142 14.7614 12 12 12C9.23858 12 7 9.76142 7 7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7Z" fill="white" />
    <path d="M21 17C21 19.7614 18.7614 22 16 22C13.2386 22 11 19.7614 11 17C11 14.2386 13.2386 12 16 12C18.7614 12 21 14.2386 21 17Z" fill="rgba(255,255,255,0.6)" />
    <path d="M13 17C13 19.7614 10.7614 22 8 22C5.23858 22 3 19.7614 3 17C3 14.2386 5.23858 12 8 12C10.7614 12 13 14.2386 13 17Z" fill="rgba(255,255,255,0.35)" />
  </svg>
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Ana navigasyon">
      <Link className="nav-logo" href="/" aria-label="PeerUP Ana Sayfa">
        <div className="nav-logo-icon">
          <LogoIcon />
        </div>
        <span className="nav-logo-text">PeerUP</span>
      </Link>

      <ul className="nav-links" role="list">
        <li><Link href="#nasil-calisir">Nasıl Çalışır</Link></li>
        <li><Link href="#ozellikler">Özellikler</Link></li>
        <li><Link href="#ogretmenler">Öğretmenler</Link></li>
        <li><Link href="#yorumlar">Yorumlar</Link></li>
        <li>
          <Link href="#indir" className="nav-cta">
            Uygulamayı İndir
          </Link>
        </li>
      </ul>

      <button
        className="nav-menu-btn btn btn-outline"
        aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        style={{ padding: "10px 14px" }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {menuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>
    </nav>
  );
}
