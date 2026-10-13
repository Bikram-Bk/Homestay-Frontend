"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardNav from "@/components/dashboard/DashboardNav";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all"); 
  const { data, isLoading } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllMutation = useMarkAllNotificationsRead();

  const notifications = data?.data || [];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <DashboardNav />

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDD1] shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
                Notifications Center
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D4A017] text-[#2C1810]">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-xs text-[#7A5C45] mt-1 font-sans">
              Stay updated on your booking status, payment receipts, and host updates
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2C1810] text-[#FAF6F0] hover:bg-[#C4654A] transition-colors shadow-sm disabled:opacity-50 cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              {markAllMutation.isPending ? "Marking..." : "Mark All as Read"}
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 border-b border-[#E8DDD1] pb-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-[#2C1810] text-[#FAF6F0]"
                : "text-[#7A5C45] hover:bg-white/80"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              filter === "unread"
                ? "bg-[#C4654A] text-[#FAF6F0]"
                : "text-[#7A5C45] hover:bg-white/80"
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              filter === "read"
                ? "bg-[#2C1810] text-[#FAF6F0]"
                : "text-[#7A5C45] hover:bg-white/80"
            }`}
          >
            Read ({readCount})
          </button>
        </div>

        {/* Content List */}
        {isLoading ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E8DDD1]">
            <p className="text-sm text-[#7A5C45] animate-pulse">
              Loading your notifications...
            </p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E8DDD1] p-8 shadow-sm">
            <span className="text-4xl block mb-3">🔔</span>
            <h3 className="font-serif text-xl font-bold text-[#2C1810]">
              {filter === "unread" ? "No Unread Notifications" : "No Notifications Found"}
            </h3>
            <p className="text-xs text-[#7A5C45] max-w-sm mx-auto mt-2 leading-relaxed">
              {filter === "unread"
                ? "You're all caught up! You have no unread updates at this moment."
                : "You don't have any notifications yet. When you book a stay or receive confirmation, updates will appear here."}
            </p>
            <Link
              href="/#rooms"
              className="inline-block mt-5 py-2.5 px-5 rounded-xl font-semibold text-xs transition-all shadow-sm"
              style={{ backgroundColor: "#C4654A", color: "#FAF6F0" }}
            >
              Explore Homestays
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !n.read
                    ? "bg-white border-[#D4A017]/40 shadow-sm"
                    : "bg-white/80 border-[#E8DDD1]"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
                      !n.read ? "bg-[#FFF8E7] text-[#D4A017]" : "bg-[#FAF6F0] text-[#7A5C45]"
                    }`}
                  >
                    {!n.read ? "🔔" : "✓"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-sm text-[#2C1810]">
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#D4A017] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[#7A5C45] mt-1 leading-relaxed font-sans">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-[#A8988B] mt-1.5 block font-mono">
                      {new Date(n.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={() => markReadMutation.mutate(n.id)}
                    disabled={markReadMutation.isPending}
                    className="self-end sm:self-center text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#E8DDD1] hover:bg-[#FAF6F0] text-[#7A5C45] hover:text-[#2C1810] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
