"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerSchema } from "@/lib/schemas";
import { useRegister } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();
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
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      terms: false,
    },
  });

  const onSubmit = (data) => {
    const { confirmPassword, terms, ...payload } = data;
    registerMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full" noValidate>
      {/* Full Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-xs font-semibold text-[#5C3D28] tracking-wider uppercase mb-1.5"
        >
          Full Name
        </label>
        <input
          id="name"
          placeholder="Bikram Luhar"
          autoComplete="name"
          {...register("name")}
          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD4C7] text-[#2C1810] text-sm focus:bg-white focus:border-[#C4654A] focus:ring-2 focus:ring-[#C4654A]/20 transition-all outline-none placeholder:text-[#A8988B]"
        />
        {errors.name && (
          <p role="alert" className="text-[#C53030] text-xs mt-1 font-medium">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
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
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD4C7] text-[#2C1810] text-sm focus:bg-white focus:border-[#C4654A] focus:ring-2 focus:ring-[#C4654A]/20 transition-all outline-none placeholder:text-[#A8988B]"
        />
        {errors.email && (
          <p role="alert" className="text-[#C53030] text-xs mt-1 font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone (optional) */}
      <div>
        <label
          htmlFor="phone"
          className="block text-xs font-semibold text-[#5C3D28] tracking-wider uppercase mb-1.5"
        >
          Phone Number <span className="text-[#8B796D] normal-case font-normal">(Optional)</span>
        </label>
        <input
          id="phone"
          placeholder="98XXXXXXXX"
          autoComplete="tel"
          {...register("phone")}
          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD4C7] text-[#2C1810] text-sm focus:bg-white focus:border-[#C4654A] focus:ring-2 focus:ring-[#C4654A]/20 transition-all outline-none placeholder:text-[#A8988B]"
        />
        {errors.phone && (
          <p role="alert" className="text-[#C53030] text-xs mt-1 font-medium">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label
            htmlFor="password"
            className="text-xs font-semibold text-[#5C3D28] tracking-wider uppercase"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-xs text-[#7A5C45] hover:text-[#C4654A] transition-colors"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="new-password"
          {...register("password")}
          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD4C7] text-[#2C1810] text-sm focus:bg-white focus:border-[#C4654A] focus:ring-2 focus:ring-[#C4654A]/20 transition-all outline-none placeholder:text-[#A8988B]"
        />
        {errors.password && (
          <p role="alert" className="text-[#C53030] text-xs mt-1 font-medium">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-xs font-semibold text-[#5C3D28] tracking-wider uppercase mb-1.5"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="new-password"
          {...register("confirmPassword")}
          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD4C7] text-[#2C1810] text-sm focus:bg-white focus:border-[#C4654A] focus:ring-2 focus:ring-[#C4654A]/20 transition-all outline-none placeholder:text-[#A8988B]"
        />
        {errors.confirmPassword && (
          <p role="alert" className="text-[#C53030] text-xs mt-1 font-medium">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms checkbox */}
      <div className="flex items-start gap-2.5 pt-1">
        <input
          id="terms"
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-[#DDD4C7] text-[#C4654A] focus:ring-[#C4654A] cursor-pointer accent-[#C4654A]"
          {...register("terms")}
        />
        <label htmlFor="terms" className="text-xs cursor-pointer leading-relaxed text-[#6B4226]">
          I agree to the{" "}
          <span className="text-[#C4654A] font-medium hover:underline">
            Terms of Service
          </span>{" "}
          and authentic homestay guidelines
        </label>
      </div>
      {errors.terms && (
        <p role="alert" className="text-[#C53030] text-xs">
          {errors.terms.message}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || registerMutation.isPending}
        className="w-full py-3.5 px-6 rounded-xl bg-[#C4654A] hover:bg-[#8B2E1A] text-white font-semibold text-sm transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        {isSubmitting || registerMutation.isPending
          ? "Creating your account..."
          : "Create Account"}
      </button>

      {/* Link to login */}
      <p className="text-xs text-center text-[#7A5C45] pt-1">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#C4654A] hover:text-[#8B2E1A] font-semibold underline-offset-2 hover:underline transition-colors"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
