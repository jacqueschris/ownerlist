import { z } from "zod";

export const TimeSlotAvailabilitySchema = z.object({
  start: z.string(),
  end: z.string(),
});

export const DayAvailabilitySchema = z.object({
  day: z.string(),
  timeSlots: z.array(TimeSlotAvailabilitySchema),
});

export const CarSpaceSchema = z.object({
  type: z.enum(["garage", "carspace"]),
  capacity: z.number(),
});

export const PropertyOwnerSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
});

export const PropertySchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  location: z.string(),
  description: z.string(),
  propertyType: z.string(),
  bedrooms: z.number(),
  locality: z.string(),
  position: z.array(z.number()), // Assuming it's [lat, lng]
  amenities: z.array(z.string()),
  images: z.array(z.string()),
  owner: z.number(),
  bathrooms: z.number(),
  size: z.number(),
  image: z.string(),
  isFavorite: z.boolean(),
  carSpaces: z.array(CarSpaceSchema),
  availabilitySchedule: z.array(DayAvailabilitySchema),
  listingType: z.enum(["buy", "rent"]),
});