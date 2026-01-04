import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Patient } from '../../models/patient';
import { DataService } from '../../services/data.service';
// import * as alertify from 'alertify.js';

@Component({
  selector: 'app-form',
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

  emptyName = 'You must include a name.';
  minlengthName = 'Your name must be at least 3 characters long.';
  maxlengthName = 'Your name cannot exceed 20 characters.';
  noGender = 'You must select a gender.';
  noDob = 'You must select a valid date of birth.';
  noMobile = 'You must include mobile number.';
  numberMobile = 'You must enter a valid 10 digit mobile number.';
  maxlengthMobile = 'Your mobile number should not exceed 10 digits.';
  patternEmail = 'You must enter a valid Email ID.';
  noEmail = 'You must include a valid email.';

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private route: Router,
    private dataService: DataService
  ) {
    this.complexForm = this.fb.group({
      'name': [''],
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
      name: [
        this.patientDetails.patient_name,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ]
      ],
      gender: [
        this.patientDetails.patient_gender,
        [Validators.required]
      ],
      dob: [
        this.patientDetails.patient_dob,
        [Validators.required]
      ],
      mobile: [
        this.patientDetails.patient_mobile,
        [
          Validators.required,
          Validators.pattern('^[0-9]{10,}$') // exactly 10 digits
        ]
      ],
      email: [
        this.patientDetails.patient_email,
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
        ]
      ],
      description: [
        this.patientDetails.desc
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
