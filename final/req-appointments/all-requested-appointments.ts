import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { Appointment } from 'src/app/models/appointment';
// import * as alertify from 'alertify.js';

interface AppointmentWithId extends Appointment {
  booking_id: string;
  patient_Id: string;
  registeredDate
}

@Component({
  selector: 'app-all-requested-appointments',
  templateUrl: './all-requested-appointments.component.html',
  styleUrls: ['./all-requested-appointments.component.css']
})
export class AllRequestedAppointmentsComponent implements OnInit {

  allAppointments: AppointmentWithId[] = [];

  constructor(private dataService: DataService, private route: Router) { }

  ngOnInit() {
    this.appointments();
  }

  appointments() {
    this.dataService.requestedAppointments().subscribe({
      next: (res: any) => {
        this.allAppointments = res.map((appointment: AppointmentWithId) => ({...appointment, patient_Id: appointment.patientId,}));
      },
      error: (err: any) => {
        console.error('Error loading requested appointments:', err);
      }
    });
  }

  view(patientId: string) {
    console.log('Navigating to patient details for ID:', patientId);
    this.route.navigate(['/patientList', patientId]);
  }

  cancelAppointment(id: string) {
    this.dataService.deleteAppointment(id).subscribe({
      next: () => {
        console.log('Appointment cancelled successfully');
        this.appointments();
      },
      error: (err: any) => {
        console.error('Error cancelling appointment:', err);
      }
    });
  }
}

