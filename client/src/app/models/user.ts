import { Booking } from "./bookings";

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  role: 'CUSTOMER' | 'AGENT' | 'ADMINISTRATOR';
  bookings?: Booking[];
}