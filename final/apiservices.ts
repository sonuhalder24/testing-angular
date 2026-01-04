import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { Credentials } from '../models/credentials.model';
import { Users } from '../models/users';
import { Patient } from '../models/patient';
import { Appointment } from '../models/appointment';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class ApiService {

  API_URL: string;

  constructor(private http: HttpClient) {

    this.API_URL = 'api';

  }

  public checkLogin(user_name: string, password: string): Observable<any> {
    return this.http.post<Credentials>(`${this.API_URL}/signin`, {
      user_name,
      password
    }).pipe(catchError((err) => throwError(err)));
  }

  public regNewUser(regNewUser): Observable<any> {
    return this.http.post<Credentials>(`${this.API_URL}/register`, regNewUser).pipe(catchError((err) => throwError(err)));
}

  public getUserDetails(userId: string): Observable < any > {
    return this.http.get<Users>(`${this.API_URL}/viewprofile/${userId}`)
    .pipe(catchError((err) => throwError(err)));
}

  public updateDetails(userId: string, userDetails: any): Observable < any > {
    return this.http.put<Users>(`${this.API_URL}/editprofile/${userId}`, userDetails)
    .pipe(catchError((err) => throwError(err)));
}

  public registerPatient(patient: any): Observable < any > {
    return this.http.post<any>(`${this.API_URL}/patients/register`, patient)
    .pipe(catchError(this.handleError));
}

  public getAllPatientsList(): Observable < any > {
    return this.http.get<any>(`${this.API_URL}/patients/list/`)
    .pipe(catchError(this.handleError));
}

  public getParticularPatient(patientId): Observable < any > {
    return this.http.get<any>(`${this.API_URL}/patients/view/${patientId}`)
    .pipe(catchError(this.handleError));
}

  public diseasesList(): Observable < any > {
    return this.http.get<any>(`${this.API_URL}/diseases`)
    .pipe(catchError(this.handleError));
}

  public scheduleAppointment(appointmentDetails: any) : Observable < any > {
    return this.http.post<any>(`${this.API_URL}/appointment/register`, appointmentDetails)
    .pipe(catchError(this.handleError));
}

  public getSinglePatientAppointments(patientId): Observable < any > {
    return this.http.get<any>(`${this.API_URL}/appointment/list/${patientId}`)
    .pipe(catchError(this.handleError));
}

  public deleteAppointment(appointmentId): Observable < any > {
    return this.http.delete<any>(`${this.API_URL}/appointment/delete/${appointmentId}`)
    .pipe(catchError(this.handleError));
}

  public requestedAppointments(): Observable < any > {
    return this.http.get<any>(`${this.API_URL}/appointment/list`)
    .pipe(catchError(this.handleError));
}


private handleError(error: HttpErrorResponse) {
  let errorMessage = 'An unknown error occurred!';
  if (error.error instanceof ErrorEvent) {
    // Client-side error
    errorMessage = error.error.message;
  } else {
    // Server-side error
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  return throwError(() => error);
}

}
