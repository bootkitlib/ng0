import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { DataRequest, DataResult } from '@bootkit/ng0/data';
import { Observable } from 'rxjs';

export interface DataResultHttpRequestOptions {
    /** Http request ID */
    id?: any;
    params?: HttpParams | Record<string, string | number | boolean | ReadonlyArray<string | number | boolean>>;
    headers?: HttpHeaders | Record<string, string | string[]>;
    pathType?: 'relative' | 'absolute';
    /**
     * Additional data to associate with the request.
     */
    tag?: any;

    /**
     * Resolver function to convert DataRequest to DataResult.
     */
    dataRequest?: {
        resolver: HttpDataRequestResolver;

        /**
         * Additional parameters to pass to HttpDataRequestResolver.
         */
        params: Record<string, string | number | boolean | ReadonlyArray<string | number | boolean>>;
    };

    /** 
     * Save response in transfer state 
     */
    transferState?: {
        enable: boolean,
        clearAfterUse?: boolean;
    };
}

export interface HttpRequestOptions {
    /** Http request ID */
    id?: any;
    params?: HttpParams | Record<string, string | number | boolean | ReadonlyArray<string | number | boolean>>;
    headers?: HttpHeaders | Record<string, string | string[]>;
    pathType?: 'relative' | 'absolute';
    responseType?: 'json' | 'blob' | 'text';
    contentType?: 'json' | 'multipart/form-data';
    reportProgress?: boolean;
    observe?: 'response' | 'body' | 'events';
    /**
     * Additional data to associate with the request.
     */
    tag?: any;

    /** 
     * Save response in transfer state 
     * 
     */
    transferState?: boolean | {
        /**
         * Clear transfer state after first read.
         */
        clearAfterUse?: boolean;
    };
}

export interface HttpRequestEventBase {
    type: 'Send' | 'Complete' | 'Progress' | 'Error';
    url: string;
    options?: HttpRequestOptions
}

export interface HttpRequestSendEvent extends HttpRequestEventBase {
    type: 'Send';
}

export interface HttpRequestCompleteEvent extends HttpRequestEventBase {
    type: 'Complete';
    response?: any;
}

export interface HttpRequestProgressEvent extends HttpRequestEventBase {
    type: 'Progress';
}

export interface HttpRequestErrorEvent extends HttpRequestEventBase {
    type: 'Error';
    error: any;
}

export type HttpRequestEvent = HttpRequestSendEvent | HttpRequestCompleteEvent | HttpRequestProgressEvent | HttpRequestErrorEvent;

/**
 * HttpDataRequestWriter is a function that takes an HTTP request and a DataRequest
 * and writes the DataRequest parameters to the HTTP request.
 * This is used to convert a DataRequest into query parameters or request body.
 * @param url The URL to send the request to.
 * @param dataRequest The DataRequest to convert.
 * @param httpClient The HttpClient to use for the request.
 * @param options Additional options for the request, such as headers.
 * @template T data item type
 * @returns An Observable that emits the DataResult.
 */
export type HttpDataRequestResolver<T = any> = (url: string, dataRequest: DataRequest, options?: DataResultHttpRequestOptions) => Observable<DataResult<T>>;
