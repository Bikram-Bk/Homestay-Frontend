"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import * as authApi from "@/features/auth/api";
import { useAuthStore } from "@/store/authStore";
import { showToast, errorMessage } from "@/lib/toast";


// Register
export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (res, variables) => {
      showToast.success("Account created successfully! Please login with your credentials 🙏");
      const email = variables?.email ? `?email=${encodeURIComponent(variables.email)}` : "";
      router.push(`/login${email}`);
    },
    onError: (err) => {
      showToast.error(errorMessage(err, "Registration failed. Please try again."));
    },
  });
}


// Login
export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      const { user, accessToken } = res.data;
      setAuth(user, accessToken);
      showToast.success(`Welcome back, ${user.name}! 🙏`);
      const redirect = searchParams?.get("redirect");
      if (redirect && redirect.startsWith("/")) {
        router.push(redirect);
      } else {
        router.push("/");
      }
    },
    onError: (err) => {
      showToast.error(errorMessage(err, "Login failed. Please try again."));
    },
  });
}


// Me 
export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["me"],
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, 
  });
}

// Logout
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
      showToast.success("Logged out successfully. See you soon!");
      router.push("/login");
    },
    onError: () => {
      logout();
      queryClient.clear();
      showToast.success("Logged out successfully. See you soon!");
      router.push("/login");
    },
  });
}


// Forgot Password & Reset
export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: authApi.resetPassword,
  });
}
