import {Component, OnInit} from '@angular/core';
import {Application} from './application.model';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppServiceService} from '../utility/shared-services/app-service.service';
import {ApiEndpoints} from '../utility/constants/api-endpoints';
import {Organization} from '../organization/organization.model';

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

  orgsItems = 20;
  pageNumberOrg = 1;
  totalNumOrgs: number;
  total: number;

  appList: Application[] = [];
  organizationList: Organization[] = [];
  allOrgList: Organization[] = [];
  selectedOrganization = [];
  allChecked = false;
  showOrg = false;
  assignOrganization = [];
  assignOrgList = [];
  assignChecked = false;
  selectedAssignOrgs = [];
  currentId = null;
  showAllOrgView = false;
  showAllOrgList = [];
  showAllOrgName = '';
  randomNumber = -1;
  anotherShowOrgList = [];

  appForm: FormGroup;
  selectApp = null;

  tableShow = true;
  formShow = false;

  constructor(private fb: FormBuilder, private appService: AppServiceService) {
  }

  ngOnInit() {
    this.getApp();
    this.getOrganizationData();
  }

  numChange(val) {
    this.pageNumber = 1;
    this.items = +val;
    this.getApp();
  }

  numChangeShowOrg(val) {
    if (this.randomNumber === -1) {
      this.pageNumberOrg = 1;
      this.orgsItems = +val;
      this.showingAllOrganizations();
    } else {
      this.pageNumberOrg = 1;
      this.orgsItems = +val;
    }
  }

  getApp() {
    // const url = `app?pageNumber=${this.pageNumber}&recordsPerPage=${this.items}`;
    this.appService.getAPI(ApiEndpoints.App, {
      pageNumber: this.pageNumber,
      recordsPerPage: this.items,
      sortBy: 'url',
      sortOrder: 'asc'
    })
      .subscribe(res => {
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
      formVal['orgs'] = JSON.stringify(this.selectedOrganization);
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

  getOrganizationData() {
    this.appService.getAPI(ApiEndpoints.Organization, {records: 'all'}).subscribe((response) => {
      this.organizationList = response.payload.data;
      this.allOrgList = response.payload.data;
    });
  }

  onCheckOrganization(event) {
    const value = +(event.target.value);
    if (event.target.checked === true) {
      this.selectedOrganization.push(value);
    } else {
      const position = this.selectedOrganization.indexOf(value);
      this.selectedOrganization.splice(position, 1);
    }
  }

  onSelectAllOrganization(event) {
    if (event.target.checked === true) {
      this.allChecked = true;
      this.organizationList.filter((org) => {
        this.selectedOrganization.push(org.id);
      });
    } else {
      this.allChecked = false;
      this.selectedOrganization = [];
    }
  }

  onClickAssignOrg(id) {
    this.showOrg = !(this.showOrg);
    this.currentId = id;
    this.appService.getAPI(ApiEndpoints.App + '/' + id)
      .subscribe((response) => {
        this.assignChecked = true;
        this.assignOrganization = response.payload.data.orgs;
        this.assignOrganization.filter((data) => {
          data.checked = true;
          this.selectedAssignOrgs.push(data.id);
        });
        this.assignOrgList = response.payload.data.orgs;
      });
  }

  filterAssignOrganization(value) {
    if (value === '') {
      this.assignOrganization = this.assignOrgList;
    } else {
      const lowerCaseValue = value.toLowerCase();
      const filterArray = this.allOrgList.filter((data) => {
        if (data.name.toLowerCase().indexOf(lowerCaseValue) >= 0) {
          return data;
        }
      });
      this.assignOrganization = filterArray;
    }
    this.checkedItems();
  }

  onChangingAssignOrgs(event) {
    const value = +(event.target.value);
    if (event.target.checked === true) {
      this.selectedAssignOrgs.push(value);
      this.allOrgList.filter((data) => {
        if (data.id === value) {
          this.assignOrgList.push(data);
          data.checked = true;
        }
      });

      this.anotherShowOrgList.filter((data) => {
        if (data.id === value) {
          data.checked = true;
        }
      });
    } else {
      const position = this.selectedAssignOrgs.indexOf(value);
      this.selectedAssignOrgs.splice(position, 1);
      this.assignOrgList = this.assignOrgList.filter(data => {
        if (data.id !== value) {
          return data;
        } else {
          data.checked = false;
        }
      });

      this.anotherShowOrgList.filter((data) => {
        if (data.id === value) {
          data.checked = false;
        }
      });
      this.assignOrganization = this.assignOrgList;
    }
    const val = {};
    val['orgs'] = JSON.stringify(this.selectedAssignOrgs);
    this.appService.putAPI(ApiEndpoints.App + '/' + this.currentId, val)
      .subscribe();
  }

  checkedItems() {
    this.assignOrganization.filter((data) => {
      for (let i = 0; i < this.assignOrgList.length; i++) {
        if (data.id === this.assignOrgList[i].id) {
          return data.checked = true;
        } else {
          continue;
        }
      }
      return data.checked = false;
    });
  }

  filterOrganization(value) {
    const lowerCaseValue = value.toLowerCase();
    const filterArray = this.allOrgList.filter((data) => {
      if (data.name.toLowerCase().indexOf(lowerCaseValue) >= 0) {
        return data;
      }
    });
    this.organizationList = filterArray;
  }

  onClickShowAll() {
    this.showAllOrgView = true;
    this.showingAllOrganizations();
  }

  showingAllOrganizations(val?) {
    this.showAllOrgName = val;
    this.appService.getAPI(ApiEndpoints.Organization, {
      pageNumber: this.pageNumberOrg,
      recordsPerPage: this.orgsItems
    }, {'name': this.showAllOrgName})
      .subscribe((response) => {
        this.totalNumOrgs = response.pager.totalRecords;
        this.total = response.pager.totalRecords;
        this.showAllOrgList = response.payload.data;
        this.anotherShowOrgList = response.payload.data;
        this.showAllOrgList.filter((data) => {
          for (let i = 0; i < this.assignOrgList.length; i++) {
            if (data.id === this.assignOrgList[i].id) {
              return data.checked = true;
            } else {
              continue;
            }
          }
          return data.checked = false;
        });
      });
  }

  onClickAssignButton() {
    this.orgsItems = 20;
    this.pageNumberOrg = 1;
    if (this.randomNumber === -1) {
      this.randomNumber = 1;
      this.showAllOrgList = this.assignOrgList;
      this.totalNumOrgs = this.showAllOrgList.length;
    } else {
      this.showAllOrgList = this.anotherShowOrgList;
      this.randomNumber = -1;
      this.totalNumOrgs = this.total;
    }
    this.pageNumberOrg = 1;
    this.orgsItems = 20;
  }

  onPageChange(event) {
    if (this.randomNumber === -1) {
      this.pageNumberOrg = event;
      this.showingAllOrganizations();
    } else {
      this.pageNumberOrg = event;
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
      description: [appData ? appData.description : ''],
      orgs: ['']
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
