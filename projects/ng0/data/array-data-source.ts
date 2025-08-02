import { delay, of, Subject, tap } from "rxjs";
import { DataRequest } from "./data-request";
import { DataResult } from "./data-result";
import { DataSource } from "./data-source";

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

    if (request.filters) {
      // Apply filters
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
