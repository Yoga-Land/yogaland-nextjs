import { z } from 'zod';

export const videoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  thumbnail: z.string().url('Invalid thumbnail URL'),
  videoUrl: z.string().url('Invalid video URL'),
  duration: z.number().positive('Duration must be positive'),
  active: z.boolean().default(true),
  views: z.number().nonnegative('Views cannot be negative').optional(),
});

export type VideoInput = z.infer<typeof videoSchema>;
