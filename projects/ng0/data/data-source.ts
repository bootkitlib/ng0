import { Observable, Subject } from "rxjs";
import { DataRequest } from "./data-request";
import { DataResult } from "./data-result";
import { signal } from "@angular/core";

/**
 * DataLoader is a function that takes a DataRequest and returns an Observable of DataResult.
 * It is used by RemoteDataSource to load data asynchronously.
 */
export type DataLoader<T = any> = (request: DataRequest) => Observable<DataResult<T>>;


export interface DataSourceChange {
  type: 'push';
}

export interface DataSourcePushChange extends DataSourceChange {
  type: 'push'

  /**
   * The items to insert.
   */
  items: any[];
}


// export interface DataSourceReplaceChange extends DataSourceChange {
//   type: 'replace'
//   replacements: {
//     index: number;
//     value: any;
//   }[]
// }

// export interface DataSourceRemoveChange extends DataSourceChange {
//   type: 'remove';

//   /**
//    * The indices of the items to remove. Indices are sorted in descending order.
//    */
//   indices: number[];
// }

export interface DataSourceChangeEvent {
  changes: Array<DataSourcePushChange>
}


/**
 * Abstract base class for data sources.
 * This class provides a common interface for loading data from various sources.
 */
export abstract class DataSource<T = any> {
  abstract readonly type: 'local' | 'remote';

  protected changeSubject = new Subject<DataSourceChangeEvent>();
  protected loading = signal(false);

  /**
   * 
   */
  public readonly change = this.changeSubject.asObservable();

  /**
   * Indicates whether the data source is currently loading data.
   */
  public isLoading = this.loading.asReadonly();


  /**
   * Loads data from the data source.
   * @param request The data request object containing pagination, sorting, and filtering information.
   */
  abstract load(request: DataRequest): Observable<DataResult>;
}

/**
 * DataSourceLike is a type that can be used to represent any data source
 * that can be used with the table, autocomplete, dropdown and any component that requires data.
 * It can be an array of data, a function that returns an observable of data,
 * or an instance of DataSource.
 */
export type DataSourceLike<T = any> =
  Array<any> |
  DataLoader<T> |
  DataSource<T> |
  Record<string, string | number> | // enum: extract enum or object values
  undefined |
  null;
