import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import { DatePipe } from '@angular/common';
import { Car } from '../models/car';
import { Booking } from '../models/bookings';


@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {
  itemForm!: FormGroup;
  cars: Car[] = [];
  filteredCars: Car[] = [];
  userBookings: Booking[] = [];
  userId: number | null = null;
  showEndDateError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.userId = this.authService.getUserId();
    this.loadCars();
    this.getAllBookings();
  }

  private initializeForm(): void {
    this.itemForm = this.fb.group({
      rentalStartDate: ["", [Validators.required]],
      rentalEndDate: ["", [Validators.required]]
    });
  }

  private loadCars(): void {
    this.httpService.getCars().subscribe(
      (cars) => {
        this.cars = cars;
      },
      (error) => console.error('Error fetching cars:', error)
    );
  }

  getAllBookings(): void {
    if (!this.userId) return;

    this.httpService.getBookingsByUserId(this.userId).subscribe(
      (bookings) => {
        this.userBookings = bookings.map((booking: any) => ({
          ...booking,
          statusMessage: booking.status === "pending" ? "Pending for acceptance" : "Booked"
        }));

        this.filterCars();
      },
      (error) => console.error('Error fetching bookings:', error)
    );
  }

  filterCars(): void {
    const startDate = new Date(this.itemForm.value.rentalStartDate);
    const endDate = new Date(this.itemForm.value.rentalEndDate);

    this.loadCars();

    // Filter out available cars
    let availableCars = this.cars.filter(car => car.status.toLowerCase() === "available");

    // Combine booked, pending, and available cars
    let userCars : Car[];

    userCars = [
      ...this.userBookings.filter(b => b.status === "Booked").map(b => b.car),
      ...this.userBookings.filter(b => b.status === "Pending").map(b => b.car)
    ]
    this.filteredCars = [
      ...userCars,
      ...availableCars
    ];
  }

  bookCar(carId: number): void {
    if (this.itemForm.valid && this.userId) {
      const rentalStartDate = new Date(this.itemForm.value.rentalStartDate);
      const rentalEndDate = new Date(this.itemForm.value.rentalEndDate);

      const formattedStartDate = this.datePipe.transform(rentalStartDate, 'yyyy-MM-dd HH:mm:ss');
      const formattedEndDate = this.datePipe.transform(rentalEndDate, 'yyyy-MM-dd HH:mm:ss');

      if (!formattedStartDate || !formattedEndDate) {
        console.error('Date formatting failed');
        return;
      }

      const bookingDetails = {
        rentalStartDate: formattedStartDate,
        rentalEndDate: formattedEndDate
      };

      this.httpService.bookACar(bookingDetails, this.userId, carId).subscribe(
        () => {
          console.log('Car booked successfully');
          this.getAllBookings();
        },
        (error) => console.error('Error booking car:', error)
      );
    } else {
      console.warn('Form is invalid');
    }
  }

   checkStartDate(): void {
      if (!this.itemForm.get('rentalStartDate')?.valid) {
        this.showEndDateError = true;
      } else {
        this.showEndDateError = false;
      }
    }

    validateEndDate(control: any): { [key: string]: boolean } | null {
        const startDate = new Date(this.itemForm.get('rentalStartDate')?.value);
        const endDate = new Date(control.value);
    
        if (endDate <= startDate) {
          return { endDateInvalid: true };
        }
        return null;
      }
    
      getNextDay(date: string): string {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        return this.datePipe.transform(nextDay, 'yyyy-MM-dd')!;
      }
    
   
    get todayString(): string {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
      const year = today.getFullYear();
   
      return `${year}-${month}-${day}`;
    }
}