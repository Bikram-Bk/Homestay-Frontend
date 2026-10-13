import api from "@/lib/axios";

export async function createReview(data) {
  const res = await api.post("/reviews", data);
  return res.data;
}

export async function getHomestayReviews(homestayId, page = 1, limit = 10) {
  const res = await api.get(`/reviews/homestay/${homestayId}`, {
    params: { page, limit },
  });
  return res.data;
}

export async function getReviewableBookings() {
  const res = await api.get("/reviews/reviewable");
  return res.data;
}

export async function getMyReviews() {
  const res = await api.get("/reviews/my");
  return res.data;
}
