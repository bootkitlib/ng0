import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  private _writeSubject = new Subject<any>;
  public readonly write = this._writeSubject.asObservable();

  constructor() { }

  public writeText(text: string) {
    window.navigator.clipboard.writeText(text);
    this._writeSubject.next(text);
  }
}
