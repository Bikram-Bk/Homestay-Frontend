"use client";

import SectionLabel from "@/features/landing/shared/SectionLabel";
import bikramPhoto from "@/public/images/Bikram_Luhar.jpg";

const HIGHLIGHTS = [
  { emoji: "🌿", label: "Eco-conscious hosting" },
  { emoji: "🏔️", label: "Scenic Himalayan views" },
  { emoji: "👨‍👩‍👧‍👦", label: "Genuine family warmth" },
  { emoji: "🍽️", label: "Organic home-cooked meals" },
];

function CornerMandala() {
  return (
    <div
      className="hidden sm:block absolute -top-5 -left-5 w-24 h-24 pointer-events-none"
      style={{ opacity: 0.14 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 80 80" fill="#C4654A" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx={40}
            cy={13}
            rx={4.5}
            ry={13}
            transform={`rotate(${i * 45} 40 40)`}
          />
        ))}
        <circle cx={40} cy={40} r={7} />
      </svg>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="bg-cream py-16 sm:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Centered Section Header — matching Rooms layout */}
        <div className="text-center mb-10 sm:mb-16">
          <SectionLabel>Our Story</SectionLabel>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — Image column */}
          <div className="relative">
            <CornerMandala />
            <div className="rounded-2xl overflow-hidden bg-brown-deep shadow-xl h-[400px] sm:h-[480px] lg:h-[580px]">
              <img
                src={bikramPhoto?.src || bikramPhoto || "/images/Bikram_Luhar.jpg"}
                alt="Bikram Luhar — Founder of Homestay Nepal"
                className="w-full h-full object-cover object-top"
              />
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(44,24,16,0.35) 0%, transparent 60%)",
                }}
              />
            </div>

            {/* Floating stat card */}
            <div
              className="hidden md:block absolute -bottom-7 -right-7 rounded-2xl p-6 shadow-2xl"
              style={{ backgroundColor: "#8B2E1A" }}
            >
              <p className="font-serif text-4xl font-bold text-mustard mb-0.5">
                3+
              </p>
              <p
                className="font-sans text-sm leading-snug"
                style={{ color: "rgba(250,246,240,0.75)" }}
              >
                Years welcoming
                <br />
                guests as family
              </p>
            </div>
          </div>

          {/* Right — Story column */}
          <div className="lg:pl-4">

            <h2
              className="font-serif text-brown-deep font-bold"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.15 }}
            >
              Come as a Guest,{" "}
              <br />
              <em className="not-italic" style={{ color: "#C4654A" }}>
                Leave as Family
              </em>
            </h2>
            {/* Blockquote */}
            <blockquote className="border-l-4 border-terracotta pl-6 mb-8 py-1">
              <p className="font-serif text-xl text-brown-deep italic leading-relaxed">
                "In Nepal, a guest is Atithi — like a god who has come to bless our
                home. We host not for money. We host because it is who we are."
              </p>
              <footer
                className="font-sans text-sm mt-3"
                style={{ color: "#7A5C45" }}
              >
                — Bikram Luhar, Founder
              </footer>
            </blockquote>

            {/* Story Paragraphs */}
            <div className="space-y-4 mb-8 font-sans text-sm sm:text-base leading-relaxed text-justify" style={{ color: "#7A5C45" }}>
              <p>
                <strong className="font-semibold text-brown-deep">Homestay Nepal</strong> started with a simple, heartfelt dream: to connect travelers not just with scenic beds, but with the warm soul of authentic Nepali families.
              </p>
              <p>
                Instead of distant hotel lobbies, we welcome you by the wood-fire hearth with a cup of spiced Himalayan chiya, sharing ancestral stories, organic home-cooked meals, and real cultural bonds that last a lifetime.
              </p>
            </div>

            {/* Highlights grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {HIGHLIGHTS.map((h) => (
                <div
                  key={h.label}
                  className="flex items-center gap-3 font-sans text-sm"
                  style={{ color: "#6B4226" }}
                >
                  <span className="text-xl">{h.emoji}</span>
                  {h.label}
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#rooms"
              className="inline-flex items-center gap-2 font-sans font-semibold text-cream px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-xl cursor-pointer"
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
