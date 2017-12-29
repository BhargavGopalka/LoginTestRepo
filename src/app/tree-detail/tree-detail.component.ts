import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppServiceService} from '../utility/shared-services/app-service.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-tree-detail',
  templateUrl: './tree-detail.component.html',
  styleUrls: ['./tree-detail.component.css']
})
export class TreeDetailComponent implements OnInit {

  // @Input() children: Array<any>;
  @Input() data: { children: any[], ivr_menu_name: string, ivr_menu_id: string };
  @Output() buttonClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  childMenu = false;
  showForm = false;
  subtypeList: any[] = [];

  crawlerForm: FormGroup;

  constructor(private appService: AppServiceService) {
  }

  ngOnInit() {
  }

  openChildView(detail) {
    this.appService.setIVR(detail);
    this.appService.setView(true);
    this.buttonClick.next(detail);
    this.childMenu = !this.childMenu;
  }

  showFormView(detail) {
    this.appService.setIVR(detail);
    this.appService.setView(true);
    this.buttonClick.next(detail);
  }

}
