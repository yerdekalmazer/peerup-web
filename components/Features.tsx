const CATEGORIES = [
  { name: "Programlama", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg> },
  { name: "Dil", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"><path d="M5 8l6 6" /><path d="M4 14l6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="M22 22l-5-10-5 10" /><path d="M14 18h6" /></svg> },
  { name: "Müzik", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg> },
  { name: "Tasarım", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg> },
  { name: "Matematik", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg> },
  { name: "Fotoğraf", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg> },
  { name: "Spor", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="3" /><path d="M6.5 8a2 2 0 0 0-1.905 2.575L5.5 14h13l.905-3.425A2 2 0 0 0 17.5 8z" /><line x1="12" y1="14" x2="12" y2="21" /></svg> },
  { name: "Daha Fazla", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> },
];

const CHAIN = [
  { initials: "ZA", bg: "#6366F1", name: "Zeynep" },
  { initials: "ES", bg: "#EC4899", name: "Elif" },
  { initials: "MK", bg: "#F59E0B", name: "Mehmet" },
  { initials: "SB", bg: "#10B981", name: "Selin" },
];

export default function Features() {
  return (
    <section className="features" id="ozellikler" aria-labelledby="features-heading">
      <div className="container">
        <div className="features-header">
          <div className="badge reveal">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Öne Çıkan Özellikler
          </div>
          <h2 className="section-title reveal" id="features-heading" style={{ marginTop: 16 }}>
            Seni Güçlendirecek<br />Araçlar
          </h2>
          <p className="section-sub reveal" style={{ marginTop: 16 }}>
            Peer-to-peer öğrenmeyi her zamankinden daha kolay ve ödüllendirici
            yapan özellikler.
          </p>
        </div>

        <div className="features-grid">
          {/* SkillCoin */}
          <div className="feature-card coin-card reveal">
            <div className="feature-icon" style={{ background: "var(--coin-light)" }} aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <h3 className="feature-title">SkillCoin Ekonomisi</h3>
            <p className="feature-desc">
              Para harcama yok. Becerinle SkillCoin kazan, SkillCoin&apos;inle öğren.
              Adil, şeffaf ve sürdürülebilir bir takas sistemi.
            </p>
            <div>
              {["Adil Takas", "Anlık Bakiye", "Şeffaf Ücretler"].map((tag) => (
                <span key={tag} className="feature-tag" style={{ background: "var(--coin-light)", color: "var(--coin-dark)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Mentor Chain */}
          <div className="feature-card chain-card reveal reveal-delay-1">
            <div className="feature-icon" style={{ background: "var(--success-light)" }} aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </div>
            <h3 className="feature-title">Mentor Zinciri</h3>
            <p className="feature-desc">
              Kim kimi öğretti? Bilginin nasıl yayıldığını görsel bir ağaçta
              takip et. Kendi mentor zincirini oluştur.
            </p>
            <div className="chain-viz" aria-label="Mentor zinciri görselleştirmesi">
              {CHAIN.map((node, idx) => (
                <div key={node.name} style={{ display: "contents" }}>
                  <div className="chain-node">
                    <div className="chain-avatar" style={{ background: node.bg }}>{node.initials}</div>
                    <div className="chain-node-name">{node.name}</div>
                  </div>
                  {idx < CHAIN.length - 1 && <div className="chain-arrow" />}
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="feature-card cat-card reveal">
            <div className="feature-icon" style={{ background: "#FDF2F8" }} aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <h3 className="feature-title">8 Beceri Kategorisi</h3>
            <p className="feature-desc">
              Programlamadan sanata, dilden spora geniş bir kategori
              yelpazesinde öğret ve öğren.
            </p>
            <div className="cat-grid" role="list">
              {CATEGORIES.map((cat) => (
                <div className="cat-item" role="listitem" key={cat.name}>
                  <div className="cat-icon" aria-hidden="true">{cat.icon}</div>
                  <span className="cat-name">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Booking */}
          <div className="feature-card reveal reveal-delay-1">
            <div className="feature-icon" style={{ background: "var(--primary-light)" }} aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="feature-title">Akıllı Rezervasyon</h3>
            <p className="feature-desc">
              Öğretmenin müsait saatlerini gör, anında rezervasyon yap.
              Hatırlatıcılar ve oturum notlarıyla hiçbir şeyi kaçırma.
            </p>
            <div>
              {["Anlık Rezervasyon", "Hatırlatıcılar", "Oturum Notları"].map((tag) => (
                <span key={tag} className="feature-tag" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
