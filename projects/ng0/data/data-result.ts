import { DataRequest } from "./data-request";

export class DataResult<T = any> {
  constructor(
    public readonly request: DataRequest,
    public readonly data: T[],
    public readonly total?: number) {
  }
}
