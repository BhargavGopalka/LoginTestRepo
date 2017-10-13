import {Component, OnInit} from '@angular/core';
import {Department} from './department.model';
import {AppServiceService} from '../app-service.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiEndpoints} from '../api-endpoints';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  items = 20;
  pageNumber = 1;
  totalNumRecords: number;

  showTable = true;
  showForm = false;

  departmentList: Department[] = [];
  organizations = [];

  departmentForm: FormGroup;
  selectDepartment = null;

  constructor(private appService: AppServiceService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.getDepartment();
  }

  numChange(val) {
    this.pageNumber = 1;
    this.items = +val;
    this.getDepartment();
  }

  getDepartment(): void {
    // const url = `department?pageNumber=${this.pageNumber}&recordsPerPage=${this.items}`;
    this.appService.getAPI(ApiEndpoints.Department + `?pageNumber=${this.pageNumber}&recordsPerPage=${this.items}`)
      .subscribe(res => {
        console.log(res);
        this.totalNumRecords = res.pager.totalRecords;
        this.departmentList = res.payload.data;
      });
  }

  getOrg() {

    // const url = `organization`;
    this.appService.getAPI(ApiEndpoints.Department)
      .subscribe(res => {
        console.log(res);
        this.organizations = res.payload.data;
      });
  }

  searchDep(value: string) {
    const searchName = {'department': value};
    // const url = `department?records=all&sortBy=department&sortOrder=asc&search=${JSON.stringify(searchName)}`;
    this.appService.getAPI(ApiEndpoints.Department + `?records=all&sortBy=department&sortOrder=asc&search=${JSON.stringify(searchName)}`)
      .subscribe(res => {
        this.departmentList = res.payload.data;
        // console.log(this.departmentList);
      });
  }

  removeDepartment(id: number, index: number): void {
    // const url = `department/${id}`;
    this.appService.deleteAPI(ApiEndpoints.Department + `/${id}`)
      .subscribe(res => {
        this.departmentList.splice(index, 1);
        console.log(res);
      });
  }

  addDepartment(formValue: any) {
    if (this.selectDepartment == null) {
      // const url = `department`;
      this.appService.postAPI(ApiEndpoints.Department, formValue)
        .subscribe(res => {
            console.log(res);
            this.getDepartment();
            this.showTable = true;
            this.showForm = false;
          },
          msg => {
            console.log(`Error: ${msg.status} ${msg.statusText}`);
          });
    } else {
      // const url = `department/${this.selectDepartment.id}`;
      this.appService.putAPI(ApiEndpoints.Department + `/${this.selectDepartment.id}`, formValue)
        .subscribe(res => {
            console.log(res);
            this.getDepartment();
            this.showTable = true;
            this.showForm = false;
          },
          msg => {
            console.log(`Error: ${msg.status} ${msg.statusText}`);
          });
    }
  }

  initial(departmentData: any) {
    this.departmentForm = this.fb.group({
      org_id: [departmentData ? departmentData.org_id : ''],
      name: [departmentData ? departmentData.department : '']
    });
  }

  goPrev() {
    this.showForm = false;
    this.showTable = true;
  }

  showProperty(departmentData: any) {
    this.showForm = true;
    this.showTable = false;
    this.initial(departmentData);
    this.selectDepartment = departmentData;
    this.getOrg();
  }

}
