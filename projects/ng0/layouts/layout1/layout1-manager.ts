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
  private _sidenavPushSubject = new Subject<Layout1SecondarySidenav>();
  private sidenavRemoveSubject = new Subject<Layout1SecondarySidenav>();

  public sidenavPushNotification = this._sidenavPushSubject.asObservable();
  public sidenavRemoveNotification = this.sidenavRemoveSubject.asObservable();


  public pushSidenav(template: TemplateRef<any>, options?: Layout1SecondarySidenavOptions): Layout1SecondarySidenav {
    const sidenav = new Layout1SecondarySidenav(template, options);
    this._sidenavPushSubject.next(sidenav);
    return sidenav;
  }

  public removeSidenav(sidenav: Layout1SecondarySidenav): void {
    this.sidenavRemoveSubject.next(sidenav);
  }
}
