import { Observable, tap } from "rxjs";
import { DataRequest } from "./data-request";
import { DataResult } from "./data-result";
import { DataSource } from "./data-source";

export type DataLoaderFunc = (request: DataRequest) => Observable<DataResult>;

export class AsyncDataSource extends DataSource {
  constructor(private readonly loader: DataLoaderFunc) {
    super();

    if (typeof loader !== 'function') {
      throw 'Invalid data loader';
    }
  }

  load(request: DataRequest) {
    this.setLoading(true);

    return this.loader(request).pipe(
      tap(res => {
        this.setLoading(false);
      })
    )
  }
}
