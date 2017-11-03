import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Constant} from '../constants/constants';
import {ChildService} from '../child/child.service';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class AppServiceService extends ChildService {

  constructor(private http: HttpClient,
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
    return this.http.get(Constant.baseUrl + endpoint, {
      headers: new HttpHeaders().set('Authorization', sessionStorage.getItem('currentUser')),
    })
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
    return this.http.delete(Constant.baseUrl + endpoint, {
      headers: new HttpHeaders().set('Authorization', sessionStorage.getItem('currentUser')),
    })
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
    debugger;
    this.showLoader();
    return this.http.post(Constant.baseUrl + endpoint, formVal)
      .catch(this.onCatch)
      .map(res => {
        debugger;
        this.extractData(res, true);
        return res;
      })
      .finally(() => {
        this.hideLoader();
      });
  }

  /* Update record */
  putAPI(endpoint: string, formVal: any): Observable<any> {
    this.showLoader();
    return this.http.put(Constant.baseUrl + endpoint, formVal, {
      headers: new HttpHeaders().set('Authorization', sessionStorage.getItem('currentUser')),
    })
      .catch(this.onCatch)
      .map(res => {
        this.extractData(res.json(), true);
        return res.json();
      })
      .finally(() => {
        this.hideLoader();
      });
  }

  // get Headers() {
  //   const header = new Header();
  //   header.set('Authorization', sessionStorage.getItem('currentUser'));
  //   const option = new RequestOptions();
  //   option.headers = header;
  //   return header;
  // }

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


