import { InjectionToken } from '@angular/core';

export const HttpServiceBaseUrl = new InjectionToken('HttpServiceBaseUrl');

export interface HttpOptions {
    /** Http request ID */
    id?: string;
    query?: any;
    pathType?: 'relative' | 'absolute';
    responseType?: 'json' | 'blob' | 'text';
    contentType?: 'json' | 'multipart/form-data';
    reportProgress?: boolean;
    observe?: 'response' | 'body' | 'events';

    /** 
     * Save response in transfer state 
     */
    transferState?: {
        enable: boolean,
        clearAfterUse?: boolean;    
    };
}

export abstract class HttpEvent {
    constructor(public readonly url: string, public readonly options?: HttpOptions) {
    }
}

export class HttpRequestSendEvent extends HttpEvent {
    constructor(url: string, options?: HttpOptions) {
        super(url, options);
    }
}

export class HttpResponseEvent extends HttpEvent {
    constructor(url: string, options?: HttpOptions) {
        super(url, options);
    }
}

export class HttpErrorEvent extends HttpEvent {
    constructor(url: string, options?: HttpOptions) {
        super(url, options);
    }
}
