

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HttpService } from '../../services/http.service';

export interface Category{
  id: number;
}

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})
export class AddCarComponent implements OnInit {
  itemForm: FormGroup;
  carCategories: any[] = [];
  cars: any[] = [];
  isEditMode: boolean = false;
  showError: boolean = false;
  errorMessage: string = '';
  showMessage: boolean = false;
  responseMessage: string = '';
  selectedCarId: number = 0;

  constructor(private formBuilder: FormBuilder, private httpService: HttpService) {
    this.itemForm = this.formBuilder.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      manufactureYear: ['', [Validators.required,Validators.pattern('^[0-9]{4}$'),Validators.min(2015), Validators.max(this.getCurrentYear())]],
      status: ['', Validators.required],
      rentalRatePerDay: [null, [Validators.required, this.negativeValueValidator]],
      registrationNumber: ['', [Validators.required, Validators.pattern('^[A-Z]{2} [0-9]{2} [A-Z]{1,2} [0-9]{4}$')]],
      category: [null, Validators.required]
    });
  }
  getCurrentYear(): number {
    const currentDate = new Date();
    return currentDate.getFullYear();
  }
    negativeValueValidator(control: AbstractControl): ValidationErrors | null {
        if (control.value < 0) {
          return { negativeValue: true };
        }
        return null;
      }  
    

  ngOnInit(): void {
    this.getCarCategories();
    this.getCars();
  }

  getCarCategories() {
    this.httpService.getAllCategories().subscribe(
      (data: any) => {
        this.carCategories = data;
      },
      error => {
        this.showError = true;
        this.errorMessage = "Error fetching car categories.";
      }
    );
  }

  getCars() {
    this.httpService.getAllCars().subscribe(
      (data: any) => {
        this.cars = data;
      },
      error => {
        this.showError = true;
        this.errorMessage = "Error fetching cars.";
      }
    );
  }

  onSubmit() {
    if (this.itemForm.valid) {
      if (this.isEditMode && this.selectedCarId !== null) {
        this.updateCar();
      } else {
        this.addCar();
      }
    } 
    else {
      this.showTemporaryMessage(true, "Form values are invalid");
    }

  }

  addCar() {
    let category: Category;
    category = {
      id: this.itemForm.get('category')?.value
    };
    this.itemForm.get('category')?.setValue(category);

    this.httpService.createCar(this.itemForm.value).subscribe(
      response => {
        this.showTemporaryMessage(false, "Car added successfully!");
        this.itemForm.reset();
        this.getCars();
      },
      error => {
        if(error.status == 409) {
          this.showTemporaryMessage(true, "Registration number already exists");
        } else {
          this.showTemporaryMessage(true, error.error || "Error adding car.");
        }
      }
    );
  }

  editCar(car: any) {
    this.isEditMode = true;
    this.selectedCarId = car.id;
    this.itemForm.patchValue(car);
  }

  updateCar() {
    let category : Category;
    category = {
      id: this.itemForm.get('category')?.value
    }  
    console.log(category.id);
    this.itemForm.get('category')?.setValue(category);
    this.httpService.updateCar(this.itemForm.value, this.selectedCarId).subscribe(
      response => {
        this.showTemporaryMessage(false, "Car updated successfully!");
        this.itemForm.reset();
        this.isEditMode = false;
        this.selectedCarId = 0;
        this.getCars();
      },
      error => {
        this.showTemporaryMessage(true, "Error updating car.");
      }

    );
  }

private showTemporaryMessage(isError: boolean, message: string) {
  if (isError) {
    this.showError = true;
    this.errorMessage = message;
  } else {
    this.showMessage = true;
    this.responseMessage = message;
  }

  // Scroll to message
  setTimeout(() => {
    const element = isError ? 
      document.querySelector('.alert-danger') : 
      document.querySelector('.alert-success');
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);

  // Hide message after 5 seconds
  setTimeout(() => {
    if (isError) {
      this.showError = false;
    } else {
      this.showMessage = false;
    }
  }, 5000);
  }
}