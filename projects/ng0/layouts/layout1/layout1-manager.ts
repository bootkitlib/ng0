import { Injectable, signal, TemplateRef } from '@angular/core';
import { SidenavMode } from '@bootkit/ng0/components/sidenav';
import { Layout1SidenavConfiguration } from './types';

/**
 * Service to manage the configuration and state of Layout1Component.
 */
@Injectable({
  providedIn: 'root'
})
export class Layout1Manager {
  private _zIndexCounter = 1000;

  /**
   * Whether the start sidenav is open.
   */
  public readonly startSidenavOpen = signal(true);

  /**
   * The mode of the start sidenav.
   */
  public readonly startSidenavMode = signal<SidenavMode>('push');

  /**
   * Whether the start sidenav is fixed.
   */
  public readonly startSidenavFixed = signal(true);

  /**
   * List of secondary sidenavs.
   */
  public readonly secondarySidenavs = signal<Layout1SidenavConfiguration[]>([]);

  /**
   * Header mode. 
   * 'default' - Header scrolls with the page.
   * 'sticky' - Header is fixed at the top.
   */
  public readonly headerMode = signal<'default' | 'sticky'>('sticky');

  /**
   * Push a new secondary sidenav onto the stack.
   * @param template TemplateRef of the sidenav content.
   * @param options Options for the sidenav.
   */
  public pushSidenav(template: TemplateRef<any>, options?: Partial<Omit<Layout1SidenavConfiguration, 'template' | 'zIndex'>>): void {
    this.secondarySidenavs().push({
      template,
      size: options?.size,
      position: options?.position ?? 'end',
      zIndex: this._zIndexCounter++,
      closeByBackdropClick: options?.closeByBackdropClick ?? true,
    });

    this.secondarySidenavs.set([...this.secondarySidenavs()]);
  }

  /**
   * Pop the topmost secondary sidenav from the stack.
   * @returns The popped secondary sidenav or undefined if the stack is empty.
   */
  public popSidenav(): Layout1SidenavConfiguration | undefined {
    let item = this.secondarySidenavs().pop();
    this.secondarySidenavs.set([...this.secondarySidenavs()]);
    return item;
  }

  /**
   * Toggle the open state of the start sidenav.
   */
  public toggleStartSidenav(): void {
    this.startSidenavOpen.update(x => !x);
  }
}
