import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	standalone: false,
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

	isLoggedIn: boolean = false;
	loginForm!: FormGroup;
	isLoginFailed: boolean = false;

	userName = '';
	password = ''

	emptyUserName = 'You must enter a username';
	minlengthUserName = 'User name must be at least 3 characters long';
	maxlengthUserName = 'Username cannot exceed 20 characters';
	userNamePattern = 'Username should be in alphanumeric only';
	emptyPassword = 'You must enter a password';
	minlengthPassword = 'Password must be at least 8 characters long';
	maxlengthPassword = 'Password cannot exceed 20 characters';
	passwordPattern = 'Pattern does not match';
	wrongCredentials = 'Incorrect Username or Password';

	constructor(private route: Router, private dataService: DataService) {
	}

	//constructor(private route: Router, private apiservice: ApiService) {}

	ngOnInit() {
		// add necessary validators


		this.loginForm = new FormGroup({
			userName: new FormControl('',
				[
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(20)
					//Validators.pattern('^[a-zA-Z0-9]*$') // Alphanumeric
				]
			),
			password: new FormControl('',
				[
					Validators.required,
					Validators.minLength(8),
					Validators.maxLength(20),
					Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!$%@#€£*?&])[A-Za-z\\d!$%@#€£*?&]{8,}$')

					//Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$') // example pattern
				]
			)
		});


	}

	// doLogin() {
	// 	console.log('Submitted');
	// 	if (this.loginForm.valid) {
	// 		const { userName, password } = this.loginForm.value;
	// 		console.log('Login success:', userName, password);
	// 		// this.route.navigate(['/profile']);
	// 		// TODO: Call API or navigate to dashboard
	// 		this.dataService.authenticateUser(userName, password);

	// 	} else {
	// 		console.log('Form is invalid');
	// 		this.loginForm.markAllAsTouched();
	// 	}

	// 	// call authenticateUser method to perform login operation
	// 	// if success, redirect to profile page
	// 	// else display appropriate error message
	// 	// reset the form

	// 	this.dataService.getAuthStatus().subscribe((status: boolean) => {
	// 		this.isLoggedIn = status;
	// 		if (this.isLoggedIn) {
	// 			this.route.navigate(['/profile']);
	// 		} else {
	// 			this.loginForm.reset();
	// 			this.isLoginFailed = true;
	// 		}
	// 	});

	// }

	doLogin() {
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

}
