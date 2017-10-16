import {AppServiceService} from './utility/shared-services/app-service.service';
import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {ApiEndpoints} from './utility/constants/api-endpoints';

@Injectable()
export class Resolver implements Resolve<any> {

  constructor(private appService: AppServiceService) {
  }

  resolve() {
    return this.appService.getAPI(ApiEndpoints.Country);
  }

}
