"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/useNotifications";

export default function NotificationBell({ variant = "default" }) {
  const isHero = variant === "hero";
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllMutation = useMarkAllNotificationsRead();

  const notifications = data?.data || [];
  const unread = data?.meta?.unread ?? notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
          isHero
            ? "hover:bg-white/10"
            : "hover:bg-white/10"
        }`}
        aria-label="Notifications"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={isHero ? "#D4A017" : "currentColor"}
          strokeWidth="2"
          className="w-5 h-5"
          style={isHero ? {} : {}}
        >
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 01-3.4 0" />
        </svg>
        {unread > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{ backgroundColor: "#D4A017", color: "#2C1810" }}
          >
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl border border-[#E8DDD1] shadow-xl z-40">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8DDD1]">
            <h4 className="font-serif font-bold text-[#2C1810]">Notifications</h4>
            {unread > 0 && (
              <button
                onClick={() => markAllMutation.mutate()}
                className="text-[10px] uppercase tracking-wider font-semibold text-[#C4654A] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {isLoading ? (
            <p className="text-xs text-[#7A5C45] p-4 animate-pulse">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-xs text-[#7A5C45] p-4 text-center">
              No notifications yet.
            </p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => !n.read && markReadMutation.mutate(n.id)}
                className={`block w-full text-left px-4 py-3 border-b border-[#F2EAE0] last:border-0 hover:bg-[#FAF6F0] transition-colors ${
                  !n.read ? "bg-[#FFF8E7]" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#D4A017" }} />
                  )}
                  <p className="text-xs font-bold text-[#2C1810]">{n.title}</p>
                </div>
                <p className="text-xs text-[#7A5C45] mt-1 leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-[#B89B82] mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </button>
            ))
          )}

          <div className="p-2.5 border-t border-[#E8DDD1] text-center bg-[#FAF6F0]">
            <Link
              href="/dashboard/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-[#C4654A] hover:underline block"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
