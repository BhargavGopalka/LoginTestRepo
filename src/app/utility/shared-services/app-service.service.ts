import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Constant} from '../constants/constants';
import {ChildService} from '../child/child.service';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map';
import 'rxjs/Rx';

@Injectable()
export class AppServiceService extends ChildService {

  // baseUrl = `https://mvp-dev-extensionsapi.visumenu.com/`;

  constructor(private http: Http,
              private toastr: ToastrService) {
    super();
  }

  /* Getting isLoading value */
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  getLoader(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  setLoader(value: boolean) {
    this.isLoading.next(value);
  }

  private showLoader() {
    this.setLoader(true);
  }

  private hideLoader() {
    this.setLoader(false);
  }
  /* Getter and setter isLoading */
  /* End */

  /* GET API - read only, get all records */
  getAPI(endpoint: string, loader: boolean = true): Observable<any> {
    if (loader) {
      this.showLoader();
    }
    return this.http.get(Constant.baseUrl + endpoint, this.Headers)
      .catch(this.onCatch)
      .map(res => {
        this.extractData(res.json(), false);
        return res.json();
      })
      .finally(() => {
      this.hideLoader();
      });
  }

  /* Delete record */
  deleteAPI(endpoint: string, loader: boolean = true): Observable<any> {
    this.showLoader();
    return this.http.delete(Constant.baseUrl + endpoint, this.Headers)
      .catch(this.onCatch)
      .map(res => {
        this.extractData(res.json(), true);
        return res.json();
      })
      .finally(() => {
      this.hideLoader();
      });
  }

  /* Add record */
  postAPI(endpoint: string, formVal: any): Observable<any> {
    this.showLoader();
    return this.http.post(Constant.baseUrl + endpoint, formVal, this.Headers)
      .catch(this.onCatch)
      .map(res => {
        this.extractData(res.json(), true);
        return res.json();
      })
      .finally(() => {
        this.hideLoader();
      });
  }

  /* Update record */
  putAPI(endpoint: string, formVal: any): Observable<any> {
    this.showLoader();
    return this.http.put(Constant.baseUrl + endpoint, formVal, this.Headers)
      .catch(this.onCatch)
      .map(res => {
        this.extractData(res.json(), true);
        return res.json();
      })
      .finally(() => {
      this.hideLoader();
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

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }

}


