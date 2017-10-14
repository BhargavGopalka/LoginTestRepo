import {Component, OnInit} from '@angular/core';
import {Application} from './application.model';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppServiceService} from '../utility/shared-services/app-service.service';
import {ApiEndpoints} from '../api-endpoints';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {

  items = 20;
  pageNumber = 1;
  totalNumRecords: number;
  urlMessage: string;

  appList: Application[] = [];

  appForm: FormGroup;
  selectApp = null;

  tableShow = true;
  formShow = false;

  constructor(private fb: FormBuilder, private appService: AppServiceService) {
  }

  ngOnInit() {
    this.getApp();
  }

  numChange(val) {
    this.pageNumber = 1;
    this.items = +val;
    this.getApp();
  }

  getApp() {
    // const url = `app?pageNumber=${this.pageNumber}&recordsPerPage=${this.items}`;
    this.appService.getAPI(ApiEndpoints.App + `?pageNumber=${this.pageNumber}&recordsPerPage=${this.items}`)
      .subscribe(res => {
        console.log(res);
        this.totalNumRecords = res.pager.totalRecords;
        this.appList = res.payload.data;
      });
  }

  searchApp(value: string) {
    const searchName = {'url': value};
    // const url = `app?records=all&sortBy=url&sortOrder=asc&search=${JSON.stringify(searchName)}`;
    this.appService.getAPI(ApiEndpoints + `?records=all&sortBy=url&sortOrder=asc&search=${JSON.stringify(searchName)}`)
      .subscribe(res => {
        this.appList = res.payload.data;
        // console.log(this.stateList);
      });
  }

  urlValidation(control: AbstractControl) {
    if (control.errors === null) {
      return null;
    } else if (control.errors.required) {
      return this.urlMessage = `URL required`;
    } else if (control.errors.pattern) {
      return this.urlMessage = `It must be a URL`;
    }
  }

  addApp(formVal: any) {
    if (this.appForm.valid === true) {
      // const url = `app`;
      if (this.selectApp == null) {
        this.appService.postAPI(ApiEndpoints.App, formVal)
          .subscribe(res => {
              console.log(res);
              this.getApp();
              this.tableShow = true;
              this.formShow = false;
            },
            msg => console.log(`Error: ${msg.status} ${msg.statusText}`));
      } else {
        this.appService.putAPI(ApiEndpoints.App + '/' + this.selectApp.id, formVal)
          .subscribe(res => {
              console.log(res);
              this.getApp();
              this.tableShow = true;
              this.formShow = false;
            },
            msg => console.log(`Error: ${msg.status} ${msg.statusText}`));
      }
    }
  }

  removeApp(id: number, index: number) {
    // const url = `app/${id}`;
    this.appService.deleteAPI(ApiEndpoints.App + `/${id}`)
      .subscribe(res => {
        this.appList.splice(index, 1);
        console.log(res);
        this.getApp();
      });
  }

  initialForm(appData: any) {
    this.appForm = this.fb.group({
      url: [appData ? appData.url : '',
        [
          Validators.required,
          Validators.pattern('https?://.+')]
      ],
      description: [appData ? appData.description : '']
    });
  }


  showForm(appData: any) {
    this.selectApp = appData;
    this.tableShow = false;
    this.formShow = true;
    this.initialForm(appData);
  }

  goPrev() {
    this.formShow = false;
    this.tableShow = true;
  }
}
