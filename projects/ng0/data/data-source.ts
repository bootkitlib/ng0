import { Observable, Subject } from "rxjs";
import { DataRequest } from "./data-request";
import { DataResult } from "./data-result";
import { signal } from "@angular/core";
import { DataSourceChangeEvent } from "./data-source-change";

/**
 * DataLoader is a function that takes a DataRequest and returns an Observable of DataResult.
 * It is used by RemoteDataSource to load data asynchronously.
 */
export type DataLoader<T = any> = (request: DataRequest) => Observable<DataResult<T>>;


/**
 * Abstract base class for data sources.
 * This class provides a common interface for loading data from various sources.
 */
export abstract class DataSource<T = any> {
  public abstract readonly type: 'local' | 'remote';
  public readonly itemTracker?: (item: any) => string | number;

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


  constructor() {
  }

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
