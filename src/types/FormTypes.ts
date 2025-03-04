import * as z from "zod";
import { TripType } from "./TripTypes";

export const bookingFormSchema = z.object({
  tripType: z.enum(["one-way", "round-trip"] as const, {
    required_error: "Please select a trip type.",
  }),
  origin: z.string({
    required_error: "Please select an origin.",
  }),
  destination: z.string({
    required_error: "Please select a destination.",
  }),
  departureDate: z.date({
    required_error: "Please select a departure date.",
  }).refine((date) => {
    return date >= new Date(new Date().setHours(0, 0, 0, 0))
  }, {
    message: "Departure date cannot be in the past.",
  }),
  returnDate: z.date().optional().refine((date) => {
    if (!date) return true
    return date >= new Date(new Date().setHours(0, 0, 0, 0))
  }, {
    message: "Return date cannot be in the past.",
  }),
}).refine((data) => {
  if (data.tripType === "round-trip" && !data.returnDate) {
    return false
  }
  return true
}, {
  message: "Return date is required for round-trip.",
  path: ["returnDate"],
}).refine((data) => {
  if (data.tripType === "round-trip" && data.returnDate && data.departureDate > data.returnDate) {
    return false
  }
  return true
}, {
  message: "Return date must be same or later than departure date.",
  path: ["returnDate"],
});


export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export interface FormattedBookingFormValues {
  tripType: TripType;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
}
