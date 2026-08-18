import { z } from "zod";

export const registerSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required"),

  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required"),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(
      /^[0-9]{10}$/,
      "Enter a valid 10-digit phone number"
    ),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter (A-Z)")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter (a-z)")
    .regex(/[0-9]/, "Password must contain at least one number (0-9)")
    .regex(
      /[-@$!%*?&#^()_+={\}[\]:;"'<>,.?/~`|\\]/,
      "Password must contain at least one special character"
    ),
    
  confirm_password: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),

  remember_me: z.boolean().optional(),
});