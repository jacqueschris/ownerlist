import { z } from 'zod';

export const ViewingStatusSchema = z.enum(['pending', 'approved', 'rejected']);

export const ViewingSchema = z.object({
  id: z.string(),
  sourceUser: z.number(),
  targetUser: z.number(),
  property: z.string().uuid(),
  date: z.number(), 
  status: ViewingStatusSchema, // Viewing request status
});
