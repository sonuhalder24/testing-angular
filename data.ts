import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Credentials } from '../models/credentials.model';
import { Users } from '../models/users.model';
import { Patient } from '../models/patient';
import { Appointment } from '../models/appointment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
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

  authenticateUser(username: string, password: string): Observable<boolean> {
    return this.api.checkLogin(username, password).pipe(
      tap((res: Credentials) => {
        if (res && res.userId) {
          if (typeof window !== 'undefined' && localStorage) {
            window.localStorage.setItem('userId', res.userId.toString());
          }
          this.isLogIn.next(true);
        }
      }),
      map(res => !!res && !!res.userId),
      catchError(() => {
        this.isLogIn.next(false);
        return [false];
      })
    );
  }

  getAuthStatus(): Observable<boolean> {
    return this.isLogIn.asObservable();
  }

  doLogOut() {
    if (localStorage.getItem('userId')) {
      localStorage.removeItem('userId');
    }
    this.isLogIn.next(false);
  }

  getUserDetails(userId: number): Observable<Users> {
    return this.api.getUserDetails(userId).pipe(
      catchError(err => throwError(() => err))
    );
  }

  updateProfile(userDetails: Users): Observable<boolean> {
    return this.api.updateDetails(userDetails).pipe(
      map(res => !!res),
      catchError(() => [false])
    );
  }

  registerPatient(patientDetails: any): Observable<any> {
    return this.api.registerPatient(patientDetails).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getAllPatientsList(): Observable<any> {
    return this.api.getAllPatientsList().pipe(
      catchError(err => throwError(() => err))
    );
  }

  getParticularPatient(id: number): Observable<any> {
    return this.api.getParticularPatient(id).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getDiseasesList(): Observable<any> {
    return this.api.getDiseasesList().pipe(
      catchError(err => throwError(() => err))
    );
  }

  bookAppointment(appointmentDetails: any): Observable<any> {
    return this.api.bookAppointment(appointmentDetails).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getAppointments(patientId: number): Observable<any> {
    return this.api.getAppointments(patientId).pipe(
      catchError(err => throwError(() => err))
    );
  }

  deleteAppointment(appointmentId: number): Observable<any> {
    return this.api.deleteAppointment(appointmentId).pipe(
      catchError(err => throwError(() => err))
    );
  }

  requestedAppointments(): Observable<any> {
    return this.api.requestedAppointments().pipe(
      catchError(err => throwError(() => err))
    );
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

