import { Booking } from "./bookings";

export interface Payment {
  id: number;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  paymentStatus: string;
  booking: Booking;
}