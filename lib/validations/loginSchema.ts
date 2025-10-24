import { z } from 'zod';

// ✅ Zod validation schema
 export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password is too long"),
});

export  type LoginInput = z.infer<typeof loginSchema>;
