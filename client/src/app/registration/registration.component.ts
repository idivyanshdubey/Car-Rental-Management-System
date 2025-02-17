import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
<<<<<<< HEAD
 
=======

>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}
<<<<<<< HEAD
 
=======

>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
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
<<<<<<< HEAD
  completionPercentage:number=0;
 
=======

>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
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
<<<<<<< HEAD
 
=======

>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
  passwordCriteria = {
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  };
<<<<<<< HEAD
 
  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
=======

  constructor(
    private fb: FormBuilder, 
    private httpService: HttpService, 
>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
    private router: Router
  ) {
    this.createForm();
    this.setupPasswordStrengthValidator();
  }
<<<<<<< HEAD
 
=======

>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
  private createForm(): void {
    this.itemForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [
<<<<<<< HEAD
        Validators.required,
        Validators.email,
=======
        Validators.required, 
        Validators.email, 
>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
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
<<<<<<< HEAD
 
=======

>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
  private setupPasswordStrengthValidator(): void {
    this.itemForm.get('password')?.valueChanges.subscribe((password: string) => {
      this.checkPasswordStrength(password);
    });
  }
<<<<<<< HEAD
 
=======

>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
  private checkPasswordStrength(password: string): void {
    this.passwordCriteria = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password)
    };
<<<<<<< HEAD
 
    const criteriaCount = Object.values(this.passwordCriteria).filter(Boolean).length;
   
=======

    const criteriaCount = Object.values(this.passwordCriteria).filter(Boolean).length;
    
>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
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
<<<<<<< HEAD
 
=======

>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password?.value === confirmPassword?.value ? null : { passwordMismatch: true };
  }
<<<<<<< HEAD
 
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
 
=======

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
  toggleFAQ(): void {
    this.showFAQ = !this.showFAQ;
    this.showTerms = false;
  }
<<<<<<< HEAD
 
=======

>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
  toggleTerms(): void {
    this.showTerms = !this.showTerms;
    this.showFAQ = false;
  }
<<<<<<< HEAD
 
=======

>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
  closeAdditionalInfo(): void {
    this.showFAQ = false;
    this.showTerms = false;
  }
<<<<<<< HEAD
 
  toggleFaqItem(index: number): void {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }
 
  isFormValid(): boolean {
    return this.itemForm.valid;
  }
  private scrollToTop():void{
    window.scrollTo({top:0,behavior:'smooth'});
  }
 
 
=======

  toggleFaqItem(index: number): void {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }

  isFormValid(): boolean {
    return this.itemForm.valid;
  }

>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
  onSubmit(): void {
    if (this.itemForm.valid) {
      const registrationData = {
        ...this.itemForm.value,
        confirmPassword: undefined
      };
<<<<<<< HEAD
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
=======

      this.httpService.registerUser(registrationData).subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Redirecting to login...';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']), 4000);
        },
        error: (error) => {
          this.successMessage = '';
          this.errorMessage = error.status === 409 
            ? 'This email or username is already registered' 
            : 'Registration failed. Please try again.';
        }
      });
    } else {
      this.markFormGroupTouched(this.itemForm);
    }
>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
  }
<<<<<<< HEAD

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
=======
>>>>>>> 97f3277d3da2d6407d13d55c1c09978e47df78cd
}
