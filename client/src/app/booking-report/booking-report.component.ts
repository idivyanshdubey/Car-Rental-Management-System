import { DatePipe, CommonModule } from '@angular/common';
import { Component, OnInit,NgModule } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
 
@Component({
  selector: 'app-booking-report',
  templateUrl: './booking-report.component.html',
  styleUrls: ['./booking-report.component.scss']
})
export class BookingReportComponent implements OnInit {
  bookings: any[] = [];
 
  constructor(private httpService: HttpService, private datePipe: DatePipe) {}

  formatDate(dateString: string): string {
     return this.datePipe.transform(dateString, 'yyyy-MM-dd HH:mm:ss') || '';
   }

  ngOnInit(): void {
    this.getBookingReport();
  }

  
 
  getBookingReport(): void {
    this.httpService.getBookingReport().subscribe(data => {
      this.bookings = data;
    }, error => {
      console.error('Error fetching booking report', error);
    });
  }
}