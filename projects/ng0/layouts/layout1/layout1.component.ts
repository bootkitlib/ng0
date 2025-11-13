import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, inject, input, QueryList, signal, TemplateRef, ViewEncapsulation } from '@angular/core';
import { SidenavMode, SidenavModule, SidenavPosition, SidenavSize } from '@bootkit/ng0/components/sidenav';
import { CommonModule } from '@angular/common';
import { Layout1Manager } from './layout1-manager';
import { Layout1SidenavDirective } from './layout1-sidenav.directive';
import { Layout1SecondarySidenavOptions, Layout1SecondarySidenav } from './secondary-sidenav';

/**
 * Layout1 component that provides a layout with sidenavs.
 */
@Component({
  selector: 'ng0-layout1',
  templateUrl: './layout1.component.html',
  styleUrls: ['./layout1.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, SidenavModule]
})
export class Layout1Component {
  private _zIndexCounter = 1000;
  private readonly _manager = inject(Layout1Manager);
  @ContentChildren(Layout1SidenavDirective) protected readonly _sidenavs?: QueryList<Layout1SidenavDirective>;
  protected readonly _secondarySidenavs = signal<Layout1SecondarySidenav[]>([]);
  protected readonly _openSecondarySidenavs = new Set<Layout1SecondarySidenav>();
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  /**
   * Default position for secondary sidenavs.
   */
  defaultSidenavPosition = input<SidenavPosition>('start');

  /**
   * Default size for secondary sidenavs.
   */
  defaultSidenavSize = input<SidenavSize>();

  /**
   * Default mode for secondary sidenavs.
   */
  defaultSidenavMode = input<SidenavMode>('over');

  /**
   * Default hasBackdrop value for secondary sidenavs.
   */
  defaultSidenavHasBackdrop = input(true);

  /**
   * Default closeOnBackdropClick value for secondary sidenavs.
   */
  defaultSidenavCloseOnBackdropClick = input(false);


  constructor() {
    this._manager.component = this;
  }

  /**
   * Push a secondary sidenav.
   * @param template The template for the secondary sidenav.
   * @param options Options for the secondary sidenav.
   * @returns The reference to the pushed secondary sidenav.
   */
  public pushSidenav(template: TemplateRef<any>, options?: Layout1SecondarySidenavOptions): Layout1SecondarySidenav {
    options = options || {};
    options.zIndex = options.zIndex ?? this._zIndexCounter++;
    options.mode = options.mode ?? this.defaultSidenavMode();
    options.position = options.position ?? this.defaultSidenavPosition();
    options.size = options.size ?? this.defaultSidenavSize();
    options.hasBackdrop = options.hasBackdrop ?? this.defaultSidenavHasBackdrop();
    options.closeOnBackdropClick = options.closeOnBackdropClick ?? this.defaultSidenavCloseOnBackdropClick();

    const sidenavRef = new Layout1SecondarySidenav(template, options);
    this._secondarySidenavs().push(sidenavRef);
    this._changeDetectorRef.markForCheck();

    // Open the sidenav in the next tick to ensure it's 'transform' transition works correctly.
    setTimeout(() => {
      this._openSecondarySidenavs.add(sidenavRef);
      this._changeDetectorRef.markForCheck();
    });

    sidenavRef.disposed.subscribe((result?: any) => {
      // Close the sidenav first. After the transition ends, it will be removed from DOM.
      this._openSecondarySidenavs.delete(sidenavRef);
    });

    return sidenavRef;
  }

  /**
   * Close the last secondary sidenav and dispose it.
   * @param result The result to pass when closing the sidenav.
   * @return The reference to the closed secondary sidenav.
  */
  public popSidenav(result?: any): Layout1SecondarySidenav | undefined {
    const last = this._secondarySidenavs().at(-1);
    if (last) {
      last.dispose(result);
      return last;
    }

    return undefined;
  }

  /**
   * Get the list of secondary sidenavs.
   */
  public get secondarySidenavs(): ReadonlyArray<Layout1SecondarySidenav> {
    return this._secondarySidenavs();
  }

  protected _onSecondarySidenavTransitionEnd(sidenav: Layout1SecondarySidenav) {
    if (sidenav.isDisposed) {
      const index = this._secondarySidenavs().findIndex(x => x === sidenav);
      this._secondarySidenavs().splice(index, 1);
    }
  }
}
