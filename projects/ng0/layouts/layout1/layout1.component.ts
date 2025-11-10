import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, inject, model, QueryList, signal, ViewEncapsulation } from '@angular/core';
import { SidenavModule } from '@bootkit/ng0/components/sidenav';
import { CommonModule } from '@angular/common';
import { Layout1Manager } from './layout1-manager';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Layout1SidenavDirective } from './layout1-sidenav.directive';
import { Layout1SecondarySidenav } from './types';

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
  // private _zIndexCounter = 1000;
  private readonly _manager = inject(Layout1Manager);
  @ContentChildren(Layout1SidenavDirective) protected readonly _sidenavs?: QueryList<Layout1SidenavDirective>;
  protected readonly _secondarySidenavs = signal<Layout1SecondarySidenav[]>([]);
  protected readonly _openSecondarySidenavs = new Set<Layout1SecondarySidenav>();
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  /**
   * Whether the header is sticky.
   */
  public readonly stickyHeader = model(true);

  constructor() {
    this._manager.sidenavPushNotification.pipe(takeUntilDestroyed()).subscribe(c => this._pushSidenav(c));
    this._manager.sidenavRemoveNotification.pipe(takeUntilDestroyed()).subscribe(c => this._removeSidenav(c));
  }

  private _pushSidenav(sidenav: Layout1SecondarySidenav): void {
    this._secondarySidenavs().push(sidenav);
    this._changeDetectorRef.markForCheck();
    setTimeout(() => {
      // Open the sidenav in the next tick to ensure it's 'transform' transition works correctly.
      this._openSecondarySidenavs.add(sidenav);
      this._changeDetectorRef.markForCheck();
    });
  }

  protected _removeSidenav(sidenav: Layout1SecondarySidenav): void {
    // Close the sidenav first. After the transition ends, it will be removed from DOM.
    this._openSecondarySidenavs.delete(sidenav);
  }

  protected _onSecondarySidenavTransitionEnd(sidenav: Layout1SecondarySidenav) {
    if (!this._openSecondarySidenavs.has(sidenav)) {
      // We should remove secondary sidenavs from DOM.
      const index = this._secondarySidenavs().findIndex(x => x === sidenav);
      this._secondarySidenavs().splice(index, 1);
    }
  }
}
