import { Observable, tap } from "rxjs";
import { DataRequest } from "./data-request";
import { DataResult } from "./data-result";
import { DataSource } from "./data-source";

/**
 * DataLoader is a function that takes a DataRequest and returns an Observable of DataResult.
 * It is used by AsyncDataSource to load data asynchronously.
 */
export type DataLoaderFunction<T=any> = (request: DataRequest) => Observable<DataResult<T>>;


/**
 * AsyncDataSource is a DataSource that loads data asynchronously using a DataLoader function.
 * It is used to fetch data from a remote source, such as an API.
 */
export class AsyncDataSource extends DataSource {
  constructor(private readonly loader: DataLoaderFunction) {
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
