import { Observable } from "rxjs";
import { DataResult } from "./data-result";
import { DataRequest } from "./data-request";

export function toDataResult<T=any>(dr: DataRequest) {
  return function (source: Observable<any>): Observable<DataResult<T>> {
    return new Observable(subscriber => {
      source.subscribe({
        next(event) {
          subscriber.next(new DataResult(dr, event));
        },
        error(error) {
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        }
      });
    });
  }
}
