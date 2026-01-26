import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, inject, PLATFORM_ID, QueryList, ViewEncapsulation } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import { SidenavPosition } from './types';

/**
 * Sidenav container component
 */
@Component({
  selector: 'ng0-sidenav-container',
  templateUrl: './sidenav-container.component.html',
  styleUrls: ['./sidenav-container.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    "[style.padding-inline-start]": "_getPadding('start')",
    "[style.padding-inline-end]": "_getPadding('end')",
    "[style.padding-top]": "_getPadding('top')",
    "[style.padding-bottom]": "_getPadding('bottom')",
    "[class.ng0-sidenav-transition]": "_isTransitionEnabled",
    "[class.ng0-sidenav-content-hidden]": "!_canComputePadding()",
  }
})
export class SidenavContainerComponent implements AfterViewInit {
  private readonly _platformId = inject(PLATFORM_ID);
  protected readonly _isPlatformServer = isPlatformServer(this._platformId)
  protected _isTransitionEnabled = false;
  @ContentChildren(SidenavComponent) protected _sidenavs!: QueryList<SidenavComponent>;

  public readonly changeDetectorRef = inject(ChangeDetectorRef);

  protected _getPadding(position: SidenavPosition) {
    let openSidenavs = this._sidenavs.filter(x => x.open() && x.mode() == 'push');
    let filteredSidenavs = openSidenavs.filter(x => x.position() == position);
    if(filteredSidenavs.length == 0) return undefined;

    if (this._isPlatformServer) {
      let hasDynamicSidenavs = openSidenavs.some(x => x._getFixedSize() == undefined);
      if (hasDynamicSidenavs) {
        // we cannot compute padding on the server
        return undefined;
      } else {
        let fixedSizes = filteredSidenavs.map(x => x._getFixedSize());
        return fixedSizes.length > 1 ? `max(${fixedSizes.join(', ')})` : fixedSizes[0];
      }
    } else {
      let horizontal = position == 'start' || position == 'end';
      let sizes = filteredSidenavs.map(x => horizontal ? x.elmentRef.nativeElement.offsetWidth : x.elmentRef.nativeElement.offsetHeight);
      return `${Math.max(...sizes)}px`;
    }
  };

  ngAfterViewInit() {
    if (!this._isPlatformServer) {
      setTimeout(() => this._isTransitionEnabled = true);
    }
  }

  // In some modes the content is pushed based on the width of the opened sidenavs, however on
  // the server we can't measure the sidenav-container padding, so the padding is always zero. This can cause the
  // content to jump around when it's rendered on the server and hydrated on the client.
  // We avoid it by hiding the content on the initial render and then showing it once the sidenav
  // has been measured on the client.
  protected _canComputePadding() {
    if (this._isPlatformServer) {
      let hasDynamicSizenavs = this._sidenavs.some(x => x.open() && x.mode() == 'push' && x._getFixedSize() == undefined);
      return !hasDynamicSizenavs;
    }

    return true;
  }
}
