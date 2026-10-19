"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyEsewaPayment } from "@/features/booking/api";
import { useAuthStore } from "@/store/authStore";

function EsewaSuccessContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState({ status: "loading", booking: null, message: "" });
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const data = searchParams.get("data");
    if (!data) {
      setState({ status: "error", booking: null, message: "No payment data found in the callback URL." });
      return;
    }

    const runVerification = async () => {
      try {
        await useAuthStore.getState().hydrate();
        const res = await verifyEsewaPayment(data);
        setState({ status: "success", booking: res?.data, message: "" });
      } catch (err) {
        setState({
          status: "error",
          booking: null,
          message: err?.response?.data?.message || "Payment verification failed.",
        });
      }
    };

    runVerification();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-[#E8DDD1] shadow-sm p-10 text-center">
        {state.status === "loading" && (
          <>
            <div className="text-4xl animate-spin">⏳</div>
            <h1 className="font-serif text-2xl font-bold text-[#2C1810] mt-4">
              Verifying your payment with eSewa...
            </h1>
            <p className="text-sm text-[#7A5C45] mt-2">Please don&apos;t close this page.</p>
          </>
        )}

        {state.status === "error" && (
          <>
            <div className="text-4xl">❌</div>
            <h1 className="font-serif text-2xl font-bold text-[#2C1810] mt-4">Verification Failed</h1>
            <p className="text-sm text-[#7A5C45] mt-2">{state.message}</p>
            <div className="flex gap-3 justify-center mt-6">
              <Link href="/dashboard" className="py-3 px-6 rounded-xl text-sm font-semibold text-white bg-[#C4654A] hover:bg-[#8B2E1A]">
                Go to Dashboard
              </Link>
              <Link href="/" className="py-3 px-6 rounded-xl text-sm font-semibold border border-[#DDD4C7] text-[#6B4226]">
                Home
              </Link>
            </div>
          </>
        )}

        {state.status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-3xl text-[#10B981]">
              ✓
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#2C1810] mt-4">Payment Successful!</h1>
            <p className="text-sm text-[#7A5C45] mt-1">Your eSewa payment has been verified.</p>

            <div className="mt-6 p-4 rounded-2xl border border-[#EADBCC] bg-[#FAF8F5] text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#7A5C45]">Homestay</span>
                <strong className="text-[#2C1810]">{state.booking?.homestay?.name || "—"}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A5C45]">Amount Paid</span>
                <strong className="text-[#C4654A]">NPR {state.booking?.totalAmount?.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A5C45]">eSewa Ref #</span>
                <strong className="text-[#2C1810] font-mono">{state.booking?.paymentRef || "—"}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A5C45]">Status</span>
                <strong className="text-[#4EA336]">PAID</strong>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-block mt-6 w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-[#C4654A] hover:bg-[#8B2E1A] transition-all"
            >
              View Booking in Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function EsewaSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
          <p className="text-sm text-[#7A5C45]">Loading...</p>
        </div>
      }
    >
      <EsewaSuccessContent />
    </Suspense>
  );
}
