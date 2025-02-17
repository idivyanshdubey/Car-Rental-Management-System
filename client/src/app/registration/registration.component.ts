import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
 
interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}
 
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  itemForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  passwordStrength: string = '';
  showFAQ = false;
  showTerms = false;
  completionPercentage:number=0;
 
  faqItems: FaqItem[] = [
    {
      question: 'How do I create a strong password?',
      answer: 'Use a combination of uppercase and lowercase letters, numbers, and special characters. Make it at least 8 characters long.',
      isOpen: false
    },
    {
      question: 'What roles are available?',
      answer: 'We offer three roles: Customer, Administrator, and Agent. Each role has different permissions and access levels.',
      isOpen: false
    },
    {
      question: 'How can I change my information later?',
      answer: 'You can update your profile information from your account settings after logging in.',
      isOpen: false
    }
  ];
 
  passwordCriteria = {
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  };
 
  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router
  ) {
    this.createForm();
    this.setupPasswordStrengthValidator();
  }
 
  private createForm(): void {
    this.itemForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [
        Validators.required,
        Validators.minLength(5),
      ]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validator: this.passwordMatchValidator
    });
  }
 
  private setupPasswordStrengthValidator(): void {
    this.itemForm.get('password')?.valueChanges.subscribe((password: string) => {
      this.checkPasswordStrength(password);
    });
  }
 
  private checkPasswordStrength(password: string): void {
    this.passwordCriteria = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password)
    };
 
    const criteriaCount = Object.values(this.passwordCriteria).filter(Boolean).length;
   
    if (password.length === 0) {
      this.passwordStrength = '';
    } else if (criteriaCount <= 2) {
      this.passwordStrength = 'weak';
    } else if (criteriaCount <= 4) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'strong';
    }
  }
 
  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password?.value === confirmPassword?.value ? null : { passwordMismatch: true };
  }
 
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
 
  toggleFAQ(): void {
    this.showFAQ = !this.showFAQ;
    this.showTerms = false;
  }
 
  toggleTerms(): void {
    this.showTerms = !this.showTerms;
    this.showFAQ = false;
  }
 
  closeAdditionalInfo(): void {
    this.showFAQ = false;
    this.showTerms = false;
  }
 
  toggleFaqItem(index: number): void {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }
 
  isFormValid(): boolean {
    return this.itemForm.valid;
  }
  private scrollToTop():void{
    window.scrollTo({top:0,behavior:'smooth'});
  }
 
 
  onSubmit(): void {
    if (this.itemForm.valid) {
      const registrationData = {
        ...this.itemForm.value,
        confirmPassword: undefined
      };
      this.httpService.registerUser(registrationData).subscribe({
            next: () => {
              this.successMessage = 'Registration successful! Redirecting to login...';
              this.errorMessage = '';
              this.scrollToTop();
              setTimeout(() => this.router.navigate(['/login']), 4000);
            },
            error: (error) => {
              this.successMessage = '';
              this.errorMessage = error.status === 409
                ? 'This email or username is already registered'
                : 'Registration failed. Please try again.';
              this.scrollToTop();
            }
          });
        } else {
          this.markFormGroupTouched(this.itemForm);
        }
      }
 
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
