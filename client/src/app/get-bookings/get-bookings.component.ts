import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

export interface Booking {
  id: number;
}

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
  showSuccessMessage: boolean = false;
  successMessage: string = '';
  selectedBooking: any = null;
  amountToBePaid: number = 0;
  paymentStatus: string = 'pending';

  @ViewChild('messageContainer') messageContainer!: ElementRef;

  constructor(
    private formBuilder: FormBuilder, 
    private httpService: HttpService, 
    private datePipe: DatePipe
  ) {
    this.itemForm = this.formBuilder.group({
      amount: ['', Validators.required],
      paymentDate: [this.getCurrentDate(), Validators.required],
      paymentMethod: ['', Validators.required],
      paymentStatus: ['Pending', Validators.required]
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
        this.showMessage(false, "An error occurred while fetching bookings.");
        console.error('Error fetching bookings:', error);
      }
    );
  }

  acceptBooking(bookingId: number, status: string) {
    this.httpService.updateBookingStatus(bookingId, status).subscribe(
      () => {
        this.showMessage(true, `Booking status set to ${status} successfully!`);
        this.getBookings();
      },
      error => {
        this.showMessage(false, "An error occurred while accepting the booking.");
        console.error('Error accepting booking:', error);
      }
    );
  }

  showPaymentForm(booking: any) {
    this.selectedBooking = booking;
    this.amountToBePaid = booking.totalAmount || 0;

    this.itemForm.patchValue({
      amount: this.amountToBePaid,
      paymentDate: this.getCurrentDate(),
      paymentMethod: '',
      paymentStatus: 'Pending'
    });
  }

  createPayment() {
    if (this.itemForm.valid && this.selectedBooking) {
      const formattedDate = this.datePipe.transform(this.itemForm.get('paymentDate')?.value, 'yyyy-MM-dd HH:mm:ss');
      this.itemForm.patchValue({ paymentDate: formattedDate });

      let booking: Booking = { id: this.selectedBooking.id };

      this.httpService.bookingPayment({ ...this.itemForm.value, booking }, this.selectedBooking.id).subscribe(
        () => {
          this.showMessage(true, "Payment processed successfully!");
          this.acceptBooking(this.selectedBooking.id, 'Booked');
          this.itemForm.get('paymentStatus')?.setValue('Completed');
          this.getBookings();
          this.selectedBooking = null;
        },
        error => {
          this.showMessage(false, "An error occurred while processing the payment.");
          console.error('Error processing payment:', error);
        }
      );
    }
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  showMessage(success: boolean, message: string) {
    if (success) {
      this.showSuccessMessage = true;
      this.successMessage = message;
    } else {
      this.showError = true;
      this.errorMessage = message;
    }

    setTimeout(() => {
      this.showSuccessMessage = false;
      this.showError = false;
    }, 5000);

    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}