"use client";

import { useQuery } from "@tanstack/react-query";
import * as homestayApi from "@/features/homestay/api";

export function useHomestays(filters = {}) {
  return useQuery({
    queryKey: ["homestays", filters],
    queryFn: () => homestayApi.getHomestays(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHomestay(idOrSlug) {
  return useQuery({
    queryKey: ["homestay", idOrSlug],
    queryFn: () => homestayApi.getHomestay(idOrSlug),
    enabled: Boolean(idOrSlug),
    staleTime: 5 * 60 * 1000,
  });
}
