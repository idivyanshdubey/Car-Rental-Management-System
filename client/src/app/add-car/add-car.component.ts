import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
 
@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})
export class AddCarComponent{
 
  itemForm: FormGroup;
  carCategories: any[] = [];
  showError: boolean = false;
  errorMessage: string = '';
  showMessage: boolean = false;
  responseMessage: string = '';
  registrationNumber:string='';
 
  constructor(private formBuilder: FormBuilder, private httpService: HttpService) {
    this.itemForm = this.formBuilder.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      manufactureYear: ['', Validators.required],
      Number: ['', Validators.required],
      status: ['', Validators.required],
      rentalRatePerDay: [0, Validators.required],
      category: ['', Validators.required],
      registrationNumber:['',Validators.required]
    });
  }
 
  ngOnInit(): void {
    this.getCarCategories();
  }
 
  getCarCategories() {
    this.httpService.getAllCategories().subscribe(
      (data: any) => {
        this.carCategories = data;
      },
      error => {
        this.showError = true;
        this.errorMessage = "An error occurred while fetching car categories.";
        console.error('Error fetching car categories:', error);
      }
    );
  }
 
  onSubmit() {
    if (this.itemForm.valid) {
      this.httpService.createCar(this.itemForm.value).subscribe(
        (response: any) => {
          this.showMessage = true;
          this.responseMessage = "Car added successfully!";
          this.itemForm.reset();
        },
        error => {
          this.showError = true;
          this.errorMessage = "An error occurred while adding the car.";
          console.error('Error adding car:', error);
        }
      );
    }
  }
} //todo: complete missing code.
