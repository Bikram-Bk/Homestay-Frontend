"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useHomestay } from "@/hooks/useHomestays";
import { useHomestayReviews, useReviewableBookings, useCreateReview } from "@/hooks/useReviews";
import { useCheckAvailability } from "@/hooks/useBookings";
import { useAuthStore } from "@/store/authStore";
import BookingModal from "@/features/booking/BookingModal";
import Navbar from "@/features/landing/sections/Navbar";



function getDaysInMonth(year, month) {
  const days = [];
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const WEEKDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];


function AvailabilityCalendar({ homestayId }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const monthStart = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(calYear, calMonth + 1, 0).getDate();
  const monthEnd = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${lastDay}`;

  const { data: availData } = useCheckAvailability(homestayId, {
    checkIn: monthStart,
    checkOut: monthEnd,
  });

  const bookedRanges = useMemo(() => {
    return availData?.data?.bookedRanges || [];
  }, [availData]);

  function isDateBooked(date) {
    if (date < today) return false; 
    return bookedRanges.some(({ checkIn, checkOut }) => {
      const ci = new Date(checkIn);
      const co = new Date(checkOut);
      return date >= ci && date < co;
    });
  }

  function isDatePast(date) {
    return date < today;
  }

  function isDateToday(date) {
    return date.toDateString() === today.toDateString();
  }

  const days = getDaysInMonth(calYear, calMonth);
  const firstWeekDay = new Date(calYear, calMonth, 1).getDay();
  const blanks = Array(firstWeekDay).fill(null);

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const isPrevDisabled =
    calYear === today.getFullYear() && calMonth === today.getMonth();

  return (
    <div className="bg-white rounded-2xl border border-[#E8DDD1] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={isPrevDisabled}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[#FAF0E6] disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous month"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2C1810" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <p className="font-serif font-bold text-[#2C1810] text-sm">
          {MONTHS[calMonth]} {calYear}
        </p>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[#FAF0E6]"
          aria-label="Next month"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2C1810" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-[#B89B82] py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {blanks.map((_, i) => <div key={`blank-${i}`} />)}
        {days.map((date) => {
          const past = isDatePast(date);
          const todayDate = isDateToday(date);
          const booked = !past && isDateBooked(date);
          const available = !past && !booked;

          let bg = "transparent";
          let textColor = "#2C1810";
          let border = "transparent";
          let title = "";

          if (past) { textColor = "#C8B8AA"; }
          else if (todayDate) { bg = "#2C1810"; textColor = "#FAF6F0"; border = "#2C1810"; title = "Today"; }
          else if (booked) { bg = "#FEE2E2"; textColor = "#DC2626"; border = "#FECACA"; title = "Booked"; }
          else if (available) { bg = "#DCFCE7"; textColor = "#16A34A"; border = "#BBF7D0"; title = "Available"; }

          return (
            <div
              key={date.toISOString()}
              title={title}
              className="flex items-center justify-center rounded-lg text-xs font-medium transition-all"
              style={{
                height: "32px",
                backgroundColor: bg,
                color: textColor,
                border: `1px solid ${border}`,
                cursor: past ? "default" : "default",
              }}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#DCFCE7", border: "1px solid #BBF7D0" }} />
          <span className="text-[10px] text-[#7A5C45]">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#FEE2E2", border: "1px solid #FECACA" }} />
          <span className="text-[10px] text-[#7A5C45]">Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#2C1810" }} />
          <span className="text-[10px] text-[#7A5C45]">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "transparent", border: "1px solid #E8DDD1" }} />
          <span className="text-[10px] text-[#7A5C45]">Past</span>
        </div>
      </div>
    </div>
  );
}

// Photo Lightbox 

function PhotoLightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  // Keyboard nav
  useMemo(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors z-10"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-sans">
        {idx + 1} / {images.length}
      </div>
      {images.length > 1 && (
        <button
          className="absolute left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-10"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label="Previous image"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      )}

      <img
        src={images[idx]}
        alt={`Photo ${idx + 1}`}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <button
          className="absolute right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-10"
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label="Next image"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIdx(i); }}
              className="rounded overflow-hidden transition-all"
              style={{
                outline: i === idx ? "2px solid #D4A017" : "2px solid transparent",
                opacity: i === idx ? 1 : 0.5,
              }}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} className="w-12 h-8 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Inline Review Form 

function InlineReviewForm({ booking, onClose }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const createReviewMutation = useCreateReview();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (rating < 1 || rating > 5) { setError("Please select a star rating."); return; }
    createReviewMutation.mutate(
      { bookingId: booking.id, rating, comment: comment || undefined },
      {
        onSuccess: () => onClose?.(),
        onError: (err) => setError(err?.response?.data?.message || "Could not submit review."),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-3xl border border-[#E8DDD1] shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-xl font-bold text-[#2C1810]">Rate Your Stay</h3>
          <button onClick={onClose} className="text-[#7A5C45] hover:text-[#2C1810] text-xl leading-none" aria-label="Close">×</button>
        </div>
        <p className="text-xs text-[#7A5C45] mb-4">
          {booking?.homestay?.name || "Homestay"} •{" "}
          {new Date(booking.checkIn).toLocaleDateString()} – {new Date(booking.checkOut).toLocaleDateString()}
        </p>
        <div className="flex gap-1 mb-4">
          {[1,2,3,4,5].map((star) => (
            <button
              key={star} type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="text-3xl transition-transform hover:scale-110"
              style={{ color: star <= (hovered || rating) ? "#D4A017" : "#E8DDD1" }}
              aria-label={`${star} star`}
            >★</button>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience (optional)..."
            rows={4} maxLength={1000}
            className="w-full rounded-xl border border-[#E8DDD1] p-3 text-sm text-[#2C1810] focus:outline-none focus:border-[#C4654A]"
          />
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          <button
            type="submit" disabled={createReviewMutation.isPending}
            className="mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#C4654A" }}
          >
            {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Main Page 

export default function HomestayDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { data, isLoading } = useHomestay(slug);
  const homestay = data?.data;

  const [bookingOpen, setBookingOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [reviewingBooking, setReviewingBooking] = useState(null);

  const { data: reviewsData } = useHomestayReviews(homestay?.id);
  const reviews = reviewsData?.data || [];

  const { isAuthenticated } = useAuthStore();
  const { data: reviewableData } = useReviewableBookings();
  const reviewableBookings = reviewableData?.data || [];

  // Find a reviewable booking for THIS homestay
  const eligibleBooking = homestay
    ? reviewableBookings.find((b) => b.homestayId === homestay.id)
    : null;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FAF6F0" }}>
          <p className="text-sm text-[#7A5C45] animate-pulse">Loading homestay details...</p>
        </div>
      </>
    );
  }

  if (!homestay) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FAF6F0" }}>
          <p className="text-sm text-red-600">Homestay not found.</p>
        </div>
      </>
    );
  }

  const images = homestay.images || [];

  return (
    <>
      <Navbar />

      <div className="min-h-screen pt-16" style={{ backgroundColor: "#FAF6F0" }}>
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Back Button */}
          <button
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push("/homestays");
              }
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#7A5C45] hover:text-[#C4654A] bg-white border border-[#E0CAB0] transition-all cursor-pointer shadow-sm hover:shadow group"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1 font-bold text-sm leading-none">←</span>
            <span>Back</span>
          </button>

          {/* Title */}
          <h1 className="font-serif text-3xl font-bold text-[#2C1810] mt-3">{homestay.name}</h1>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-sm text-[#7A5C45]">📍 {homestay.village}, {homestay.region}</span>
            {homestay.averageRating && (
              <span className="text-sm text-[#D4A017] font-semibold">
                ⭐ {homestay.averageRating} <span className="text-[#7A5C45] font-normal">({homestay.reviewCount} reviews)</span>
              </span>
            )}
          </div>

          {/* ── Photo Gallery with Lightbox ── */}
          {images.length > 0 && (
            <div className="mt-6">
              {images.length === 1 ? (
                <button
                  className="w-full rounded-2xl overflow-hidden cursor-zoom-in"
                  onClick={() => setLightboxIdx(0)}
                >
                  <img src={images[0]} alt={homestay.name} className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500" />
                </button>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      className="relative group rounded-2xl overflow-hidden cursor-zoom-in focus:outline-none"
                      onClick={() => setLightboxIdx(i)}
                      aria-label={`View photo ${i + 1}`}
                    >
                      <img
                        src={img}
                        alt={`${homestay.name} photo ${i + 1}`}
                        className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <svg
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white drop-shadow"
                          width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        >
                          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </div>
                      {/* "View all" badge on last image */}
                      {i === images.length - 1 && images.length >= 4 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          +{images.length} photos
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-[#B89B82] mt-1.5 text-right">Click any photo to view full size</p>
            </div>
          )}

          <div className="mt-8 grid md:grid-cols-3 gap-8">
            {/* ── Left Column ── */}
            <div className="md:col-span-2 space-y-8">

              {/* About */}
              {homestay.description && (
                <section>
                  <h2 className="font-serif text-xl font-bold text-[#2C1810]">About This Stay</h2>
                  <p className="text-sm text-[#7A5C45] mt-2 leading-relaxed">{homestay.description}</p>
                </section>
              )}

              {/* Host */}
              <section>
                <h2 className="font-serif text-xl font-bold text-[#2C1810]">Meet Your Host</h2>
                <div
                  className="flex items-start gap-4 mt-3 p-4 rounded-2xl"
                  style={{ backgroundColor: "#FDF8F3", border: "1px solid #E8DDD1" }}
                >
                  {homestay.hostPhoto ? (
                    <img
                      src={homestay.hostPhoto}
                      alt={homestay.hostName}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-serif text-2xl font-bold flex-shrink-0"
                      style={{ backgroundColor: "#C4654A", color: "#FAF6F0" }}
                    >
                      {homestay.hostName?.charAt(0) || "H"}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-[#2C1810]">{homestay.hostName}</p>
                    <p className="text-xs text-[#7A5C45] mt-1 leading-relaxed">{homestay.hostBio}</p>
                  </div>
                </div>
              </section>

              {/* Facilities */}
              {(homestay.facilities || []).length > 0 && (
                <section>
                  <h2 className="font-serif text-xl font-bold text-[#2C1810]">Facilities & Amenities</h2>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {homestay.facilities.map((f) => (
                      <span
                        key={f}
                        className="px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: "#F4EBE1", color: "#5A3825", border: "1px solid #E8DDD1" }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Availability Calendar ── */}
              <section>
                <h2 className="font-serif text-xl font-bold text-[#2C1810]">Availability</h2>
                <p className="text-xs text-[#7A5C45] mt-1 mb-3">
                  Green dates are available · Red dates are already booked
                </p>
                <AvailabilityCalendar homestayId={homestay.id} />
              </section>

              {/* ── Reviews ── */}
              <section>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="font-serif text-xl font-bold text-[#2C1810]">
                    Guest Reviews
                    {homestay.averageRating ? ` · ⭐ ${homestay.averageRating}` : ""}
                    <span className="text-sm font-sans font-normal text-[#7A5C45] ml-1">
                      ({homestay.reviewCount ?? reviews.length})
                    </span>
                  </h2>

                  {/* Write a Review button — shown only if user has an eligible booking here */}
                  {isAuthenticated && eligibleBooking && (
                    <button
                      onClick={() => setReviewingBooking(eligibleBooking)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: "#D4A017" }}
                    >
                      ✏️ Write a Review
                    </button>
                  )}
                </div>

                <div className="mt-4 space-y-4">
                  {reviews.length === 0 ? (
                    <div
                      className="py-8 text-center rounded-2xl"
                      style={{ backgroundColor: "#FDF8F3", border: "1px dashed #E8DDD1" }}
                    >
                      <p className="text-sm text-[#7A5C45]">No reviews yet — be the first to review this stay!</p>
                    </div>
                  ) : (
                    reviews.map((r) => (
                      <div key={r.id} className="bg-white rounded-2xl border border-[#E8DDD1] p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ backgroundColor: "#E8DDD1", color: "#5A3825" }}
                            >
                              {r.user?.name?.charAt(0)?.toUpperCase() || "G"}
                            </div>
                            <p className="text-xs font-bold text-[#2C1810]">{r.user?.name || "Guest"}</p>
                          </div>
                          <p className="text-sm text-[#D4A017]">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                        </div>
                        {r.comment && <p className="text-sm text-[#7A5C45] mt-2 leading-relaxed">{r.comment}</p>}
                        <p className="text-[10px] text-[#B89B82] mt-2">
                          {new Date(r.createdAt).toLocaleDateString("en-NP", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* ── Sticky Booking Card ── */}
            <div>
              <div
                className="bg-white rounded-3xl p-6 sticky top-24"
                style={{ border: "1px solid #E8DDD1", boxShadow: "0 8px 32px rgba(44,24,16,0.08)" }}
              >
                {/* Price */}
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-2xl font-bold text-[#C4654A]">
                    NPR {homestay.pricePerNight?.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#7A5C45] mb-0.5">/night</span>
                </div>

                {/* Quick details */}
                <div className="space-y-1.5 py-3 border-y border-[#F0E6DA] my-3 text-xs text-[#7A5C45]">
                  <div className="flex justify-between">
                    <span>🛏️ Room Type</span>
                    <span className="font-semibold text-[#2C1810]">{homestay.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🍽️ Meals</span>
                    <span className="font-semibold text-[#2C1810]">{homestay.mealsIncluded?.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>👥 Max Guests</span>
                    <span className="font-semibold text-[#2C1810]">{homestay.capacity} guests</span>
                  </div>
                </div>

                <button
                  id="detail-book-now"
                  onClick={() => setBookingOpen(true)}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "#C4654A" }}
                >
                  Check Availability & Book
                </button>

                <p className="text-[10px] text-center text-[#B89B82] mt-3">
                  No charges until you complete eSewa payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && images.length > 0 && (
        <PhotoLightbox
          images={images}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}

      {/* Booking Modal */}
      <BookingModal
        homestay={bookingOpen ? homestay : null}
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />

      {/* Review Modal */}
      {reviewingBooking && (
        <InlineReviewForm
          booking={reviewingBooking}
          onClose={() => setReviewingBooking(null)}
        />
      )}
    </>
  );
}

