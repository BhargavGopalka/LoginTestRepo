import {Component, OnInit} from '@angular/core';
import {City} from './city.model';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppServiceService} from '../utility/shared-services/app-service.service';
import {ApiEndpoints} from '../utility/constants/api-endpoints';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  items = 20;
  pageNumber = 1;
  totalNumRecords: number;
  stateMessage: string;
  cityMessage: string;

  cityList: City[] = [];
  stateList = [];

  showTable = true;
  showForm = false;
  isLoading = true;
  afterLoad = false;

  cityForm: FormGroup;
  selectCity = null;

  constructor(private fb: FormBuilder, private appService: AppServiceService) {
  }

  ngOnInit() {
    this.getCity();
  }

  removeCity(id: number, index: number): void {
    // const url = `city/${id}`;
    this.appService.deleteAPI(ApiEndpoints.City + `/${id}`)
      .subscribe(res => {
        this.cityList.splice(index, 1);
      });
  }

  numChange(val) {
    this.pageNumber = 1;
    this.items = +val;
    this.getCity();
  }

  getCity(): void {
    // const url = `city?pageNumber=${this.pageNumber}&recordsPerPage=${this.items}`;
    this.appService.getAPI(ApiEndpoints.City + `?pageNumber=${this.pageNumber}&recordsPerPage=${this.items}`)
      .subscribe((res => {
        this.totalNumRecords = res.pager.totalRecords;
        this.cityList = res.payload.data;
      }),
        (error: any) => {
        });
  }

  searchCity(value: string) {
    const searchName = {'name': value};
    // const url = `city?records=all&sortBy=name&sortOrder=asc&search=${JSON.stringify(searchName)}`;
    this.appService.getAPI(ApiEndpoints.City + `?records=all&sortBy=name&sortOrder=asc&search=${JSON.stringify(searchName)}`)
      .subscribe(res => {
        this.cityList = res.payload.data;
      });
  }

  stateValidation(control: AbstractControl) {
    if (control.errors) {
      return this.stateMessage = `Must select a State`;
    } else {
      return null;
    }
  }

  cityValidation(control: AbstractControl) {
    if (control.errors) {
      return this.cityMessage = `Name is required`;
    } else {
      return null;
    }
  }

  addCity(formValue: any) {
    if (this.cityForm.valid === true) {
      if (this.selectCity == null) {
        // const url = `city`;
        this.appService.postAPI(ApiEndpoints.City, formValue)
          .subscribe(res => {
              this.getCity();
              this.showTable = true;
              this.showForm = false;
            },
            msg => {
              console.log(`Error: ${msg.status} ${msg.statusText}`);
            });
      } else {
        // const anotherUrl = `city/${this.selectCity.id}`;
        this.appService.putAPI(ApiEndpoints.City + `/${this.selectCity.id}`, formValue)
          .subscribe(res => {
              this.getCity();
              this.showTable = true;
              this.showForm = false;
            },
            msg => {
              console.log(`Error: ${msg.status} ${msg.statusText}`);
            });
      }
    }
  }

  getState() {
    // const url = `state`;
    this.appService.getAPI(ApiEndpoints.State)
      .subscribe(res => {
        this.stateList = res.payload.data;
      });
  }

  initial(cityData: any) {
    this.cityForm = this.fb.group({
      state_id: [cityData ? cityData.state_id : '', Validators.required],
      name: [cityData ? cityData.name : '', Validators.required],
      code: [cityData ? cityData.code : '']
    });
  }

  goPrev() {
    this.showForm = false;
    this.showTable = true;
  }

  showProperty(cityData: any) {
    this.showForm = true;
    this.showTable = false;
    this.initial(cityData);
    this.selectCity = cityData;
    this.getState();
  }
}
