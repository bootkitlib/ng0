import { from, Observable, of } from 'rxjs';

/**
 * Converts a value to an Observable.
 * If the value is already an Observable, it returns it directly.
 * If the value is a Promise, it converts it to an Observable.
 * If the value is neither, it wraps it in an Observable using `of`.
 * @param value The value to convert.
 * @returns An Observable that emits the value.
 */
export function toObservable<T>(value: T | Observable<T> | Promise<T>): Observable<T> {
    if (value instanceof Observable) {
        return value;
    } else if (value instanceof Promise) {
        return from(value);
    } else {
        return of(value);
    }
}
