import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InfoTableComponent} from './info-table/info-table.component';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {LoginUserComponent} from './login-user/login-user.component';
import {OrganizationComponent} from './organization/organization.component';
import {CountryComponent} from './country/country.component';
import {StateInfoComponent} from './state-info/state-info.component';
import {AppServiceService} from './utility/shared-services/app-service.service';
import {DepartmentComponent} from './department/department.component';
import {CityComponent} from './city/city.component';
import {LocationComponent} from './location/location.component';
import {ApplicationComponent} from './application/application.component';
import {PhoneDetailComponent} from './phone-detail/phone-detail.component';
import {AuthGuard, SaveDataGuard} from './auth.guard';
import {OrganizationDataComponent} from './organization-data/organization-data.component';
import {CountryDataComponent} from './country-data/country-data.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {PaginationComponent} from './pagination/pagination.component';
import {BoldPipePipe} from './bold-pipe.pipe';
import {SideBarComponent} from './side-bar/side-bar.component';
import {UtilityModule} from './utility/utility.module';

@NgModule({
  declarations: [
    AppComponent,
    InfoTableComponent,
    LoginUserComponent,
    OrganizationComponent,
    CountryComponent,
    StateInfoComponent,
    DepartmentComponent,
    CityComponent,
    LocationComponent,
    ApplicationComponent,
    PhoneDetailComponent,
    OrganizationDataComponent,
    CountryDataComponent,
    PaginationComponent,
    BoldPipePipe,
    SideBarComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    UtilityModule,
    AppRoutingModule
  ],
  providers: [AppServiceService, AuthGuard, SaveDataGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
