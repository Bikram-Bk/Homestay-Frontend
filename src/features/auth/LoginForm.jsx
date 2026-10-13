"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema } from "@/lib/schemas";
import { useLogin } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    useAuthStore.getState().hydrate();
    const token =
      typeof window !== "undefined" ? localStorage.getItem("hn_access_token") : null;
    if (useAuthStore.getState().isAuthenticated || Boolean(token)) {
      const redirect = searchParams?.get("redirect");
      router.replace(redirect && redirect.startsWith("/") ? redirect : "/");
    }
  }, [isAuthenticated, router, searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    // Register pachi redirect aako bela email prefill huncha
    defaultValues: { email: searchParams?.get("email") || "", password: "" },
  });

  const onSubmit = (data) => {
    // Success & failure toasts useAuth hook batai handle huncha
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full" noValidate>
      {/* Email */}
      <div>
        <label
          htmlFor="login-email"
          className="block text-xs font-semibold text-[#5C3D28] tracking-wider uppercase mb-1.5"
        >
          Email Address
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
          className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD4C7] text-[#2C1810] text-sm focus:bg-white focus:border-[#C4654A] focus:ring-2 focus:ring-[#C4654A]/20 transition-all outline-none placeholder:text-[#A8988B]"
        />
        {errors.email && (
          <p role="alert" className="text-[#C53030] text-xs mt-1.5 font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="login-password"
            className="text-xs font-semibold text-[#5C3D28] tracking-wider uppercase"
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-[#C4654A] hover:text-[#8B2E1A] transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
            className="w-full px-4 py-3 pr-11 rounded-xl bg-[#FAF8F5] border border-[#DDD4C7] text-[#2C1810] text-sm focus:bg-white focus:border-[#C4654A] focus:ring-2 focus:ring-[#C4654A]/20 transition-all outline-none placeholder:text-[#A8988B]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B796D] hover:text-[#2C1810] p-1.5 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p role="alert" className="text-[#C53030] text-xs mt-1.5 font-medium">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        id="login-submit-btn"
        disabled={isSubmitting || loginMutation.isPending}
        className="w-full py-3.5 px-4 rounded-xl bg-[#C4654A] hover:bg-[#8B2E1A] text-white font-semibold text-sm transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        {isSubmitting || loginMutation.isPending ? "Logging in…" : "Login to Your Account"}
      </button>

      {/* Register link */}
      <p className="text-center text-xs text-[#7A5C45] pt-1">
        New to Homestay Nepal?{" "}
        <Link
          href="/register"
          className="text-[#C4654A] hover:text-[#8B2E1A] font-semibold underline-offset-2 hover:underline transition-colors"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
