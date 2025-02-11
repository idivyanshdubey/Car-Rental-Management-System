import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent {
   userRole: string = '';  

   constructor(private router: Router, private authService: AuthService) {}   

   ngOnInit() {    
    this.userRole = localStorage.getItem('role') || '';  
  } 

  logout() {    
    this.authService.logout();
    this.router.navigate(['/login']);  
  }
}
