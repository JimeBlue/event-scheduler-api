import { z } from "zod";

// validates req.body before it reaches Mongoose, mirroring the same rules as the Event Mongoose schema
export const eventSchema = z.strictObject({
  title: z.string().min(3, "min length is 3 chars").max(255, "max length is 255 chars"),
  description: z.string().min(2, "min length is 2 chars").max(255, "max length is 255 chars").optional(),
  location: z.string().min(2, "min length is 2 chars").max(255, "max length is 255 chars"),
  date: z.iso.datetime({ message: "date must be a valid ISO datetime string" }),
  latitude: z.number().min(-90, "latitude must be between -90 and 90").max(90, "latitude must be between -90 and 90").optional(),
  longitude: z.number().min(-180, "longitude must be between -180 and 180").max(180, "longitude must be between -180 and 180").optional(),
});

export type EventtInput = z.infer<typeof eventSchema>;
