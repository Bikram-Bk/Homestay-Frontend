"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useMe, useLogout } from "@/hooks/useAuth";
import { useMyBookings, useCancelBooking } from "@/hooks/useBookings";
import { initiateEsewaPayment, submitEsewaForm } from "@/features/booking/api";
import { showToast, errorMessage, confirmToast } from "@/lib/toast";
import ReviewForm from "@/features/review/ReviewForm";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logoutMutation = useLogout();

  const { data: meData, isLoading: loadingMe } = useMe();
  const { data: bookingsData, isLoading: loadingBookings } = useMyBookings();
  const cancelBookingMutation = useCancelBooking();

  const [cancellingId, setCancellingId] = useState(null);
  const [cancelNote, setCancelNote] = useState("");
  const [payingId, setPayingId] = useState(null);
  const [reviewingBooking, setReviewingBooking] = useState(null);

  const handlePay = async (bookingId) => {
    setPayingId(bookingId);
    try {
      const res = await initiateEsewaPayment(bookingId);
      submitEsewaForm(res?.data);
    } catch (err) {
      showToast.error(errorMessage(err, "Could not start eSewa payment."));
      setPayingId(null);
    }
  };

  const bookings = bookingsData?.data || [];
  const currentUser = meData?.data || user;

  const handleCancel = (bookingId) => {
    confirmToast(
      "Cancel this booking? This action cannot be undone.",
      () => {
        cancelBookingMutation.mutate(
          {
            id: bookingId,
            data: { cancelNote: cancelNote || "Cancelled by guest" },
          },
          {
            onSuccess: () => {
              showToast.success("Booking cancelled successfully.");
              setCancellingId(null);
              setCancelNote("");
            },
            onError: (err) => {
              showToast.error(
                errorMessage(err, "Could not cancel booking. Please try again.")
              );
            },
          }
        );
      },
      "Yes, cancel it"
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "CONFIRMED":
        return { bg: "rgba(16, 185, 129, 0.15)", text: "#10B981", border: "rgba(16, 185, 129, 0.3)" };
      case "CANCELLED":
        return { bg: "rgba(239, 68, 68, 0.15)", text: "#EF4444", border: "rgba(239, 68, 68, 0.3)" };
      case "COMPLETED":
        return { bg: "rgba(59, 130, 246, 0.15)", text: "#3B82F6", border: "rgba(59, 130, 246, 0.3)" };
      case "PAID":
        return { bg: "rgba(96, 187, 70, 0.15)", text: "#4EA336", border: "rgba(96, 187, 70, 0.3)" };
      default: 
        return { bg: "rgba(245, 158, 11, 0.15)", text: "#F59E0B", border: "rgba(245, 158, 11, 0.3)" };
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF6F0" }}>
      <DashboardNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Welcome Banner */}
        <div
          className="rounded-3xl p-5 sm:p-8 relative overflow-hidden text-[#FAF6F0] shadow-xl border border-white/10"
          style={{
            backgroundColor: "#2C1810",
            backgroundImage: `radial-gradient(circle at 80% 20%, rgba(196, 101, 74, 0.3) 0%, transparent 60%)`,
          }}
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D4A017] font-semibold">
                My Bookings
              </span>
              <h1 className="font-serif text-3xl font-bold mt-1">
                Namaste, {currentUser?.name || "Traveler"}!
              </h1>
              <p className="text-sm mt-1" style={{ color: "#D4BBA5" }}>
                {currentUser?.email} {currentUser?.phone ? `• ${currentUser.phone}` : ""}
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/#rooms"
                className="py-3 px-5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md"
                style={{ backgroundColor: "#C4654A", color: "#FAF6F0" }}
              >
                Book Another Stay
              </Link>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2C1810]">
                My Bookings & Reservations
              </h2>
              <p className="text-xs text-[#7A5C45] mt-0.5">
                Manage your authentic rural community stays
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8DDD1] text-[#2C1810]">
              {bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"}
            </span>
          </div>

          {loadingBookings ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DDD1]">
              <p className="font-sans text-sm text-[#7A5C45] animate-pulse">
                Loading your stays...
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E8DDD1] p-8 shadow-sm">
              <span className="text-4xl">🏔️</span>
              <h3 className="font-serif text-xl font-bold text-[#2C1810] mt-3">
                No Bookings Yet
              </h3>
              <p className="text-sm text-[#7A5C45] max-w-md mx-auto mt-2 leading-relaxed">
                You haven&apos;t reserved any homestay yet. Discover authentic village homes across Nepal with warm hosts and homemade meals.
              </p>
              <Link
                href="/#rooms"
                className="inline-block mt-6 py-3 px-6 rounded-xl font-semibold text-sm transition-all shadow-md"
                style={{ backgroundColor: "#C4654A", color: "#FAF6F0" }}
              >
                Explore Homestays Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => {
                const badge = getStatusBadge(booking.status);
                const homestay = booking.homestay || {};
                const checkInDate = booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "";
                const checkOutDate = booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "";

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-3xl overflow-hidden border border-[#E8DDD1] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image / Header */}
                      <div className="relative h-44 bg-[#2C1810]">
                        <img
                          src={
                            (homestay.images && homestay.images[0]) ||
                            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80"
                          }
                          alt={homestay.name || "Homestay"}
                          className="w-full h-full object-cover"
                        />
                        <span
                          className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm"
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.text,
                            borderColor: badge.border,
                          }}
                        >
                          {booking.status}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <p className="text-xs uppercase tracking-wider font-semibold text-[#C4654A]">
                          📍 {homestay.village || "Nepal"}, {homestay.region || ""}
                        </p>
                        <h4 className="font-serif text-lg font-bold text-[#2C1810] mt-1">
                          {homestay.name || "Authentic Homestay"}
                        </h4>

                        <div className="mt-4 space-y-1.5 text-xs text-[#7A5C45] border-t border-[#E8DDD1] pt-3">
                          <div className="flex justify-between">
                            <span>Check-In:</span>
                            <strong className="text-[#2C1810]">{checkInDate}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Check-Out:</span>
                            <strong className="text-[#2C1810]">{checkOutDate}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Guests:</span>
                            <strong className="text-[#2C1810]">{booking.guests} guest(s)</strong>
                          </div>
                          <div className="flex justify-between border-t border-dashed border-[#E8DDD1] pt-2 mt-2">
                            <span className="font-semibold text-[#2C1810]">Total Paid:</span>
                            <strong className="text-[#C4654A] text-sm">
                              NPR {booking.totalAmount?.toLocaleString()}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-5 pt-0">
                      {booking.status === "PENDING" && (
                        <button
                          onClick={() => handlePay(booking.id)}
                          disabled={payingId === booking.id}
                          className="w-full mb-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white transition-colors disabled:opacity-50"
                          style={{ backgroundColor: "#60BB46" }}
                        >
                          {payingId === booking.id ? "Redirecting to eSewa..." : "Pay with eSewa"}
                        </button>
                      )}
                      {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancelBookingMutation.isPending}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Cancel Reservation
                        </button>
                      )}
                      {["PAID", "CONFIRMED"].includes(booking.status) &&
                        new Date(booking.checkOut) < new Date() &&
                        !booking.review && (
                          <button
                            onClick={() => setReviewingBooking(booking)}
                            className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-semibold"
                            style={{ backgroundColor: "#D4A017", color: "#2C1810" }}
                          >
                            ⭐ Write a Review
                          </button>
                        )}
                      {booking.review && (
                        <p className="mt-2 text-xs text-center text-[#7A5C45]">
                          ✅ Reviewed — {booking.review.rating}★
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {reviewingBooking && (
        <ReviewForm
          booking={reviewingBooking}
          onClose={() => setReviewingBooking(null)}
        />
      )}
    </div>
  );
}
