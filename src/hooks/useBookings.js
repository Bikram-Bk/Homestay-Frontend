"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as bookingApi from "@/features/booking/api";
import { useAuthStore } from "@/store/authStore";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingApi.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

export function useCheckAvailability(homestayId, { checkIn, checkOut }) {
  return useQuery({
    queryKey: ["availability", homestayId, checkIn, checkOut],
    queryFn: () => bookingApi.checkAvailability(homestayId, { checkIn, checkOut }),
    enabled: Boolean(homestayId && checkIn && checkOut && checkOut > checkIn),
    staleTime: 60 * 1000,
  });
}

export function useMyBookings() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["myBookings"],
    queryFn: bookingApi.getMyBookings,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => bookingApi.cancelBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
  });
}
