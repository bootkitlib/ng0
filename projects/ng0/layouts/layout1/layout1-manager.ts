import { Injectable, TemplateRef } from '@angular/core';
import { Layout1SecondarySidenav, Layout1SecondarySidenavOptions } from './secondary-sidenav';
import { Layout1Component } from './layout1.component';

/**
 * Service to manage the configuration and state of Layout1Component.
 */
@Injectable({
  providedIn: 'root'
})
export class Layout1Manager {
  /**
   * The Layout1Component instance associated with this manager.
   */
  public component!: Layout1Component;

  /**
   * Push a secondary sidenav.
   * @param content The template for the secondary sidenav.
   * @param options Options for the secondary sidenav.
   * @returns The reference to the pushed secondary sidenav.
   */
  public pushSidenav(content: TemplateRef<any>, options?: Layout1SecondarySidenavOptions): Layout1SecondarySidenav {
    return this.component.pushSidenav(content, options);
  }

  /**
   * Close the last secondary sidenav and dispose it.
   */
  public popSidenav(result?: any): Layout1SecondarySidenav | undefined {
    return this.component.popSidenav(result);
  }

  /**
   * Get the list of secondary sidenavs.
   */
  public get secondarySidenavs(): ReadonlyArray<Layout1SecondarySidenav> {
    return this.component.secondarySidenavs;
  }

  /**
   * Get the last secondary sidenav.
   */
  public get last(): Layout1SecondarySidenav | undefined {
    return this.component.secondarySidenavs.at(-1);
  }
}
