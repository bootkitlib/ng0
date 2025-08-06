import { delay, of, Subject, tap } from "rxjs";
import { DataRequest, DataRequestFilter } from "./data-request";
import { DataResult } from "./data-result";
import { DataSource } from "./data-source";
import { StandardFilterOperators } from "./types";

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
    let items: Array<any>;

    if (request.page) {
      let startItemIndex = (request.page.zeroBased ? request.page.index : request.page.index - 1) * request.page.size;
      items = this.items.slice(startItemIndex, startItemIndex + request.page.size);
    } else {
      items = [...this.items];
    }

    if (Array.isArray(request.filters) && request.filters.length > 0) {
      // Apply filters

      request.filters.forEach(filter => {
        let filterFunction = getFilterFunction(filter);

        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          let value = filter.field ? item[filter.field] : item;
          if (!filterFunction(value, filter.value)) {
            items.splice(i, 1);
            i--; // Adjust index after removal
          }
        }
      });
    }

    if (request.sort) {
      // Apply sorting
    }

    let result = new DataResult(items, this.items.length);

    // this._loading = true;
    // return of(result).pipe(
    //   delay(5000),
    //   tap(x => this._loading = false)
    // );
    return of(result);
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

function getFilterFunction(filter: DataRequestFilter): (item: any, filter: any) => boolean {
  let operator = filter.operator || StandardFilterOperators.Contains;
  let caseSensitive = filter.caseSensitive || false;

  if(filter.value === undefined || filter.value === null) {
    return (item: any) => true; // No filter applied
  }

  switch (filter.operator) {
    case StandardFilterOperators.Contains:
      return caseSensitive ?
        (item: string, filter: string) => item.includes(filter) :
        (item: string, filter: string) => item.toLowerCase().includes(filter.toLowerCase());

    case StandardFilterOperators.StartsWith:
      return caseSensitive ?
        (item: string, filter: string) => item.startsWith(filter) :
        (item: string, filter: string) => item.toLowerCase().startsWith(filter.toLowerCase());

    case StandardFilterOperators.EndsWith:
      return caseSensitive ?
        (item: string, filter: string) => item.endsWith(filter) :
        (item: string, filter: string) => item.toLowerCase().endsWith(filter.toLowerCase());

    case StandardFilterOperators.Equals:
      if (typeof filter.value === 'string') {
        return caseSensitive ?
          (item: string, filter: string) => item === filter :
          (item: string, filter: string) => item.toLowerCase() === filter.toLowerCase();
      } else {
        return (item: any, filter: any) => item === filter.value;
      }

    default:
      throw new Error(`filter operator: ${operator} is not implemented in ArrayDataSource.`);
  }
}