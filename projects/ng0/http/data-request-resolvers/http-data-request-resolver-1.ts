import { DataRequest, DataResult } from "@bootkit/ng0/data";
import { HttpRequestOptions } from "../types";
import { map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";

/**
 * Default implementation of httpDataRequestResolver1.
 * It adds DataRequest parameters as query string to the HTTP request.
 * @param url 
 * @param dataRequest 
 * @param options
 * @template T data item type
 * @returns 
 */
export function httpDataRequestResolver1<T = any>(
    url: string,
    dataRequest: DataRequest,
    options?: HttpRequestOptions): Observable<DataResult<T>> {
    var query: Record<string, any> = {};

    const httpClient = inject(HttpClient);

    if (dataRequest.page) {
        query['page[size]'] = dataRequest.page.size;
        query['page[index]'] = dataRequest.page.index;
    }

    if (dataRequest.sort) {
        query['sort[field]'] = dataRequest.sort.field;
        query['sort[asc]'] = dataRequest.sort.asc;
    }

    if (Array.isArray(dataRequest.filters)) {
        for (let i = 0; i < dataRequest.filters.length; i++) {
            const filter = dataRequest.filters[i];
            query[`filters[${i}].field`] = filter.field;
            query[`filters[${i}].operator`] = filter.operator;
            query[`filters[${i}].value`] = filter.value;
        }
    }

    if (typeof dataRequest.computeTotal == 'boolean') {
        query['computeTotal'] = dataRequest.computeTotal;
    }

    return httpClient.get<{ data: T[], total?: number }>(url, {
        params: query,
        headers: options?.headers,
    }).pipe(
        map(result => {
            return new DataResult<T>(result.data, result.total)
        })
    );
}

// /**
//  * Provides httpDataRequestResolver1.
//  * This is used to convert a DataRequest into query parameters for the HTTP (GET) request.
//  * @returns 
//  */
// export function withHttpDataRequestResolver1(): HttpServiceFeature {
//     return {
//         ɵproviders: [
//             { provide: DEFAULT_DATA_REQUEST_RESOLVER, useValue: HttpDataRequestResolver1 }
//         ]
//     };
// }