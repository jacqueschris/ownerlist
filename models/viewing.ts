import { z } from 'zod';

export const ViewingStatusSchema = z.enum(['pending', 'approved', 'rejected']);

export const ViewingSchema = z.object({
  id: z.string(),
  sourceUser: z.number(),
  targetUser: z.number(),
  sentResponse: z.boolean(),
  sentInvitation: z.boolean(),
  property: z.string().uuid(),
  date: z.number(), 
  status: ViewingStatusSchema, // Viewing request status
});
