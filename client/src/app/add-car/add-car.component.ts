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
export class AddCarComponent implements OnInit{
 
  itemForm: FormGroup;
  carCategories: any[] = [];
  showError: boolean = false;
  errorMessage: string = '';
  showMessage: boolean = false;
  responseMessage: string = '';
  registrationNumber:string='';
  category: number| null = null;
 
  constructor(private formBuilder: FormBuilder, private httpService: HttpService) {
    this.itemForm = this.formBuilder.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      manufactureYear: ['', Validators.required],
      status: ['', Validators.required],
      rentalRatePerDay: [0, Validators.required],
      registrationNumber:['',Validators.required]
    });
  }
 
  ngOnInit(): void {
    this.getCarCategories();
  }
 
  getCarCategories() {
    console.log('in get car categories');
    this.httpService.getAllCategories().subscribe(
      (data: any) => {
        console.log(data);
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
      // const carCategory = this.carCategories.filter((cat) => {
      //   return cat.id === this.category;
      // });
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
    }else{
      this.errorMessage="Form values invalid";
      this.showError=true;
    }
  }
} //todo: complete missing code.