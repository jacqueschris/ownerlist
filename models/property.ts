import { z } from "zod";

export const propertySchema = z.object({
  listingType: z.enum(["buy", "rent"]),
  propertyType: z.string().min(2),
  title: z.string().min(3),
  price: z.string().min(1),
  bedrooms: z.string().min(1),
  bathrooms: z.string().min(1),
  size: z.string().min(1),
  location: z.string().min(3),
  description: z.string().min(10),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  availableDays: z.array(z.date()).optional(),
  position: z.tuple([z.number(), z.number()]),
  owner: z.string().min(3),
});