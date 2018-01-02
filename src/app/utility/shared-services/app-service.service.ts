import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Constant} from '../constants/constants';
import {ChildService} from '../child/child.service';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class AppServiceService extends ChildService {

  constructor(private http: HttpClient,
              private toastr: ToastrService) {
    super();
  }

  /* Header */

  // const header = new HttpHeaders();
  // header.set('Authorization', sessionStorage.getItem('currentUser'));

  /* End */

  private ivr: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private parentView: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
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

  /* Current IVR */
  getIVR(): Observable<any> {
    return this.ivr.asObservable();
  }

  setIVR(value: any) {
    this.ivr.next(value);
  }

  /* Current IVR */
  getView(): Observable<boolean> {
    return this.parentView.asObservable();
  }

  setView(value: boolean) {
    this.parentView.next(value);
  }

  /* Getter and setter isLoading */
  /* End */

  /* GET API - read only, get all records */
  getAPI(endpoint: string, queryParams?, searchParams?, loader: boolean = true): Observable<any> {
    if (loader) {
      this.showLoader();
    }

    if (!queryParams) {
      queryParams = {};
    }
    (searchParams) ? (queryParams['search'] = JSON.stringify(searchParams)) : '';
    let params = new HttpParams();
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        params = params.set(key, queryParams[key]);
      }
    }

    return this.http.get(Constant.baseUrl + endpoint + '?' + params.toString(), {headers: this.httpOptions})
      .catch(this.onCatch)
      .map(res => {
        this.extractData(res, false);
        return res;
      })
      .finally(() => {
        this.hideLoader();
      });
  }

  getFileAPI(endpoint: string, queryParams?, searchParams?, loader: boolean = true): Observable<any> {
    if (loader) {
      this.showLoader();
    }

    if (!queryParams) {
      queryParams = {};
    }
    (searchParams) ? (queryParams['search'] = JSON.stringify(searchParams)) : '';
    let params = new HttpParams();
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        params = params.set(key, queryParams[key]);
      }
    }

    return this.http.get(Constant.baseUrl + endpoint + '?' + params.toString(), {
      headers: this.httpOptions,
      responseType: 'text'
    })
      .catch(this.onCatch)
      .map(res => {
        this.extractData(res, false);
        return res;
      })
      .finally(() => {
        this.hideLoader();
      });
  }

  getCrawlerAPI(endpoint: string, loader: boolean = true): Observable<any> {
    if (loader) {
      this.showLoader();
    }
    return this.http.get(Constant.baseCrawlerUrl + endpoint, {headers: this.httpOptions})
      .catch(this.onCatch)
      .map(res => {
        this.extractData(res, false);
        return res;
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
        this.extractData(res, true);
        return res;
      })
      .finally(() => {
        this.hideLoader();
      });
  }

  loginPost(endpoint: string, formVal: any): Observable<any> {
    // const header = new HttpHeaders();
    // header.set('Authorization', sessionStorage.getItem('currentUser'));
    this.showLoader();
    return this.http.post(Constant.baseUrl + endpoint, formVal)
      .catch(this.onCatch)
      .map(res => {
        this.extractData(res, true);
        return res;
      })
      .finally(() => {
        this.hideLoader();
      });
  }

  /* Add record */
  postAPI(endpoint: string, formVal: any, files?): Observable<any> {
    // const header = new HttpHeaders();
    // header.set('Authorization', sessionStorage.getItem('currentUser'));
    this.showLoader();
    if (!files) {
      return this.http.post(Constant.baseCrawlerUrl + endpoint, formVal, {headers: this.httpOptions})
        .catch(this.onCatch)
        .do(res => {
            this.extractData(res, true);
            return res;
          },
          error => {
            this.onGettingError(error);
          })
        .finally(() => {
          this.hideLoader();
        });
    } else {

      const formData: FormData = new FormData();
      if (formVal !== '' && formVal !== undefined && formVal !== null) {
        for (const property in formVal) {
          if (formVal.hasOwnProperty(property)) {
            formData.append(property, formVal[property]);
          }
        }
      }

      const singleFile: File = files[0];
      formData.append('file', singleFile, singleFile.name);
      return this.http.post<any>(Constant.baseCrawlerUrl + endpoint, formData, {headers: this.httpOptions})
        .pipe(
          tap((response: any) => {
              this.extractData(response, true);
              return response;
            },
            (error) => {
              this.onGettingError(error);
            }),
          catchError(this.onCatch)
        )
        .finally(() => {
          this.hideLoader();
        });
    }
  }

  /* Update record */
  putAPI(endpoint: string, formVal: any): Observable<any> {
    this.showLoader();
    return this.http.put(Constant.baseUrl + endpoint, formVal, {
      headers: new HttpHeaders().set('Authorization', sessionStorage.getItem('currentUser')),
    })
      .catch(this.onCatch)
      .map(res => {
        this.extractData(res, true);
        return res;
      })
      .finally(() => {
        this.hideLoader();
      });
  }

  patchAPI(endpoint: string, formVal: any): Observable<any> {
    /*const formData: FormData = new FormData();
    if (formVal !== '' && formVal !== undefined && formVal !== null) {
      for (const property in formVal) {
        if (formVal.hasOwnProperty(property)) {
          formData.append(property, formVal[property]);
        }
      }
    }*/

    this.showLoader();
    return this.http.patch(Constant.baseCrawlerUrl + endpoint, formVal, {
      headers: new HttpHeaders().set('Authorization', sessionStorage.getItem('currentUser'))
        .set('Content-Type', 'application/x-www-form-urlencoded'),
    })
      .catch(this.onCatch)
      .map(res => {
        this.extractData(res, true);
        return res;
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

  /* Headers */
  get httpOptions(): HttpHeaders {
    const Authorization = sessionStorage.getItem('currentUser');
    const headers = new HttpHeaders({'Authorization': Authorization});
    return headers;
  }

  onGettingError(errorResponse) {
    const errorMsg = errorResponse.error.message;
    this.toastr.error(errorMsg);
  }

  private extractData(res, show?: boolean) {
    const msg = res.message;

    if (show && msg) {
      this.toastr.success(msg);
    }
  }

  private onCatch(errorResponse: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(errorResponse);
  }

}


