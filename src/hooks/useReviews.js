"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as reviewApi from "@/features/review/api";
import { useAuthStore } from "@/store/authStore";

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApi.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["reviewableBookings"] });
      queryClient.invalidateQueries({ queryKey: ["homestayReviews"] });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
    },
  });
}

export function useHomestayReviews(homestayId) {
  return useQuery({
    queryKey: ["homestayReviews", homestayId],
    queryFn: () => reviewApi.getHomestayReviews(homestayId),
    enabled: Boolean(homestayId),
    staleTime: 60 * 1000,
  });
}

export function useReviewableBookings() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["reviewableBookings"],
    queryFn: reviewApi.getReviewableBookings,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

export function useMyReviews() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["myReviews"],
    queryFn: reviewApi.getMyReviews,
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}
