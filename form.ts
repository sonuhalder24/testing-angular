import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Patient } from '../../models/patient';
import { DataService } from '../../services/data.service';
// import * as alertify from 'alertify.js';

@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [DatePipe]
})
export class FormComponent implements OnInit {

  complexForm: FormGroup;
  patientDetails = new Patient();
  result: any;
  today: string = '';

  noRecordsFound = 'No patient records found in the list. Click on Register New Patient to add Patient details.';

  emptyFirstname = 'You must include a first name.';
  minlengthFirstname = 'Your first name must be at least 3 characters long.';
  maxlengthFirstname = 'Your first name cannot exceed 20 characters.';

  emptyLastname = 'You must include a last name.';
  minlengthLastname = 'Your last name must be at least 3 characters long.';
  maxlengthLastname = 'Your last name cannot exceed 20 characters.';

  noGender = 'You must select a gender.';
  noDob = 'You must select a valid date of birth.';
  noMobile = 'You must include mobile number.';
  numberMobile = 'You must enter a valid 10 digit mobile number.';
  maxlengthMobile = 'Your mobile number should not exceed 10 digits.';
  noEmail = 'You must include a valid email.';
  patternEmail = 'Pattern does not match.';

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private route: Router,
    private dataService: DataService
  ) {
    this.complexForm = this.fb.group({
      'firstName': [''],
      'lastName': [''],
      'gender': [null],
      'dob': [null],
      'mobile': [''],
      'email': [''],
      'description': ['']
    });
  }

  ngOnInit() {
    this.today = this.datePipe.transform(Date.now(), 'yyyy-MM-dd')!;

    this.complexForm = this.fb.group({
      firstName: [
        this.patientDetails.firstName,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ]
      ],
      lastName: [
        this.patientDetails.lastName,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ]
      ],
      gender: [
        this.patientDetails.gender,
        [Validators.required]
      ],
      dob: [
        this.patientDetails.dob,
        [Validators.required]
      ],
      mobile: [
        this.patientDetails.mobile,
        [
          Validators.required,
          Validators.pattern('^[0-9]{10,}$') // exactly 10 digits
        ]
      ],
      email: [
        this.patientDetails.email,
        [
          Validators.required,
          // Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
          Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
        ]
      ],
      description: [
        this.patientDetails.description
      ]
    });
  }

  submitForm(value: any) {
    if (this.complexForm.valid) {
      const newPatient: Patient = {
        ...value,
        registeredTime: new Date()
      };

      this.dataService.registerPatient(newPatient).subscribe({
        next: () => {
          // redirect to patient list page
          this.route.navigate(['/patientList']);
        },
        error: (err) => {
          console.error('Error saving patient', err);
        }
      });
      this.route.navigate(['/patientList']);
    } else {
      this.complexForm.markAllAsTouched();
    }
  }
}
