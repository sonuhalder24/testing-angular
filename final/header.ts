import { Component, OnInit, DoCheck, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userId = -1;
  userDetails = new Users();

  constructor(private dataService: DataService, private route: Router) { }

  ngOnInit() {
    // get userId from service and assign it to userId property
    if(typeof this.dataService.getUserId === 'function') {
      this.userId = this.dataService.getUserId();
    }else {
      const storedId = window.localStorage.getItem('id');
      this.userId = storedId ? parseInt(storedId) : -1;
    }
    console.log('Retrieved userId:', this.userId);

    // call getProfileDetails method to get user details
    this.getProfileDetails();
  }

  getProfileDetails() {
    // call getUserDetails method of dataService and assign response to userDetails property
    console.log('Loading user details for userId:', this.userId);

    this.dataService.getUserDetails().subscribe({
      next: (res: Users) => {
        console.log('User details retrieved:', res);
        this.userDetails = res;
      },
      error: (err: any) => {
        console.error('Error loading user details:', err);
        // Handle error case - maybe set default values or show error message
        this.userDetails = new Users();
      }
    });
  }

  logout() {
    console.log('Logging out user');
    this.dataService.doLogOut();
    this.route.navigate(['/login']);
  }
}
