"use client";


const STATS = [
  { value: "16+", label: "Verified Villages" },
  { value: "100%", label: "Local Family Run" },
  { value: "4.9★", label: "Guest Satisfaction" },
  { value: "1000+", label: "Happy Travelers" },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] lg:min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ backgroundColor: "#2C1810" }}
    >
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=1080&fit=crop&auto=format"
          alt="Nepali village and mountain scenery"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(44,24,16,0.85) 0%, rgba(44,24,16,0.60) 50%, rgba(44,24,16,0.92) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-36 w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-12 bg-mustard" />
          <span
            className="font-sans text-mustard uppercase tracking-[0.2em] font-medium"
            style={{ fontSize: "11px" }}
          >
            Homestay Nepal · Authentic Community & Village Stays
          </span>
        </div>

        <h1
          className="font-serif font-bold text-cream leading-[1.08] mb-6 max-w-4xl"
          style={{ fontSize: "clamp(2.5rem, 6.5vw, 5.2rem)" }}
        >
          Stay with a<br />
          <em className="not-italic" style={{ color: "#C4654A" }}>
            Nepali Family.
          </em>
          <br />
          Experience Authentic<br />
          Village Homestays.
        </h1>

        <p
          className="font-sans text-base sm:text-lg max-w-xl mb-9 leading-relaxed"
          style={{ color: "rgba(250,246,240,0.82)" }}
        >
          Immerse yourself in authentic village life across Nepal. Live with local
          host families, share organic home-cooked meals, and discover the true
          warmth of Nepali community hospitality.
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-14">
          <a
            href="#rooms"
            className="inline-flex items-center gap-2.5 font-sans font-semibold text-cream px-7 py-3.5 rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            style={{ backgroundColor: "#C4654A" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8B2E1A")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C4654A")}
          >
            Explore Homestays
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </a>

          <a
            href="#about"
            className="inline-flex items-center gap-2 font-sans font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 border"
            style={{
              borderColor: "rgba(255,255,255,0.25)",
              color: "#FAF6F0",
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.14)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
            }}
          >
            Our Story & Values
          </a>
        </div>

        <div className="flex flex-wrap gap-8 sm:gap-12 pt-4 border-t border-white/10" role="list" aria-label="Key statistics">
          {STATS.map((stat) => (
            <div key={stat.label} role="listitem">
              <p
                className="font-serif font-bold text-mustard leading-none"
                style={{ fontSize: "1.9rem" }}
              >
                {stat.value}
              </p>
              <p
                className="font-sans text-xs sm:text-sm mt-1"
                style={{ color: "rgba(250,246,240,0.65)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-0 inset-x-0 z-10"
        style={{ lineHeight: 0 }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
          width="100%"
          height="64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,64 L0,44 L90,22 L200,40 L320,10 L440,34 L560,4 L680,28 L800,6 L920,30 L1040,2 L1160,24 L1280,12 L1380,32 L1440,18 L1440,64 Z"
            fill="#FAF6F0"
          />
        </svg>
      </div>
    </section>
  );
}
