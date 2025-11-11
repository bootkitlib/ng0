import { Injectable, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Layout1SecondarySidenav, Layout1SecondarySidenavOptions } from './types';

/**
 * Service to manage the configuration and state of Layout1Component.
 */
@Injectable({
  providedIn: 'root'
})
export class Layout1Manager {
  private _zIndexCounter = 1000;
  private _sidenavPushSubject = new Subject<Layout1SecondarySidenav>();
  private _sidenavPopSubject = new Subject<any>();
  private _sidenavRemoveSubject = new Subject<Layout1SecondarySidenav>();

  /**
   * @private
   */
  public sidenavPushNotification = this._sidenavPushSubject.asObservable();

  /**
   * @private
   */
  public sidenavPopNotification = this._sidenavPopSubject.asObservable();

  /**
   * @private
   */
  public sidenavRemoveNotification = this._sidenavRemoveSubject.asObservable();

  /**
   * Push a secondary sidenav.
   * @param template  
   * @param options 
   * @returns 
   */
  public pushSidenav(template: TemplateRef<any>, options?: Layout1SecondarySidenavOptions): Layout1SecondarySidenav {
    options = options || {};
    options.zIndex = options.zIndex ?? this._zIndexCounter++;

    const sidenav = new Layout1SecondarySidenav(template, options);
    this._sidenavPushSubject.next(sidenav);
    return sidenav;
  }

  /**
   * Pop the last secondary sidenav.
   */
  public popSidenav(): void {
    this._sidenavPopSubject.next(undefined);
  }

  /**
   * Remove a secondary sidenav.
   * @param sidenav 
   */
  public removeSidenav(sidenav: Layout1SecondarySidenav): void {
    this._sidenavRemoveSubject.next(sidenav);
  }
}
