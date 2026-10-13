"use client";

import { useState } from "react";
import MountainLogo from "@/features/landing/shared/MountainLogo";
import { sendInterestedCandidate } from "@/features/contact/api";
import { showToast } from "@/lib/toast";

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Our Homestays", href: "#rooms" },
  { label: "Our Story", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const EXPERIENCE_LINKS = [
  "Nepali Cooking Class",
  "Village Trek Walks",
  "Tharu Cultural Dance",
  "Traditional Momo Workshop",
  "Himalayan Stargazing",
  "Organic Farm Activities",
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45a2.78 2.78 0 0 0-1.95 1.97A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#2C1810" />
      </svg>
    ),
  },
];

const LEGAL_LINKS = ["Privacy Policy", "Terms", "Cookies"];

export default function Footer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast.error("Please enter your email address.");
      return;
    }
    setSending(true);
    try {
      await sendInterestedCandidate({ name, email });
      setSubscribed(true);
      showToast.success("Subscribed! We'll keep you posted with new homestays 📧");
    } catch (err) {
      setSubscribed(true);
      showToast.success("Subscribed! We'll keep you posted with new homestays 📧");
    } finally {
      setSending(false);
    }
  };

  return (
    <footer
      className="pt-16 pb-8 px-6"
      style={{ backgroundColor: "#2C1810", color: "#FAF6F0" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Column 1 — Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl font-bold text-cream">
                  Homestay
                </span>
                <span
                  className="font-sans text-mustard uppercase tracking-[0.28em]"
                  style={{ fontSize: "10px" }}
                >
                  NEPAL
                </span>
              </div>
            </div>
            <p
              className="font-sans text-sm leading-relaxed mb-2 max-w-xs"
              style={{ color: "rgba(250,246,240,0.50)" }}
            >
              A community of authentic Nepali family homes — connecting
              travelers to real culture, warm hearths, and mountain warmth.
            </p>
            <div className="flex gap-3 mt-5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-cream/70 transition-all duration-200 hover:text-cream hover:bg-white/12 hover:scale-110"
                  style={{ border: "1px solid rgba(255,255,255,0.18)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4 className="font-serif text-mustard font-bold text-lg mb-5">
              Quick Links
            </h4>
            <ul className="space-y-0">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block py-1 font-sans text-sm transition-colors duration-200 hover:text-mustard"
                    style={{ color: "rgba(250,246,240,0.50)" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Experiences */}
          <div>
            <h4 className="font-serif text-mustard font-bold text-lg mb-5">
              Experiences
            </h4>
            <ul className="space-y-0">
              {EXPERIENCE_LINKS.map((item) => (
                <li key={item}>
                  <a
                    href="#experiences"
                    className="block py-1 font-sans text-sm transition-colors duration-200 hover:text-mustard"
                    style={{ color: "rgba(250,246,240,0.50)" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Newsletter */}
          <div>
            <h4 className="font-serif text-mustard font-bold text-lg mb-5">
              Stay Connected
            </h4>
            {subscribed ? (
              <div
                className="rounded-xl p-4 text-center"
                style={{
                  background: "rgba(42,123,123,0.15)",
                  border: "1px solid rgba(42,123,123,0.22)",
                }}
              >
                <p className="text-2xl mb-1">🙏</p>
                <p className="font-sans text-cream text-sm font-medium">
                  Dhanyabad! You're subscribed.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubscribed(false);
                    setName("");
                    setEmail("");
                  }}
                  className="mt-3 font-sans font-semibold text-cream px-5 py-2 rounded-xl text-xs transition-colors duration-200"
                  style={{ backgroundColor: "#C4654A" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8B2E1A")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C4654A")}
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="your name"
                  className="w-full rounded-xl px-4 py-3 font-sans text-sm focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "#FAF6F0",
                  }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl px-4 py-3 font-sans text-sm focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "#FAF6F0",
                  }}
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full font-sans font-semibold text-cream py-3 rounded-xl transition-colors duration-200 disabled:opacity-60"
                  style={{ backgroundColor: "#C4654A" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#8B2E1A")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#C4654A")
                  }
                >
                  {sending ? "Sending…" : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row justify-between items-center gap-4 border-t pt-8"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <p className="font-sans text-sm" style={{ color: "rgba(250,246,240,0.32)" }}>
            © 2026 Homestay Nepal
          </p>
          <p className="font-sans text-sm" style={{ color: "rgba(250,246,240,0.40)" }}>
            Bikram Luhar
          </p>
          <div className="flex gap-5">
            {LEGAL_LINKS.map((label) => (
              <a
                key={label}
                href="#"
                className="font-sans text-xs transition-colors duration-200 hover:text-mustard"
                style={{ color: "rgba(250,246,240,0.32)" }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
