"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hooks/useAuth";

const TABS = [
  { label: "My Bookings", href: "/dashboard" },
  { label: "My Reviews", href: "/dashboard/reviews" },
  { label: "Notifications", href: "/dashboard/notifications" },
  { label: "Profile", href: "/dashboard/profile" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const logoutMutation = useLogout();

  return (
    <header className="border-b bg-[#2C1810] text-[#FAF6F0] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 transition-transform group-hover:scale-105"
          >
            <polygon points="16,3 29,26 3,26" fill="#C4654A" />
            <polygon points="16,3 22,14 16,11 10,14" fill="#FAF6F0" opacity="0.9" />
            <polygon points="23,16 30,28 16,28" fill="#8B2E1A" />
            <polygon points="9,16 16,28 2,28" fill="#6B2212" />
          </svg>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-lg font-bold tracking-tight text-[#FAF6F0]">
              Homestay
            </span>
            <span
              className="font-sans text-[#D4A017] uppercase tracking-[0.25em]"
              style={{ fontSize: "9px" }}
            >
              NEPAL
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  active
                    ? "bg-[#C4654A] text-[#FAF6F0] shadow-sm"
                    : "text-[rgba(250,246,240,0.7)] hover:text-[#FAF6F0] hover:bg-white/5"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Area */}
        <div className="flex items-center gap-3">
          <Link
            href="/#rooms"
            className="hidden sm:inline-block text-xs uppercase tracking-wider font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: "#D4A017" }}
          >
            Explore Homestays
          </Link>
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 transition-colors cursor-pointer text-[#FAF6F0]"
          >
            {logoutMutation.isPending ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Tabs Bar */}
      <div className="md:hidden border-t border-white/10 px-4 py-2 flex items-center justify-around gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                active
                  ? "bg-[#C4654A] text-[#FAF6F0]"
                  : "text-[rgba(250,246,240,0.7)] hover:text-[#FAF6F0]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
