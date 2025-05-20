import { Directionality } from '@angular/cdk/bidi';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit, Component, ContentChildren, ElementRef, EventEmitter, HostBinding,
  Inject, Input, OnDestroy, Output, PLATFORM_ID, QueryList, Renderer2
} from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutContentPosition } from './types';
import { LayoutComponentState } from './layout-state';
import { PanelComponent } from './panel.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'jss-panels',
  exportAs: 'jssPanels',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [LayoutComponentState],
  animations: [
    trigger('t', [
      state('0', style({
        padding: '{{padding}}',
      }), { params: { padding: '' } }),
      state('1', style({
        padding: '{{padding}}',
      }), { params: { padding: '' } }),
      transition('0 <=> 1', [
        animate('.1s'),
      ])
    ]),
  ]
})
export class LayoutComponent implements AfterContentInit, OnDestroy {
  /** Includes viewport panels for computing conent padding */
  @Input() includeViewportPanels = false;
  @Output() layoutChange = new EventEmitter<LayoutContentPosition>();
  @ContentChildren(PanelComponent) _drawers: QueryList<PanelComponent>;
  private _isBrowser: boolean;
  private _isRtl: boolean;
  private _contentPos: LayoutContentPosition;
  private _panelSubscription: Subscription;
  private _animationState = false;

  constructor(
    private _state: LayoutComponentState,
    private _dir: Directionality,
    @Inject(PLATFORM_ID) private _platformId) {

    this._isBrowser = isPlatformBrowser(_platformId);
    this._isRtl = this._dir.value === 'rtl';
    this._panelSubscription = this._state.panelChange.subscribe(d => {
      this._handleLayoutChange();
      this._animationState = !this._animationState;
    });
  }

  ngAfterContentInit(): void {
    this._handleLayoutChange();
  }

  private _handleLayoutChange() {
    this._contentPos = this._computeContentPosition();
    this._state.layoutChanged(this._contentPos);
    this.layoutChange.emit(this._contentPos);
  }

  private _computeContentPosition(): LayoutContentPosition {
    let top: number, bottom: number, left: number, right: number;

    if (this._isBrowser && this._drawers) {
      const fixedPanels = this._drawers.filter(d => d.show && !d.over && (d.placement === 'container' || this.includeViewportPanels));
      const filterDrawers = (x: string) => fixedPanels.filter(d => d.position === x);
      const max = (items: number[]) => items.length === 0 ? 0 : Math.max(...items);
      const v = ['start', 'end', 'top', 'bottom'].map(x => max(filterDrawers(x).map(d => d.size)));
      left = this._isRtl ? v[1] : v[0];
      right = this._isRtl ? v[0] : v[1];
      top = v[2];
      bottom = v[3];
    } else {
      top = bottom = left = right = 0;
    }

    return { top, right, bottom, left };
  }

  get _animationTrigger() {
    const p = this._contentPos;

    return {
      value: this._animationState,
      params: {
        padding: p ? `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px` : '0',
      }
    };
  }

  ngOnDestroy(): void {
    this._panelSubscription.unsubscribe();
  }
}
