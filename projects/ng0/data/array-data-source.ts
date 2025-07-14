import { of } from "rxjs";
import { DataRequest } from "./data-request";
import { DataResult } from "./data-result";
import { DataSource } from "./data-source";

export class ArrayDataSource extends DataSource {
  constructor(private items: any[]) {
    super();
  }

  load(request: DataRequest) {
    var startItem = request.pageIndex * request.pageSize;
    let result = this.items.slice(startItem, startItem + request.pageSize);
    return of(new DataResult(request, result, this.items.length));
  }

  remove(item: any) {
    var idx = this.items!.findIndex(x => x === item);
    if (idx > -1) {
      this.items.splice(idx, 1);
      this.changeSubject.next(0);
    }
  }

  insert(item: any) {
    var idx = this.items.push(item);
    this.changeSubject.next(0);
  }

  set(items: any[]) {
    this.items = items;
    this.changeSubject.next(0);
  }
}
