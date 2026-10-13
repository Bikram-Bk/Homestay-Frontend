import { z } from "zod";

// Register
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name minimum 2 characters")
      .max(50, "Name maximum 50 characters"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(6, "Password minimum 6 characters")
      .max(100, "Password maximum 100 characters"),
    confirmPassword: z.string(),
    phone: z
      .string()
      .regex(/^(98|97|96)\d{8}$/, "Invalid Nepali phone number")
      .optional()
      .or(z.literal("")),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Login
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password minimum 6 characters"),
});
