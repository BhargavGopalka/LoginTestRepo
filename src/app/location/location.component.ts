import {Component, OnInit} from '@angular/core';
import {Location} from './location.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AppServiceService} from '../app-service.service';
import 'rxjs/add/operator/filter';
import {State} from '../state-info/state.model';
import {City} from '../city/city.model';
import {ApiEndpoints} from '../api-endpoints';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  items = 20;
  pageNumber = 1;
  totalNumRecords: number;

  locationList: Location[] = [];
  stateList: State[];
  organizationList = [];
  countryList = [];
  cityList: City[] = [];
  selectedState: State[] = [];
  selectedCity: City[] = [];

  showTable = true;
  showForm = false;

  locationForm: FormGroup;
  selectLocation = null;

  constructor(private fb: FormBuilder, private appService: AppServiceService) {
  }

  ngOnInit() {
    this.getLocation();
  }

  removeLocation(id: number, index: number): void {
    // const url = `location/${id}`;
    this.appService.deleteAPI(ApiEndpoints.Location + `/${id}`)
      .subscribe(res => {
        this.cityList.splice(index, 1);
        console.log(res);
      });
  }

  numChange(val) {
    this.pageNumber = 1;
    this.items = +val;
    this.getLocation();
  }

  getLocation(): void {
    // const url = `location?pageNumber=${this.pageNumber}&recordsPerPage=${this.items}`;
    this.appService.getAPI(ApiEndpoints.Location + `?pageNumber=${this.pageNumber}&recordsPerPage=${this.items}`)
      .subscribe(res => {
        console.log(res);
        this.totalNumRecords = res.pager.totalRecords;
        this.locationList = res.payload.data;
      });
  }

  searchStreet(value: string) {
    const searchName = {'street': value};
    // const url = `location?records=all&sortBy=street&sortOrder=asc&search=${JSON.stringify(searchName)}`;
    this.appService.getAPI(ApiEndpoints.Location + `?records=all&sortBy=street&sortOrder=asc&search=${JSON.stringify(searchName)}`)
      .subscribe(res => {
        this.locationList = res.payload.data;
        // console.log(this.stateList);
      });
  }

  addLocation(formValue: any) {
    if (this.selectLocation == null) {
      // const url = `location`;
      this.appService.postAPI(ApiEndpoints.Location, formValue)
        .subscribe(res => {
            console.log(res);
            this.getLocation();
            this.showTable = true;
            this.showForm = false;
          },
          msg => {
            console.log(`Error: ${msg.status} ${msg.statusText}`);
          });
    } else {
      // const url = `city/${this.selectLocation.id}`;
      this.appService.putAPI(ApiEndpoints.City + `/${this.selectLocation.id}`, formValue)
        .subscribe(res => {
            console.log(res);
            this.getLocation();
            this.showTable = true;
            this.showForm = false;
          },
          msg => {
            console.log(`Error: ${msg.status} ${msg.statusText}`);
          });
    }
  }

  getState() {
    // const url = `state`;
    this.appService.getAPI(ApiEndpoints.State)
      .subscribe(res => {
        console.log(res);
        this.stateList = res.payload.data;
      });
  }

  onSelectState(value: string) {
    console.log(this.stateList);
    this.selectedState = this.stateList.filter(state => {
      return state.country_id === +value;
    });
    console.log(this.selectedState);
  }

  onSelectCity(value: string) {
    this.selectedCity = this.cityList.filter(city => {
      return city.state_id === +value;
    });
    console.log(this.selectedCity);
  }

  getOrg() {
    // const url = `organization`;
    this.appService.getAPI(ApiEndpoints.Organization)
      .subscribe(res => {
        console.log(res);
        this.organizationList = res.payload.data;
      });
  }

  getCountry() {
    // const url = `country`;
    this.appService.getAPI(ApiEndpoints.Country)
      .subscribe(res => {
        console.log(res);
        this.countryList = res.payload.data;
      });
  }

  getCity() {
    // const url = `city`;
    this.appService.getAPI(ApiEndpoints.City)
      .subscribe(res => {
        console.log(res);
        this.cityList = res.payload.data;
      });
  }

  initial(locationData: any) {
    this.locationForm = this.fb.group({
      street: [locationData ? locationData.street : ''],
      org_id: [locationData ? locationData.org_id : ''],
      country_id: [locationData ? locationData.country_id : ''],
      state_id: [locationData ? locationData.state_id : ''],
      city_id: [locationData ? locationData.city_id : ''],
      postal_code: [locationData ? locationData.postal_code : '']
    });
  }

  goPrev() {
    this.showForm = false;
    this.showTable = true;
  }

  showProperty(locationData: any) {
    this.showForm = true;
    this.showTable = false;
    this.initial(locationData);
    this.selectLocation = locationData;
    this.getState();
    this.getOrg();
    this.getCity();
    this.getCountry();
  }
}
