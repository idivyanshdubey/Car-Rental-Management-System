import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {
  itemForm!: FormGroup;
  cars: any[] = [];
  filteredCars: any[] = [];
  userBookings: any[] = [];
  userId: number | null = null;

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
      rentalStartDate: ["", Validators.required],
      rentalEndDate: ["", Validators.required]
    });
  }

  private loadCars(): void {
    this.httpService.getCars().subscribe(
      (cars) => {
        this.cars = cars;
        this.filterCars();
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

    // Filter out available cars
    let availableCars = this.cars.filter(car => car.status.toLowerCase() === "available");

    // Combine booked, pending, and available cars
    this.filteredCars = [
      ...this.userBookings.filter(b => b.status === "Booked"),
      ...this.userBookings.filter(b => b.status === "Pending"),
      ...availableCars
    ];
  }

  // filterCars(): void {
  //   const startDate = new Date(this.itemForm.value.rentalStartDate);
  //   const endDate = new Date(this.itemForm.value.rentalEndDate);
  
  //   // Extract booked and pending cars from userBookings by matching carId with cars
  //   const bookedCars = this.userBookings
  //     .filter(b => b.status === "Booked")
  //     .map(b => {
  //       const car = this.cars.find(car => car.id === b.car.id);
  //       return car ? { ...car, statusMessage: "Booked" } : null;
  //     })
  //     .filter(car => car !== null); // Remove null values
      
  //   console.log(bookedCars[0].id);
  //   const pendingCars = this.userBookings
  //     .filter(b => b.status === "Pending")
  //     .map(b => {
  //       const car = this.cars.find(car => car.id === b.car.id);
  //       return car ? { ...car, statusMessage: "Pending for acceptance" } : null;
  //     })
  //     .filter(car => car !== null); // Remove null values
  
  //   // Filter available cars
  //   const availableCars = this.cars.filter(car => 
  //     car.status.toLowerCase() === "available" && 
  //     !this.userBookings.some(b => b.carId === car.id) // Exclude already booked cars
  //   );
  
  //   // Combine the cars: Booked → Pending → Available
  //   this.filteredCars = [...bookedCars, ...pendingCars, ...availableCars];
  // }

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
}