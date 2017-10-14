import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppServiceService} from '../utility/shared-services/app-service.service';
import {State} from './state.model';
import {ApiEndpoints} from '../api-endpoints';

@Component({
  selector: 'app-state-info',
  templateUrl: './state-info.component.html',
  styleUrls: ['./state-info.component.css']
})

export class StateInfoComponent implements OnInit {

  items = 20;
  pageNumber = 1;
  totalNumRecords: number;
  message: string;
  messageCountry: string;

  stateList: State[] = [];
  countries = [];

  showTable = true;
  showForm = false;

  stateForm: FormGroup;
  selectState = null;

  constructor(private fb: FormBuilder, private appService: AppServiceService) {
  }

  ngOnInit() {
    this.getState();
  }

  removeState(id: number, index: number): void {
    // const url = `state/${id}`;
    this.appService.deleteAPI(ApiEndpoints.State + `/${id}`)
      .subscribe(res => {
        this.stateList.splice(index, 1);
        console.log(res);
      });
  }

  numChange(val) {
    this.pageNumber = 1;
    this.items = +val;
    this.getState();
  }

  getState(): void {
    // const url = `state?pageNumber=${this.pageNumber}&recordsPerPage=${this.items}`;
    this.appService.getAPI(ApiEndpoints.State + `?pageNumber=${this.pageNumber}&recordsPerPage=${this.items}`)
      .subscribe(res => {
        console.log(res);
        this.totalNumRecords = res.pager.totalRecords;
        this.stateList = res.payload.data;
      });
    // const header = new Headers();
    // header.append('Authorization', sessionStorage.getItem('currentUser'));
    //
    // const option = new RequestOptions();
    // option.headers = header;
    //
    // const url = `https://mvp-dev-extensionsapi.visumenu.com/state`;
    // this.http.get(url, option)
    //   .subscribe(res => {
    //     console.log(res.json());
    //     this.details = res.json().payload.data;
    //   });
  }

  searchState(value: string) {
    const searchName = {'state': value};
    // const url = `state?records=all&sortBy=state&sortOrder=asc&search=${JSON.stringify(searchName)}`;
    this.appService.getAPI(ApiEndpoints.State + `?records=all&sortBy=state&sortOrder=asc&search=${JSON.stringify(searchName)}`)
      .subscribe(res => {
        this.stateList = res.payload.data;
        // console.log(this.stateList);
      });
  }

  addState(formValue: any) {
    if (this.stateForm.valid === true) {
      // const header = new Headers();
      // header.append('Authorization', sessionStorage.getItem('currentUser'));
      //
      // const option = new RequestOptions();
      // option.headers = header;
      //
      if (this.selectState == null) {
        // const url = `state`;
        this.appService.postAPI(ApiEndpoints.State, formValue)
          .subscribe(res => {
              console.log(res);
              this.getState();
              this.showTable = true;
              this.showForm = false;
            },
            msg => {
              console.log(`Error: ${msg.status} ${msg.statusText}`);
            });
      } else {
        // const anotherUrl = `state/${this.selectState.id}`;
        this.appService.putAPI(ApiEndpoints.State + `/${this.selectState.id}`, formValue)
          .subscribe(res => {
              console.log(res);
              this.getState();
              this.showTable = true;
              this.showForm = false;
            },
            msg => {
              console.log(`Error: ${msg.status} ${msg.statusText}`);
            });
      }
    }
  }

  getCountries() {

    // const url = `country`;
    this.appService.getAPI(ApiEndpoints.Country)
      .subscribe(res => {
        console.log(res);
        this.countries = res.payload.data;
      });
  }

  countryValidation(control: AbstractControl) {
    if (control.errors) {
      return this.messageCountry = `Must select Country`;
    } else {
      return null;
    }
  }

  stateValidation(control: AbstractControl) {
    if (control.errors) {
      return this.message = `State name required`;
    } else {
      return null;
    }
  }

  // removeState( id: number, index: number) {
  //
  //   const header = new Headers();
  //   header.append('Authorization', sessionStorage.getItem('currentUser'));
  //
  //   const option = new RequestOptions();
  //   option.headers = header;
  //
  //   const url = `https://mvp-dev-extensionsapi.visumenu.com/state/${id}`;
  //   this.http.delete( url, option)
  //     .subscribe( () => {
  //       this.details.splice( index, 1);
  //     });
  // }

  initial(stateData: any) {
    this.stateForm = this.fb.group({
      country_id: [stateData ? stateData.country_id : '', Validators.required],
      state: [stateData ? stateData.state : '', Validators.required],
      code: [stateData ? stateData.code : '']
    });
  }

  goPrev() {
    this.showForm = false;
    this.showTable = true;
  }

  showProperty(stateData: any) {
    this.showForm = true;
    this.showTable = false;
    this.initial(stateData);
    this.selectState = stateData;
    this.getCountries();
  }

}
