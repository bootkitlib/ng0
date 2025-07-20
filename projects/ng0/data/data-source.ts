import { Observable, Subject } from "rxjs";
import { DataRequest } from "./data-request";
import { DataResult } from "./data-result";

export abstract class DataSource<T=any> {
  protected _loading = false;

  constructor() {
  }

  get loading() { return this._loading; }
  protected setLoading(value: boolean) {
    this._loading = value;
  }

  // get data() { return this._data; }
  // protected set data(value: any[] | undefined) {
  //   this._data = value;
  // }

  // get totallRecords() { return this._totallRecords; }
  // protected set totallRecords(value: number | undefined) {
  //   this._totallRecords= value;
  // }

  abstract load(request: DataRequest): Observable<DataResult>;
}
