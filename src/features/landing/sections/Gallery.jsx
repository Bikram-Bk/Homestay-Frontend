"use client";

import SectionLabel from "@/features/landing/shared/SectionLabel";
import { GALLERY } from "@/data/landing";

export default function Gallery() {
  return (
    <section id="gallery" className="bg-cream py-16 sm:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <SectionLabel>Gallery</SectionLabel>
          <h2
            className="font-serif text-brown-deep font-bold"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            Through Our
            <br />
            <em className="not-italic" style={{ color: "#C4654A" }}>
              HomeStay Windows
            </em>
          </h2>
        </div>

        {/* Desktop masonry grid */}
        <div
          className="hidden md:grid gap-4"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(2, 234px)",
          }}
        >
          {GALLERY.map((img) => (
            <div
              key={img.alt}
              className="relative overflow-hidden rounded-2xl group cursor-pointer bg-brown"
              style={{
                gridColumn: `${img.colStart} / span ${img.colSpan}`,
                gridRow: `${img.rowStart} / span ${img.rowSpan}`,
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div
                className="absolute inset-0 flex items-end p-5 transition-colors duration-300"
                style={{}}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgba(44,24,16,0.45)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <p className="font-sans text-cream text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.alt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile 2-column grid */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {GALLERY.map((img) => (
            <div
              key={img.alt}
              className="relative overflow-hidden rounded-xl bg-brown"
              style={{ height: 175 }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
