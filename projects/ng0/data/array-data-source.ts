import { of, Subject } from "rxjs";
import { DataRequest } from "./data-request";
import { DataResult } from "./data-result";
import { DataSource } from "./data-source";

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
    let startItem = request.page!.index * request.page!.size;
    let resultArray = this.items.slice(startItem, startItem + request.page!.size);
    let result = new DataResult(resultArray, this.items.length);
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
