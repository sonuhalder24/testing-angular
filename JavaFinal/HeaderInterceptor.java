import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  private AUTH_HEADER = "Authorization";

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the request is for login or user registration endpoints only
    // Exclude only: /signin and /register (not /patients/register or /appointment/register)
    const isPublicEndpoint = req.url.includes('/signin') || 
                             (req.url.includes('/register') && !req.url.includes('/patients/register') && !req.url.includes('/appointment/register'));
    
    if (isPublicEndpoint) {
      return next.handle(req);
    }

    // For all other requests, add authentication token
    const authReq = this.addAuthenticationToken(req);
    return next.handle(authReq);
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    // should add authorization token into headers except login and signup
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token doesn't exist, return the original request
    if (!token) {
      return request;
    }

    // Clone the request and add the Authorization header with Bearer token
    return request.clone({
      setHeaders: {
        [this.AUTH_HEADER]: `Bearer ${token}`
      }
    });
  }

}
