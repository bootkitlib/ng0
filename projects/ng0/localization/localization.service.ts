import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Locale } from './locale';
import { LocaleChangeEvent } from './types';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private _locales: Locale[] = [];
  private _activeLocale?: Locale;
  private _changeSubject = new Subject<LocaleChangeEvent>();
  readonly change = this._changeSubject.asObservable();

  constructor() {
  }

  /** 
   * Adds a Locale 
   */
  add(locale: Locale): void;
  /** Adds an array of Locales to this LocaleProvider */
  add(locales: Locale[]): void;
  add(l: any): void {
    if (l instanceof Locale) {
      this._locales.push(l);
    } else if (Array.isArray(l)) {
      l.forEach(x => this.add(x));
    } else {
      throw Error('Invalid locale');
    }

    if (this._locales.length == 1) {
      this._activeLocale = this._locales[0];
    }
  }

  /** Changes the active locale */
  set(localeName: string): void {
    const locale = this._locales.find(x => x.name === localeName);
    if (locale) {
      this._changeSubject.next({ old: this._activeLocale, new: locale });
      this._activeLocale = locale;
      return;
    }

    throw Error('Locale not found.');
  }

  /** Gets the active locale */
  get(): Locale | undefined {
      return this._activeLocale;
  }
}
