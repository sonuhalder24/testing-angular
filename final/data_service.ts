import { HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable, of, throwError } from 'rxjs';

import { Credentials } from '../models/credentials.model';
import { Users } from '../models/users';
import { Patient } from '../models/patient';
import { Appointment } from '../models/appointment';

import { ApiService } from './api.service';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable()
export class DataService {

  userId : string;

  isLoggedIn = false;
  isLogIn: BehaviorSubject<boolean>;

  constructor(private api: ApiService) {
    this.isLogIn = new BehaviorSubject<boolean>(false);
    if (typeof window !== 'undefined' && localStorage) {
      const storedUserId = window.localStorage.getItem('userId');
      if (storedUserId) {
        this.isLogIn.next(true);
      }
    }
  }

  authenticateUser(user_name: string, password: string): Observable<boolean> {
    // store 'id' from response as key name 'id' to the localstorage
    // store 'token' from response as key name 'token' to the localstorage

    // return true if user authenticated

    // return false if user not authenticated

    return this.api.checkLogin(user_name, password).pipe(
      tap((res) => {
        if (res && res.id) {
          if (typeof window !== 'undefined' && localStorage) {
            window.localStorage.setItem('id', res.id.toString());
            window.localStorage.setItem('token', res.token);
            this.userId = res.id.toString()
          }
          this.isLogIn.next(true);
        }
      }),
      map(res => !!res && !!res.id),
      catchError(() => {
        this.isLogIn.next(false);
        return [false];
      })
    );
  }

  getAuthStatus(): Observable<boolean> {
    // return true/false as a auth status

    return this.isLogIn.asObservable();
  }

  regNewUser(regNewUser): Observable<any> {
    // should return response retrieved from ApiService

    // handle error

    return this.api.regNewUser(regNewUser).pipe(
      catchError(err => throwError(() => err))
    );
  }

  doLogOut() {
    // You should remove the key 'id', 'token' if exists
    if (localStorage.getItem('id')) {
      localStorage.removeItem('id');
      localStorage.removeItem('token');
    }
    this.isLogIn.next(false);
  }

  getUserDetails(): Observable<any> {
    // should return user details retrieved from api service

    return this.api.getUserDetails(this.userId).pipe(
      catchError(err => throwError(() => err))
    );
  }

  updateProfile(userId:string, userDetails): Observable<boolean> {
    // should return response retrieved from ApiService

    // handle error

    return this.api.updateDetails(userId, userDetails).pipe(
      map(res => !!res),
      catchError(() => [false])
    );
  }

  registerPatient(patientDetails): Observable<any> {
    // should return response retrieved from ApiService

    // handle error

    return this.api.registerPatient(patientDetails).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getAllPatientsList(): Observable<any> {
    // should return all patients from server

    // handle error

    return this.api.getAllPatientsList().pipe(
      catchError(err => throwError(() => err))
    );
  }

  getParticularPatient(id): Observable<any> {
    // should return particular patient details from server

    // handle error

    return this.api.getParticularPatient(id).pipe(
      catchError(err => throwError(() => err))
    );
  }

  diseasesList(): Observable<any> {
    // should return diseases from server

    // handle error

    return this.api.diseasesList().pipe(
      catchError(err => throwError(() => err))
    );
  }

  scheduleAppointment(appointmentDetails): Observable<any> {
    // should return response from server if appointment booked successfully

    // handle error

    return this.api.scheduleAppointment(appointmentDetails).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getSinglePatientAppointments(patientId): Observable<any> {
    // should return appointments of particular patient from server

    // handle error

    return this.api.getSinglePatientAppointments(patientId).pipe(
      catchError(err => throwError(() => err))
    );
  }

  deleteAppointment(appointmentId): Observable<any> {
    // should delete the appointment

    // handle error

    return this.api.deleteAppointment(appointmentId).pipe(
      catchError(err => throwError(() => err))
    );
  }

  requestedAppointments(): Observable<any> {
    // should return all requested appointments from server

    // handle error

    return this.api.requestedAppointments().pipe(
      catchError(err => throwError(() => err))
    );
  }

  private handleError(error: HttpErrorResponse) {
    // handle error here
  }

  getUserId(): number {
    // Check if user is logged in
    if (!this.isLogIn.value) {
      return -1;
    }

    // Get userId from localStorage
    const userId = window.localStorage.getItem('userId');

    // If userId doesn't exist or is invalid, return -1
    if (!userId) {
      return -1;
    }

    const parsedUserId = Number(userId);

    // If parsed userId is invalid (NaN, 0, negative), return -1
    if (isNaN(parsedUserId) || parsedUserId <= 0) {
      return -1;
    }

    return parsedUserId;
  }

}
