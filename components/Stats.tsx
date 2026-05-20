"use client";

import { useEffect, useRef } from "react";

const STATS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    iconBg: "var(--primary-light)",
    value: 2400,
    suffix: "+",
    label: "Aktif Kullanıcı",
    decimals: false,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    iconBg: "var(--coin-light)",
    value: 8,
    suffix: "",
    label: "Beceri Kategorisi",
    decimals: false,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    iconBg: "var(--success-light)",
    value: 12000,
    suffix: "+",
    label: "Tamamlanan Oturum",
    decimals: false,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    iconBg: "#FDF2F8",
    value: 4.8,
    suffix: "",
    label: "Ortalama Öğretmen Puanı",
    decimals: true,
  },
];

function formatValue(val: number, target: number, decimals: boolean, suffix: string) {
  if (decimals) return val.toFixed(1) + suffix;
  if (target >= 1000) return val.toLocaleString("tr-TR") + suffix;
  return Math.round(val) + suffix;
}

export default function Stats() {
  const gridRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const nums = grid.querySelectorAll<HTMLElement>(".stat-num");
          STATS.forEach((stat, i) => {
            const el = nums[i];
            if (!el) return;
            const duration = 1800;
            let startTime: number | null = null;

            function step(timestamp: number) {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3);
              const val = ease * stat.value;
              el.textContent = formatValue(val, stat.value, stat.decimals, stat.suffix);
              if (progress < 1) requestAnimationFrame(step);
              else el.textContent = formatValue(stat.value, stat.value, stat.decimals, stat.suffix);
            }

            requestAnimationFrame(step);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats" aria-label="Platform istatistikleri">
      <div className="container">
        <div className="stats-grid" ref={gridRef}>
          {STATS.map((stat, i) => (
            <div className={`stat-card reveal${i > 0 ? ` reveal-delay-${i}` : ""}`} key={stat.label}>
              <div className="stat-icon" style={{ background: stat.iconBg }} aria-hidden="true">
                {stat.icon}
              </div>
              <div
                className="stat-num"
                aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
              >
                {stat.decimals
                  ? stat.value.toFixed(1) + stat.suffix
                  : stat.value >= 1000
                  ? stat.value.toLocaleString("tr-TR") + stat.suffix
                  : stat.value + stat.suffix}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
