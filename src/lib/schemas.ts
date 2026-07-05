import { z } from "zod";

export const bookingSchema = z.object({
  date: z.string().min(1, "Välj ett datum"),
  startTime: z.string().min(1, "Välj en tid"),
  serviceType: z.enum(
    ["Bad & Tvätt", "Klippning", "Pälsvård", "Kloklippning", "Tassbehandling", "VIP-paket"] as const,
    { error: "Välj en tjänst" }
  ),
  petName: z.string().min(1, "Ange husdjurets namn"),
  petType: z.enum(["Hund", "Katt"] as const, { error: "Välj djurtyp" }),
  petBreed: z.string().optional().default(""),
  ownerName: z.string().min(2, "Ange ditt namn"),
  ownerEmail: z.string().email("Ogiltig e-postadress"),
  ownerPhone: z
    .string()
    .min(8, "Ange telefonnummer")
    .regex(/^[0-9\s\-+()]+$/, "Ogiltigt telefonnummer"),
  message: z.string().optional().default(""),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const loginSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(1, "Ange lösenord"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
