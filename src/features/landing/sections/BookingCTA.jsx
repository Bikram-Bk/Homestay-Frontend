"use client";

import { useState } from "react";
import SectionLabel from "@/features/landing/shared/SectionLabel";
import { ROOMS } from "@/data/landing";
import { useHomestays } from "@/hooks/useHomestays";
import { sendBookingRequest } from "@/features/contact/api";
import { showToast } from "@/lib/toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const INPUT_CLASS =
  "w-full border border-border-warm rounded-xl px-4 py-2.5 font-sans text-brown-deep text-sm bg-cream focus:outline-none focus:border-terracotta transition-colors placeholder:opacity-40";
const LABEL_CLASS = "block font-sans text-sm font-medium mb-1.5" ;

export default function BookingCTA() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    guests: "2",
    room: "",
    dates: "",
    message: "",
  });

  const { data: homestaysData } = useHomestays({ limit: 20 });
  const roomsList =
    homestaysData?.data && homestaysData.data.length > 0
      ? homestaysData.data
      : ROOMS;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await sendBookingRequest(form);
      setSubmitted(true);
      showToast.success("Booking request sent! We'll get back to you soon 🙏");
    } catch (err) {
      showToast.error("Could not send your request. Please try again or reach us on WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="bg-parchment py-14 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <SectionLabel>Book Your Stay</SectionLabel>
          <h2
            className="font-serif text-brown-deep font-bold mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            Begin Your Homestay
            <br />
            <em className="not-italic" style={{ color: "#C4654A" }}>
              Nepal Journey Today
            </em>
          </h2>
          <p className="font-sans max-w-md mx-auto leading-relaxed text-sm" style={{ color: "#7A5C45" }}>
            Send us your preferred dates and village — we'll confirm within 24 hours.
            No bots, no systems — just Bikram and our host families.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* LEFT — Form */}
          <div className="lg:col-span-3 h-full">
            {submitted ? (
              <div
                className="rounded-2xl p-6 sm:p-10 text-center h-full flex flex-col justify-center"
                style={{
                  background: "rgba(42,123,123,0.10)",
                  border: "1px solid rgba(42,123,123,0.22)",
                }}
              >
                <p className="text-5xl mb-4">🙏</p>
                <h3 className="font-serif text-brown-deep text-2xl font-bold mb-3">
                  Namaste! We received your request.
                </h3>
                <p className="font-sans leading-relaxed" style={{ color: "#7A5C45" }}>
                  Bikram Luhar will personally review your request and respond within 24 hours.
                  May your Homestay Nepal journey be filled with warmth and unforgettable memories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      fullName: "",
                      email: "",
                      phone: "",
                      guests: "2",
                      room: "",
                      dates: "",
                      message: "",
                    });
                  }}
                  className="mt-6 font-sans font-semibold text-cream px-6 py-2.5 rounded-xl transition-all duration-200 hover:shadow-xl text-sm"
                  style={{ backgroundColor: "#C4654A" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8B2E1A")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C4654A")}
                >
                  Send Another Booking Request
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-card-warm rounded-2xl p-6 shadow-sm border border-border-warm space-y-4 h-full"
              >
                {/* Row 1 */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className={LABEL_CLASS} style={{ color: "#6B4226" }}>
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      placeholder="Your full name"
                      value={form.fullName}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={LABEL_CLASS} style={{ color: "#6B4226" }}>
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className={LABEL_CLASS} style={{ color: "#6B4226" }}>
                      Phone / WhatsApp
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={form.phone}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="guests" className={LABEL_CLASS} style={{ color: "#6B4226" }}>
                      Guests
                    </label>
                    <Select
                      value={form.guests}
                      onValueChange={(v) => setForm((prev) => ({ ...prev, guests: v }))}
                    >
                      <SelectTrigger id="guests" aria-label="Guests">
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} guest{n > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Preferred Room */}
                <div>
                  <label htmlFor="room" className={LABEL_CLASS} style={{ color: "#6B4226" }}>
                    Preferred Room
                  </label>
                  <Select
                    value={form.room}
                    onValueChange={(v) => setForm((prev) => ({ ...prev, room: v === "any" ? "" : v }))}
                  >
                    <SelectTrigger id="room" aria-label="Preferred Room">
                      <SelectValue placeholder="Any available room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any available room</SelectItem>
                      {roomsList.map((r) => (
                        <SelectItem key={r.id} value={r.name}>
                          {r.name}{r.priceNPR || r.pricePerNight ? ` — NPR ${(r.priceNPR ?? r.pricePerNight).toLocaleString()}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dates */}
                <div>
                  <label htmlFor="dates" className={LABEL_CLASS} style={{ color: "#6B4226" }}>
                    Arrival &amp; Departure Dates
                  </label>
                  <input
                    id="dates"
                    name="dates"
                    type="text"
                    placeholder="e.g. Nov 8 – Nov 15, 2026"
                    value={form.dates}
                    onChange={handleChange}
                    className={INPUT_CLASS}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className={LABEL_CLASS} style={{ color: "#6B4226" }}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Tell us about your trip, dietary needs, or any questions…"
                    value={form.message}
                    onChange={handleChange}
                    className={INPUT_CLASS}
                    style={{ resize: "none" }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full font-sans font-semibold text-cream py-3 rounded-xl transition-all duration-200 hover:shadow-xl text-base disabled:opacity-60"
                  style={{ backgroundColor: "#C4654A" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8B2E1A")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C4654A")}
                >
                  {sending ? "Sending…" : "Send Booking Request 🙏"}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT — Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-5 h-full">
            {/* WhatsApp card */}
            <div className="rounded-2xl p-5 flex-1" style={{ backgroundColor: "#25D366" }}>
              <div className="flex items-center gap-3 mb-2">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.126.558 4.116 1.533 5.845L0 24l6.33-1.511A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.011-1.37l-.36-.214-3.73.89.934-3.62-.236-.373A9.8 9.8 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182c5.422 0 9.818 4.396 9.818 9.818 0 5.422-4.396 9.818-9.819 9.818z" />
                </svg>
                <h3 className="font-sans font-bold text-white text-base">
                  Chat on WhatsApp
                </h3>
              </div>
              <p className="font-sans text-xs text-white/80 leading-relaxed mb-3">
                Have a quick question? We respond personally —
                usually within minutes during Nepal daylight hours.
              </p>
              <a
                href="https://wa.me/9779749315184?text=Namaste!%20I%27m%20interested%20in%20booking%20a%20homestay%20with%20Homestay%20Nepal."
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white font-sans font-bold text-center py-3 rounded-xl transition-opacity duration-200 hover:opacity-90"
                style={{ color: "#25D366" }}
              >
                +977 974 931 5184
              </a>
            </div>

            {/* Location card */}
            <div className="bg-card-warm border border-border-warm rounded-2xl p-5 flex-1">
              <h3 className="font-serif text-brown-deep text-xl font-bold mb-3">
                Find Us
              </h3>
              <div className="space-y-2 font-sans text-sm mb-3" style={{ color: "#7A5C45" }}>
                <p>
                  📍 <span className="font-medium" style={{ color: "#2C1810" }}>Homestay Nepal</span>
                  <br />
                  <span className="pl-6 block">Operated across multiple villages — Ghandruk, Bandipur, Sirubari, Chitwan & more</span>
                  <span className="pl-6 block text-xs mt-0.5" style={{ color: "#7A5C45" }}>
                    Founded by Bikram Luhar · Registered in Nepal
                  </span>
                </p>
                <p>✈️ Village transfers arranged from Kathmandu & Pokhara</p>
                <p>🚐 Private pickups available · Price varies by village</p>
              </div>
            </div>

            {/* Hours card */}
            <div className="bg-card-warm border border-border-warm rounded-2xl p-5 flex-1">
              <h3 className="font-serif text-brown-deep text-xl font-bold mb-3">
                Best Time to Reach Us
              </h3>
              <div className="space-y-2 font-sans text-sm mb-3">
                {[
                  ["Nepal Time (NST)", "UTC +5:45"],
                  ["Morning", "6:00 – 9:00 AM NST"],
                  ["Evening", "5:00 – 8:00 PM NST"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span style={{ color: "#7A5C45" }}>{label}</span>
                    <span className="font-medium" style={{ color: "#2C1810" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="font-sans text-xs font-semibold text-terracotta">
                ✓ Responds within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
