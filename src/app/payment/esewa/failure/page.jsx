import Link from "next/link";

export default function EsewaFailurePage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-[#E8DDD1] shadow-sm p-10 text-center">
        <div className="text-5xl">⚠️</div>
        <h1 className="font-serif text-2xl font-bold text-[#2C1810] mt-4">Payment Not Completed</h1>
        <p className="text-sm text-[#7A5C45] mt-2 leading-relaxed">
          Your eSewa payment was cancelled or failed. Don&apos;t worry — your booking is still
          saved with <strong>PENDING</strong> status, so you can retry the payment anytime from
          your dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Link
            href="/dashboard"
            className="py-3 px-6 rounded-xl text-sm font-semibold text-white bg-[#60BB46] hover:bg-[#4EA336] transition-all"
          >
            Retry Payment in Dashboard
          </Link>
          <Link
            href="/#rooms"
            className="py-3 px-6 rounded-xl text-sm font-semibold border border-[#DDD4C7] text-[#6B4226] hover:bg-[#FAF6F0] transition-all"
          >
            Return to Homestays
          </Link>
        </div>
      </div>
    </div>
  );
}
