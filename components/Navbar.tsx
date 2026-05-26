"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoMark, Wordmark } from "./Logo";

const LINKS = [
  { href: "#nasil-calisir", label: "Nasıl Çalışır" },
  { href: "#ozellikler", label: "Özellikler" },
  { href: "#ogretmenler", label: "Öğretmenler" },
  { href: "#yorumlar", label: "Yorumlar" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Ana navigasyon">
        <Link className="nav-logo" href="/" aria-label="PeerUp Ana Sayfa">
          <span className="nav-logo-icon">
            <LogoMark size={22} />
          </span>
          <Wordmark
            className="nav-logo-text"
            peerColor="var(--text)"
            upColor="var(--primary)"
          />
        </Link>

        <ul className="nav-links" role="list">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
          <li>
            <Link href="#indir" className="nav-cta">
              Uygulamayı İndir
            </Link>
          </li>
        </ul>

        <button
          type="button"
          className="nav-menu-btn"
          aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg
            width="20"
            height="20"
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

      {/* Mobil overlay menü */}
      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
      >
        <ul className="mobile-menu-list" role="list">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={closeMenu}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="#indir"
              className="mobile-menu-cta"
              onClick={closeMenu}
            >
              Uygulamayı İndir
            </Link>
          </li>
        </ul>
      </div>
      {menuOpen && (
        <button
          type="button"
          aria-label="Menüyü kapat"
          className="mobile-menu-backdrop"
          onClick={closeMenu}
        />
      )}
    </>
  );
}
