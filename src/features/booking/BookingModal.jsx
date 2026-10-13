"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useCreateBooking, useCheckAvailability } from "@/hooks/useBookings";
import { initiateEsewaPayment, submitEsewaForm } from "@/features/booking/api";
import { showToast, errorMessage } from "@/lib/toast";

function offsetDateStr(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function BookingModal({ homestay, isOpen, onClose }) {
  const router = useRouter();
  const titleId = useId();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const [checkIn, setCheckIn] = useState(() => offsetDateStr(1));
  const [checkOut, setCheckOut] = useState(() => offsetDateStr(3));
  const [guests, setGuests] = useState(1);
  const [bookedData, setBookedData] = useState(null);
  const [paying, setPaying] = useState(false);

  const createBookingMutation = useCreateBooking();

  // Availability query
  const { data: availData, isLoading: checkingAvail } = useCheckAvailability(
    homestay?.id,
    { checkIn, checkOut }
  );

  if (!isOpen || !homestay) return null;

  // Nights calculation
  const nights = Math.max(
    1,
    Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  );
  const totalPrice = (homestay.pricePerNight || 2000) * nights;

  const isAvailable = availData?.data?.available !== false;

  const handleConfirmBooking = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!checkIn || !checkOut || checkOut <= checkIn) {
      showToast.error("Check-out date must be after check-in date.");
      return;
    }

    createBookingMutation.mutate(
      {
        homestayId: homestay.id,
        checkIn,
        checkOut,
        guests: Number(guests),
      },
      {
        onSuccess: (res) => {
          setBookedData(res?.data);
          showToast.success("Booking reserved! Complete your payment 🎉");
        },
        onError: (err) => {
          showToast.error(
            errorMessage(err, "Booking failed. Please verify dates or try again.")
          );
        },
      }
    );
  };

  const handleModalClose = () => {
    setBookedData(null);
    onClose();
  };

  const handlePayWithEsewa = async (bookingId) => {
    setPaying(true);
    try {
      const res = await initiateEsewaPayment(bookingId);
      submitEsewaForm(res?.data);
    } catch (err) {
      showToast.error(errorMessage(err, "Could not start eSewa payment. Try again."));
      setPaying(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[#EADBCC] bg-white text-[#2C1810] animate-in zoom-in-95 duration-200">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#C4654A] via-[#D4A017] to-[#8B2E1A]" />

        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#F4EBE1]">
          <div>
            <span id={titleId} className="font-sans text-[11px] uppercase tracking-widest text-[#C4654A] font-bold block mb-0.5">
              ✦ Authentic Homestay Reservation
            </span>
            <h3 className="font-serif text-xl font-bold text-[#2C1810]">
              {bookedData ? "Booking Confirmed" : "Reserve Your Stay"}
            </h3>
          </div>
          <button
            onClick={handleModalClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A5C45] hover:text-[#2C1810] hover:bg-[#FAF6F0] transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {bookedData ? (
            <div className="text-center py-2 space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-3xl text-[#10B981] shadow-sm">
                ✓
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#2C1810] mb-1">
                  Namaste! Booking Request Sent
                </h3>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#C4654A]">
                  Booking Reference: #{bookedData.id?.slice(-8).toUpperCase() || "CONFIRMED"}
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-4 rounded-2xl text-left space-y-2.5 border border-[#EADBCC] bg-[#FAF8F5] text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-[#EFE8DF]">
                  <span className="text-xs text-[#7A5C45]">Homestay</span>
                  <span className="font-bold text-[#2C1810]">{homestay.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#7A5C45]">Dates:</span>
                  <span className="font-medium text-[#2C1810]">{checkIn} to {checkOut} ({nights} nights)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#7A5C45]">Guests:</span>
                  <span className="font-medium text-[#2C1810]">{guests} guest(s)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#7A5C45]">Status:</span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                    {bookedData.status || "PENDING"} (Awaiting Host)
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#EFE8DF] pt-2.5 font-bold">
                  <span className="text-[#6B4226]">Total Payable:</span>
                  <span className="text-[#C4654A] text-base">NPR {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-xs text-[#7A5C45] leading-relaxed">
                The local host family has been notified. You can review and track your booking status directly in your Traveler Dashboard.
              </p>

              <button
                type="button"
                onClick={() => handlePayWithEsewa(bookedData.id)}
                disabled={paying}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide text-white bg-[#60BB46] hover:bg-[#4EA336] transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-[0.99]"
              >
                {paying ? "Redirecting to eSewa..." : `Pay NPR ${totalPrice.toLocaleString()} with eSewa`}
              </button>

              <div className="flex gap-3 pt-2">
                <Link
                  href="/dashboard"
                  onClick={handleModalClose}
                  className="flex-1 py-3 px-4 rounded-xl text-center text-sm font-semibold text-white bg-[#C4654A] hover:bg-[#8B2E1A] transition-all shadow-sm"
                >
                  View in Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="py-3 px-5 rounded-xl text-sm font-semibold border border-[#DDD4C7] text-[#6B4226] hover:bg-[#FAF6F0] transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="flex gap-3.5 items-center p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EADBCC]">
                <img
                  src={
                    (homestay.images && homestay.images[0]) ||
                    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80"
                  }
                  alt={homestay.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0 border border-[#EADBCC]"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#2C1810] truncate">
                    {homestay.name}
                  </h4>
                  <p className="text-xs text-[#7A5C45] truncate mt-0.5">
                    📍 {homestay.village}, {homestay.region}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-bold text-[#C4654A]">
                      NPR {homestay.pricePerNight?.toLocaleString()} <span className="text-[11px] font-normal text-[#7A5C45]">/ night</span>
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-[#E2D8CC] text-[#6B4226]">
                      Max {homestay.capacity || 4} guests
                    </span>
                  </div>
                </div>
              </div>

              {/* Check-In / Check-Out Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B4226] mb-1">
                    Check-In
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD4C7] text-[#2C1810] text-sm focus:bg-white focus:border-[#C4654A] focus:ring-2 focus:ring-[#C4654A]/20 transition-all outline-none font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B4226] mb-1">
                    Check-Out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD4C7] text-[#2C1810] text-sm focus:bg-white focus:border-[#C4654A] focus:ring-2 focus:ring-[#C4654A]/20 transition-all outline-none font-medium"
                    required
                  />
                </div>
              </div>

              {/* Guests Count Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B4226] mb-1">
                  Guests Count
                </label>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD4C7]">
                  <div className="flex items-center gap-2">
                    <span className="text-base">👥</span>
                    <span className="text-sm font-semibold text-[#2C1810]">
                      {guests} guest{guests !== 1 ? "s" : ""}
                    </span>
                    <span className="text-[11px] text-[#7A5C45]">
                      (Max: {homestay.capacity || 4})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#DDD4C7] text-[#2C1810] font-bold hover:bg-white transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-bold text-sm text-[#2C1810]">
                      {guests}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests(Math.min(homestay.capacity || 8, guests + 1))}
                      disabled={guests >= (homestay.capacity || 8)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#DDD4C7] text-[#2C1810] font-bold hover:bg-white transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-[#7A5C45] mt-1 pl-1">
                  {homestay.mealsIncluded
                    ? `🍛 Included: ${homestay.mealsIncluded.replace("_", " ")}`
                    : "🍛 Authentic organic home-cooked meals included"}
                </p>
              </div>

              {/* Availability Indicator */}
              <div className="text-xs">
                {checkingAvail ? (
                  <div className="p-2.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] font-medium flex items-center gap-1.5">
                    <span className="animate-spin text-sm">⏳</span> Checking room availability...
                  </div>
                ) : isAvailable ? (
                  <div className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] font-medium flex items-center gap-1.5">
                    <span className="text-sm">✓</span> Available for selected dates ({nights} night{nights > 1 ? "s" : ""})
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#FDF2F0] border border-[#F5C2B8] text-[#B92B1B] font-medium flex items-center gap-1.5">
                    <span className="text-sm">✕</span> These dates are already booked. Please choose different dates.
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EADBCC] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#7A5C45]">
                  <span>NPR {homestay.pricePerNight?.toLocaleString()} × {nights} night{nights > 1 ? "s" : ""}</span>
                  <span className="font-semibold text-[#2C1810]">NPR {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#7A5C45]">
                  <span>Local Community Fund & Hospitality</span>
                  <span className="text-[#059669] font-bold">Included</span>
                </div>
                <div className="flex justify-between border-t border-[#EAE2D5] pt-2 font-bold text-sm text-[#2C1810]">
                  <span>Total Amount</span>
                  <span className="text-[#C4654A] font-serif text-lg">NPR {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Authentication Status Check */}
              {!isAuthenticated ? (
                <div className="p-4 rounded-2xl border border-[#F3DEC3] bg-[#FFF8F0] space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-lg">🔒</span>
                    <div>
                      <p className="text-xs font-bold text-[#8B2E1A] uppercase tracking-wide">
                        Login Required to Confirm
                      </p>
                      <p className="text-xs text-[#6B4226] mt-0.5 leading-relaxed">
                        Please sign in to confirm your booking and view direct host contact details.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/")}`}
                      className="flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-bold uppercase tracking-wider bg-[#C4654A] hover:bg-[#8B2E1A] text-white transition-all shadow-sm"
                    >
                      Login to Book
                    </Link>
                    <Link
                      href="/register"
                      className="py-2.5 px-4 rounded-xl text-center text-xs font-bold border border-[#DDD4C7] bg-white text-[#6B4226] hover:bg-[#FAF6F0] transition-all"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between text-xs text-[#7A5C45] px-1">
                    <span>Booking as: <strong className="text-[#2C1810]">{user?.name}</strong></span>
                    <span className="truncate max-w-[180px]">{user?.email}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={!isAvailable || createBookingMutation.isPending}
                    className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide text-white bg-[#C4654A] hover:bg-[#8B2E1A] transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                  >
                    {createBookingMutation.isPending
                      ? "Submitting Booking..."
                      : `Confirm & Reserve for NPR ${totalPrice.toLocaleString()}`}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
