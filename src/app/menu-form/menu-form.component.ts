import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AppServiceService} from '../utility/shared-services/app-service.service';
import {ApiEndpoints} from '../utility/constants/api-endpoints';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.css']
})
export class MenuFormComponent implements OnInit {

  @Input() treeItem: any;
  subtypeList: any[] = [];

  showForm = true;
  addLeafForm = false;
  crawlerForm: FormGroup;
  leafForm: FormGroup;
  parentView = false;
  dtmf = '';
  parentDTMF = '';
  parentSTIME = '';
  sTime = '';
  sTimeArray = [];
  dtmfSTimeArray = [];

  recordingStatus = 'No Status';
  transcribingStatus = 'No Status';
  parsingoftextStatus = 'No Status';
  autoCrawlerMessage = 'Start';

  menuDiscoveryStatus = false;

  constructor(private appService: AppServiceService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.createLeafForm();
    this.getUpdatedIVR();
    this.getSubtypeList();
  }

  createCrawlerForm() {
    this.getParentView();
    this.showForm = true;
    if (this.treeItem && this.treeItem.ivr_menu_dtmf_seq !== null) {
      this.dtmf = this.treeItem.ivr_menu_dtmf_seq.substr(this.treeItem.ivr_menu_dtmf_seq.length - 1);
      this.parentDTMF = this.treeItem.ivr_menu_dtmf_seq.substring(0, this.treeItem.ivr_menu_dtmf_seq.length - 1);
    }
    if (this.treeItem && this.treeItem.ivr_menu_stime !== null) {
      this.sTime = this.treeItem.ivr_menu_stime.substr(this.treeItem.ivr_menu_stime.length - 2);
      this.parentSTIME = this.treeItem.ivr_menu_stime.substring(0, this.treeItem.ivr_menu_stime.length - 2);
    }
    this.crawlerForm = new FormGroup({
      ivr_menu_name: new FormControl(this.treeItem ? this.treeItem.ivr_menu_name : ''),
      ivr_menu_name_short: new FormControl(this.treeItem ? this.treeItem.ivr_menu_name_short : ''),
      ivr_calling_type: new FormControl(this.treeItem ? this.treeItem.ivr_calling_type : 'DIRECT'),
      ivr_menu_subtype: new FormControl(this.treeItem ? this.treeItem.ivr_menu_subtype : ''),
      parentDTMF: new FormControl(this.treeItem ? this.dtmf : ''),
      ivr_menu_dtmf_seq: new FormControl(this.treeItem ? this.treeItem.ivr_menu_dtmf_seq : ''),
      parentSTIME: new FormControl(''),
      sTime: new FormControl(this.treeItem ? this.createStime() : '')
    });
  }

  createLeafForm() {
    this.leafForm = new FormGroup({
      ivr_menu_name: new FormControl(''),
      ivr_menu_name_short: new FormControl(''),
      ivr_menu_subtype: new FormControl('INFO'),
      ivr_calling_type: new FormControl('DIRECT'),
      parentDTMF: new FormControl('0'),
      ivr_menu_dtmf_seq: new FormControl(''),
      parentSTIME: new FormControl(''),
      sTime: new FormControl('')
    });
  }

  getUpdatedIVR() {
    this.appService.getIVR()
      .subscribe((ivr) => {
        this.treeItem = ivr;
        this.getStatusMessages();
        this.createStime();
        this.createCrawlerForm();
      });
  }

  getStatusMessages() {
    if (this.treeItem) {
      if (this.treeItem.ivr_menu_pattern_matching_status === 'Yes') {
        this.parsingoftextStatus = 'Done';
      }
      if (this.treeItem.ivr_menu_pattern_matching_status === 'InProcess') {
        this.parsingoftextStatus = 'In Process';
      }
      if (this.treeItem.ivr_menu_pattern_matching_status === 'No') {
        this.parsingoftextStatus = 'In queue';
      }
      if (this.treeItem.ivr_menu_pattern_matching_status === 'Error') {
        this.parsingoftextStatus = 'Error';
      }
      if (this.treeItem.ivr_menu_pattern_matching_status === '') {
        this.parsingoftextStatus = 'No Status';
      }

      if (this.treeItem.ivr_menu_trans_status === 'Yes') {
        this.transcribingStatus = 'Done';
      }
      if (this.treeItem.ivr_menu_trans_status === 'InProcess') {
        this.transcribingStatus = 'In Process';
      }
      if (this.treeItem.ivr_menu_trans_status === 'No') {
        this.transcribingStatus = 'In queue';
      }
      if (this.treeItem.ivr_menu_trans_status === 'Error') {
        this.transcribingStatus = 'Error';
      }
      if (this.treeItem.ivr_menu_trans_status === '') {
        this.transcribingStatus = 'No Status';
      }

      if (this.treeItem.ivr_menu_voice_rec_status === 'Yes') {
        this.recordingStatus = 'Done';
      }
      if (this.treeItem.ivr_menu_voice_rec_status === 'InProcess') {
        this.recordingStatus = 'In Process';
      }
      if (this.treeItem.ivr_menu_voice_rec_status === 'No') {
        this.recordingStatus = 'In queue';
      }
      if (this.treeItem.ivr_menu_voice_rec_status === 'Error') {
        this.recordingStatus = 'Error';
      }
      if (this.treeItem.ivr_menu_voice_rec_status === '') {
        this.recordingStatus = 'No Status';
      }
    }
  }

  getParentView() {
    this.appService.getView()
      .subscribe((boolean) => {
        this.parentView = boolean;
      });
  }

  getSubtypeList() {
    this.appService.getCrawlerAPI(`menu/subtypes`)
      .subscribe((response) => {
        this.subtypeList = response.data.subtypes;
      });
  }

  updateCrawlerDetail(param, value) {
    if (this.treeItem[param] !== value) {
      if (value !== null && value !== '' && value !== undefined) {
        const formValue = {};
        formValue['param'] = param;
        formValue['value'] = value;

        const myParams = new URLSearchParams();
        myParams.append(formValue['param'], formValue['value']);

        this.appService.patchAPI(ApiEndpoints.MENU + '/' + this.treeItem.ivr_menu_id, myParams.toString())
          .subscribe((response) => {
            this.treeItem[param] = value;
            this.createCrawlerForm();
          });
      }
    }
  }

  updateSTimeDetail(param, value, index) {

    this.sTimeArray[index].labelSTime = value;
    const filteredSTime = this.sTimeArray.map(response => {
      return response['labelSTime'];
    });
    const sTimeFilteredValue = filteredSTime.join('|');

    if (this.treeItem[param] !== sTimeFilteredValue) {
      if (sTimeFilteredValue !== null && sTimeFilteredValue !== '' && sTimeFilteredValue !== undefined) {
        const formValue = {};
        formValue['param'] = param;
        formValue['value'] = sTimeFilteredValue;

        const myParams = new URLSearchParams();
        myParams.append(formValue['param'], formValue['value']);

        this.appService.patchAPI(ApiEndpoints.MENU + '/' + this.treeItem.ivr_menu_id, myParams.toString())
          .subscribe((response) => {
            this.treeItem[param] = sTimeFilteredValue;
            this.createCrawlerForm();
          });
      }
    }
  }

  onSubmitLeafDetails(value) {
    const filteredSTime = this.dtmfSTimeArray.map(response => {
      return response['labelSTime'];
    });
    const sTimeFilteredValue = filteredSTime.join('|');
    value['ivr_menu_stime'] = sTimeFilteredValue;
    value['ivr_menu_parent_id'] = this.treeItem.ivr_menu_id;
    value['ivr_number'] = this.treeItem.ivr_number;
    value['ivr_menu_type'] = 'Leaf';
    this.appService.postAPI(ApiEndpoints.MENU, value)
      .subscribe((response) => {
        this.treeItem = response.payload.data;
        this.appService.setIVR(this.treeItem);
        this.addLeafForm = false;
      });
  }

  createStime() {
    if (this.treeItem) {
      const dtmfArray = this.treeItem.ivr_menu_dtmf_seq.split('');
      const stime = this.treeItem.ivr_menu_stime.split('|');
      let result = '';
      this.sTimeArray = [];
      for (let i = 0; i < dtmfArray.length; i++) {
        if (stime[i] !== null && stime[i] !== '' && stime[i] !== undefined) {
          this.sTimeArray.push({labelSTime: stime[i], labelDTMF: dtmfArray[i]});
        } else {
          stime[i] = 1;
          this.sTimeArray.push({labelSTime: stime[i], labelDTMF: dtmfArray[i]});
        }
      }

      const dtmfLength = dtmfArray.length;
      const stimeLength = stime.length;
      for (let j = dtmfLength; j < stimeLength; j++) {
        stime.splice(dtmfLength, 1);
      }
      this.treeItem.ivr_menu_stime = stime.join('|');

      for (let i = 0; i < this.sTimeArray.length; i++) {
        result = `${result} ${this.sTimeArray[i].labelSTime} ${this.sTimeArray[i].labelDTMF}`;
      }
      return result;
    }
  }

  onAddDtmf(value) {
    this.dtmfSTimeArray.push({labelSTime: '1', labelDTMF: value});
  }

  updateSTimeArray(value, index) {
    this.dtmfSTimeArray[index].labelSTime = value;
    console.log(this.dtmfSTimeArray);
  }

  onClickDelete() {
    this.appService.deleteAPI(ApiEndpoints.MENU + '/' + this.treeItem.ivr_menu_id)
      .subscribe((response) => {
        this.addLeafForm = false;
      });
  }

  onClickAction(number) {
    const formValue = {};
    if (number === 1) {
      formValue['field'] = 'ivr_menu_voice_rec_status';
    }
    if (number === 2) {
      formValue['field'] = 'ivr_menu_trans_status';
    }
    if (number === 3) {
      formValue['field'] = 'ivr_menu_pattern_matching_status';
    }

    this.appService.putAPI(ApiEndpoints.CHANGESTATUS + '/' + this.treeItem.ivr_menu_id, formValue)
      .subscribe((response) => {
        this.treeItem = response.payload.data;
        this.getStatusMessages();
      });
  }

  onClickRefresh() {
    this.appService.getAPI(ApiEndpoints.MENU + '/' + this.treeItem.ivr_menu_id)
      .subscribe((response) => {
        this.treeItem = response.payload.data;
        this.getStatusMessages();
      });
  }

  onClickAutoCrawl() {
    const formValue = {};
    if (this.autoCrawlerMessage === 'Start') {
      formValue['auto_crawl'] = '1';
    } else {
      formValue['auto_crawl'] = '0';
    }
    this.appService.putAPI(ApiEndpoints.MENU + '/' + this.treeItem.ivr_menu_id, formValue)
      .subscribe((response) => {
        if (this.autoCrawlerMessage === 'Start') {
          this.autoCrawlerMessage = 'Stop';
        } else {
          this.autoCrawlerMessage = 'Start';
        }
      });
  }

  onClickAdd() {
    this.addLeafForm = true;
  }

  onClickCancel() {
    this.createLeafForm();
    this.addLeafForm = false;
  }

}
