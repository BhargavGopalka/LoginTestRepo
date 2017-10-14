import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiEndpoints} from '../api-endpoints';
import {AppServiceService} from '../utility/shared-services/app-service.service';

@Component({
  selector: 'app-info-table',
  templateUrl: './info-table.component.html',
  styleUrls: ['./info-table.component.css']
})
export class InfoTableComponent implements OnInit {

  details = [];

  today = Date.now();

  constructor(private apiService: AppServiceService, private routes: Router) {
  }

  ngOnInit() {
    this.doHeader();
  }

  doHeader() {
    this.apiService.getAPI(ApiEndpoints.PhoneDetail)
      .subscribe(res => {

          this.details = res.payload.data;

          // const response = res.json();
          // const path = response.payload.data;
          // this.details = path;

          console.log(this.details);
        },
        msg => console.log(`Error: ${msg.status} ${msg.statusText}`));
  }

  logOut() {
    sessionStorage.clear();
    this.routes.navigate(['login']);
  }
}
