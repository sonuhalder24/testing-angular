import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Users } from '../../models/users';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  editProfile = false;
  userId = -1;
  userDetails = new Users();
  editProfileForm: FormGroup;
  userImg = './../../assets/user.jpg';
  mobileErrMsg = 'You must enter a valid mobile number';
  emailErrMsg = 'You must enter a valid Email ID';
  locationErrMsg = 'You must enter the location';

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.editProfileForm = this.fb.group({
      username: [''],
      mobile: [''],
      email: [''],
      location: ['']
    });
  }

  ngOnInit() {
    this.editProfileForm = new FormGroup({
      userName: new FormControl(
        '',
        [Validators.required]
      ),
      mobile: new FormControl(
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ),
      email: new FormControl(
        '',
        [
          Validators.required,
          Validators.email
        ]
      ),
      location: new FormControl(
        '',
        [
          Validators.required,
        ])
    });

    if(typeof this.dataService.getUserId === 'function') {
      this.userId = this.dataService.getUserId();
    }else {
      const storedId = window.localStorage.getItem('id');
      this.userId = storedId ? parseInt(storedId) : -1;
    }

    this.getProfileDetails();
  }

  changeMyProfile() {
    if (this.editProfileForm.valid) {
      this.userDetails = {
        user_name: this.editProfileForm.get('userName')?.value,
        user_mobile: this.editProfileForm.get('mobile')?.value,
        user_email: this.editProfileForm.get('email')?.value,
        location: this.editProfileForm.get('location')?.value,
        password: this.userDetails.password
      };
      this.dataService.updateProfile(this.userId+"",this.userDetails).subscribe({
        next: (success) => {
          if (success) {
            this.getProfileDetails();
            this.discardEdit();
          }
        },
        error: (error) => {
          console.log(error)
        }
      });
    } else {
      this.editProfileForm.markAllAsTouched();
    }
  }

  editMyProfile() {
    this.editProfile = true;
  }

  discardEdit() {
    this.editProfile = false;
    this.editProfileForm.reset({
      userName: this.userDetails.user_name,
      mobile: this.userDetails.user_mobile,
      email: this.userDetails.user_email,
      location: this.userDetails.location
    });
  }

  getProfileDetails() {
    this.dataService.getUserDetails().subscribe({
      next: (user: Users) => {
        this.userDetails = user;
        this.editProfileForm.patchValue({
          userName: this.userDetails.user_name,
          mobile: this.userDetails.user_mobile,
          email: this.userDetails.user_email,
          location: this.userDetails.location
        });
      },
      error: () => {
        // alert('Failed to load profile details');
        console.log('Failed to load profile details')
      }
    });
  }
}

