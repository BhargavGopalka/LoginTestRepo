import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiEndpoints} from '../utility/constants/api-endpoints';
import {AppServiceService} from '../utility/shared-services/app-service.service';
import {MenuDetailComponent} from '../menu-detail/menu-detail.component';
import 'rxjs/Rx';
import {saveAs as importedSaveAs} from 'file-saver';

@Component({
  selector: 'app-info-table',
  templateUrl: './info-table.component.html',
  styleUrls: ['./info-table.component.css']
})
export class InfoTableComponent implements OnInit {

  items = 20;
  pageNumber = 1;
  totalNumRecords: number;

  details = [];
  numbers = [];
  allNumber: any[];
  filterView = false;
  organizationList = [];
  numberList = [];
  departmentList = [];
  deptList = [];
  cityList = [];
  countryList = [];
  stateList = [];
  filterOrgArray = [];
  filterNumberArray = [];
  filterDepartmentArray = [];
  filterCityArray = [];
  filterCountryArray = [];
  filterStateArray = [];
  exportNumbers = [];
  phoneNumberList = [];

  today = Date.now();

  constructor(private apiService: AppServiceService, private routes: Router,
              private menuDetail: MenuDetailComponent) {
  }

  ngOnInit() {
    this.doHeader();
    this.getAllnumber();
  }

  doHeader() {
    this.apiService.getAPI(ApiEndpoints.PhoneDetail, this.queryParams(), this.searchParams())
      .subscribe(res => {
          this.details = res.payload.data;
          this.exportNumbers = res.payload.numbers;
          this.totalNumRecords = res.pager.totalRecords;
        },
        msg => console.log(`Error: ${msg.status} ${msg.statusText}`));
  }

  filterNumber() {
    this.doHeader();
    this.numberList = this.phoneNumberList.filter((data) => {
      for (let i = 0; i < this.filterOrgArray.length; i++) {
        if (data.org_id === +(this.filterOrgArray[i])) {
          return data;
        }
      }
    });
    this.departmentList = this.deptList.filter((data) => {
      for (let i = 0; i < this.filterOrgArray.length; i++) {
        if (data.org_id === +(this.filterOrgArray[i])) {
          return data;
        }
      }
    });
  }

  getAllnumber() {
    this.apiService.getAPI(ApiEndpoints.PhoneDetail)
      .subscribe(res => {
          this.allNumber = res.payload.numbers;
          sessionStorage.setItem('allNumbers', JSON.stringify(this.allNumber));
        },
        msg => console.log(`Error: ${msg.status} ${msg.statusText}`));
  }

  onClickFilters() {
    this.filterView = true;
    this.getOrganizationData();
    this.getNumberData();
    this.getDepartmentData();
    this.getCountryData();
    this.getStateData();
    this.getCityData();
  }

  getCityData() {
    this.apiService.getAPI(ApiEndpoints.City, this.filterQueryParams())
      .subscribe((response) => {
        this.cityList = response.payload.data;
      });
  }

  getStateData() {
    this.apiService.getAPI(ApiEndpoints.State, this.filterQueryParams())
      .subscribe((response) => {
        this.stateList = response.payload.data;
      });
  }

  getCountryData() {
    this.apiService.getAPI(ApiEndpoints.Country, this.filterQueryParams())
      .subscribe((response) => {
        this.countryList = response.payload.data;
      });
  }

  getDepartmentData() {
    this.apiService.getAPI(ApiEndpoints.Department, this.filterQueryParams())
      .subscribe((response) => {
        this.departmentList = response.payload.data;
        this.deptList = response.payload.data;
      });
  }

  getOrganizationData() {
    this.apiService.getAPI(ApiEndpoints.Organization, this.filterQueryParams())
      .subscribe((response) => {
        this.organizationList = response.payload.data;
      });
  }

  getNumberData() {
    this.apiService.getAPI(ApiEndpoints.Phone, this.filterQueryParams())
      .subscribe((response) => {
        this.numberList = response.payload.data;
        this.phoneNumberList = response.payload.data;
      });
  }

  onClickExport() {
    this.apiService.getFileAPI(ApiEndpoints.EXPORT, this.queryExportParams())
      .subscribe((response) => {
        this.downloadFile(response);
      });
  }

  downloadFile(data: Response) {
    const blob = new Blob([data], {type: 'text/csv'});
    importedSaveAs(blob, 'numbers.csv');
  }

  logOut() {
    sessionStorage.clear();
    this.routes.navigate(['login']);
  }

  redirectToMenu(detail) {
    sessionStorage.setItem('phNumber', (detail.phone_number));
    this.routes.navigate(['menuDetail']);
  }

  onClickCancel() {
    this.filterOrgArray = [];
    this.filterNumberArray = [];
    this.filterDepartmentArray = [];
    this.filterCountryArray = [];
    this.filterStateArray = [];
    this.filterCityArray = [];
    this.numberList = this.phoneNumberList;
    this.departmentList = this.deptList;
    this.doHeader();
  }

  numChange(val) {
    this.pageNumber = 1;
    this.items = +val;
    this.doHeader();
  }

  queryParams(): any {
    return {
      pageNumber: this.pageNumber,
      recordsPerPage: this.items
    };
  }

  filterQueryParams(): any {
    return {
      records: 'all'
    };
  }

  searchParams(): any {
    const searchParams = {};
    if (this.filterOrgArray.length > 0) {
      searchParams['organization'] = this.filterOrgArray;
    }
    if (this.filterNumberArray.length > 0) {
      searchParams['phone'] = this.filterNumberArray;
    }
    if (this.filterDepartmentArray.length > 0) {
      searchParams['department'] = this.filterDepartmentArray;
    }
    if (this.filterCountryArray.length > 0) {
      searchParams['country'] = this.filterCountryArray;
    }
    if (this.filterStateArray.length > 0) {
      searchParams['state'] = this.filterStateArray;
    }
    if (this.filterCityArray.length > 0) {
      searchParams['city'] = this.filterCityArray;
    }

    return searchParams;
  }

  queryExportParams(): any {
    return {
      ivrNumbers: JSON.stringify(this.exportNumbers)
    };
  }

}
