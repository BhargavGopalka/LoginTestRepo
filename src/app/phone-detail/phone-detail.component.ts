import {Component, OnInit} from '@angular/core';
import {PhoneDetail} from './phoneDetail.model';
import {AppServiceService} from '../utility/shared-services/app-service.service';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Organization} from '../organization/organization.model';
import {Country} from '../country/country.model';
import {State} from '../state-info/state.model';
import {City} from '../city/city.model';
import {Location} from '../location/location.model';
import {ApiEndpoints} from '../utility/constants/api-endpoints';
import {ActivatedRoute} from '@angular/router';
import {Department} from '../department/department.model';
import {Observable} from 'rxjs/Observable';
import {DomSanitizer} from '@angular/platform-browser';
import {Constant, ValidFileTypeArray} from '../utility/constants/constants';
import {ToastrService} from 'ngx-toastr';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-phone-detail',
  templateUrl: './phone-detail.component.html',
  styleUrls: ['./phone-detail.component.css']
})
export class PhoneDetailComponent implements OnInit {
  p = 1;
  tPage = null;
  pageItems = 20;
  phoneMessage: string;
  typeMessage: string;
  orgMessage: string;
  countryMessage: string;
  postalMessage: string;
  departID: number = null;
  selectedFile: any = null;

  showTable = true;
  showForm = false;
  showRemoveButton = false;
  addWindow = false;

  numberList: PhoneDetail[] = [];
  organizationList: Organization[] = [];
  countryList: Country[] = [];
  stateList: State[] = [];
  selectedState: State[] = [];
  selectedCity: City[] = [];
  cityList: City[] = [];
  streetList: Location[] = [];
  departmentList: Department[] = [];
  // selectedDept: Department[] = [];

  numberForm: FormGroup;
  selectNumber = null;

  constructor(private appService: AppServiceService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private _sanitizer: DomSanitizer,
              private toastr: ToastrService,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.countryList = this.route.snapshot.data['countryList'].payload.data;
    this.firstFunction();
  }

  // After selecting file
  onFileSelect(inputFile) {
    console.log(inputFile.files[0]);
    const file = inputFile.files[0];
    if (file) {
      if (!ValidFileTypeArray.includes(file.type)) {
        this.toastr.error('Please select valid file');
        inputFile.value = '';
        return;
      }
      this.selectedFile = file;
    }
  }

  // Uploading selected file
  uploadFile() {
    if (this.selectedFile) {
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile);

      // const header = new HttpHeaders();
      // header.set('Authorization', sessionStorage.getItem('currentUser'));
      // const option = new HttpRequest < any >;
      // option.headers = header;

      this.http.post(Constant.baseUrl + ApiEndpoints.IMPORT_EXCEL, formData, {
        headers: new HttpHeaders().set('Authorization', sessionStorage.getItem('currentUser')),
      })
        .subscribe(res => {
          this.selectedFile = null;
          this.addWindow = false;
          console.log(res);
          // this.toastr.success(res);
        });
    } else {
      this.toastr.error('Please select file');
    }
  }

  onChange(value) {
    this.p = 1;
    this.pageItems = +value;
    this.getNumberDetail();
    // console.log(this.pageItems);
  }

  departmentArray = (keyword: any): Observable<any[]> => {
    const searchParam = JSON.stringify({'department': keyword});
    return this.appService.getAPI(ApiEndpoints.Department + `?records=all&search=${searchParam}`);
  }

  listFormatter = (data: any) => {
    const html = `<span>${data.department}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  getNumberDetail() {
    // console.log(this.pageItems);
    // const url = `phoneDetail?pageNumber=${this.p}&recordsPerPage=${this.pageItems}&sortBy=org&sortOrder=asc`;
    this.appService.getAPI(ApiEndpoints.PhoneDetail + `?pageNumber=${this.p}&recordsPerPage=${this.pageItems}&sortBy=org&sortOrder=asc`)
      .subscribe(res => {
        // console.log(res);
        this.tPage = res.pager.totalRecords;
        this.numberList = res.payload.data;
      });
  }

  getDept() {
    if (this.departmentList.length === 0) {
      this.appService.getAPI(ApiEndpoints.Department + `?records=all`)
        .subscribe(res => {
          this.departmentList = res.payload.data;
        });
    }
    console.log(this.departmentList);
  }

  onSelectDepartment(value) {
    console.log(value);
    this.departID = value;
    console.log(this.departID);
    // this.selectedDept = this.departmentList.filter(depart => {
    //   return depart.id === value;
    // });
    // console.log(this.selectedDept);
  }

  getOrg() {
    if (this.organizationList.length === 0) {
      // const url = `organization`;
      this.appService.getAPI(ApiEndpoints.Organization)
        .subscribe(res => {
          // console.log(res);
          this.organizationList = res.payload.data;
        });
    }
  }

  // getCountry() {
  //   if (this.countryList.length === 0) {
  //     // const url = `country`;
  //     this.appService.getAPI(ApiEndpoints.Country)
  //       .subscribe(res => {
  //         // console.log(res);
  //         this.countryList = res.payload.data;
  //       });
  //   }
  // }

  getState() {
    if (this.stateList.length === 0) {
      // const url = `state`;
      this.appService.getAPI(ApiEndpoints.State)
        .subscribe(res => {
          // console.log(res);
          this.stateList = res.payload.data;
        });
    }
  }

  onSelectState(value: string) {
    console.log(this.stateList);
    this.selectedState = this.stateList.filter(state => {
      return state.country_id === +value;
    });
    // console.log(this.selectedState);
  }

  getCity() {
    if (this.cityList.length === 0) {
      // const url = `city`;
      this.appService.getAPI(ApiEndpoints.City)
        .subscribe(res => {
          // console.log(res);
          this.cityList = res.payload.data;
        });
    }
  }

  onSelectCity(value: string) {
    this.selectedCity = this.cityList.filter(city => {
      return city.state_id === +value;
    });
    // console.log(this.selectedCity);
  }

  getStreet() {
    if (this.streetList.length === 0) {
      // const url = `location?records=all`;
      this.appService.getAPI(ApiEndpoints.Location + `?records=all`)
        .subscribe(res => {
          console.log(res);
          this.streetList = res.payload.data;
        });
    }
  }

  phoneValidation(control: AbstractControl) {
    if (control.errors === null) {
      return null;
    } else if (control.errors.required) {
      return this.phoneMessage = `Phone Number is required`;
    } else if (control.errors.pattern) {
      return this.phoneMessage = `It must be Number`;
    } else if (control.value.length < 10) {
      return this.phoneMessage = `Minimum 10 digits`;
    } else if (control.value.length > 11) {
      return this.phoneMessage = `Maximum 11 digits`;
    }
  }

  typeValidation(control: AbstractControl) {
    if (control.errors === null) {
      return null;
    } else if (control.errors.required) {
      return this.typeMessage = `Must select a Phone type`;
    }
  }

  orgValidation(control: AbstractControl) {
    if (control.errors === null) {
      return null;
    } else if (control.errors.required) {
      return this.orgMessage = `Must select a Organization`;
    }
  }

  countryValidation(control: AbstractControl) {
    if (control.errors === null) {
      return null;
    } else if (control.errors) {
      return this.countryMessage = `Must select a Country`;
    }
  }

  postalValidation(control: AbstractControl) {
    if (control.errors === null) {
      return null;
    } else if (control.errors.pattern) {
      return this.postalMessage = `It must be Numbers`;
    }
  }

  addNumber(formValue: any, isValid: boolean) {
    if (this.numberForm.valid === true) {
      if (this.selectNumber == null) {
        formValue.department = JSON.stringify(formValue.department);
        console.log(formValue.department);
        this.appService.postAPI(ApiEndpoints.Phone, formValue)
          .subscribe(() => {
              this.getNumberDetail();
              this.selectedState = [];
              this.selectedCity = [];
              this.showTable = true;
              this.showForm = false;
            },
            msg => {
              console.log(`Error: ${msg.status} ${msg.statusText}`);
            });
      } else {
        // const url = `phone/${this.selectNumber.phone_id}`;
        this.appService.putAPI(ApiEndpoints.Phone + `/${this.selectNumber.phone_id}`, formValue)
          .subscribe(() => {
              this.getNumberDetail();
              this.showTable = true;
              this.showForm = false;
            },
            msg => {
              console.log(`Error: ${msg.status} ${msg.statusText}`);
            });
      }
    }
  }

  removeNumber(id: number, index: number): void {
    // const url = `phone/${id}`;
    this.appService.deleteAPI(ApiEndpoints.Phone + `/${id}`)
      .subscribe(() => {
        this.numberList.splice(index, 1);
      });
  }

  initial(numberData: any) {
    this.numberForm = this.fb.group({
      phone_number: [numberData ? numberData.phone_number : '',
        [
          Validators.required,
          Validators.pattern('[0-9]*'),
          Validators.maxLength(11),
          Validators.minLength(10)
        ]
      ],
      phone_type_id: [numberData ? numberData.phone_list_id : '', Validators.required],
      org_id: [numberData ? numberData.org_id : '', Validators.required],
      country_id: [numberData ? numberData.country_id : '', Validators.required],
      state_id: [numberData ? numberData.state_id : ''],
      city_id: [numberData ? numberData.city_id : ''],
      street: [numberData ? numberData.street : ''],
      postal_code: [numberData ? numberData.postal_code : '', Validators.pattern('[0-9]*')],
      department: this.fb.array([this.departFormArray()]),
      isCrawl: [numberData ? numberData.isCrawl : false],
    });
  }

  departFormArray() {
    return this.fb.group({
      // deptId: new FormControl(''),
      dept: new FormControl(''),
      extension: new FormControl('')
    });
  }

  onAddDept() {
    (<FormArray>this.numberForm.get('department')).push(this.departFormArray());
    this.showRemoveButton = true;
  }

  onRemoveDept(i: number) {
    (<FormArray>this.numberForm.get('department')).removeAt(i);
  }

  goPrev() {
    this.selectedState = [];
    this.selectedCity = [];
    this.showForm = false;
    this.showTable = true;
  }

  showProperty(numberData: any) {
    this.showForm = true;
    this.showTable = false;
    this.initial(numberData);
    this.selectNumber = numberData;
  }

  firstFunction() {
    this.getDept();
    this.getOrg();
    this.getState();
    this.getCity();
    // this.getCountry();
    this.getStreet();
    this.getNumberDetail();
  }
}
