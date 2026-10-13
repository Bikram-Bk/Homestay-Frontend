"use client";

import { useState } from "react";
import Link from "next/link";
import { useHomestays } from "@/hooks/useHomestays";
import BookingModal from "@/features/booking/BookingModal";
import Navbar from "@/features/landing/sections/Navbar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function HomestaysPage() {
  const [selected, setSelected] = useState(null);

  // Rich search box state 
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("All");
  const [guestsFilter, setGuestsFilter] = useState("All");
  const [priceRange, setPriceRange] = useState("All");

  // Extra filters kept on this page
  const [roomType, setRoomType] = useState("All");
  const [mealsIncluded, setMealsIncluded] = useState("All");
  const [sortBy, setSortBy] = useState("");

  const { data, isLoading } = useHomestays({ limit: 50 });
  const homestays = data?.data || [];

  const villageOptions = [
    "All",
    ...Array.from(new Set(homestays.map((h) => h.village).filter(Boolean))),
  ];

  const filtered = homestays
    .filter((room) => {
      if (selectedVillage !== "All") {
        const v = (room.village || "").toLowerCase();
        const reg = (room.region || "").toLowerCase();
        const target = selectedVillage.toLowerCase();
        if (!v.includes(target) && !reg.includes(target)) return false;
      }
      if (guestsFilter !== "All") {
        if (room.capacity && room.capacity < Number(guestsFilter)) return false;
      }
      const price = room.pricePerNight ?? 2000;
      if (priceRange === "under2000" && price > 2000) return false;
      if (priceRange === "2000-3500" && (price < 2000 || price > 3500)) return false;
      if (priceRange === "above3500" && price <= 3500) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const hay = [room.name, room.village, room.hostName, room.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (roomType !== "All" && room.roomType !== roomType) return false;
      if (mealsIncluded !== "All" && room.mealsIncluded !== mealsIncluded) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.pricePerNight - b.pricePerNight;
      if (sortBy === "price_desc") return b.pricePerNight - a.pricePerNight;
      if (sortBy === "capacity") return b.capacity - a.capacity;
      return 0;
    });

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedVillage !== "All" ||
    guestsFilter !== "All" ||
    priceRange !== "All" ||
    roomType !== "All" ||
    mealsIncluded !== "All" ||
    sortBy !== "";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedVillage("All");
    setGuestsFilter("All");
    setPriceRange("All");
    setRoomType("All");
    setMealsIncluded("All");
    setSortBy("");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16" style={{ backgroundColor: "#FAF6F0" }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link href="/" className="text-xs font-semibold text-[#C4654A] hover:underline">
          ← Back to Home
        </Link>
        <h1 className="font-serif text-3xl font-bold text-[#2C1810] mt-3">
          Browse Homestays
        </h1>
        <p className="text-sm text-[#7A5C45] mt-1">
          Discover authentic family-run stays across Nepal
        </p>

        <div className="bg-white rounded-3xl border border-[#E0CAB0] shadow-[0_10px_35px_-5px_rgba(44,24,16,0.08)] overflow-hidden mt-6 mb-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#C4654A] via-[#D4A017] to-[#8B2E1A]" />
          <div className="flex flex-wrap items-center justify-between px-6 pt-5 pb-3 border-b border-[#F4EBE1] gap-3">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#FAF0E6] text-[#C4654A] flex items-center justify-center font-bold text-base shadow-sm">🏡</span>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C1810]">Find Your Ideal Village Stay</h3>
                <p className="text-xs text-[#7A5C45]">Search across verified community homes by village, guests, or price</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EC] border border-[#EADBCC] text-xs font-semibold text-[#6B4226]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              {filtered.length} {filtered.length === 1 ? "Homestay" : "Homestays"} Available
            </span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
              <div className="rounded-xl p-3 bg-[#FAF8F5] border border-[#E2D8CC] focus-within:bg-white focus-within:border-[#C4654A]">
                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7A5C45] mb-1">
                  🔍 Search Stays
                </label>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Homestay or host..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
              <div className="rounded-xl p-3 bg-[#FAF8F5] border border-[#E2D8CC]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A5C45] mb-1 block">📍 Village Destination</label>
                <Select value={selectedVillage} onValueChange={setSelectedVillage}>
                  <SelectTrigger className="border-0 bg-transparent px-0 py-0"><SelectValue placeholder="Village" /></SelectTrigger>
                  <SelectContent>
                    {villageOptions.map((v) => (
                      <SelectItem key={v} value={v}>{v === "All" ? "All Villages & Regions" : v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-xl p-3 bg-[#FAF8F5] border border-[#E2D8CC]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A5C45] mb-1 block">👥 Guests</label>
                <Select value={guestsFilter} onValueChange={setGuestsFilter}>
                  <SelectTrigger className="border-0 bg-transparent px-0 py-0"><SelectValue placeholder="Guests" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Any Number of Guests</SelectItem>
                    <SelectItem value="1">1+ Guest</SelectItem>
                    <SelectItem value="2">2+ Guests</SelectItem>
                    <SelectItem value="4">4+ Guests (Family)</SelectItem>
                    <SelectItem value="6">6+ Guests (Group)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-xl p-3 bg-[#FAF8F5] border border-[#E2D8CC]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A5C45] mb-1 block">🏷️ Budget / Night</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="border-0 bg-transparent px-0 py-0"><SelectValue placeholder="Price" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Price Ranges</SelectItem>
                    <SelectItem value="under2000">Under NPR 2,000</SelectItem>
                    <SelectItem value="2000-3500">NPR 2,000 – 3,500</SelectItem>
                    <SelectItem value="above3500">Above NPR 3,500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Extra filters kept on this page */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="rounded-xl p-3 bg-[#FAF8F5] border border-[#E2D8CC]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A5C45] mb-1 block">🛏️ Room Type</label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger className="border-0 bg-transparent px-0 py-0"><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Any Room Type</SelectItem>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                    <SelectItem value="SHARED">Shared</SelectItem>
                    <SelectItem value="FAMILY">Family</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-xl p-3 bg-[#FAF8F5] border border-[#E2D8CC]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A5C45] mb-1 block">🍽️ Meals</label>
                <Select value={mealsIncluded} onValueChange={setMealsIncluded}>
                  <SelectTrigger className="border-0 bg-transparent px-0 py-0"><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Any Meals</SelectItem>
                    <SelectItem value="BREAKFAST">Breakfast</SelectItem>
                    <SelectItem value="BREAKFAST_DINNER">Breakfast & Dinner</SelectItem>
                    <SelectItem value="ALL_MEALS">All Meals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-xl p-3 bg-[#FAF8F5] border border-[#E2D8CC]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A5C45] mb-1 block">↕️ Sort By</label>
                <Select value={sortBy || "default"} onValueChange={(v) => setSortBy(v === "default" ? "" : v)}>
                  <SelectTrigger className="border-0 bg-transparent px-0 py-0"><SelectValue placeholder="Default" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Newest First</SelectItem>
                    <SelectItem value="price_asc">Price: Low → High</SelectItem>
                    <SelectItem value="price_desc">Price: High → Low</SelectItem>
                    <SelectItem value="capacity">Capacity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#F4EBE1]">
              {isFiltered && (
                <button
                  onClick={handleResetFilters}
                  className="ml-auto text-xs font-semibold text-[#C4654A] hover:text-[#8B2E1A] py-1 px-2.5 rounded-lg hover:bg-[#FAF0E6]"
                >
                  ✕ Reset all filters
                </button>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <p className="mt-10 text-sm text-[#7A5C45] animate-pulse">Loading homestays...</p>
        ) : filtered.length === 0 ? (
          <p className="mt-10 text-sm text-[#7A5C45]">No homestays match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((h) => (
              <div key={h.id} className="bg-white rounded-3xl overflow-hidden border border-[#E8DDD1] shadow-sm hover:shadow-lg transition-all">
                <img
                  src={h.images?.[0] || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80"}
                  alt={h.name}
                  className="h-44 w-full object-cover"
                />
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#C4654A]">📍 {h.village}, {h.region}</p>
                  <h3 className="font-serif text-lg font-bold text-[#2C1810] mt-1">{h.name}</h3>
                  <p className="text-xs text-[#7A5C45] mt-1">
                    ⭐ {h.averageRating ?? "New"} ({h.reviewCount ?? 0} reviews) • {h.capacity} guests • {h.mealsIncluded}
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#C4654A]">NPR {h.pricePerNight?.toLocaleString()}/night</p>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/homestays/${h.slug || h.id}`} className="flex-1 text-center py-2 rounded-xl text-xs font-semibold border border-[#E8DDD1] text-[#2C1810] hover:bg-[#FAF6F0]">
                      View Details
                    </Link>
                    <button onClick={() => setSelected(h)} className="flex-1 py-2 rounded-xl text-xs font-semibold text-white" style={{ backgroundColor: "#C4654A" }}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BookingModal homestay={selected} isOpen={Boolean(selected)} onClose={() => setSelected(null)} />
    </div>
    </>
  );
}
