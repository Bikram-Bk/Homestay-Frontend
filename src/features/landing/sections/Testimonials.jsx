"use client";

import { useState } from "react";
import SectionLabel from "@/features/landing/shared/SectionLabel";
import Stars from "@/features/landing/shared/Stars";
import { TESTIMONIALS } from "@/data/landing";

function TestimonialCard({ t }) {
  return (
    <div
      className="rounded-2xl p-7 md:p-8 flex flex-col justify-between transition-all duration-300 hover:border-mustard/40 h-full shadow-lg"
      style={{
        background: "rgba(255,255,255,0.09)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.18)",
      }}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <Stars n={t.rating} />
          {t.host && (
            <span
              className="font-sans text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
              style={{
                backgroundColor: "rgba(212,160,23,0.22)",
                color: "#F5D485",
                border: "1px solid rgba(212,160,23,0.4)",
              }}
            >
              {t.host}
            </span>
          )}
        </div>
        <blockquote className="font-serif text-cream text-base sm:text-lg italic leading-relaxed mb-6">
          &ldquo;{t.text}&rdquo;
        </blockquote>
      </div>
      <footer className="flex items-center gap-4 pt-4 border-t border-white/10">
        <img
          src={t.avatar}
          alt={t.name}
          className="w-12 h-12 rounded-full object-cover shrink-0"
          style={{ border: "2px solid #D4A017" }}
          loading="lazy"
        />
        <div className="min-w-0">
          <p className="font-sans font-semibold text-cream text-sm truncate">{t.name}</p>
          <p className="font-sans text-xs text-cream/70">
            {t.country}
          </p>
          <p className="font-sans text-xs mt-0.5 font-medium truncate" style={{ color: "#F5D485" }}>
            📍 {t.stay}
          </p>
        </div>
      </footer>
    </div>
  );
}

function BigMandala() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity: 0.04 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 400"
        width={700}
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <ellipse
            key={i}
            cx={200}
            cy={60}
            rx={14}
            ry={70}
            transform={`rotate(${i * 20} 200 200)`}
          />
        ))}
        <circle cx={200} cy={200} r={62} />
      </svg>
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("next");
  const total = TESTIMONIALS.length;

  const prev = () => {
    setDirection("prev");
    setCurrent((c) => (c - 1 + total) % total);
  };

  const next = () => {
    setDirection("next");
    setCurrent((c) => (c + 1) % total);
  };

  const goTo = (index) => {
    setDirection(index >= current ? "next" : "prev");
    setCurrent(index);
  };

  return (
    <section
      id="culture"
      className="py-16 sm:py-24 px-6 relative overflow-hidden"
      style={{ backgroundColor: "#8B2E1A" }}
    >
      <style>{`
        @keyframes testimonialSlideRight {
          0% {
            opacity: 0;
            transform: translateX(42px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes testimonialSlideLeft {
          0% {
            opacity: 0;
            transform: translateX(-42px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .slide-animate-next {
          animation: testimonialSlideRight 0.42s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .slide-animate-prev {
          animation: testimonialSlideLeft 0.42s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      <BigMandala />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <SectionLabel light>Guest Stories</SectionLabel>
          <h2
            className="font-serif font-bold text-cream"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            Words from Our
            <br />
            <em className="not-italic" style={{ color: "#D4A017" }}>
              Homestay Family
            </em>
          </h2>
        </div>

        <div
          key={`desktop-${current}`}
          className={`hidden md:grid grid-cols-2 gap-8 mb-10 ${
            direction === "next" ? "slide-animate-next" : "slide-animate-prev"
          }`}
        >
          <TestimonialCard t={TESTIMONIALS[current]} />
          <TestimonialCard t={TESTIMONIALS[(current + 1) % total]} />
        </div>

        <div
          key={`mobile-${current}`}
          className={`md:hidden mb-10 ${
            direction === "next" ? "slide-animate-next" : "slide-animate-prev"
          }`}
        >
          <TestimonialCard t={TESTIMONIALS[current]} />
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="w-12 h-12 rounded-full flex items-center justify-center text-cream transition-all duration-200 hover:bg-white/15 hover:border-mustard active:scale-95 cursor-pointer shadow-md"
            style={{ border: "2px solid rgba(255,255,255,0.25)" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex gap-2 items-center">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="h-2 rounded-full transition-all duration-300 cursor-pointer hover:opacity-100"
                style={{
                  width: i === current ? 32 : 8,
                  backgroundColor:
                    i === current ? "#D4A017" : "rgba(255,255,255,0.30)",
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next testimonial"
            className="w-12 h-12 rounded-full flex items-center justify-center text-cream transition-all duration-200 hover:bg-white/15 hover:border-mustard active:scale-95 cursor-pointer shadow-md"
            style={{ border: "2px solid rgba(255,255,255,0.25)" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
