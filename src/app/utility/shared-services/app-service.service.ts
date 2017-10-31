import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Constant} from '../constants/constants';
import {ChildService} from '../child/child.service';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class AppServiceService extends ChildService {

  // baseUrl = `https://mvp-dev-extensionsapi.visumenu.com/`;

  constructor(private http: Http,
              private toastr: ToastrService) {
    super();
  }

  /* GET API - read only, get all records */
  getAPI(endpoint: string): Observable<any> {
    return this.http.get(Constant.baseUrl + endpoint, this.Headers)
      .map(res => {
        this.extractData(res.json(), false);
        return res.json();
      });
  }

  /* Delete record */
  deleteAPI(endpoint: string): Observable<any> {
    return this.http.delete(Constant.baseUrl + endpoint, this.Headers)
      .map(res => {
        this.extractData(res.json(), true);
        return res.json();
      });
  }

  /* Add record */
  postAPI(endpoint: string, formVal: any): Observable<any> {
    return this.http.post(Constant.baseUrl + endpoint, formVal, this.Headers)
      .map(res => {
        this.extractData(res.json(), true);
        return res.json();
      });
  }

  /* Update record */
  putAPI(endpoint: string, formVal: any): Observable<any> {
    return this.http.put(Constant.baseUrl + endpoint, formVal, this.Headers)
      .map(res => {
        this.extractData(res.json(), true);
        return res.json();
      });
  }

  get Headers(): RequestOptions {
    const header = new Headers();
    header.append('Authorization', sessionStorage.getItem('currentUser'));
    const option = new RequestOptions();
    option.headers = header;
    return option;
  }

  private extractData(res, show?: boolean) {
    const msg = res.message;

    if (show && msg) {
      this.toastr.success(msg);
    }
  }

}


