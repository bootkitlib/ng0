import { ArrayDataSource } from "./array-data-source";
import { AsyncDataSource, DataLoader } from "./async-data-source";
import { DataSource } from "./data-source";

/**
 * DataSourceLike is a type that can be used to represent any data source
 * that can be used with the table, autocomplete, dropdown and any component that requires data.
 * It can be an array of data, a function that returns an observable of data,
 * or an instance of DataSource.
 */
export type DataSourceLike<T = any> = Array<any> | DataLoader<T> | DataSource<T> | undefined | null;


/**
 * Converts a data source like an array, function, or DataSource into a DataSource instance.
 * @param source The data source to convert.
 * @returns A DataSource instance.
 */
export function convertToDataSource<T>(source: DataSourceLike): DataSource<T> {
  if (Array.isArray(source)) {
    return new ArrayDataSource(source);
  } else if (typeof source == 'function') {
    return new AsyncDataSource(source);
  } else if (source instanceof DataSource) {
    return source;
  } else if (source === undefined || source === null) {
    return new ArrayDataSource([]);
  } else {
    throw new Error('Invalid source parameter.');
  }
}

/**
 * StandardFilterOperators is an enumeration of standard filter operators
 * that can be used in data requests to filter data.
 * It includes operators like Contains, StartsWith, EndsWith, and Equals.
 */
export enum StandardFilterOperators {
  /**
   * A filter that matches items that contain the specified value.
   */
  Contains = 'contains',

  /**
   * A filter that matches items that start with the specified value.
   */
  StartsWith = 'startsWith',

  /**
   * A filter that matches items that end with the specified value.
   */
  EndsWith = 'endsWith',

  /**
   * A filter that matches items that are equal to the specified value.
   */
  Equals = 'equals',

  /**
   * A filter that matches items that are not equal to the specified value.
   */
  NotEquals = 'notEquals',

  /**
   * A filter that matches items that are greater than the specified value.
   */
  GreaterThan = 'greaterThan',

  /**
   * A filter that matches items that are greater than or equal to the specified value.
   */
  GreaterThanOrEqual = 'greaterThanOrEqual',

  /**
   * A filter that matches items that are less than the specified value.
   */
  LessThan = 'lessThan',

  /**
   * A filter that matches items that are less than or equal to the specified value.
   */
  LessThanOrEqual = 'lessThanOrEqual',

  
}