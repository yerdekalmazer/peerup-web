const TEACHERS = [
  {
    initials: "ZA",
    bg: "#6366F1",
    name: "Zeynep Arslan",
    skill: "React Native",
    rating: "4.9",
    reviews: "(47)",
    stars: "★★★★★",
    coin: "1.2 SC/saat",
    online: true,
    badges: [
      { label: "Doğrulanmış", top: false },
      { label: "Top Öğretmen", top: true },
    ],
  },
  {
    initials: "AD",
    bg: "#F59E0B",
    name: "Ayşe Demir",
    skill: "UI/UX Tasarım",
    rating: "5.0",
    reviews: "(31)",
    stars: "★★★★★",
    coin: "1.4 SC/saat",
    online: true,
    badges: [
      { label: "Doğrulanmış", top: false },
      { label: "Top Öğretmen", top: true },
      { label: "Yeni", top: false },
    ],
  },
  {
    initials: "EŞ",
    bg: "#EC4899",
    name: "Elif Şahin",
    skill: "Python & ML",
    rating: "4.9",
    reviews: "(55)",
    stars: "★★★★★",
    coin: "1.1 SC/saat",
    online: true,
    badges: [{ label: "Doğrulanmış", top: false }],
  },
  {
    initials: "CY",
    bg: "#10B981",
    name: "Can Yılmaz",
    skill: "Piyano",
    rating: "4.7",
    reviews: "(28)",
    stars: "★★★★☆",
    coin: "1.0 SC/saat",
    online: true,
    badges: [{ label: "Doğrulanmış", top: false }],
  },
];

const CoinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export default function Teachers() {
  return (
    <section className="teachers" id="ogretmenler" aria-labelledby="teachers-heading">
      <div className="container">
        <div className="teachers-header">
          <div className="badge reveal" style={{ margin: "0 auto 16px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Öğretmenlerimiz
          </div>
          <h2 className="section-title reveal" id="teachers-heading">
            Uzman Öğretmenlerle<br />Tanış
          </h2>
          <p className="section-sub reveal" style={{ margin: "16px auto 0", textAlign: "center" }}>
            Doğrulanmış, deneyimli ve tutkulu öğretmenlerden birebir öğrenme
            deneyimi yaşa.
          </p>
        </div>

        <div className="teachers-grid">
          {TEACHERS.map((t, i) => (
            <div
              className={`teacher-card reveal${i > 0 ? ` reveal-delay-${i}` : ""}`}
              key={t.name}
            >
              <div className="teacher-avatar-wrap">
                <div
                  className="teacher-avatar"
                  style={{ background: t.bg }}
                  aria-label={t.name}
                >
                  {t.initials}
                </div>
                {t.online && <div className="teacher-online" aria-label="Çevrimiçi" />}
              </div>
              <div className="teacher-name">{t.name}</div>
              <div className="teacher-skill">{t.skill}</div>
              <div className="teacher-rating">
                <span className="stars" aria-hidden="true">{t.stars}</span>
                <span className="rating-num">{t.rating}</span>
                <span className="rating-count">{t.reviews}</span>
              </div>
              <div className="teacher-coin-badge">
                <CoinIcon />
                {t.coin}
              </div>
              <div className="teacher-badges">
                {t.badges.map((b) => (
                  <span key={b.label} className={`t-badge${b.top ? " top" : ""}`}>
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
