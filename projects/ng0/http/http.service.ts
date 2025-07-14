import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, Observable, of, Subject, tap } from 'rxjs';
import { HttpErrorEvent, HttpEvent, HttpOptions, HttpRequestSendEvent, HttpResponseEvent, HttpServiceBaseUrl } from './types';
import { Inject, Injectable, makeStateKey, Optional, PLATFORM_ID, TransferState } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { DataRequest, DataResult } from '@bootkit/ng0/data';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private _eventsSubject = new Subject<HttpEvent>();
  private _baseUrl?: string;

  public events = this._eventsSubject.asObservable();
  public defaultHeaders?: HttpHeaders;

  constructor(
    private _http: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(HttpServiceBaseUrl) baseUrl?: string
  ) {
    this._baseUrl = typeof baseUrl == 'string' ? baseUrl : '';
  }

  public get<T>(url: string, options?: HttpOptions): Observable<T> {
    this._eventsSubject.next(new HttpRequestSendEvent(url, options));
    const URL = this.makeUrl(url, options);
    const OPTIONS = this.makeHttpClientOptions(options);
    let obs = this.tap<T>(this._http.get<T>(URL, OPTIONS), url, options);
    obs = this._handleTransferState(obs, options);
    return obs;
  }

  private _handleTransferState<T>(obs: Observable<T>, options: HttpOptions | undefined): Observable<T> {
    if (!options?.transferState) {
      return obs;
    }

    if (!options.id) {
      throw Error('To use transferState, set request id')
    }

    let key = makeStateKey<T>(options.id!);

    // Check if data exists in TransferState (to avoid refetching)
    if (this.transferState.hasKey(key)) {
      const data = this.transferState.get<T>(key, null!);

      if(options.transferState.clearAfterUse || true) { 
        this.transferState.remove(key); // Free memory
      }
      
      return of<T>(data);
    } else {
      return obs.pipe(
        tap((d) => {
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(key, d);
          }
        })
      )
    }
  }

  public getResult<T>(url: string, request: DataRequest, options?: HttpOptions): Observable<DataResult<T>> {
    this._eventsSubject.next(new HttpRequestSendEvent(url, options));
    const URL = this.makeUrl(url, options);
    options = options || {};
    options.query = { ...options.query, ...this.mapDataRequesToQueryObject(request) };
    const OPTIONS = this.makeHttpClientOptions(options);
    var o = this._http.get<{ data: any[], total: number }>(URL, OPTIONS)
      .pipe(
        map((x: any) => new DataResult(request, x.data, x.total))
      );

    return this.tap(o, url, options);
  }

  public post<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    this._eventsSubject.next(new HttpRequestSendEvent(url, options));
    const URL = this.makeUrl(url, options);
    const BODY = this.makeBody(body, options);
    const OPTIONS = this.makeHttpClientOptions(options);
    return this.tap<T>(this._http.post(URL, BODY, OPTIONS), url, options);
  }

  public put<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    this._eventsSubject.next(new HttpRequestSendEvent(url, options));
    const URL = this.makeUrl(url, options);
    const BODY = this.makeBody(body, options);
    const OPTIONS = this.makeHttpClientOptions(options);
    return this.tap<T>(this._http.put(URL, BODY, OPTIONS), url, options);
  }

  public delete<T>(url: string, options?: HttpOptions): Observable<T> {
    this._eventsSubject.next(new HttpRequestSendEvent(url, options));
    const URL = this.makeUrl(url, options);
    const OPTIONS = this.makeHttpClientOptions(options);
    return this.tap<T>(this._http.delete(URL, OPTIONS), url, options);
  }

  private tap<T>(o: Observable<any>, url: string, options?: HttpOptions): Observable<T> {
    return o.pipe(
      tap({
        next: r => {
          this._eventsSubject.next(new HttpResponseEvent(url, options));
        },
        error: e => {
          this._eventsSubject.next(new HttpErrorEvent(url, options))
        }
      })
    )
  }

  private makeUrl(url: string, options?: HttpOptions) {
    return (options?.pathType === 'absolute') ? url : (this._baseUrl + url);
  }

  private makeHttpClientOptions(options?: HttpOptions) {
    if (!options) {
      return undefined;
    }

    const ngOptions: any = {};

    // Query String
    const query = options.query;
    if (typeof query === 'object') {
      let params = new HttpParams();
      for (const key in query) {
        if (query.hasOwnProperty(key)) {
          const value = query[key];
          const type = typeof value;
          if (type === 'string' || type === 'number' || type === 'boolean') {
            params = params.set(key, value);
          }
        }
      }
      ngOptions.params = params;
    }

    // Response Type
    // if (options.responseType) {
    ngOptions.responseType = options.responseType;
    // }

    if (!options.sendAuthToken) {
    }

    ngOptions.headers = this.defaultHeaders;
    ngOptions.reportProgress = options.reportProgress;
    ngOptions.observe = options.observe;

    return ngOptions;
  }

  private makeBody(body: any, options?: HttpOptions) {
    body = this.processBodyFields(body);
    if (!options || !options.contentType || options.contentType !== 'multipart/form-data') {
      return body;
    }

    // contentType is multipart/form-data
    const formData = new FormData();
    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        const field = body[key];
        let value;

        if (typeof field === 'string' || field instanceof File) {
          value = field;
        } else if (typeof field === 'number') {
          value = field.toString();
        } else if (typeof field === 'object') {
          value = JSON.stringify(field);
        }

        if (value) {
          formData.append(key, value);
        }
      }
    }
    return formData;
  }

  private processBodyFields(body: any) {
    return body;
  }

  private mapDataRequesToQueryObject(request: DataRequest) {
    var result: { [key: string]: any } = {};

    if (!request) {
      return result;
    }

    if (Number.isInteger(request.pageIndex) && Number.isInteger(request.pageSize)) {
      result['page.size'] = request.pageSize;
      result['page.index'] = request.pageIndex;
    }

    if (request.sort) {
      result['sort[field]'] = request.sort.field;
      result['sort[asc]'] = request.sort.asc;
    }

    for (let i = 0; i < request.filters.length; i++) {
      const filter = request.filters[i];
      result[`filters[${i}].field`] = filter.field;
      result[`filters[${i}].operator`] = filter.operator;
      result[`filters[${i}].value`] = filter.value;
    }

    if (typeof request.computeTotal == 'boolean') {
      result['ct'] = request.computeTotal;
    }

    return result;
  }
}
