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
      manufactureYear: ['', [Validators.required,Validators.pattern('^[0-9]{4}$'),Validators.min(2015)]],
      status: ['', Validators.required],
      rentalRatePerDay: [null, [Validators.required, this.negativeValueValidator]],
      registrationNumber: ['', [Validators.required, Validators.pattern('^[A-Z]{2} [0-9]{2} [A-Z]{1,2} [0-9]{4}$')]],
      category: [null, Validators.required]
    });
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
    } else {
      this.showError = true;
      this.errorMessage = "Form values are invalid";
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
        this.showMessage = true;
        this.showError = false;
        this.responseMessage = "Car added successfully!";
        this.itemForm.reset();
        this.getCars();
      },
      error => {
        if(error.status == 409){
          this.showError = true;
          this.showMessage = false;
          this.errorMessage="Registration number already exists";
          console.log("error 409")
        }else{
          this.showError = true;
          this.showMessage = false;
          this.errorMessage = error.error || "Error adding car.";
          console.error("error adding car");
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
        this.showMessage = true;
        this.showError = false;
        this.responseMessage = "Car updated successfully!";
        this.itemForm.reset();
        this.isEditMode = false;
        this.selectedCarId = 0;
        this.getCars();
      },
      error => {
        this.showError = true;
        this.showMessage = false;
        this.errorMessage = "Error updating car.";
      }
    );
  }
}