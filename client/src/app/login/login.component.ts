import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  itemForm!: FormGroup;
  errorMessage: string = '';
 
  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
 
  onSubmit(): void {
    if (this.itemForm.valid) {
      const { username, password } = this.itemForm.value;
      this.httpService.Login({ username, password }).subscribe(
        (response: any) => {
          this.authService.saveToken(response.token);
          this.authService.SetRole(response.role);
          this.authService.saveUserId(response.userId);
          console.log("token saved");
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.log("login failed.")
          this.errorMessage = 'Invalid username or password';
        }
      );
    }
  }
}
