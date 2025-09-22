import { LocalDataSource } from "./local-data-source";
import { RemoteDataSource, DataLoader } from "./remote-data-source";
import { DataSource } from "./data-source";

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

/**
 * Converts a DataSourceLike to a DataSource instance.
 * @param source The data source to convert.
 * @returns A DataSource instance.
 */
export function dataSourceAttribute<T>(source: DataSourceLike): DataSource<T> {
  if (Array.isArray(source)) {
    return new LocalDataSource(source);
  } else if (typeof source == 'function') {
    return new RemoteDataSource(source);
  } else if (source instanceof DataSource) {
    return source;
  } else if (source === undefined || source === null) {
    return new LocalDataSource([]);
  } else if (typeof source === 'object') {
    return DataSource.fromEnum(source);
  } else {
    throw new Error('Invalid data source.');
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

export interface DataSourceChange {
  type: 'insert' | 'replace' | 'remove';
}

export interface DataSourceItemInsert extends DataSourceChange {
  type: 'insert'

  /** Insert index */
  index?: number;
  items: any[];
}

export interface DataSourceItemReplace extends DataSourceChange {
  type: 'replace'
  index: number;
  value: any;
}

export interface DataSourceItemRemove extends DataSourceChange {
  type: 'remove'
  index: number;
  count?: number
}


export interface DataSourceChangeEvent {
  changes: Array<DataSourceItemInsert | DataSourceItemReplace | DataSourceItemRemove>
}