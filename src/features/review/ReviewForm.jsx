"use client";

import { useState } from "react";
import { useCreateReview } from "@/hooks/useReviews";

export default function ReviewForm({ booking, onClose }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const createReviewMutation = useCreateReview();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating < 1 || rating > 5) {
      setError("Please select a star rating.");
      return;
    }

    createReviewMutation.mutate(
      { bookingId: booking.id, rating, comment: comment || undefined },
      {
        onSuccess: () => onClose?.(),
        onError: (err) =>
          setError(err?.response?.data?.message || "Could not submit review."),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-3xl border border-[#E8DDD1] shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl font-bold text-[#2C1810]">
            Rate Your Stay
          </h3>
          <button
            onClick={onClose}
            className="text-[#7A5C45] hover:text-[#2C1810] text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="text-xs text-[#7A5C45] mb-4">
          {booking?.homestay?.name || "Homestay"} •{" "}
          {new Date(booking.checkIn).toLocaleDateString()} –{" "}
          {new Date(booking.checkOut).toLocaleDateString()}
        </p>

        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="text-3xl transition-transform hover:scale-110"
              style={{ color: star <= (hovered || rating) ? "#D4A017" : "#E8DDD1" }}
              aria-label={`${star} star`}
            >
              ★
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience (optional)..."
            rows={4}
            maxLength={1000}
            className="w-full rounded-xl border border-[#E8DDD1] p-3 text-sm text-[#2C1810] focus:outline-none focus:border-[#C4654A]"
          />

          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

          <button
            type="submit"
            disabled={createReviewMutation.isPending}
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
