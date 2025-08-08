import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject, tap } from 'rxjs';
import { HttpRequestOptions, HttpRequestEvent } from './types';
import { inject, Inject, Injectable, Injector, makeStateKey, PLATFORM_ID, runInInjectionContext, TransferState } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { DataRequest, DataResult } from '@bootkit/ng0/data';
import { HTTP_SERVICE_CONFIG } from './provide';

/**
 * HttpService provides a simple HTTP client for making requests.
 * It supports GET, POST, PUT, DELETE methods and can handle DataRequest objects.
 * It also supports transfer state for server-side rendering.
 * It emits events for request lifecycle: Send, Progress, Complete and Error.
 * It can be configured with a base URL and a default DataRequest resolver.
 * It can also handle multipart/form-data requests.
 */
@Injectable()
export class HttpService {
  private _eventsSubject = new Subject<HttpRequestEvent>();
  private _baseUrl?: string;

  public events = this._eventsSubject.asObservable();
  public defaultHeaders?: HttpHeaders;

  private readonly _config = inject(HTTP_SERVICE_CONFIG);

  constructor(
    private http: HttpClient,
    private transferState: TransferState,
    private injector: Injector,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this._baseUrl = this._config.baseUrl ?? '';
  }

  /**
   * Sends a GET request to the specified URL.
   * @param url The URL to send the request to.
   * @param options The options for the request.
   * @returns An observable of the response.
   */
  public get<T>(url: string, options?: HttpRequestOptions): Observable<T> {
    this._verifyOptions(options);
    const transferStateData = this._findInTransferState<T>(options);
    if (transferStateData.found) {
      return of(transferStateData.data!);
    }

    this._eventsSubject.next({ type: 'Send', url, options });
    let obs = this.http.get<T>(this._makeUrl(url, options), options as any).pipe(
      tap(result => {
        if (isPlatformServer(this.platformId) && options?.transferState) {
          const key = makeStateKey<T>(options.id);
          this.transferState.set(key, result as T);
        }
      })
    );
    return this._handleEvents<T>(obs, url, options);
  }


  /**
   * Sends a DataRequest to the specified URL and returns a DataResult.
   * This method is used for paginated or filtered data requests.
   * It uses the configured DataRequestResolver to handle the request. 
   * @param url The URL to send the request to.
   * @param request The DataRequest object containing the request parameters.
   * @param options The options for the request.
   * @returns An observable of DataResult<T>.
   */
  public getDataResult<T>(url: string, request: DataRequest, options?: HttpRequestOptions): Observable<DataResult<T>> {
    this._verifyOptions(options);
    const transferStateData = this._findInTransferState<DataResult<T>>(options);
    if (transferStateData.found) {
      return of(transferStateData.data!);
    }

    this._eventsSubject.next({ type: 'Send', url, options });
    let resolver = this._config.dataRequestResolver;
    if (!resolver) {
      throw new Error('No HttpDataRequestResolver provided.');
    }

    const URL = this._makeUrl(url, options);
    let obs = runInInjectionContext<Observable<DataResult<T>>>(this.injector, resolver.bind(null, URL, request, options));
    if (!(obs instanceof Observable)) {
      throw Error('HttpDataRequestResolver should return an observable.');
    }

    return this._handleEvents(obs, url, options);
  }

  /**
   * Sends a POST request to the specified URL with the given body.
   * @param url The URL to send the request to.
   * @param body The body of the request.
   * @param options The options for the request.
   * @returns An observable of the response.
   */
  public post<T>(url: string, body: any, options?: HttpRequestOptions): Observable<T> {
    this._verifyOptions(options);
    this._eventsSubject.next({ type: 'Send', url, options });
    const BODY = this._makeBody(body, options);
    let obs = this.http.post(this._makeUrl(url, options), BODY, options as any) as Observable<T>;
    return this._handleEvents<T>(obs, url, options);
  }

  /**
   * Sends a PUT request to the specified URL with the given body.
   * @param url The URL to send the request to.
   * @param body The body of the request.
   * @param options The options for the request.
   * @returns An observable of the response.
   */
  public put<T>(url: string, body: any, options?: HttpRequestOptions): Observable<T> {
    this._verifyOptions(options);
    this._eventsSubject.next({ type: 'Send', url, options });
    const BODY = this._makeBody(body, options);
    let obs = this.http.put(this._makeUrl(url, options), BODY, options as any) as Observable<T>;
    return this._handleEvents<T>(obs, url, options);
  }

  /**
   * Sends a DELETE request to the specified URL.
   * @param url The URL to send the request to.
   * @param options The options for the request.
   * @returns An observable of the response.
   */
  public delete<T>(url: string, options?: HttpRequestOptions): Observable<T> {
    this._verifyOptions(options);
    this._eventsSubject.next({ type: 'Send', url, options });
    let obs = this.http.delete(this._makeUrl(url, options), options as any)
    return this._handleEvents<T>(obs, url, options);
  }

  private _makeUrl(url: string, options?: HttpRequestOptions) {
    return (options?.pathType === 'absolute') ? url : (this._baseUrl + url);
  }

  private _makeBody(body: any, options?: HttpRequestOptions) {
    if (options?.contentType === 'multipart/form-data') {
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

    return body;
  }

  private _handleEvents<T>(o: Observable<any>, url: string, options?: HttpRequestOptions): Observable<T> {
    return o.pipe(
      tap({
        next: r => {
          this._eventsSubject.next({ type: 'Complete', url, options, response: r });
        },
        error: e => {
          this._eventsSubject.next({ type: 'Error', url, options, error: e });
        }
      })
    )
  }

  private _verifyOptions(options?: HttpRequestOptions) {
    if (options) {
      if (options.transferState && !options.id) {
        throw Error('To use transferState, set request id')
      }

      if (this.transferState && (options.observe == 'events' || options.observe == 'response')) {
        throw Error('TransferState is only supported with observe == body.');
      }
    }
  }

  private _findInTransferState<T>(options?: HttpRequestOptions): { found: boolean, data: T | undefined } {
    if (!options?.transferState || isPlatformServer(this.platformId)) {
      return { found: false, data: undefined };
    }

    const key = makeStateKey<T>(options.id);
    if (this.transferState.hasKey(key)) {
      const data = this.transferState.get<T>(key, null!);
      if ((options.transferState as any)?.['clearAfterUse']) {
        this.transferState.remove(key); // Free memory
      }

      return { found: true, data: data };
    }

    return { found: false, data: undefined };
  }
}
