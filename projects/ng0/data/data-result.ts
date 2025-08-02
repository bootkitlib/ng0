export class DataResult<T = any> {
  constructor(
    public readonly data: T[],
    public readonly total?: number) {
  }
}
