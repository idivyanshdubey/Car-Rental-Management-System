import { Car } from "./car";
import { Payment } from "./payment";
import { User } from "./user";

export interface Booking {
  id: number;
  rentalStartDate: Date;
  rentalEndDate: Date;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  payment: Payment;
  user: User;
  car: Car;
}