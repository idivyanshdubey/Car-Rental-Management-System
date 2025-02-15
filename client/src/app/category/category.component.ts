import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
 
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  itemForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
 
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private httpService: HttpService
  ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      baseRate: ['', [Validators.required, Validators.min(0)]]
    });
  }
 
  ngOnInit(): void {}
 
  onSubmit(): void {
    if (this.itemForm.valid) {
      this.httpService.createCategory(this.itemForm.value).subscribe(
        response => {
          this.successMessage = 'Category added successfully';
          this.errorMessage = "";
          console.log('Category added successfully', response);
        },
        error => {
          if(error.status === 409){
            console.log('in error message')
            this.errorMessage = "Car Category name already exists";
            this.successMessage="";
          }
          console.error('Error adding category', error);
        }
      );
    }
  }
}