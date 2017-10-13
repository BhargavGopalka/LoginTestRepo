import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AppServiceService} from '../app-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-organization-data',
  templateUrl: './organization-data.component.html',
  styleUrls: ['./organization-data.component.css']
})
export class OrganizationDataComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder, private appService: AppServiceService, private router: Router) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['']
    });
  }

  addOrg(formValue: any) {
    const url = `organization`;
    this.appService.postAPI(url, formValue)
      .subscribe((res) => {
          console.log(res);
        },
        msg => console.log(`Error: ${msg.status} ${msg.statusText}`));
    this.form.reset();
  }

  goPrev() {
    this.router.navigate(['infoTable']);
  }

}
