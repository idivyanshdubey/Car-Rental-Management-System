import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {
  userRole: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.userRole = localStorage.getItem('role') || '';
  }

  getRoleIcon(): string {
    switch (this.userRole) {
      case 'ADMINISTRATOR':
        return 'fas fa-user-shield';
      case 'AGENT':
        return 'fas fa-user-tie';
      case 'CUSTOMER':
        return 'fas fa-user';
      default:
        return 'fas fa-user';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
