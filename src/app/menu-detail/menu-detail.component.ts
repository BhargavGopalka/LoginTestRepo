import {Component, OnInit} from '@angular/core';
import {AppServiceService} from '../utility/shared-services/app-service.service';
import {Router} from '@angular/router';
import {ApiEndpoints} from '../utility/constants/api-endpoints';
import {saveAs as importedSaveAs} from 'file-saver';
import {FormControl, FormGroup} from '@angular/forms';
import {Constant} from '../utility/constants/constants';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.component.html',
  styleUrls: ['./menu-detail.component.css'],
})
export class MenuDetailComponent implements OnInit {

  childMenu = false;
  treeDetail: any[] = [];
  number: string;
  phNumber: any;
  allNumber: any[];
  index: any;
  detail: any = {};
  dataInfo: any = {};
  showForm = false;
  updatedIvr: any = null;
  exportNumbers = [];
  menuDetail = true;
  generalInfo = false;
  workingHoursForm: FormGroup;
  workingHours = [];
  ivr_tz: string;
  workingArray: any;
  filesToUpload: any;
  uploadedUserFile: string;
  uploadedCompanyFile: string;
  showUserRecording = false;
  showCompanyRecording = false;

  timeZone = new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1];
  timeFilterArray = Constant.timeArray;

  menuDiscoveryStatus = false;

  constructor(private appService: AppServiceService,
              private router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.number = (sessionStorage.getItem('phNumber'));
    this.exportNumbers = [this.number];
    this.allNumber = JSON.parse(sessionStorage.getItem('allNumbers'));
    this.getTreeDetails();
  }


  getTreeDetails() {
    this.index = this.allNumber.findIndex(num => num === this.number);
    this.appService.getCrawlerAPI(`ivr/tree/` + (+(this.number)))
      .subscribe((response) => {
        this.workingArray = JSON.stringify(response.data.info.ivr_working_hours);
        this.detail = response.data.info;
        this.treeDetail = response.data.tree;
        this.dataInfo = response.data.info;
        this.updatedIvr = this.treeDetail[0];
        this.appService.setIVR(this.updatedIvr);
        this.workingHours = response.data.info.ivr_working_hours;
        this.ivr_tz = response.data.info.ivr_tz;
        // debugger;
        this.uploadedUserFile = response.data.info.client_announcement;
        this.uploadedCompanyFile = response.data.info.company_announcement;
        this.createWorkingHoursForm();
      });
  }

  onChangingTimeZone(value) {
    const formValue = {};
    formValue['ivr_tz'] = value;
    const params = new URLSearchParams();
    for (const key in formValue) {
      if (formValue.hasOwnProperty(key)) {
        params.set(key, formValue[key]);
      }
    }
    this.appService.patchAPI(ApiEndpoints.IVR + '/' + this.number, params.toString())
      .subscribe();
  }

  createWorkingHoursForm() {
    this.workingHoursForm = new FormGroup({
      ivr_tz: new FormControl(this.dataInfo.ivr_tz)
    });
  }

  onChangeSelectedDays(index: number, isSelected: boolean) {
    this.workingHours[index].isActive = (!isSelected);
    if (!isSelected === false) {
      this.workingHours[index].timeFrom = null;
      this.workingHours[index].timeTill = null;
    } else {
      this.workingHours[index].timeFrom = '09:00';
      this.workingHours[index].timeTill = '17:00';
    }

    const value = {};
    value['ivr_timezone'] = this.timeZone;
    value['ivr_working_hours'] = JSON.stringify(this.workingHours);

    const params = new URLSearchParams();
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        params.set(key, value[key]);
      }
    }

    this.appService.patchAPI(ApiEndpoints.IVR + '/' + this.number, params.toString())
      .subscribe(() => {
        this.getTreeDetails();
      });
  }

  onChangeStartingTime(index: number, fromValue) {
    // debugger;
    const defaultWorkingHours = JSON.parse(this.workingArray)[index].timeFrom;
    if (fromValue === '' || fromValue === null || fromValue === undefined) {
      this.workingHours[index].timeFrom = defaultWorkingHours;
    } else {
      if (fromValue.length === 3 || fromValue.length > 5) {
        this.toastr.error('Valid Time Required!');
        this.workingHours[index].timeFrom = defaultWorkingHours;
      }
      if (fromValue.length === 1) {
        const patternOne = /[0-9]/;
        if (!patternOne.test(fromValue)) {
          // invalid character, prevent input
          event.preventDefault();
          this.toastr.error('Valid Time Required!');
          this.workingHours[index].timeFrom = defaultWorkingHours;
        } else {
          this.workingHours[index].timeFrom = `0${fromValue}:00`;
          this.updateTime();
        }
      }
      if (fromValue.length === 2) {
        const patternTwo = /([0-1][0-9]|2[0-3])/;
        if (!patternTwo.test(fromValue)) {
          // invalid character, prevent input
          event.preventDefault();
          this.toastr.error('Valid Time Required!');
          this.workingHours[index].timeFrom = defaultWorkingHours;
        } else {
          this.workingHours[index].timeFrom = `${fromValue}:00`;
          this.updateTime();
        }
      }
      if (fromValue.length === 4) {
        const patternFour = /([0-1][0-9]|2[0-3])([0-5][0-9])/;
        if (!patternFour.test(fromValue)) {
          // invalid character, prevent input
          event.preventDefault();
          this.toastr.error('Valid Time Required!');
          this.workingHours[index].timeFrom = defaultWorkingHours;
        } else {
          const hour = fromValue.slice(0, 2);
          const min = fromValue.slice(2, 4);
          this.workingHours[index].timeFrom = `${hour}:${min}`;
          this.updateTime();
        }
      }
      if (fromValue.length === 5) {
        // const patternFour = /([0-2][0-9]:[0-5][0-9])/;
        // const patternFive = /((\b2[0-3]\b|\b[0-1]?[0-9]\b):[0-5][0-9])/;
        const patternFive = /(([0-1][0-9]|2[0-3]):[0-5][0-9])/;
        if (!patternFive.test(fromValue)) {
          // invalid character, prevent input
          event.preventDefault();
          this.toastr.error('Valid Time Required!');
          this.workingHours[index].timeFrom = defaultWorkingHours;
        } else {
          this.workingHours[index].timeFrom = fromValue;
          this.updateTime();
        }
      }
    }
  }

  updateTime() {
    // this.workingHours[index].timeFrom = fromValue;
    const value = {};
    value['ivr_working_hours'] = JSON.stringify(this.workingHours);

    const params = new URLSearchParams();
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        params.set(key, value[key]);
      }
    }

    this.appService.patchAPI(ApiEndpoints.IVR + '/' + this.number, params.toString())
      .subscribe(() => {
        this.getTreeDetails();
      });
  }

  onChangeEndTime(index: number, tillValue) {
    const defaultWorkingHours = JSON.parse(this.workingArray)[index].timeTill;
    if (tillValue === '' || tillValue === null || tillValue === undefined) {
      this.workingHours[index].timeTill = defaultWorkingHours;
    } else {
      if (tillValue.length === 3 || tillValue.length > 5) {
        this.toastr.error('Valid Time Required!');
        this.workingHours[index].timeTill = defaultWorkingHours;
      }
      if (tillValue.length === 1) {
        const patternOne = /[0-9]/;
        if (!patternOne.test(tillValue)) {
          // invalid character, prevent input
          event.preventDefault();
          this.toastr.error('Valid Time Required!');
          this.workingHours[index].timeTill = defaultWorkingHours;
        } else {
          this.workingHours[index].timeTill = `0${tillValue}:00`;
          this.updateTime();
        }
      }
      if (tillValue.length === 2) {
        const patternTwo = /([0-1][0-9]|2[0-3])/;
        if (!patternTwo.test(tillValue)) {
          // invalid character, prevent input
          event.preventDefault();
          this.toastr.error('Valid Time Required!');
          this.workingHours[index].timeTill = defaultWorkingHours;
        } else {
          this.workingHours[index].timeTill = `${tillValue}:00`;
          this.updateTime();
        }
      }
      if (tillValue.length === 4) {
        const patternFour = /([0-1][0-9]|2[0-3])([0-5][0-9])/;
        if (!patternFour.test(tillValue)) {
          // invalid character, prevent input
          event.preventDefault();
          this.toastr.error('Valid Time Required!');
          this.workingHours[index].timeTill = defaultWorkingHours;
        } else {
          const hour = tillValue.slice(0, 2);
          const min = tillValue.slice(2, 4);
          this.workingHours[index].timeTill = `${hour}:${min}`;
          this.updateTime();
        }
      }
      if (tillValue.length === 5) {
        // const patternFour = /([0-2][0-9]:[0-5][0-9])/;
        // const patternFive = /((\b2[0-3]\b|\b[0-1]?[0-9]\b):[0-5][0-9])/;
        const patternFive = /(([0-1][0-9]|2[0-3]):[0-5][0-9])/;
        if (!patternFive.test(tillValue)) {
          // invalid character, prevent input
          event.preventDefault();
          this.toastr.error('Valid Time Required!');
          this.workingHours[index].timeTill = defaultWorkingHours;
        } else {
          this.workingHours[index].timeTill = tillValue;
          this.updateTime();
        }
      }
    }
  }

  fileChange(event, number) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.filesToUpload = fileList;
      const formValue = {};
      formValue['ivr_number'] = this.number;
      formValue['convertast'] = true;
      formValue['stripesilenc'] = true;
      if (number === 1) {
        formValue['column'] = 'client_announcement';
      } else {
        formValue['column'] = 'company_announcement';
      }
      this.appService.postAPI(ApiEndpoints.FILES, formValue, this.filesToUpload)
        .subscribe((response) => {
          const url = response.data.URL;
          if (number === 1) {
            this.showUserRecording = true;
            this.uploadedUserFile = `http://${url}`;
          } else {
            this.showCompanyRecording = true;
            this.uploadedCompanyFile = `http://${url}`;
          }
        });
    }
  }

  onClickExport() {
    this.appService.getFileAPI(ApiEndpoints.EXPORT, this.queryExportParams())
      .subscribe((response) => {
        this.downloadFile(response);
      });
  }

  downloadFile(data: Response) {
    const blob = new Blob([data], {type: 'text/csv'});
    importedSaveAs(blob, 'numbers.csv');
  }

  onClickNext() {
    this.appService.setIVR(null);
    this.appService.setView(false);
    if (this.index === this.allNumber.length - 1) {
      this.index = -1;
    }
    this.number = this.allNumber[this.index + 1];
    sessionStorage.setItem('phNumber', (this.number));
    this.childMenu = false;
    this.getTreeDetails();
  }

  onClickPrevious() {
    this.appService.setIVR(null);
    this.appService.setView(false);
    if (this.index === 0) {
      this.index = this.allNumber.length;
    }
    this.number = this.allNumber[this.index - 1];
    sessionStorage.setItem('phNumber', (this.number));
    this.childMenu = false;
    this.getTreeDetails();
  }

  goBack() {
    this.appService.setIVR(null);
    this.appService.setView(false);
    this.router.navigate(['infoTable']);
  }

  openChildView(details) {
    this.childMenu = !this.childMenu;
    this.appService.setIVR(details);
    this.appService.setView(false);
  }

  showFormView(details) {
    this.appService.setIVR(details);
    this.appService.setView(false);
  }

  gettingUpdatedIvr(ivr) {
    this.updatedIvr = ivr;
  }

  queryExportParams(): any {
    return {
      ivrNumbers: JSON.stringify(this.exportNumbers)
    };
  }

  showGeneralInfo() {
    this.generalInfo = true;
    this.menuDetail = false;
  }

  showMenuDetail() {
    this.generalInfo = false;
    this.menuDetail = true;
  }

}
