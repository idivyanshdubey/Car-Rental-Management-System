import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
 
@Component({
  selector: 'app-get-bookings',
  templateUrl: './get-bookings.component.html',
  styleUrls: ['./get-bookings.component.scss']
})
export class GetBookingsComponent implements OnInit {
  itemForm!: FormGroup;
  bookings: any[] = [];  
  showError: boolean = false;  
  errorMessage: string = '';  
  showMessage: boolean = false;  
  responseMessage: string = '';  
  selectedBooking: any = null;
  amountToBePaid: number = 0;
  paymentStatus: string = 'pending';
 
  constructor(private formBuilder: FormBuilder, private httpService: HttpService) {    
    this.itemForm = this.formBuilder.group({      
      amount: ['', Validators.required],      
      paymentDate: [this.getCurrentDate(), Validators.required],      
      paymentMethod: ['', Validators.required],      
      paymentStatus: ['pending', Validators.required]    
    });  
  }  
 
  ngOnInit(): void {    
    this.getBookings();  
  }  
 
  getBookings() {    
    this.httpService.getBookingByAgent().subscribe(      
      (data: any) => {        
        this.bookings = data;      
      },      
      error => {        
        this.showError = true;        
        this.errorMessage = "An error occurred while fetching bookings.";        
        console.error('Error fetching bookings:', error);      
      }    
    );  
  }  
 
  completeBooking(booking: any) {
    this.selectedBooking = booking;
    this.amountToBePaid = booking.amount || 0; // Assuming there's an amount field in booking
    this.paymentStatus = 'pending';
 
    this.itemForm.patchValue({
      amount: this.amountToBePaid,
      paymentDate: this.getCurrentDate(),
      paymentMethod: '',
      paymentStatus: 'pending'
    });
  }
 
  updateBookingStatus(bookingId: number, status: string) {    
    this.httpService.updateBookingStatus(bookingId, status).subscribe(        
      (response: any) => {        
        this.showMessage = true;        
        this.responseMessage = "Booking status updated successfully!";        
        this.getBookings();  
      },      
      error => {        
        this.showError = true;        
        this.errorMessage = "An error occurred while updating the booking status.";        
        console.error('Error updating booking status:', error);      
      }    
    );  
  }
 
  onSubmit() {    
    if (this.itemForm.valid && this.selectedBooking) {      
      this.httpService.bookingPayment(this.itemForm.value,this.selectedBooking.id).subscribe(        
        (response: any) => {          
          this.showMessage = true;          
          this.responseMessage = "Payment processed successfully!";
          this.paymentStatus = 'completed';          
          this.itemForm.get('paymentStatus')?.setValue('completed');
          this.getBookings(); // Refresh bookings
        },        
        error => {          
          this.showError = true;          
          this.errorMessage = "An error occurred while processing the payment.";          
          console.error('Error processing payment:', error);        
        }      
      );    
    }  
  }  
 
  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Formats as YYYY-MM-DD
  }
}
