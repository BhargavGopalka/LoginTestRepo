import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InfoTableComponent} from '../info-table/info-table.component';
import {LoginUserComponent} from '../login-user/login-user.component';
import {OrganizationComponent} from '../organization/organization.component';
import {CountryComponent} from '../country/country.component';
import {StateInfoComponent} from '../state-info/state-info.component';
import {DepartmentComponent} from '../department/department.component';
import {CityComponent} from '../city/city.component';
import {LocationComponent} from '../location/location.component';
import {ApplicationComponent} from '../application/application.component';
import {PhoneDetailComponent} from '../phone-detail/phone-detail.component';
import {AuthGuard, SaveDataGuard} from '../auth.guard';
import {OrganizationDataComponent} from '../organization-data/organization-data.component';
import {CountryDataComponent} from '../country-data/country-data.component';
import {Resolver} from "../resolve";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'department',
    component: DepartmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'infoTable',
    component: InfoTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'organization',
    component: OrganizationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'infoTable/organization',
    component: OrganizationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'infoTable/login',
    component: LoginUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'city',
    component: CityComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'infoTable/city',
    component: CityComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'location',
    component: LocationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'infoTable/location',
    component: LocationComponent,
    canActivate: [AuthGuard],
    resolve: {
      countryList: Resolver
    }
  },
  {
    path: 'orgData',
    component: OrganizationDataComponent,
    canActivate: [AuthGuard],
    canDeactivate: [SaveDataGuard]
  },
  {
    path: 'infoTable/orgData',
    component: OrganizationDataComponent,
    canActivate: [AuthGuard],
    canDeactivate: [SaveDataGuard]
  },
  {
    path: 'countryData',
    component: CountryDataComponent,
    canActivate: [AuthGuard],
    canDeactivate: [SaveDataGuard]
  },
  {
    path: 'infoTable/countryData',
    component: CountryDataComponent,
    canActivate: [AuthGuard],
    canDeactivate: [SaveDataGuard]
  },
  {
    path: 'infoTable/department',
    component: DepartmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'country',
    component: CountryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'infoTable/country',
    component: CountryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'application',
    component: ApplicationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'phone',
    component: PhoneDetailComponent,
    canActivate: [AuthGuard],
    resolve: {
      countryList: Resolver
    }
  },
  {
    path: 'infoTable/phone',
    component: PhoneDetailComponent,
    canActivate: [AuthGuard],
    resolve: {
      countryList: Resolver
    }
  },
  {
    path: 'infoTable/application',
    component: ApplicationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'state',
    component: StateInfoComponent,
    canActivate: [AuthGuard],
    resolve: {
      countryList: Resolver
    }
  },
  {
    path: 'infoTable/state',
    component: StateInfoComponent,
    canActivate: [AuthGuard],
    resolve: {
    countryList: Resolver
  }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
