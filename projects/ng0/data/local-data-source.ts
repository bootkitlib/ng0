import { of } from "rxjs";
import { DataRequest, DataRequestFilter } from "./data-request";
import { DataResult } from "./data-result";
import { DataSource } from "./data-source";
import { getEnumValues } from "@bootkit/ng0/common";

/**
 * An implementation of DataSource that uses an array as the data source.
 * This is useful for static data or when you want to manage the data manually.
 */
export class LocalDataSource extends DataSource {
  readonly type = 'local';

  /**
   * Creates a new LocalDataSource.
   * @param items The array of items to be used as the data source. 
   */
  constructor(private items: any[]) {
    super();
  }

  /**
 * Creates a LocalDataSource from enum values.
 * @param enumClass The enum class to extract values from.
 * @returns A LocalDataSource containing the enum values.
 */
  public static fromEnum(enumClass: Record<string, string | number>): LocalDataSource {
    return new LocalDataSource(getEnumValues(enumClass));
  }

  /**
   * Loads data from the local array based on the provided DataRequest.
   * @param request The DataRequest containing filtering, sorting, and pagination information.
   * @returns An observable of DataResult containing the requested data. 
   */
  load(request: DataRequest) {
    let filteredValues = [...this.items];
    let result: any[];

    // Filtering
    // if (Array.isArray(request.filters) && request.filters.length > 0) {
    //   request.filters.forEach(filter => {
    //     if (!filter.filterBy) {
    //       throw Error('A filterBy function must be provided for LocalDataSource filters.');
    //     }

    //     let isPassedByFilter = getFilterFunction(filter);

    //     for (let i = 0; i < filteredValues.length; i++) {
    //       let row = filteredValues[i];
    //       if (!isPassedByFilter(row[filter.field], filter.value)) {
    //         filteredValues.splice(i, 1);
    //         i--; // Adjust index after removal
    //       }
    //     }
    //   });
    // }

    // Pagination
    if (request.page) {
      let startItemIndex = request.page.index * request.page.size;
      result = filteredValues.slice(startItemIndex, startItemIndex + request.page.size);
    } else {
      result = filteredValues;
    }

    // Sorting
    if (request.sort) {

    }

    let dataResult = new DataResult(result, filteredValues.length);

    // this._loading = true;
    // return of(result).pipe(
    //   delay(5000),
    //   tap(x => this._loading = false)
    // );
    return of(dataResult);
  }
}

function getFilterFunction(requestfilter: DataRequestFilter): (cellValue: any, filterValue: any) => boolean {
  let operator = requestfilter.operator || 'contains';
  let caseSensitive = requestfilter.caseSensitive || false;

  // if (requestfilter.value === undefined || requestfilter.value === null) {
  //   return (item: any) => true; // No filter applied
  // }

  switch (requestfilter.operator) {
    case 'contains':
      return caseSensitive ?
        (item: string, filter: string) => item.includes(filter) :
        (item: string, filter: string) => item.toLowerCase().includes(filter.toLowerCase());

    case 'startsWith':
      return caseSensitive ?
        (item: string, filter: string) => item.startsWith(filter) :
        (item: string, filter: string) => item.toLowerCase().startsWith(filter.toLowerCase());

    case 'endsWith':
      return caseSensitive ?
        (item: string, filter: string) => item.endsWith(filter) :
        (item: string, filter: string) => item.toLowerCase().endsWith(filter.toLowerCase());

    case 'eq':
      if (typeof requestfilter.value === 'string') {
        return caseSensitive ?
          (item: string, filter: string) => item == filter :
          (item: string, filter: string) => item.toString().toLowerCase() === filter.toLowerCase();
      } else {
        return (item: any, filter: any) => item === filter;
      }

    case 'lt':
      return (item: any, filter: any) => item < filter;

    case 'lte':
      return (item: any, filter: any) => item <= filter;

    case 'gt':
      return (item: any, filter: any) => item > filter;

    case 'gte':
      return (item: any, filter: any) => item >= filter;

    case 'ne':
      return (item: any, filter: any) => item !== filter;

    default:
      throw new Error(`filter operator: ${operator} is not implemented in ArrayDataSource.`);
  }
}