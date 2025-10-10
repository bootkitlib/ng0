import { of } from "rxjs";
import { DataRequest, DataRequestFilter } from "./data-request";
import { DataResult } from "./data-result";
import { DataSource } from "./data-source";
import { signal } from "@angular/core";
import { getEnumValues, ValueWriter } from "@bootkit/ng0/common";

/**
 * An implementation of DataSource that uses an array as the data source.
 * This is useful for static data or when you want to manage the data manually.
 */
export class LocalDataSource extends DataSource {
  readonly type = 'local';
  // public valueWriter = signal<ValueWriter>
  // public valueComparer = signal<ValueComparerFunction>

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

  /**
   * Adds items to the end of the local array.
   * @param items The items to add.
   */
  public push(...items: any[]): void {
    let insertIndex = this.items.length;
    this.items.push(items);
    this.changeSubject.next({ changes: [{ type: 'push', items }] });
  }

  /**
   * Inserts items at the specified index.
   * @param index The index at which to insert the items.
   * @param items The items to insert.
   */
  public insert(index: number, ...items: any[]): void {
    this._validateIndex(index);
    this.items.splice(index, 0, ...items);
    this.changeSubject.next({ changes: [{ type: 'insert', items, index }] });
  }

  /**
   * Replaces an item at the specified index.
   * @param index The index of the item to replace.
   * @param value The new value for the item.
   */
  public replace(index: number, value: any): void {
    this._validateIndex(index);
    this.changeSubject.next({ changes: [{ type: 'replace', replacements: [{ index, value }] }] });
  }

  /**
   * Replaces multiple items at the specified indices.
   * @param replacements An array of objects containing the index and new value for each replacement.
   */
  public replaceMany(...replacements: { index: number, value: any }[]): void {
    replacements.forEach(({ index, value }) => {
      this._validateIndex(index);
      this.items[index] = value;
    });

    this.changeSubject.next({ changes: [{ type: 'replace', replacements: replacements }] });
  }

  /**
   * Removes items at the specified indices.
   * @param indices The indices of the items to remove.
   */
  public remove(...indices: any[]): void {
    indices.forEach(index => {
      this._validateIndex(index);
      this.items.splice(index, 1);
    });

    this.changeSubject.next({ changes: [{ type: 'remove', indices: indices }] });
  }

  public update(updater: (items: any[]) => void): void {
    updater(this.items);
    this.changeSubject.next({ changes: [{ type: 'mutate', items: this.items }] });
  }

  private _validateIndex(index: number) {
    if (index < 0 || index >= this.items.length) {
      throw Error('Index is out of range.');
    }
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