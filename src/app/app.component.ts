import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AppServiceService} from './utility/shared-services/app-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isLoading = true;

  constructor(private appService: AppServiceService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.initInitialMethods();
  }

  /* Provide isLoading value to getLoader function */
  private initInitialMethods() {
    this.appService.getLoader().subscribe((isLoading) => {
      this.isLoading = isLoading;
      this.cdr.detectChanges();
    });
  }
}
