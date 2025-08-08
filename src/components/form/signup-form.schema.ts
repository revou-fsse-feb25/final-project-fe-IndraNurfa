import { z } from "zod";

export const signupFormSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    passwordConfirm: z
      .string()
      .min(6, {
        message: "Password confirmation must be at least 6 characters",
      }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export type SignupFormValues = z.infer<typeof signupFormSchema>;
