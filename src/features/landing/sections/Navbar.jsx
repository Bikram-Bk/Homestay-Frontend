"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import NotificationBell from "@/features/notification/NotificationBell";

const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Rooms", href: "/#rooms" },
  { label: "About", href: "/#about" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, user } = useAuthStore();
  const logoutMutation = useLogout();

  const isHome = pathname === "/";
  const isSolid = !isHome || scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const close = () => setUserMenuOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [userMenuOpen]);

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    setOpen(false);
    logoutMutation.mutate();
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isSolid ? "py-3 shadow-2xl" : "py-5"
      }`}
      style={{
        backgroundColor: isSolid ? "#2C1810" : "transparent",
        boxShadow: isSolid ? "0 4px 30px rgba(44,24,16,0.5)" : "none",
        borderBottom: isSolid ? "1px solid rgba(255,255,255,0.08)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* ── Brand ── */}
        <Link href="/" className="flex items-center gap-3" aria-label="Homestay Nepal Home">
         
          <div className="flex flex-col leading-none">
            <span className="font-serif font-bold text-cream text-xl tracking-wide">
              Homestay
            </span>
            <span
              className="font-sans text-mustard uppercase tracking-[0.28em]"
              style={{ fontSize: "10px" }}
            >
              NEPAL
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-sm tracking-wide transition-colors duration-200"
              style={{ color: "rgba(250,246,240,0.80)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D4A017")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(250,246,240,0.80)")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated && user && <NotificationBell variant="hero" />}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                id="navbar-user-menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen((p) => !p);
                }}
                className="flex items-center gap-2 font-sans text-sm text-cream px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
                style={{ border: "1px solid rgba(255,255,255,0.25)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#D4A017")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)")}
              >
                {/* Avatar circle */}
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs"
                  style={{ backgroundColor: "#C4654A", color: "#FAF6F0" }}
                >
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
                <span className="max-w-[100px] truncate">{user.name?.split(" ")[0]}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl py-2 shadow-2xl z-50"
                  style={{ backgroundColor: "#2C1810", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 font-sans text-sm text-cream hover:text-mustard transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 font-sans text-sm text-cream hover:text-mustard transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    Profile
                  </Link>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} className="my-1" />
                  <button
                    id="navbar-logout-btn"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 font-sans text-sm transition-colors cursor-pointer"
                    style={{ color: "#C4654A" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#8B2E1A")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#C4654A")}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                id="navbar-login-btn"
                className="font-sans text-sm text-cream px-4 py-2 rounded-full transition-all duration-200"
                style={{ border: "1px solid rgba(255,255,255,0.25)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#D4A017")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)")}
              >
                Login
              </Link>
              <Link
                href="/homestays"
                id="navbar-book-now"
                className="font-sans text-sm font-semibold text-cream px-6 py-2.5 rounded-full transition-all duration-200 hover:shadow-xl"
                style={{ backgroundColor: "#C4654A" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8B2E1A")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C4654A")}
              >
                Browse Stays
              </Link>
            </>
          )}
        </div>

        <button
          id="navbar-hamburger"
          className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span
            className="block h-px w-6 transition-all duration-300"
            style={{
              backgroundColor: "#FAF6F0",
              transform: open ? "translateY(3.5px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block h-px w-6 transition-all duration-300"
            style={{
              backgroundColor: "#FAF6F0",
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="block h-px w-6 transition-all duration-300"
            style={{
              backgroundColor: "#FAF6F0",
              transform: open ? "translateY(-3.5px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      <div
        className="lg:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? "calc(100vh - 64px)" : "0",
          backgroundColor: open ? "#F5EDD8" : "transparent",
          backdropFilter: open ? "blur(14px)" : "none",
          borderBottom: open ? "1px solid #E0CAB0" : "none",
        }}
      >
        <div
          className="px-6 pb-8 pt-4 flex flex-col gap-1 overflow-y-auto"
          style={{
            maxHeight: "calc(100vh - 64px)",
            WebkitOverflowScrolling: "touch", 
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="font-sans text-base font-medium py-3 px-3 rounded-md transition-colors hover:bg-black/5"
              style={{ color: "#2C1810" }}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-[#E0CAB0] pt-4 mt-2">
            {isAuthenticated && user ? (
              <>
                {/* Mobile Action Icons Row */}
                <div className="flex items-center justify-around gap-2 py-2">
                  <Link href="/dashboard" onClick={handleLinkClick}>
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-black/5"
                      aria-label="My Bookings"
                      style={{ color: "#2C1810" }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </button>
                  </Link>

                  <NotificationBell variant="hero" />

                  <Link href="/dashboard/profile" onClick={handleLinkClick}>
                    <button
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-opacity hover:opacity-85"
                      style={{ backgroundColor: "#C4654A", color: "#FAF6F0" }}
                      aria-label="Profile"
                    >
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </button>
                  </Link>
                </div>

                {/* Full-width Logout */}
                <button
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="w-full px-5 py-3.5 font-sans text-sm font-semibold rounded-xl mt-3 transition-opacity hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: "#8B2E1A", color: "#FAF6F0" }}
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={handleLinkClick}>
                  <button
                    className="w-full px-5 py-3.5 font-sans text-sm font-semibold rounded-xl transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#C4654A", color: "#FAF6F0" }}
                  >
                    Login
                  </button>
                </Link>
                <Link href="/homestays" onClick={handleLinkClick}>
                  <button
                    id="mobile-book-now"
                    className="w-full px-5 py-3.5 font-sans text-sm font-semibold rounded-xl mt-2.5 transition-colors hover:bg-black/5"
                    style={{ color: "#2C1810", border: "1px solid #E0CAB0" }}
                  >
                    Browse Stays
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
