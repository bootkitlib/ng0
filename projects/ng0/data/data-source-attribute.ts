import { LocalDataSource } from "./local-data-source";
import { RemoteDataSource } from "./remote-data-source";
import { DataSource, DataSourceLike } from "./data-source";

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
    return LocalDataSource.fromEnum(source);
  } else {
    throw new Error('Invalid data source.');
  }
}
