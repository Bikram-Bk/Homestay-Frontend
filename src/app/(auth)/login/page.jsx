import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "@/features/auth/LoginForm";

export const metadata = {
  title: "Login — Homestay Nepal",
  description: "Login to your Homestay Nepal account to manage bookings and explore authentic Nepali homestays.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center px-4 py-12 bg-[#FAF7F2]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(196, 101, 74, 0.05) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(212, 160, 23, 0.04) 0%, transparent 40%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md my-auto">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 group mb-3">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 transition-transform group-hover:scale-105"
            >
              <polygon points="16,3 29,26 3,26" fill="#C4654A" />
              <polygon points="16,3 22,14 16,11 10,14" fill="#FAF6F0" opacity="0.9" />
              <polygon points="23,16 30,28 16,28" fill="#8B2E1A" />
              <polygon points="9,16 16,28 2,28" fill="#6B2212" />
            </svg>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#2C1810]">
              Homestay <span style={{ color: "#C4654A" }}>Nepal</span>
            </span>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#2C1810] mb-1">
            Welcome Back
          </h1>
          <p className="text-xs tracking-wider uppercase font-sans font-medium text-[#7A5C45]">
            Sign in to manage your homestays & bookings
          </p>
        </div>

        
        <div className="bg-white rounded-2xl p-7 sm:p-9 border border-[#EADBCC] shadow-[0_10px_35px_-4px_rgba(44,24,16,0.07)]">
          <Suspense fallback={<div className="text-center py-6 text-sm text-[#7A5C45]">Loading login form...</div>}>
            <LoginForm />
          </Suspense>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#EFE8DF]" />
            <span className="text-[11px] font-sans text-[#A8988B] tracking-wider uppercase">
              OR
            </span>
            <div className="flex-1 h-px bg-[#EFE8DF]" />
          </div>

          <Link
            href="/#rooms"
            className="block w-full py-2.5 px-4 rounded-xl border border-[#DFD5C7] text-center text-xs font-semibold text-[#6B4226] hover:bg-[#FAF7F2] hover:border-[#C4654A] transition-all"
          >
            Browse stays without logging in
          </Link>
        </div>
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs font-sans text-[#7A5C45] hover:text-[#C4654A] transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
