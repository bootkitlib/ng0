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
 * LogicalOperator is a list of predefined logical operators that can be used in data requests to filter data.
 */
export type LogicalOperator =
  | 'contains'
  | 'endsWith'
  | 'startsWith'
  | 'like'
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte';