import { Observable, Subject } from "rxjs";
import { DataRequest } from "./data-request";
import { DataResult } from "./data-result";
import { signal } from "@angular/core";
import { DataSourceChangeEvent } from "./types";
import { ValueComparerFunction, ValueExtractorFunction } from "@bootkit/ng0/common";

/**
 * Abstract base class for data sources.
 * This class provides a common interface for loading data from various sources.
 */
export abstract class DataSource<T = any> {
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
  public valueExtractor = signal<ValueExtractorFunction>
  // public valueComparer = signal<ValueComparerFunction>

  /**
   * Loads data from the data source.
   * @param request The data request object containing pagination, sorting, and filtering information.
   */
  abstract load(request: DataRequest): Observable<DataResult>;
}
