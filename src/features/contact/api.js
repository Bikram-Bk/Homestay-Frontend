import api from "@/lib/axios";

export async function sendBookingRequest(data) {
  const res = await api.post("/contact/booking-request", data);
  return res.data;
}

export async function sendInterestedCandidate(data) {
  const res = await api.post("/contact/interested", data);
  return res.data;
}
