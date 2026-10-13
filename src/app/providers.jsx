"use client";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/authStore";
import ChatWidget from "@/features/chat/ChatWidget";

export default function Providers({ children }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#FFF8F2",
            color: "#2C1810",
            border: "1px solid #E0CAB0",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "13px",
            fontFamily: "'Poppins', sans-serif",
            boxShadow: "0 10px 25px rgba(44, 24, 16, 0.12)",
          },
          success: {
            iconTheme: { primary: "#15803D", secondary: "#ECFDF5" },
            style: { borderLeft: "4px solid #15803D" },
          },
          error: {
            iconTheme: { primary: "#C53030", secondary: "#FDF2F0" },
            style: { borderLeft: "4px solid #C53030" },
          },
        }}
      />
      <ChatWidget />
    </QueryClientProvider>
  );
}
