import api from "@/lib/axios";

export async function getMyNotifications(page = 1, limit = 20) {
  const res = await api.get("/notifications", { params: { page, limit } });
  return res.data;
}
export async function markNotificationRead(id) {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data;
}
export async function markAllNotificationsRead() {
  const res = await api.patch("/notifications/read-all");
  return res.data;
}
