
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  contactForm: FormGroup;
  submitted = false;
  successMessage = '';

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;

    if (this.contactForm.valid) {
      // Store form data
      const formData = this.contactForm.value;
      
      // Show success message
      this.successMessage = 'Message sent successfully! We will get back to you soon.';
      this.submitted = false;
      // Reset form
      this.contactForm.reset();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
      
      // Log the form data (replace with your API call)
      console.log('Form Data:', formData);
    }
  }


  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}