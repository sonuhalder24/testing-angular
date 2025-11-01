import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Users } from '../../models/users.model';
import { DataService } from '../../services/data.service';

@Component({
  standalone: false,
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
        '', // ✅ Enabled field
        [Validators.required] // ✅ With validation
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
    
    this.userId = this.dataService.getUserId();
    if (this.userId && this.userId !== -1) {
      this.getProfileDetails();
    }
  }

  changeMyProfile() {
    if (this.editProfileForm.valid) {
      this.userDetails = {
        userId: this.userDetails.userId,
        username: this.editProfileForm.get('userName')?.value, // ✅ Get from form
        mobile: this.editProfileForm.get('mobile')?.value,
        email: this.editProfileForm.get('email')?.value,
        location: this.editProfileForm.get('location')?.value
      };
      this.dataService.updateProfile(this.userDetails).subscribe(success => {
        if (success) {
          this.getProfileDetails();
          this.discardEdit();
        } else {
          alert('Profile update failed!');
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
      userName: this.userDetails.username,
      mobile: this.userDetails.mobile,
      email: this.userDetails.email,
      location: this.userDetails.location
    });
  }

  getProfileDetails() {
    this.dataService.getUserDetails(this.userId).subscribe({
      next: (user: Users) => {
        this.userDetails = user;
        this.editProfileForm.patchValue({
          userName: this.userDetails.username,
          mobile: this.userDetails.mobile,
          email: this.userDetails.email,
          location: this.userDetails.location
        });
      },
      error: () => {
        alert('Failed to load profile details');
      }
    });
  }
}
