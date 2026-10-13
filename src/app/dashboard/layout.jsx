"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    useAuthStore.getState().hydrate();
    const token =
      typeof window !== "undefined" ? localStorage.getItem("hn_access_token") : null;
    const isAuthed = useAuthStore.getState().isAuthenticated || Boolean(token);

    if (!isAuthed) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setChecking(false);
    }
  }, [isAuthenticated, pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF6F0] p-6 text-center">
        <div className="w-12 h-12 border-4 border-[#C4654A]/30 border-t-[#C4654A] rounded-full animate-spin mb-4" />
        <h2 className="font-serif text-lg font-bold text-[#2C1810]">
          Verifying your session...
        </h2>
        <p className="text-xs text-[#7A5C45] mt-1 font-sans">
          Taking you to your Homestay Nepal traveler portal
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
