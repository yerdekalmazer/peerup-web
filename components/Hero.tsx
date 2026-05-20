import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-blob hero-blob-1" aria-hidden="true" />
      <div className="hero-blob hero-blob-2" aria-hidden="true" />
      <div className="hero-blob hero-blob-3" aria-hidden="true" />

      <div className="container">
        {/* Left content */}
        <div className="hero-content">
          <div className="reveal">
            <span className="badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Peer-to-Peer Öğrenme Platformu
            </span>
          </div>

          <h1 className="hero-title reveal reveal-delay-1" id="hero-heading">
            Becerini Öğret,<br />
            <span className="highlight">SkillCoin Kazan</span>
          </h1>

          <p className="hero-desc reveal reveal-delay-2">
            PeerUP ile herkes hem öğrenci hem öğretmen. Programlama&apos;dan
            müziğe, tasarımdan dile — becerini paylaş, SkillCoin kazan, yeni
            yetenekler edin.
          </p>

          <div className="hero-actions reveal reveal-delay-3">
            <Link href="#indir" className="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
              </svg>
              Hemen İndir
            </Link>
            <Link href="#nasil-calisir" className="btn btn-outline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 8 12 12 14 14" />
              </svg>
              Nasıl Çalışır?
            </Link>
          </div>

          <div className="hero-trust reveal reveal-delay-4">
            <div className="hero-avatars" aria-label="Kullanıcılar">
              <div className="hero-avatar" style={{ background: "#6366F1" }} aria-hidden="true">ZA</div>
              <div className="hero-avatar" style={{ background: "#EC4899" }} aria-hidden="true">MK</div>
              <div className="hero-avatar" style={{ background: "#F59E0B" }} aria-hidden="true">AD</div>
              <div className="hero-avatar" style={{ background: "#10B981" }} aria-hidden="true">CY</div>
              <div className="hero-avatar" style={{ background: "#4F46E5" }} aria-hidden="true">+</div>
            </div>
            <p className="hero-trust-text">
              <strong>2.400+</strong> aktif kullanıcı zaten aramızda
            </p>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="phone-wrap reveal reveal-delay-2" aria-hidden="true">
          <div className="phone" role="img" aria-label="PeerUP uygulama önizlemesi">
            <div className="phone-inner">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="phone-header">
                  <div className="phone-greeting">Merhaba, Taha</div>
                  <div className="phone-title">Bugün ne öğrenmek istiyorsun?</div>
                </div>
                <div className="phone-coin-card">
                  <div>
                    <div className="phone-coin-label">SkillCoin Bakiyesi</div>
                    <div className="phone-coin-amount">4.6 SC</div>
                  </div>
                  <div className="phone-coin-add">+ Yükle</div>
                </div>
                <div className="phone-search">Beceri veya öğretmen ara...</div>
                <div className="phone-bottom">
                  <div className="phone-section-label">Öne Çıkan Öğretmenler</div>
                  <div className="phone-teachers-row">
                    {[
                      { initials: "ZA", bg: "#6366F1", name: "Zeynep A.", skill: "React Native", coin: "1.2 SC/saat" },
                      { initials: "AD", bg: "#F59E0B", name: "Ayşe D.", skill: "UI/UX", coin: "1.4 SC/saat" },
                      { initials: "CY", bg: "#10B981", name: "Can Y.", skill: "Piyano", coin: "1.0 SC/saat" },
                    ].map((t) => (
                      <div className="phone-teacher-card" key={t.name}>
                        <div className="phone-teacher-avatar" style={{ background: t.bg }}>{t.initials}</div>
                        <div className="phone-teacher-name">{t.name}</div>
                        <div className="phone-teacher-skill">{t.skill}</div>
                        <div className="phone-teacher-coin">{t.coin}</div>
                      </div>
                    ))}
                  </div>
                  <div className="phone-section-label" style={{ marginTop: "4px" }}>Popüler Beceriler</div>
                  {[
                    { initials: "ES", bg: "#EC4899", skill: "Python", teacher: "Elif Şahin" },
                    { initials: "MK", bg: "#4F46E5", skill: "İspanyolca", teacher: "Mehmet Kaya" },
                  ].map((r) => (
                    <div className="phone-row-item" key={r.skill}>
                      <div className="phone-row-left">
                        <div className="phone-mini-avatar" style={{ background: r.bg }}>{r.initials}</div>
                        <div>
                          <div className="phone-row-skill">{r.skill}</div>
                          <div className="phone-row-teacher">{r.teacher}</div>
                        </div>
                      </div>
                      <div className="phone-row-book">Rezerve</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          <div className="float-card float-card-1 glass-card">
            <div className="float-icon" style={{ background: "var(--coin-light)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <div className="float-label">Kazandığın</div>
              <div className="float-value" style={{ color: "var(--coin-dark)" }}>12.4 SC</div>
            </div>
          </div>

          <div className="float-card float-card-2 glass-card">
            <div className="float-icon" style={{ background: "var(--success-light)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div className="float-label">Tamamlanan Oturum</div>
              <div className="float-value" style={{ color: "var(--success)" }}>18 Oturum</div>
            </div>
          </div>

          <div className="float-card float-card-3 glass-card">
            <div className="float-icon" style={{ background: "var(--primary-light)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div>
              <div className="float-label">Puanın</div>
              <div className="float-value">4.8 ★</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
