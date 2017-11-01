import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Country} from './country.model';
import {AppServiceService} from '../utility/shared-services/app-service.service';
import {Headers, Http, RequestOptions} from '@angular/http';
import {ApiEndpoints} from '../utility/constants/api-endpoints';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  items = 20;
  pageNumber = 1;
  totalNumRecords: number;
  message: string;

  countryList: Country[] = [];

  tableShow = true;
  formShow = false;

  countryForm: FormGroup;
  selectCountry = null;

  constructor(private fb: FormBuilder,
              private  appService: AppServiceService,
              private http: Http,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getCountry();
  }

  recordChange(val) {
    this.pageNumber = 1;
    this.items = +val;
    this.getCountry();
  }

  getCountry() {
    // const url = `country?pageNumber=${this.pageNumber}&recordsPerPage=${this.items}`;
    this.appService.getAPI(ApiEndpoints.Country + `?pageNumber=${this.pageNumber}&recordsPerPage=${this.items}`)
      .subscribe(res => {
        this.totalNumRecords = res.pager.totalRecords;
        this.countryList = res.payload.data;
      });
  }

  searchCountry(value: string) {
    const searchName = {'country': value};
    const header = new Headers();
    header.append('search', JSON.stringify(searchName));
    header.append('Authorization', sessionStorage.getItem('currentUser'));
    const option = new RequestOptions();
    option.headers = header;

    const url = `https://mvp-dev-extensionsapi.visumenu.com/country?pageNumber=1&recordsPerPage=20&sortBy=country&sortOrder=asc`;
    // this.appService.getAPI(url,option)
    this.http.get(url, option)
      .subscribe(res => {
        this.countryList = res.json().payload.data;
        // console.log(this.countryList);
      });
  }

  addCountry(formVal: any) {
    if (this.countryForm.valid === true) {
      // const url = `country`;
      if (this.selectCountry == null) {
        this.appService.postAPI(ApiEndpoints.Country, formVal)
          .subscribe(() => {
              this.getCountry();
              this.tableShow = true;
              this.formShow = false;
              // this.details.push(res.json().payload.data);
              // console.log(this.details);
              // this.http.get(url, option)
              //   .subscribe( respon => {this.details.push(respon.json());
              //   console.log(this.details); });
            },
            msg => console.log(`Error: ${msg.status} ${msg.statusText}`));
      } else {
        this.appService.putAPI(ApiEndpoints.Country + '/' + this.selectCountry.id, formVal)
          .subscribe(res => {
            console.log(res);
            this.getCountry();
            this.tableShow = true;
            this.formShow = false;
          });
      }
    }
  }

  removeCountry(id: number, index: number) {
    this.appService.deleteAPI(ApiEndpoints.Country + `/${id}`)
      .subscribe(res => {
          this.countryList.splice(index, 1);
        }
        // (err) => {
        //   console.log(err);
        //   this.toastr.error(err.json().message);
        );
  }

  nameValidation(control: AbstractControl) {
    if (control.errors) {
      return this.message = `Name required`;
    } else {
      return null;
    }
  }

  initial(countryData: any) {
    this.countryForm = this.fb.group({
      country: [countryData ? countryData.country : '', Validators.required],
      code: [countryData ? countryData.code : ''],
      dialing_code: [countryData ? countryData.dialing_code : '']
    });
  }

  showForm(countryData: any) {
    this.tableShow = false;
    this.formShow = true;
    this.initial(countryData);
    this.selectCountry = countryData;
  }

  goPrev() {
    this.formShow = false;
    this.tableShow = true;
  }
}
