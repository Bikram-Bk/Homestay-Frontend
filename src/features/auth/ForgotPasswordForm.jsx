"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForgotPassword, useResetPassword } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { showToast, errorMessage } from "@/lib/toast";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const forgotMutation = useForgotPassword();
  const resetMutation = useResetPassword();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    useAuthStore.getState().hydrate();
    const token =
      typeof window !== "undefined" ? localStorage.getItem("hn_access_token") : null;
    if (useAuthStore.getState().isAuthenticated || Boolean(token)) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast.error("Please enter a valid email address.");
      return;
    }

    forgotMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          const msg = data?.message || "Verification code sent to your email!";
          setSuccessMsg(msg);
          showToast.success("Verification code sent to your email 📧");
          const otpVal = data?.data?.devOtp || data?.devOtp;
          if (otpVal) {
            setDevOtp(otpVal);
          }
          setStep(2);
        },
        onError: (err) => {
          showToast.error(
            errorMessage(err, "Failed to send reset code. Please try again.")
          );
        },
      }
    );
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!otp || otp.trim().length !== 6) {
      showToast.error("Please enter the 6-digit OTP code sent to your email.");
      return;
    }

    if (newPassword.length < 6) {
      showToast.error("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast.error("Passwords do not match.");
      return;
    }

    resetMutation.mutate(
      { email, otp: otp.trim(), newPassword },
      {
        onSuccess: (data) => {
          setSuccessMsg(data?.message || "Password reset successfully!");
          showToast.success("Password reset successfully! Please login with your new password ✅");
          setStep(3);
        },
        onError: (err) => {
          showToast.error(
            errorMessage(err, "Invalid OTP or failed to reset password.")
          );
        },
      }
    );
  };

  return (
    <div className="w-full">
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
          <p className="text-xs text-[#7A5C45] text-center leading-relaxed">
            Enter your registered email address and we will send you a 6-digit verification code to reset your password.
          </p>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-[#5C3D28] tracking-wider uppercase mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD4C7] text-[#2C1810] text-sm focus:bg-white focus:border-[#C4654A] focus:ring-2 focus:ring-[#C4654A]/20 transition-all outline-none placeholder:text-[#A8988B]"
            />
          </div>

          <button
            type="submit"
            disabled={forgotMutation.isPending}
            className="w-full py-3.5 px-6 rounded-xl bg-[#C4654A] hover:bg-[#8B2E1A] text-white font-semibold text-sm transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {forgotMutation.isPending ? "Sending OTP..." : "Send Verification Code"}
          </button>

          <p className="text-xs text-center text-[#7A5C45] pt-1">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="text-[#C4654A] hover:text-[#8B2E1A] font-semibold underline-offset-2 hover:underline transition-colors"
            >
              Back to Login
            </Link>
          </p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
          <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-medium text-center space-y-1">
            <p>{successMsg || "Verification code sent to your email!"}</p>
            {devOtp && (
              <p className="font-mono text-xs font-bold text-[#047857]">
                🔑 Dev Mode OTP: <span className="underline tracking-widest">{devOtp}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="otp"
              className="block text-xs font-semibold text-[#5C3D28] tracking-wider uppercase mb-1.5"
            >
              6-Digit OTP Code
            </label>
            <input
              id="otp"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD4C7] text-[#2C1810] text-center tracking-widest text-lg font-mono font-bold focus:bg-white focus:border-[#C4654A] focus:ring-2 focus:ring-[#C4654A]/20 transition-all outline-none placeholder:text-[#A8988B]"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-xs font-semibold text-[#5C3D28] tracking-wider uppercase mb-1.5"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-[#FAF8F5] border border-[#DDD4C7] text-[#2C1810] text-sm focus:bg-white focus:border-[#C4654A] focus:ring-2 focus:ring-[#C4654A]/20 transition-all outline-none placeholder:text-[#A8988B]"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((p) => !p)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B796D] hover:text-[#2C1810] p-1 transition-colors"
              >
                {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold text-[#5C3D28] tracking-wider uppercase mb-1.5"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-[#FAF8F5] border border-[#DDD4C7] text-[#2C1810] text-sm focus:bg-white focus:border-[#C4654A] focus:ring-2 focus:ring-[#C4654A]/20 transition-all outline-none placeholder:text-[#A8988B]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B796D] hover:text-[#2C1810] p-1 transition-colors"
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={resetMutation.isPending}
            className="w-full py-3.5 px-6 rounded-xl bg-[#C4654A] hover:bg-[#8B2E1A] text-white font-semibold text-sm transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {resetMutation.isPending ? "Resetting Password..." : "Set New Password"}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-xs text-center text-[#7A5C45] hover:text-[#C4654A] transition-colors pt-1"
          >
            Didn&apos;t get the code? Request another OTP
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="text-center space-y-5 py-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-2xl text-[#10B981]">
            ✓
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2C1810] mb-1.5">
              Password Reset Complete!
            </h3>
            <p className="text-xs text-[#7A5C45] leading-relaxed">
              Your password has been successfully updated. You can now log in with your new credentials.
            </p>
          </div>

          <Link
            href="/login"
            className="block w-full py-3.5 px-6 rounded-xl bg-[#C4654A] hover:bg-[#8B2E1A] text-white font-semibold text-sm text-center transition-all shadow-sm hover:shadow active:scale-[0.99]"
          >
            Go to Login
          </Link>
        </div>
      )}
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
