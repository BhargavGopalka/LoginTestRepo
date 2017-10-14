import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AppServiceService} from '../utility/shared-services/app-service.service';

@Component({
  selector: 'app-country-data',
  templateUrl: './country-data.component.html',
  styleUrls: ['./country-data.component.css']
})
export class CountryDataComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder, private  appService: AppServiceService, private router: Router) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      country: [''],
      code: [''],
      dialing_code: ['']
    });
  }

  addCountry(formVal: any) {

    const url = `country`;
    this.appService.postAPI(url, formVal)
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
