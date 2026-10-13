"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMe } from "@/hooks/useAuth";
import { updateMe, changePassword } from "@/features/auth/api";
import { useAuthStore } from "@/store/authStore";
import { showToast, errorMessage } from "@/lib/toast";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const accessToken = useAuthStore((s) => s.accessToken);

  const { data: meData, isLoading } = useMe();
  const currentUser = meData?.data || user;

  const [form, setForm] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setForm({ name: currentUser.name || "", phone: currentUser.phone || "" });
    }
  }, [currentUser?.name, currentUser?.phone]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateMe(form);
      const updated = res?.data || { ...currentUser, ...form };
      setAuth(updated, accessToken);
      showToast.success("Profile updated successfully!");
    } catch (err) {
      showToast.error(errorMessage(err, "Could not update profile. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast.error("New passwords do not match.");
      return;
    }

    setPwSaving(true);
    try {
      await changePassword({ currentPassword, newPassword });
      showToast.success("Password changed successfully! 🔒");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showToast.error(errorMessage(err, "Could not change password. Please try again."));
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF6F0" }}>
      <DashboardNav />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl font-bold text-[#2C1810]">My Profile</h1>
        <p className="text-xs text-[#7A5C45] mt-0.5 mb-8">View and update your account details</p>

        <div className="bg-white rounded-3xl border border-[#E8DDD1] shadow-sm p-8">
          {isLoading ? (
            <p className="text-sm text-[#7A5C45] animate-pulse">Loading profile...</p>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block font-sans text-sm font-medium mb-1.5 text-[#6B4226]">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#E0CAB0] rounded-xl px-4 py-2.5 font-sans text-sm text-[#2C1810] bg-[#FAF6F0] focus:outline-none focus:border-[#C4654A] transition-colors"
                />
              </div>

              <div>
                <label className="block font-sans text-sm font-medium mb-1.5 text-[#6B4226]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={currentUser?.email || ""}
                  disabled
                  className="w-full border border-[#E0CAB0] rounded-xl px-4 py-2.5 font-sans text-sm text-[#7A5C45] bg-[#F0E9DD] cursor-not-allowed"
                />
                <p className="text-xs text-[#7A5C45] mt-1">Email cannot be changed.</p>
              </div>

              <div>
                <label className="block font-sans text-sm font-medium mb-1.5 text-[#6B4226]">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+977 ..."
                  className="w-full border border-[#E0CAB0] rounded-xl px-4 py-2.5 font-sans text-sm text-[#2C1810] bg-[#FAF6F0] focus:outline-none focus:border-[#C4654A] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto font-sans font-semibold text-cream px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-xl text-sm disabled:opacity-60"
                style={{ backgroundColor: "#C4654A" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8B2E1A")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C4654A")}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>
          )}
        </div>

        {/* Change Password */}
        <h2 className="font-serif text-2xl font-bold text-[#2C1810] mt-10 mb-1">Change Password</h2>
        <p className="text-xs text-[#7A5C45] mb-4">Keep your account secure with a strong new password</p>

        <div className="bg-white rounded-3xl border border-[#E8DDD1] shadow-sm p-8">
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <PasswordField
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              show={showCurrent}
              onToggle={() => setShowCurrent((p) => !p)}
            />

            <PasswordField
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              show={showNew}
              onToggle={() => setShowNew((p) => !p)}
              minLength={6}
            />

            <PasswordField
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              show={showConfirm}
              onToggle={() => setShowConfirm((p) => !p)}
              minLength={6}
            />

            <button
              type="submit"
              disabled={pwSaving}
              className="w-full sm:w-auto font-sans font-semibold text-cream px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-xl text-sm disabled:opacity-60"
              style={{ backgroundColor: "#C4654A" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8B2E1A")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C4654A")}
            >
              {pwSaving ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}


const EyeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

function PasswordField({ label, value, onChange, show, onToggle, ...inputProps }) {
  return (
    <div>
      <label className="block font-sans text-sm font-medium mb-1.5 text-[#6B4226]">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
          className="w-full border border-[#E0CAB0] rounded-xl px-4 py-2.5 pr-11 font-sans text-sm text-[#2C1810] bg-[#FAF6F0] focus:outline-none focus:border-[#C4654A] transition-colors"
          {...inputProps}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B796D] hover:text-[#2C1810] p-1 transition-colors"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}
