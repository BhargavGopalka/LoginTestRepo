import {Component, OnInit} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-info-table',
  templateUrl: './info-table.component.html',
  styleUrls: ['./info-table.component.css']
})
export class InfoTableComponent implements OnInit {

  details = [];

  today = Date.now();

  constructor(private http: Http, private routes: Router) {
  }

  ngOnInit() {
    this.doHeader();
  }

  doHeader() {
    const header = new Headers();
    header.append('Authorization', sessionStorage.getItem('currentUser'));
    const option = new RequestOptions();
    option.headers = header;
    const url = `https://mvp-dev-extensionsapi.visumenu.com/phoneDetail?pageNumber=1&recordsPerPage=3&totalPage=0&sortBy=phone_number&sortOrder=asc`;
    this.http.get(url, option)
      .subscribe(res => {

          this.details = res.json().payload.data;

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
