import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  showSuccessMessage: boolean = false;
  successMessage: string = '';
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

  acceptBooking(bookingId: number) {
    this.httpService.updateBookingStatus(bookingId).subscribe(
      (response: any) => {
        this.showSuccessMessage = true;
        this.successMessage = "Booking accepted successfully!";
        this.getBookings();
      },
      error => {
        this.showError = true;
        this.errorMessage = "An error occurred while accepting the booking.";
        console.error('Error accepting booking:', error);
      }
    );
  }

  showPaymentForm(booking: any) {
    this.selectedBooking = booking;
    this.amountToBePaid = booking.amount || 0;
    this.paymentStatus = 'pending';

    this.itemForm.patchValue({
      amount: this.amountToBePaid,
      paymentDate: this.getCurrentDate(),
      paymentMethod: '',
      paymentStatus: 'pending'
    });
  }

  createPayment() {
    if (this.itemForm.valid && this.selectedBooking) {
      this.httpService.bookingPayment(this.itemForm.value, this.selectedBooking.id).subscribe(
        (response: any) => {
          this.showMessage = true;
          this.responseMessage = "Payment processed successfully!";
          this.paymentStatus = 'completed';
          this.itemForm.get('paymentStatus')?.setValue('completed');
          this.getBookings();
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
    return new Date().toISOString().split('T')[0];
  }
}