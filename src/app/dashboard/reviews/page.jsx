"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { useMyReviews, useReviewableBookings } from "@/hooks/useReviews";
import ReviewForm from "@/features/review/ReviewForm";

export default function MyReviewsPage() {
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  const { data: reviewsData, isLoading: loadingReviews } = useMyReviews();
  const { data: reviewableData, isLoading: loadingReviewable } = useReviewableBookings();

  const reviews = reviewsData?.data || [];
  const reviewableBookings = reviewableData?.data || [];

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <DashboardNav />

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDD1] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C4654A] font-semibold">
              Traveler Feedback
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810] mt-1">
              My Reviews & Experiences
            </h1>
            <p className="text-xs text-[#7A5C45] mt-1 font-sans">
              Stories and feedback you&apos;ve shared with local Nepali hosts
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-[#FAF6F0] p-4 rounded-2xl border border-[#E8DDD1]">
            <div className="text-center px-2">
              <span className="font-serif text-2xl font-bold text-[#2C1810]">
                {reviews.length}
              </span>
              <p className="text-[10px] uppercase font-semibold text-[#7A5C45]">Reviews</p>
            </div>
            {avgRating && (
              <>
                <div className="w-px h-8 bg-[#E8DDD1]" />
                <div className="text-center px-2">
                  <span className="font-serif text-2xl font-bold text-[#D4A017] flex items-center justify-center gap-1">
                    ★ {avgRating}
                  </span>
                  <p className="text-[10px] uppercase font-semibold text-[#7A5C45]">Avg Rating</p>
                </div>
              </>
            )}
          </div>
        </div>

        {reviewableBookings.length > 0 && (
          <div className="bg-[#FFF8E7] rounded-3xl border border-[#D4A017]/40 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C1810] flex items-center gap-2">
                  <span>✏️</span> Stays Ready for Your Review
                </h3>
                <p className="text-xs text-[#7A5C45] mt-0.5">
                  Your feedback supports local community homestays and helps other travelers.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4A017] text-[#2C1810]">
                {reviewableBookings.length} pending
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviewableBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-4 rounded-2xl border border-[#E8DDD1] flex items-center justify-between gap-3 shadow-xs"
                >
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#2C1810]">
                      {b.homestay?.name || "Homestay"}
                    </h4>
                    <p className="text-xs text-[#7A5C45] mt-0.5">
                      Completed stay: {new Date(b.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedBookingForReview(b)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#C4654A] text-[#FAF6F0] hover:bg-[#8B2E1A] transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    Write Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Past Reviews List ── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold text-[#2C1810]">
              Past Submitted Reviews
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8DDD1] text-[#2C1810]">
              {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
            </span>
          </div>

          {loadingReviews ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E8DDD1]">
              <p className="text-sm text-[#7A5C45] animate-pulse">Loading your reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E8DDD1] p-8 shadow-sm">
              <span className="text-4xl block mb-3">⭐</span>
              <h3 className="font-serif text-xl font-bold text-[#2C1810]">
                No Reviews Written Yet
              </h3>
              <p className="text-xs text-[#7A5C45] max-w-md mx-auto mt-2 leading-relaxed">
                When you complete an authentic village homestay, you can share your experience and rate the hosts right here.
              </p>
              <Link
                href="/dashboard"
                className="inline-block mt-5 py-2.5 px-5 rounded-xl font-semibold text-xs transition-all shadow-sm"
                style={{ backgroundColor: "#C4654A", color: "#FAF6F0" }}
              >
                View My Bookings
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => {
                const homestay = r.homestay || {};
                const homestayImage =
                  Array.isArray(homestay.images) && homestay.images.length > 0
                    ? homestay.images[0]
                    : "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=300&q=80";

                return (
                  <article
                    key={r.id}
                    className="bg-white rounded-2xl p-6 border border-[#E8DDD1] shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5"
                  >
                    <div className="w-full md:w-36 h-28 rounded-xl overflow-hidden bg-[#2C1810] flex-shrink-0">
                      <img
                        src={homestayImage}
                        alt={homestay.name || "Homestay"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-serif text-lg font-bold text-[#2C1810] hover:text-[#C4654A] transition-colors">
                              <Link href={`/homestays/${homestay.slug || homestay.id}`}>
                                {homestay.name || "Homestay"}
                              </Link>
                            </h3>
                            {homestay.village && (
                              <p className="text-xs text-[#7A5C45]">
                                📍 {homestay.village}
                                {homestay.region ? `, ${homestay.region}` : ""}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#FAF6F0] px-3 py-1.5 rounded-xl border border-[#E8DDD1]">
                            <span className="text-[#D4A017] text-sm">
                              {"★".repeat(r.rating)}
                              {"☆".repeat(5 - r.rating)}
                            </span>
                            <span className="font-serif font-bold text-xs text-[#2C1810]">
                              {r.rating}.0
                            </span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-[#5C3D28] leading-relaxed mt-2 italic font-serif">
                          &ldquo;{r.comment || "No written comment provided."}&rdquo;
                        </p>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#F2EAE0] pt-3 mt-4 text-[11px] text-[#A8988B]">
                        <span>
                          Stay:{" "}
                          {r.booking?.checkIn
                            ? new Date(r.booking.checkIn).toLocaleDateString()
                            : "Completed stay"}
                        </span>
                        <span>
                          Reviewed on {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {selectedBookingForReview && (
        <ReviewForm
          booking={selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
        />
      )}
    </div>
  );
}
