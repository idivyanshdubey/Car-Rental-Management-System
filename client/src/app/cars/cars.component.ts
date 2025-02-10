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
      rentalStartDate: ['', Validators.required],
      rentalEndDate: ['', Validators.required]
    });
  }
 
  private loadCars(): void {
    this.httpService.getCars().subscribe(
      (cars) => (this.cars = cars),
      (error) => console.error('Error fetching cars:', error)
    );
  }
 
  bookCar(carId: number): void {
    if (this.itemForm.valid) {
      const userId = this.authService.getUserId(); // Retrieve user ID from AuthService
      const bookingDetails = {
        rentalStartDate: this.itemForm.value.rentalStartDate,
        rentalEndDate: this.itemForm.value.rentalEndDate
      };
 
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
 