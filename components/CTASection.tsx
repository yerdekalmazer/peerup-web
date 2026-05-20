export default function CTASection() {
  return (
    <section className="cta-section" id="indir" aria-labelledby="cta-heading">
      <div className="cta-bg-blob cta-bg-blob-1" aria-hidden="true" />
      <div className="cta-bg-blob cta-bg-blob-2" aria-hidden="true" />

      <div className="container">
        <div className="cta-inner">
          <div className="cta-badge reveal" style={{ display: "inline-flex", margin: "0 auto 24px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
            </svg>
            Ücretsiz Başla
          </div>

          <h2 className="cta-title reveal" id="cta-heading">
            Bugün Öğretmeye<br />Başla
          </h2>
          <p className="cta-desc reveal">
            Kaydol, becerinle SkillCoin kazan. Kredi kartı yok, ödeme yok.
            Sadece öğrenme ve öğretme keyfi.
          </p>

          <div className="store-btns reveal">
            {/* App Store */}
            <a href="#" className="store-btn" aria-label="App Store'dan indir">
              <div className="store-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              </div>
              <div>
                <div className="store-sub">Şimdi İndir</div>
                <div className="store-name">App Store</div>
              </div>
            </a>

            {/* Google Play */}
            <a href="#" className="store-btn" aria-label="Google Play'den indir">
              <div className="store-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M3,20.5v-17c0-0.83,0.94-1.3,1.6-0.8l15,8.5c0.6,0.34,0.6,1.26,0,1.6l-15,8.5C3.94,21.8,3,21.33,3,20.5z" />
                </svg>
              </div>
              <div>
                <div className="store-sub">Şimdi İndir</div>
                <div className="store-name">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
