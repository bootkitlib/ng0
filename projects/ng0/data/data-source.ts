import { Observable, Subject } from "rxjs";
import { DataRequest } from "./data-request";
import { DataResult } from "./data-result";
import { signal } from "@angular/core";
import { DataSourceChangeEvent } from "./types";
import { LocalDataSource } from "./local-data-source";
import { getEnumValues } from "@bootkit/ng0/common";

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

  /**
   * Creates a LocalDataSource from enum values.
   * @param enumClass The enum class to extract values from.
   * @returns A LocalDataSource containing the enum values.
   */
  public static fromEnum(enumClass: Record<string, string | number>): LocalDataSource {
    return new LocalDataSource(getEnumValues(enumClass));
  }
}
