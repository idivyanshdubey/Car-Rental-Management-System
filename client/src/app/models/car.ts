import { Booking } from "./bookings";
import { CarCategory } from "./carCategory";

export interface Car {
  id: number;
  make: string;
  model: string;
  manufactureYear: string;
  registrationNumber: string;
  status: 'available' | 'booked' | 'pending';
  rentalRatePerDay: number;
  category: CarCategory;
  bookings?: Booking[];
}