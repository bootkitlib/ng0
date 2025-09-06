import { delay, of, Subject, tap } from "rxjs";
import { DataRequest, DataRequestFilter } from "./data-request";
import { DataResult } from "./data-result";
import { DataSource } from "./data-source";
import { FilterOperators } from "./types";

/**
 * An implementation of DataSource that uses an array as the data source.
 * This is useful for static data or when you want to manage the data manually.
 */
export class ArrayDataSource extends DataSource {
  private _insertSubject = new Subject<{ items: any[] }>();
  private _updateSubject = new Subject<{ item: any, index: number }>();
  private _removeSubject = new Subject<{ item: any, index: number }>();

  public readonly inserted = this._insertSubject.asObservable();
  public readonly removed = this._removeSubject.asObservable();
  public readonly updated = this._updateSubject.asObservable();

  constructor(private items: any[]) {
    super();
  }

  load(request: DataRequest) {
    let filteredValues = [...this.items];
    let result: any[];

    // Filtering
    if (Array.isArray(request.filters) && request.filters.length > 0) {
      request.filters.forEach(filter => {
        if (!filter.field) {
          throw Error('DataRequestFilter "field" cannot be null.');
        }

        let isPassedByFilter = getFilterFunction(filter);

        for (let i = 0; i < filteredValues.length; i++) {
          let row = filteredValues[i];
          if (!isPassedByFilter(row[filter.field], filter.value)) {
            filteredValues.splice(i, 1);
            i--; // Adjust index after removal
          }
        }
      });
    }

    // Pagination
    if (request.page) {
      let startItemIndex = (request.page.zeroBased ? request.page.index : request.page.index - 1) * request.page.size;
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

  public remove(item: any) {
    let index = this.items!.findIndex(x => x === item);
    if (index > -1) {
      this.items.splice(index, 1);
      this._removeSubject.next({ item, index });
    }
  }

  public insert(...items: any[]) {
    this.items.push(items);
    this._insertSubject.next({ items });
  }

  // public set(items: any[]) {
  //   this.items = items;
  //   // this._removeSubject.next(0);
  // }
}

function getFilterFunction(requestfilter: DataRequestFilter): (cellValue: any, filterValue: any) => boolean {
  let operator = requestfilter.operator || FilterOperators.Contains;
  let caseSensitive = requestfilter.caseSensitive || false;

  // if (requestfilter.value === undefined || requestfilter.value === null) {
  //   return (item: any) => true; // No filter applied
  // }

  switch (requestfilter.operator) {
    case FilterOperators.Contains:
      return caseSensitive ?
        (item: string, filter: string) => item.includes(filter) :
        (item: string, filter: string) => item.toLowerCase().includes(filter.toLowerCase());

    case FilterOperators.StartsWith:
      return caseSensitive ?
        (item: string, filter: string) => item.startsWith(filter) :
        (item: string, filter: string) => item.toLowerCase().startsWith(filter.toLowerCase());

    case FilterOperators.EndsWith:
      return caseSensitive ?
        (item: string, filter: string) => item.endsWith(filter) :
        (item: string, filter: string) => item.toLowerCase().endsWith(filter.toLowerCase());

    case FilterOperators.Equals:
      if (typeof requestfilter.value === 'string') {
        return caseSensitive ?
          (item: string, filter: string) => item == filter :
          (item: string, filter: string) => item.toString().toLowerCase() === filter.toLowerCase();
      } else {
        return (item: any, filter: any) => item === filter;
      }

    case FilterOperators.LessThan:
      return (item: any, filter: any) => item < filter;

    case FilterOperators.LessThanOrEqual:
      return (item: any, filter: any) => item <= filter;

    case FilterOperators.GreaterThan:
      return (item: any, filter: any) => item > filter;

    case FilterOperators.GreaterThanOrEqual:
      return (item: any, filter: any) => item >= filter;

    case FilterOperators.NotEquals:
      return (item: any, filter: any) => item !== filter;

    default:
      throw new Error(`filter operator: ${operator} is not implemented in ArrayDataSource.`);
  }
}