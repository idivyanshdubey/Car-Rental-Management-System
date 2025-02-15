import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
      manufactureYear: ['', Validators.required],
      status: ['', Validators.required],
      rentalRatePerDay: [0, Validators.required],
      registrationNumber: ['', Validators.required],
      category: [null, Validators.required]
    });
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
<<<<<<< HEAD

  addCar() {
    let category : Category;
    category = {
      id: this.itemForm.get('category')?.value
    }  
    console.log(category.id);
    this.itemForm.get('category')?.setValue(category);
    this.httpService.createCar(this.itemForm.value).subscribe(
      response => {
        this.showMessage = true;
        this.responseMessage = "Car added successfully!";
        this.itemForm.reset();
        this.getCars();
      },
      error => {
        this.showError = true;
        this.errorMessage = "Error adding car.";
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
        this.responseMessage = "Car updated successfully!";
        this.itemForm.reset();
        this.isEditMode = false;
        this.selectedCarId = 0;
        this.getCars();
      },
      error => {
        this.showError = true;
        this.errorMessage = "Error updating car.";
      }
    );
  }
}
=======
} //todo: complete missing code.
>>>>>>> 97f3277d3da2d6407d13d55c1c09978e47df78cd
