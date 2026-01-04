import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoggedIn: boolean = false;
  loginForm: FormGroup;
  isLoginFailed: boolean = false;

  emptyUserName = 'You must enter a username';
  minlengthUserName = 'User name must be at least 3 characters long';
  maxlengthUserName = 'Username cannot exceed 20 characters';
  userNamePattern = 'Username should be in alphanumeric only';

  emptyPassword = 'You must enter a password';
  minlengthPassword = 'Password must be at least 8 characters long';
  maxlengthPassword = 'Password cannot exceed 20 characters';
  passwordPattern = 'Pattern does not match';

  constructor(private route: Router, private dataService: DataService) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      userName: new FormControl('',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern('^[a-zA-Z0-9]*$') // ✅ UNCOMMENTED
        ]
      ),
      password: new FormControl('',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!$%@#€£*?&])[A-Za-z\\d!$%@#€£*?&]{8,}$')
        ]
      )
    });
  }

  doLogin() {
    // Clear localStorage immediately
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    
    if (this.loginForm.valid) {
      const { userName, password } = this.loginForm.value;
      this.dataService.authenticateUser(userName, password).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.route.navigate(['/profile']);
          } else {
            this.loginForm.reset();
            this.isLoginFailed = true;
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.loginForm.reset();
          this.isLoginFailed = true;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  signUp() {
    this.route.navigate(['/register_user']);
  }

}
