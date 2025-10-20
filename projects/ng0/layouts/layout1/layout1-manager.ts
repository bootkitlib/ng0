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
  // public readonly endSidenavOpen = signal(true);
  // public readonly endSidenavMode = signal<SidenavMode>('push');

  /**
   * Default size of the first secondary sidenav.
   */
  public readonly secondarySidenavDefaultSize = signal(600);

  /**
   * Reduce size step for the secondary sidenavs.
   */
  public readonly secondarySidenavReduceSize = signal(100);

  /**
   * Minimum size of a secondary sidenav.
   */
  public readonly secondarySidenavMinSize = signal(100);

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
    let size = options?.size;
    if (!size) {
      if (this.secondarySidenavs().length == 0) {
        size = this.secondarySidenavDefaultSize();
      } else {
        size = this.secondarySidenavs().at(-1)!.size - this.secondarySidenavReduceSize();
        if (size < this.secondarySidenavMinSize()) {
          size = this.secondarySidenavMinSize();
        }
      }
    }

    this.secondarySidenavs().push({
      template,
      size: size,
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
