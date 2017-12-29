import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InfoTableComponent} from './info-table/info-table.component';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {LoginUserComponent} from './login-user/login-user.component';
import {OrganizationComponent} from './organization/organization.component';
import {CountryComponent} from './country/country.component';
import {StateInfoComponent} from './state-info/state-info.component';
import {DepartmentComponent} from './department/department.component';
import {CityComponent} from './city/city.component';
import {LocationComponent} from './location/location.component';
import {ApplicationComponent} from './application/application.component';
import {PhoneDetailComponent} from './phone-detail/phone-detail.component';
import {AuthGuard, SaveDataGuard} from './auth.guard';
import {OrganizationDataComponent} from './organization-data/organization-data.component';
import {CountryDataComponent} from './country-data/country-data.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {SideBarComponent} from './side-bar/side-bar.component';
import {UtilityModule} from './utility/utility.module';
import {Resolver} from './resolve';
import {NguiAutoCompleteModule} from '@ngui/auto-complete';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {HttpClientModule} from '@angular/common/http';
import {MenuDetailComponent} from './menu-detail/menu-detail.component';
import {TreeDetailComponent} from './tree-detail/tree-detail.component';
import {MenuFormComponent} from './menu-form/menu-form.component';


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
    SideBarComponent,
    MenuDetailComponent,
    TreeDetailComponent,
    MenuFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    UtilityModule,
    NgxPaginationModule,
    NguiAutoCompleteModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AppRoutingModule
  ],
  providers: [SaveDataGuard, AuthGuard, Resolver, MenuDetailComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
