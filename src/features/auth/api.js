import api from "@/lib/axios";

export async function register(data) {
  const res = await api.post("/auth/register", data);
  return res.data;
}

export async function login(data) {
  const res = await api.post("/auth/login", data);
  return res.data;
}

export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data;
}

export async function updateMe(data) {
  const res = await api.patch("/auth/me", data);
  return res.data;
}

export async function changePassword(data) {
  const res = await api.patch("/auth/change-password", data);
  return res.data;
}

export async function logout() {
  const res = await api.post("/auth/logout");
  return res.data;
}

export async function refresh() {
  const res = await api.post("/auth/refresh");
  return res.data;
}

// Password Reset & Recovery
export async function forgotPassword(data) {
  const res = await api.post("/auth/forgot-password", data);
  return res.data;
}

export async function verifyOtp(data) {
  const res = await api.post("/auth/verify-otp", data);
  return res.data;
}

export async function resetPassword(data) {
  const res = await api.post("/auth/reset-password", data);
  return res.data;
}
