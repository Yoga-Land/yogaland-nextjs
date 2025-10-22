import { z } from 'zod';

export const adSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
//   type: z.enum(['pre-roll', 'mid-roll'], {
//     errorMap: () => ({ message: 'Type must be pre-roll or mid-roll' }),
//   }),
  vastUrl: z.string().url('Invalid VAST URL'),
  active: z.boolean().default(true),
});

export type AdInput = z.infer<typeof adSchema>;
