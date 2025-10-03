import { z } from "zod";

// Enums from Prisma schema
export const UserRoleEnum = z.enum(["admin", "tourist", "local_community", "researcher"]);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const MediaTypeEnum = z.enum(["image", "video", "panorama360", "audio"]);
export type MediaType = z.infer<typeof MediaTypeEnum>;

export const BookingStatusEnum = z.enum(["pending", "confirmed", "cancelled"]);
export type BookingStatus = z.infer<typeof BookingStatusEnum>;

/* User */
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1),
  email: z.string().email(),
  hashedPassword: z.string().min(1),
  fullName: z.string().nullable().optional(),
  role: UserRoleEnum.default("tourist"),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type User = z.infer<typeof UserSchema>;

export const RegisterUserRequest = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
    fullName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterUserRequest = z.infer<typeof RegisterUserRequest>;

export const CreateUserRequest = UserSchema.omit({ id: true, createdAt: true, updatedAt: true }).extend({
  password: z.string().min(6),
});
export const UserResponse = UserSchema.omit({ hashedPassword: true });

/* Monastery */
export const MonasterySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  establishedYear: z.number().int().nullable().optional(),
  address: z.string().nullable().optional(),
  geoLatitude: z.number(),
  geoLongitude: z.number(),
  mainImageUrl: z.string().url().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Monastery = z.infer<typeof MonasterySchema>;

export const CreateMonasteryRequest = MonasterySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const MonasteryResponse = MonasterySchema;

/* MonasteryMedia */
export const MonasteryMediaSchema = z.object({
  id: z.string().uuid(),
  monasteryId: z.string().uuid(),
  mediaType: MediaTypeEnum,
  mediaUrl: z.string().url(),
  description: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  createdAt: z.date(),
});
export type MonasteryMedia = z.infer<typeof MonasteryMediaSchema>;

export const CreateMonasteryMediaRequest = MonasteryMediaSchema.omit({
  id: true,
  createdAt: true,
});
export const MonasteryMediaResponse = MonasteryMediaSchema;

/* DigitalDocument */
export const DigitalDocumentSchema = z.object({
  id: z.string().uuid(),
  monasteryId: z.string().uuid(),
  documentType: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  fileUrl: z.string().url(),
  description: z.string().nullable().optional(),
  createdAt: z.date(),
});
export type DigitalDocument = z.infer<typeof DigitalDocumentSchema>;

export const CreateDigitalDocumentRequest = DigitalDocumentSchema.omit({
  id: true,
  createdAt: true,
});
export const DigitalDocumentResponse = DigitalDocumentSchema;

/* Tour */
export const TourSchema = z.object({
  id: z.string().uuid(),
  monasteryId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  durationMinutes: z.number().int().nullable().optional(),
  createdAt: z.date(),
});
export type Tour = z.infer<typeof TourSchema>;

export const CreateTourRequest = TourSchema.omit({
  id: true,
  createdAt: true,
});
export const TourResponse = TourSchema;

/* Event */
export const EventSchema = z.object({
  id: z.string().uuid(),
  monasteryId: z.string().uuid(),
  name: z.string().min(1),
  imageUrl: z.string().min(1),
  description: z.string().nullable().optional(),
  seats: z.number(),
  reserved: z.number(),
  ticketPrice: z.number(),
  startDate: z.date().nullable().optional(),
  endDate: z.date().nullable().optional(),
  recurring: z.boolean().default(false),
  createdAt: z.date(),
});
export type Event = z.infer<typeof EventSchema>;

export const CreateEventRequest = EventSchema.omit({
  id: true,
  createdAt: true,
});
export const EventResponse = EventSchema;

/* Booking */
export const BookingSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  eventId: z.string().uuid().nullable().optional(),
  tourId: z.string().uuid().nullable().optional(),
  bookingDate: z.date(),
  status: BookingStatusEnum.default("pending"),
});
export type Booking = z.infer<typeof BookingSchema>;

export const CreateBookingRequest = BookingSchema.omit({
  id: true,
  bookingDate: true,
});
export const BookingResponse = BookingSchema;

/* Review */
export const ReviewSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  monasteryId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable().optional(),
  createdAt: z.date(),
});
export type Review = z.infer<typeof ReviewSchema>;

export const CreateReviewRequest = ReviewSchema.omit({
  id: true,
  createdAt: true,
});
export const ReviewResponse = ReviewSchema;
