"use client";

import { useState } from "react";
import Link from "next/link";
import SectionLabel from "@/features/landing/shared/SectionLabel";
import { ROOMS as FALLBACK_ROOMS, AMENITY_ICONS } from "@/data/landing";
import { useHomestays } from "@/hooks/useHomestays";
import BookingModal from "@/features/booking/BookingModal";

function badgeStyle(badge) {
  if (badge === "Most Popular" || badge === "FAMILY") return { bg: "#C4654A", color: "#FAF6F0" };
  if (badge === "Premium" || badge === "DELUXE") return { bg: "#2C1810", color: "#D4A017" };
  return { bg: "#2A7B7B", color: "#FAF6F0" };
}

function RoomCard({ room, onBook }) {
  const badgeLabel = room.badge || (room.roomType ? `${room.roomType} SUITE` : "Authentic Stay");
  const badge = badgeStyle(badgeLabel);
  const detailsUrl = `/homestays/${room.slug || room.id}`;

  const displayImage =
    (Array.isArray(room.images) && room.images.length > 0 ? room.images[0] : null) ||
    room.image ||
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80";

  const priceNPR = room.pricePerNight ?? room.priceNPR ?? 2200;

  const amenitiesList = room.facilities || room.amenities || [
    "Mountain View",
    "Traditional Breakfast",
    "Warm Hospitality",
    "Local Guide"
  ];

  return (
    <article className="bg-card-warm rounded-2xl overflow-hidden border border-border-warm shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between">
      <div>
        {/* Image */}
        <Link href={detailsUrl} className="block relative h-64 overflow-hidden bg-brown-deep">
          <img
            src={displayImage}
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {badgeLabel && (
            <span
              className="absolute top-4 left-4 font-sans text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-md uppercase tracking-wider"
              style={{ backgroundColor: badge.bg, color: badge.color }}
            >
              {badgeLabel}
            </span>
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(44,24,16,0.55) 0%, transparent 60%)",
            }}
          />
          {room.village && (
            <span className="absolute bottom-3 left-4 text-xs font-sans font-medium text-cream bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md">
              📍 {room.village}{room.region ? `, ${room.region}` : ""}
            </span>
          )}
        </Link>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-serif text-brown-deep text-xl font-bold mb-2 group-hover:text-brick transition-colors">
            <Link href={detailsUrl}>
              {room.name}
            </Link>
          </h3>
          <p
            className="font-sans text-sm leading-relaxed mb-5 line-clamp-2"
            style={{ color: "#7A5C45" }}
          >
            {room.description}
          </p>

          {/* Amenity pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {amenitiesList.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="flex items-center gap-1.5 bg-parchment border border-border-warm font-sans text-xs px-3 py-1.5 rounded-full"
                style={{ color: "#6B4226" }}
              >
                <span>{AMENITY_ICONS[amenity] ?? "✦"}</span>
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="px-6 pb-6 pt-4 border-t border-border-warm flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto">
        <div>
          <p className="font-serif text-2xl font-bold text-brick leading-tight">
            NPR {priceNPR.toLocaleString()}
          </p>
          <p className="font-sans text-xs" style={{ color: "#7A5C45" }}>
            per night
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={detailsUrl}
            className="font-sans text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all duration-200 border text-center whitespace-nowrap cursor-pointer"
            style={{
              borderColor: "#C4654A",
              color: "#C4654A",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FAF6F0";
              e.currentTarget.style.borderColor = "#8B2E1A";
              e.currentTarget.style.color = "#8B2E1A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "#C4654A";
              e.currentTarget.style.color = "#C4654A";
            }}
          >
            View Details
          </Link>
          <button
            onClick={() => onBook(room)}
            className="font-sans text-xs font-semibold text-cream px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap"
            style={{ backgroundColor: "#C4654A" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8B2E1A")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C4654A")}
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Rooms() {
  const [selectedHomestay, setSelectedHomestay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: homestaysData, isLoading } = useHomestays({ limit: 6 });

  const homestaysList =
    homestaysData?.data && homestaysData.data.length > 0
      ? homestaysData.data
      : FALLBACK_ROOMS;

  const displayedHomestays = homestaysList.slice(0, 6);

  const handleOpenBooking = (homestay) => {
    setSelectedHomestay(homestay);
    setIsModalOpen(true);
  };

  const handleCloseBooking = () => {
    setIsModalOpen(false);
    setSelectedHomestay(null);
  };

  return (
    <section id="rooms" className="bg-cream py-16 sm:py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <SectionLabel>Authentic Village Stays</SectionLabel>
          <h2
            className="font-serif text-brown-deep font-bold mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            A Homestay for Every
            <br />
            <em className="not-italic" style={{ color: "#C4654A" }}>
              Kind of Traveler
            </em>
          </h2>
          <p
            className="font-sans max-w-xl mx-auto leading-relaxed"
            style={{ color: "#7A5C45" }}
          >
            Stay in verified rural community homes across Nepal. Enjoy fresh organic
            Dal Bhat, warm local host families, and authentic Nepali culture.
          </p>
        </div>


        {isLoading && (
          <div className="text-center py-8">
            <span className="inline-block animate-pulse font-sans text-sm text-[#7A5C45]">
              Connecting to Nepal Homestay network...
            </span>
          </div>
        )}

        {!isLoading && displayedHomestays.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-[#E0CAB0] max-w-lg mx-auto">
            <span className="text-4xl block mb-3">🏡</span>
            <h3 className="font-serif text-xl font-bold text-brown-deep mb-2">
              No Homestays Available
            </h3>
            <p className="text-sm text-[#7A5C45]">
              Please check back soon for new community stays.
            </p>
          </div>
        )}

        {displayedHomestays.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedHomestays.map((room) => (
              <RoomCard key={room.id} room={room} onBook={handleOpenBooking} />
            ))}
          </div>
        )}

        {displayedHomestays.length > 0 && (
          <div className="flex flex-col items-center justify-center mt-16 text-center">
            <Link
              href="/homestays"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-sans font-semibold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
              style={{
                backgroundColor: "#2C1810",
                color: "#FAF6F0",
                border: "1px solid rgba(212,160,23,0.35)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#C4654A";
                e.currentTarget.style.borderColor = "transparent";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2C1810";
                e.currentTarget.style.borderColor = "rgba(212,160,23,0.35)";
              }}
            >
              <span>Explore All Homestays</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1 font-bold">→</span>
            </Link>
            <p className="text-xs mt-3 font-sans" style={{ color: "#7A5C45" }}>
              Showing 6 of our verified community stays across Nepal
            </p>
          </div>
        )}
      </div>
      <BookingModal
        homestay={selectedHomestay}
        isOpen={isModalOpen}
        onClose={handleCloseBooking}
      />
    </section>
  );
}
