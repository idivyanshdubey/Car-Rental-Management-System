import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
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

  private showMessage(message: string, isError: boolean = false): void {
    if (isError) {
      this.errorMessage = message;
      this.successMessage = '';
    } else {
      this.successMessage = message;
      this.errorMessage = '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      if (isError) {
        this.errorMessage = '';
      } else {
        this.successMessage = '';
      }
    }, 5000);
  }

  private loadCars(): void {
    this.httpService.getCars().subscribe(
      (cars) => {
        this.cars = cars;
      },
      (error) => {
        console.error('Error fetching cars:', error);
        this.showMessage('Unable to load cars. Please try again later.', true);
      }
    );
  }

  getAllBookings(): void {
    if (!this.userId) {
      this.showMessage('User authentication required.', true);
      return;
    }

    this.httpService.getBookingsByUserId(this.userId).subscribe(
      (bookings) => {
        this.userBookings = bookings.map((booking: any) => ({
          ...booking,
          statusMessage: booking.status === "pending" ? "Pending for acceptance" : "Booked"
        }));
        this.filterCars();
      },
      (error) => {
        console.error('Error fetching bookings:', error);
        this.showMessage('Unable to load bookings. Please try again later.', true);
      }
    );
  }

  filterCars(): void {
    const startDate = new Date(this.itemForm.value.rentalStartDate);
    const endDate = new Date(this.itemForm.value.rentalEndDate);

    this.loadCars();

    let availableCars = this.cars.filter(car => car.status.toLowerCase() === "available");
    let userCars = [
      ...this.userBookings.filter(b => b.status === "Booked").map(b => b.car),
      ...this.userBookings.filter(b => b.status === "Pending").map(b => b.car)
    ];
    
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
          this.showMessage('Invalid date format. Please try again.', true);
          return;
        }
  
        const bookingDetails = {
          rentalStartDate: formattedStartDate,
          rentalEndDate: formattedEndDate
        };
  
        this.httpService.bookACar(bookingDetails, this.userId, carId).subscribe(
          () => {
            this.showMessage('Booking request sent successfully! Page will refresh in 3 seconds.');
            this.getAllBookings();
            
            setTimeout(() => {
              const baseUrl = window.location.href.split('/proxy/3000')[0] + '/proxy/3000';
              window.location.href = `${baseUrl}/`;
            }, 4000);
          },
          (error) => {
            if (error.status === 400) {
              this.showMessage(error.error, true);
            } else {
              this.showMessage('Unable to book the car. Please try again later.', true);
            }
          }
        );
      } else {
        this.showMessage('Please fill in all required fields correctly.', true);
      }
  }
  

  get todayString(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }
<<<<<<< HEAD
}
=======
}
 
>>>>>>> 97f3277d3da2d6407d13d55c1c09978e47df78cd
