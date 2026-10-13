import toast from "react-hot-toast";

export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
};

export function errorMessage(err, fallback = "Something went wrong. Please try again.") {
  return err?.response?.data?.message || fallback;
}

export function confirmToast(message, onConfirm, confirmLabel = "Yes, confirm") {
  toast(
    (t) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "220px" }}>
        <p style={{ margin: 0, fontWeight: 600, color: "#2C1810", fontSize: "13px" }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: "6px 14px",
              borderRadius: "10px",
              border: "1px solid #DDD4C7",
              background: "#FFFFFF",
              color: "#6B4226",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            No, keep it
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            style={{
              padding: "6px 14px",
              borderRadius: "10px",
              border: "none",
              background: "#C53030",
              color: "#FFFFFF",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    ),
    { duration: 8000 }
  );
}
