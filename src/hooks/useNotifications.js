"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as notificationApi from "@/features/notification/api";
import { useAuthStore } from "@/store/authStore";

export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationApi.getMyNotifications(),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, 
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
