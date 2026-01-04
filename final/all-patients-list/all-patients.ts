import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Patient } from '../../models/patient';
import { DataService } from '../../services/data.service';
import {ActivatedRoute, RouterLinkActive} from '@angular/router';

interface PatientWithId extends Patient {
  patient_Id: string; // mapped from backend "id"
  registeredDate
}

@Component({
  selector: 'app-all-patients-list',
  templateUrl: './all-patients-list.component.html',
  styleUrls: ['./all-patients-list.component.css']
})
export class AllPatientsListComponent implements OnInit {

  allPatients: PatientWithId[] = [];;

  constructor(
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService.getAllPatientsList().subscribe({
      next: (res: PatientWithId[]) => {
        this.allPatients = res;
      },
      error: (err) => {
        console.error('Error fetching patients:', err);
      }
    });
  }

  view(patientId: string) {
    this.router.navigate(['/patientList', patientId]);
  }

}
