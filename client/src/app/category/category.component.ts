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
  itemForm: any;
  errorMessage: string = '';
  successMessage: string = '';
  categories: any[] = [];
  filteredCategories: any[] = [];
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  isEditMode = false;
  selectedCategoryId: number | null = null;
 
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private httpService: HttpService
  ) {
    this.initForm();
  }
 
  ngOnInit(): void {
    this.loadCategories();
  }
 
  private showTemporaryMessage(isSuccess: boolean, message: string) {
    if (isSuccess) {
      this.successMessage = message;
      this.errorMessage = '';
    } else {
      this.errorMessage = message;
      this.successMessage = '';
    }
 
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
      this.loadCategories();
    }, 5000);
  }
 
  initForm() {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      baseRate: ['', [Validators.required, Validators.min(0)]]
    });
  }
 
  loadCategories() {
    this.httpService.getAllCategories().subscribe(
      (data) => {
        this.categories = data;
        this.filteredCategories = [...this.categories];
        this.applyFilter();
      },
      (error) => {
        this.showTemporaryMessage(false, 'Error loading categories');
      }
    );
  }
 
  onEdit(category: any) {
    this.isEditMode = true;
    this.selectedCategoryId = category.id;
    this.itemForm.patchValue({
      name: category.name,
      description: category.description,
      baseRate: category.baseRate
    });
  }
 
  onSubmit(): void {
    if (this.itemForm.valid) {
      const formData = {
        name: this.itemForm.get('name')?.value,
        description: this.itemForm.get('description')?.value,
        baseRate: this.itemForm.get('baseRate')?.value
      };
 
      const isDuplicateName = this.categories.some(
        cat => cat.name.toLowerCase() === formData.name.toLowerCase()
        && cat.id !== this.selectedCategoryId
      );
 
      if (isDuplicateName) {
        this.showTemporaryMessage(false, "Category name already exists");
        return;
      }
 
      if (this.isEditMode && this.selectedCategoryId) {
        this.httpService.updateCategory(formData, this.selectedCategoryId).subscribe(
          (response) => {
            this.showTemporaryMessage(true, 'Category updated successfully');
            this.resetForm();
          },
          (error) => {
            this.showTemporaryMessage(false, "Error updating category");
          }
        );
      } else {
        this.httpService.createCategory(formData).subscribe(
          (response) => {
            this.showTemporaryMessage(true, 'Category added successfully');
            this.resetForm();
          },
          (error) => {
            if(error.status === 409) {
              this.showTemporaryMessage(false, "Car Category name already exists");
            }
          }
        );
      }
    }
  }
 
  resetForm() {
    this.itemForm.reset();
    this.isEditMode = false;
    this.selectedCategoryId = null;
  }
 
  applyFilter() {
    this.filteredCategories = this.categories.filter(category => {
      const searchStr = this.searchTerm.toLowerCase();
      return (
        category.name.toLowerCase().includes(searchStr) ||
        category.description.toLowerCase().includes(searchStr) ||
        category.baseRate.toString().includes(searchStr)
      );
    });
  }
 
  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
 
    this.filteredCategories.sort((a, b) => {
      const direction = this.sortDirection === 'asc' ? 1 : -1;
      if (a[column] < b[column]) return -1 * direction;
      if (a[column] > b[column]) return 1 * direction;
      return 0;
    });
  }
 
  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'fa-sort';
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }
}
