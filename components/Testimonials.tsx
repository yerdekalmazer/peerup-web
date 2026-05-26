const TESTIMONIALS = [
  {
    text: '"React Native öğrenmek istiyordum ama kurs ücretleri çok pahalıydı. PeerUP ile Python bilgimi öğreterek SkillCoin kazandım ve hayalimdekileri öğrendim. Harika bir platform!"',
    initials: "BK",
    bg: "#4F46E5",
    name: "Burak Kaya",
    role: "Full-Stack Geliştirici · İstanbul",
  },
  {
    text: '"Mentor Zinciri özelliği inanılmaz! Zeynep\'ten öğrendim, şimdi ben de başkalarına öğretiyorum. Bilginin nasıl yayıldığını görmek çok motive edici."',
    initials: "SÇ",
    bg: "#EC4899",
    name: "Selin Çelik",
    role: "UX Tasarımcı · Ankara",
  },
  {
    text: '"Konservatuvar mezunuyum, piyano dersleri veriyorum. PeerUP sayesinde hem öğrencilerime ulaşıyorum hem de İspanyolca öğreniyorum. SkillCoin sistemi adil ve şeffaf."',
    initials: "DA",
    bg: "#10B981",
    name: "Deniz Arslan",
    role: "Müzisyen · İzmir",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials" id="yorumlar" aria-labelledby="testimonials-heading">
      <div className="container">
        <div className="section-head">
          <span className="badge reveal">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Kullanıcı Yorumları
          </span>
          <h2 className="section-title reveal" id="testimonials-heading">
            Onlar Çoktan Başladı
          </h2>
          <p className="section-sub reveal">
            Binlerce kullanıcı PeerUP ile becerilerini geliştiriyor. Onların
            deneyimlerini okuyun.
          </p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div
              className={`testimonial-card reveal${i > 0 ? ` reveal-delay-${i}` : ""}`}
              key={t.name}
            >
              <div className="testimonial-stars" aria-label="5 yıldız değerlendirme">
                ★★★★★
              </div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div
                  className="testimonial-avatar"
                  style={{ background: t.bg }}
                  aria-label={t.name}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
