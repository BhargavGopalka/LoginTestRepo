import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppServiceService} from '../utility/shared-services/app-service.service';
import {Organization} from './organization.model';
import {ApiEndpoints} from '../utility/constants/api-endpoints';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {

  p = 1;
  items = 20;
  totalNumRecords: number;
  message: string;

  Organization: Organization[] = [];

  dataForm: FormGroup;
  selectedOrg = null;

  tableShow = true;
  formShow = false;

  constructor(private fb: FormBuilder, private appService: AppServiceService) {
  }

  ngOnInit() {
    this.getOrg();
  }

  recordChange(val) {
    this.p = 1;
    this.items = +val;
    this.getOrg();
  }

  getOrg() {
    // const url = `organization?pageNumber=${this.p}&recordsPerPage=${this.items}`;
    this.appService.getAPI(ApiEndpoints.Organization + `?pageNumber=${this.p}&recordsPerPage=${this.items}`)
      .subscribe(res => {
        console.log(res);
        this.Organization = res.payload.data;
        this.totalNumRecords = res.pager.totalRecords;
        // console.log(this.details);
      });
  }

  searchOrg(value: string) {
    const searchName = {'name': value};
    // const url = `organization?sortBy=name&sortOrder=asc&search=${JSON.stringify(searchName)}`;
    this.appService.getAPI(ApiEndpoints.Organization + `sortBy=name&sortOrder=asc&search=${JSON.stringify(searchName)}`)
      .subscribe(res => {
        this.Organization = res.payload.data;
        console.log(this.Organization);
      });
  }

  addOrg(formVal: any) {
    if (this.dataForm.valid === true) {
      // this.dataForm = this.fb.group({
      //   name: ['formVal']
      // });

      // const url = `organization`;
      if (this.selectedOrg == null) {
        this.appService.postAPI(ApiEndpoints.Organization, formVal)
          .subscribe(res => {
              console.log(res);
              this.getOrg();
              this.tableShow = true;
              this.formShow = false;
            },
            msg => console.log(`Error: ${msg.status} ${msg.statusText}`));
      } else {
        this.appService.putAPI(ApiEndpoints.Organization + '/' + this.selectedOrg.id, formVal)
          .subscribe(res => {
              console.log(res);
              // this.details.push(res.json().payload.data);
              // console.log(this.details);
              this.getOrg();
              this.tableShow = true;
              this.formShow = false;
            },
            msg => console.log(`Error: ${msg.status} ${msg.statusText}`));
      }
    }
  }

  // doEdit(id: number, formVal: any) {
  //
  //   this.addShow = true;
  //   this.show = false;
  //
  //   const header = new Headers();
  //   header.append('Authorization', sessionStorage.getItem('currentUser'));
  //
  //   const option = new RequestOptions();
  //   option.headers = header;
  //
  //   const url = `https://mvp-dev-extensionsapi.visumenu.com/organization/${id}`;
  //   this.http.put(url, formVal, option)
  //     .subscribe(res => {
  //         console.log(res.json());
  //         // this.details.push(res.json().payload.data);
  //         // console.log(this.details);
  //       },
  //       msg => console.log(`Error: ${msg.status} ${msg.statusText}`));
  // }

  removeOrg(id: number, index: number) {
    // const url = `organization/${id}`;
    this.appService.deleteAPI(ApiEndpoints.Organization + `/${id}`)
      .subscribe(res => {
        this.Organization.splice(index, 1);
        console.log(res);
        this.getOrg();
      });
  }

  nameValidation(control: AbstractControl) {
    if (control.errors) {
      return this.message = `Name is Required.`;
    } else {
      return null;
    }
  }

  intialForm(orgData: any) {
    this.dataForm = this.fb.group({
      name: [orgData ? orgData.name : '', Validators.required]
    });
  }

  showForm(orgData: any) {
    this.selectedOrg = orgData;
    this.tableShow = false;
    this.formShow = true;
    this.intialForm(orgData);
  }

  goPrev() {
    this.formShow = false;
    this.tableShow = true;
  }
}
