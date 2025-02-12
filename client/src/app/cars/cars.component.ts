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

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCars();
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
        this.filterCars(); // Apply filtering after fetching the data
      },
      (error) => console.error('Error fetching cars:', error)
    );
  }

  filterCars(): void {
    const startDate: Date = new Date(this.itemForm.value.rentalStartDate);
    const endDate: Date = new Date(this.itemForm.value.rentalEndDate);

    if (!startDate || !endDate) {
      this.filteredCars = this.cars.filter(car => car.status.toLowerCase() === "available");
      return;
    }

    this.filteredCars = this.cars.filter(car => {
      const carStatus = car.status.toLowerCase();
      return carStatus === "available" && this.isCarAvailableForDateRange(car, startDate, endDate);
    });
  }

  private isCarAvailableForDateRange(car: any, startDate: Date, endDate: Date): boolean {
    if (!car.bookings || car.bookings.length === 0) return true;

    return !car.bookings.some((booking: any) => {
      const bookedStart = new Date(booking.rentalStartDate);
      const bookedEnd = new Date(booking.rentalEndDate);
      return (startDate <= bookedEnd && endDate >= bookedStart);
    });
  }

  bookCar(carId: number): void {
    if (this.itemForm.valid) {
      const userId = this.authService.getUserId();
      const rentalStartDate: Date = new Date(this.itemForm.value.rentalStartDate);
      const rentalEndDate: Date = new Date(this.itemForm.value.rentalEndDate);
  
      // Format the dates using DatePipe
      const formattedStartDate = this.datePipe.transform(rentalStartDate, 'yyyy-MM-dd HH:mm:ss');
      const formattedEndDate = this.datePipe.transform(rentalEndDate, 'yyyy-MM-dd HH:mm:ss');
  
      // Ensure the formatted dates are not null
      if (!formattedStartDate || !formattedEndDate) {
        console.error('Date formatting failed');
        return;
      }
  
      const bookingDetails = {
        rentalStartDate: formattedStartDate,
        rentalEndDate: formattedEndDate
      };
  
      console.log('Formatted Start Date:', bookingDetails.rentalStartDate);
      console.log('Formatted End Date:', bookingDetails.rentalEndDate);
  
      this.httpService.bookACar(bookingDetails, userId, carId).subscribe(
        (response) => {
          console.log('Car booked successfully', response);
          this.router.navigate(['/']);
        },
        (error) => console.error('Error booking car:', error)
      );
    } else {
      console.warn('Form is invalid');
    }
  }
}