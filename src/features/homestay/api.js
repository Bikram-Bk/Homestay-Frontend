import api from "@/lib/axios";

export async function getHomestays(params = {}) {
  const res = await api.get("/homestays", { params });
  return res.data;
}

export async function getHomestay(idOrSlug) {
  const res = await api.get(`/homestays/${idOrSlug}`);
  return res.data;
}
