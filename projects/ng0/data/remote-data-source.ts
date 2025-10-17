import { catchError, Observable, tap } from "rxjs";
import { DataRequest } from "./data-request";
import { DataLoader, DataSource } from "./data-source";


/**
 * RemoteDataSource is a DataSource that loads data asynchronously using a DataLoader function.
 * It is used to fetch data from a remote source, such as an API.
 */
export class RemoteDataSource extends DataSource {
  readonly type = 'remote';

  constructor(private readonly loader: DataLoader) {
    super();

    if (typeof loader !== 'function') {
      throw 'Invalid data loader';
    }
  }

  load(request: DataRequest) {
    this._isLoading.set(true);

    return this.loader(request).pipe(
      catchError(err => {
        this._isLoading.set(false);
        throw err;
      }),
      tap(res => {
        this._isLoading.set(false);
      })
    )
  }
}
