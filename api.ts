import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Credentials } from '../models/credentials.model';
import { Users } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_URL: string;
  AUTH_API_URL = '/auth/server/';

  constructor(private http: HttpClient) {
    this.API_URL = 'http://localhost:5000/api';
    this.AUTH_API_URL = this.API_URL + this.AUTH_API_URL;
  }

  public checkLogin(username: string, password: string): Observable<Credentials> {
    return this.http.post<Credentials>(this.AUTH_API_URL, {
      username,
      password
    }).pipe(catchError((err) => throwError(err)));
  }

  public getUserDetails(userId: number): Observable<Users> {
    return this.http.get<Users>(`${this.API_URL}/users/${userId}`)
      .pipe(catchError(this.handleError));
  }

  public updateDetails(userDetails: Users): Observable<Users> {
    return this.http.put<Users>(`${this.API_URL}/users/${userDetails.userId}`, userDetails)
      .pipe(catchError(this.handleError));
  }

  public registerPatient(patientDetails: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/allpatients`, patientDetails)
      .pipe(catchError(this.handleError));
  }

  public getAllPatientsList(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/allpatients`)
      .pipe(catchError(this.handleError));
  }

  public getParticularPatient(patientId: any): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/allpatients/${patientId}`)
      .pipe(catchError(this.handleError));
  }

  public getDiseasesList(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/diseases`)
      .pipe(catchError(this.handleError));
  }

  public bookAppointment(appointmentDetails: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/reqappointments`, appointmentDetails)
      .pipe(catchError(this.handleError));
  }

  public requestedAppointments(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/reqappointments`)
      .pipe(catchError(this.handleError));
  }

  public getAppointments(patientId: any): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/reqappointments?patientId=${patientId}`)
      .pipe(catchError(this.handleError));
  }

  public deleteAppointment(appointmentId: any): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/reqappointments/${appointmentId}`)
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
