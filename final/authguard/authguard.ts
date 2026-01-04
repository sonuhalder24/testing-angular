import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { DataService } from './data.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public dataService: DataService, public router: Router) { }

  canActivate(): boolean {
    // return true if authenticated else redirect to login page
    
    let isAuthenticated = false;

    // Subscribe to getAuthStatus to check if user is logged in
    this.dataService.getAuthStatus().subscribe(
      (authStatus: boolean) => {
        isAuthenticated = authStatus;
        
        // If not authenticated, navigate to login page
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        // If error occurs, navigate to login page
        isAuthenticated = false;
        this.router.navigate(['/login']);
      }
    );

    return isAuthenticated;
  }

}
