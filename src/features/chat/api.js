import api from "@/lib/axios";

export async function sendChatMessage({ message, sessionId }) {
  const res = await api.post("/chat/message", { message, sessionId });
  return res.data;
}

export async function createChatSession(title) {
  const res = await api.post("/chat/sessions", { title });
  return res.data;
}

export async function getChatSessions() {
  const res = await api.get("/chat/sessions");
  return res.data;
}

export async function getSessionMessages(sessionId) {
  const res = await api.get(`/chat/sessions/${sessionId}`);
  return res.data;
}

export async function deleteChatSession(sessionId) {
  const res = await api.delete(`/chat/sessions/${sessionId}`);
  return res.data;
}
