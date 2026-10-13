import api from "@/lib/axios";

export async function createBooking(data) {
  const res = await api.post("/bookings", data);
  return res.data;
}

export async function checkAvailability(homestayId, { checkIn, checkOut }) {
  const res = await api.get(`/homestays/${homestayId}/availability`, {
    params: { checkIn, checkOut },
  });
  return res.data;
}

export async function getMyBookings() {
  const res = await api.get("/bookings/my");
  return res.data;
}

export async function getBookingById(id) {
  const res = await api.get(`/bookings/${id}`);
  return res.data;
}

export async function cancelBooking(id, data = {}) {
  const res = await api.patch(`/bookings/${id}/cancel`, data);
  return res.data;
}

// Initiate eSewa payment for a booking
export async function initiateEsewaPayment(bookingId) {
  const res = await api.post("/payments/esewa/initiate", { bookingId });
  return res.data;
}

// Verify eSewa payment with encoded callback data
export async function verifyEsewaPayment(data) {
  const res = await api.post("/payments/esewa/verify", { data });
  return res.data;
}

// Auto-submit a hidden form to the eSewa gateway
export function submitEsewaForm(payload) {
  if (typeof document === "undefined") return;
  const form = document.createElement("form");
  form.method = "POST";
  form.action = payload.gatewayUrl;

  const fields = {
    amount: payload.amount,
    tax_amount: payload.tax_amount,
    total_amount: payload.total_amount,
    transaction_uuid: payload.transaction_uuid,
    product_code: payload.product_code,
    product_service_charge: payload.product_service_charge,
    product_delivery_charge: payload.product_delivery_charge,
    success_url: payload.success_url,
    failure_url: payload.failure_url,
    signed_field_names: payload.signed_field_names,
    signature: payload.signature,
  };

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
