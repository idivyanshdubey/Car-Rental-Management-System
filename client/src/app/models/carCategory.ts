import { Car } from "./car";

export interface CarCategory {
  id: number;
  name: string;
  description: string;
  baseRate: number;
  cars?: Car[];
}
