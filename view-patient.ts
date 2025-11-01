import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Appointment } from '../../models/appointment';
import { Patient } from '../../models/patient';

interface PatientWithId extends Patient {
  patientId: number;
}

interface AppointmentWithId extends Appointment {
  id: number;
}

@Component({
  selector: 'app-view-patient',
  standalone: false,
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.css'],
  providers: [DatePipe]
})
export class ViewPatientComponent implements OnInit {

  patient!: PatientWithId;
  today: string | null;
  isBookAppointment: boolean = false;  // Changed to false
  isFormEnabled: boolean = false;
  isScheduledAppointment: boolean = false;  // Changed to false
  isTableEnabled: boolean = false;

  appointmentForm: FormGroup;
  appointmentDetails = new Appointment();
  bookedAppointmentResponse: any;
  scheduledAppointmentResponse: any;

  diseases: any[] = [];
  appointments: AppointmentWithId[] = [];

  constructor(
    fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) {
    this.today = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');

    this.appointmentForm = fb.group({
      selectDisease: [null, Validators.required],
      tentativeDate: [null, Validators.required],
      priority: [null, Validators.required]
    });
  }

  ngOnInit() {
    const patientIdParam = this.activatedRoute.snapshot.paramMap.get('id');
    const patientId = patientIdParam ? Number(patientIdParam) : 0;

    this.dataService.getParticularPatient(patientId).subscribe({
      next: (res: any) => {
        this.patient = { ...res, patientId: res.id };
      },
      error: (err: any) => console.error('Error loading patient:', err)
    });
  }

  bookAppointment() {
    this.dataService.getDiseasesList().subscribe({
      next: (res: any) => {
        this.diseases = res;
        this.isBookAppointment = true;  // Changed to true (disable book button)
        this.isFormEnabled = true;
        this.isScheduledAppointment = false;  // Changed to false (enable scheduled button)
        this.isTableEnabled = false;
      },
      error: (err: any) => console.error('Error loading diseases:', err)
    });
  }

  scheduleAppointment() {
    if (this.appointmentForm.valid && this.patient) {
      const formValues = this.appointmentForm.value;

      this.appointmentDetails.patientId = this.patient.patientId;
      this.appointmentDetails.patientFirstName = this.patient.firstName;
      this.appointmentDetails.patientLastName = this.patient.lastName;
      this.appointmentDetails.disease = formValues.selectDisease;
      this.appointmentDetails.priority = formValues.priority;
      this.appointmentDetails.tentativedate = formValues.tentativeDate;
      this.appointmentDetails.registeredTime = this.today!;

      this.dataService.bookAppointment(this.appointmentDetails).subscribe({
        next: (res: any) => {
          this.bookedAppointmentResponse = res;
          this.router.navigate(['/requested_appointments']);
        },
        error: (err: any) => console.error('Error booking appointment:', err)
      });
    }
  }

  scheduledAppointment() {
    if (this.patient) {
      this.dataService.getAppointments(this.patient.patientId).subscribe({
        next: (res: any) => {
          this.appointments = res.map((appointment: AppointmentWithId) => ({...appointment, id: appointment.id}));
          this.isBookAppointment = false;  // Changed to false (enable book button)
          this.isScheduledAppointment = true;  // Changed to true (disable scheduled button)
          this.isFormEnabled = false;
          this.isTableEnabled = true;
        },
        error: (err: any) => console.error('Error loading appointments:', err)
      });
    }
  }

  cancelAppointment(id: number) {
    this.dataService.deleteAppointment(id).subscribe({
      next: () => {
        if (this.patient) {
          this.scheduledAppointment();
        }
      },
      error: (err: any) => console.error('Error deleting appointment:', err)
    });
  }
}
