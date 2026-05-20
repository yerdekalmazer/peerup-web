const STEPS = [
  {
    num: "1",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Profilini Oluştur",
    desc: "Hangi becerileri öğretebileceğini ve öğrenmek istediğini belirle. Sertifikalarını ve deneyimlerini profiline ekle.",
  },
  {
    num: "2",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
    title: "SkillCoin Kazan",
    desc: "Oturumlar düzenleyerek SkillCoin kazan. Kazandığın coin'leri başka öğretmenlerden ders almak için kullan.",
  },
  {
    num: "3",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "Öğren ve Öğret",
    desc: "Seçtiğin öğretmenle oturum rezervasyonu yap. Canlı seanslar, Mentor Zinciri ve değerlendirmelerle büyü.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how" id="nasil-calisir" aria-labelledby="how-heading">
      <div className="container">
        <div className="how-header">
          <div className="badge reveal" style={{ margin: "0 auto 16px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 8 12 12 14 14" />
            </svg>
            Nasıl Çalışır?
          </div>
          <h2 className="section-title reveal" id="how-heading">
            Üç Adımda Başla
          </h2>
          <p className="section-sub reveal" style={{ margin: "16px auto 0", textAlign: "center" }}>
            PeerUP&apos;ı kullanmaya başlamak çok basit. Birkaç dakika içinde
            öğrenmeye ve öğretmeye hazır olacaksın.
          </p>
        </div>

        <div className="steps-grid">
          <div className="steps-connector" aria-hidden="true" />
          {STEPS.map((step, i) => (
            <div
              className={`step-card reveal${i > 0 ? ` reveal-delay-${i}` : ""}`}
              key={step.title}
            >
              <div className="step-num" aria-hidden="true">{step.num}</div>
              <div className="step-icon" aria-hidden="true">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
