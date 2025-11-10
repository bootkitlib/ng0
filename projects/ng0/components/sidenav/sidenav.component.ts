import { booleanAttribute, numberAttribute, Component, ComponentRef, effect, ElementRef, EventEmitter, input, OnDestroy, Output, Renderer2, ViewContainerRef, inject, ChangeDetectionStrategy, ViewEncapsulation, PLATFORM_ID, Inject, DOCUMENT } from '@angular/core';
import { SidenavMode, SidenavPosition, SidenavSize } from './types';
import { BackdropComponent } from '@bootkit/ng0/components/backdrop';
import { isPlatformServer } from '@angular/common';
import { SidenavContainerComponent } from './sidenav-container.component';
import { Observable, Subscription, throttleTime } from 'rxjs';

/**
 * A sidenav component that displays a sliding navigation panel.
 */
@Component({
  selector: 'ng0-sidenav',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    "[style.width]": "position() == 'start' || position() == 'end' ? _getFixedSize() : undefined",
    "[style.height]": "undefined",
    "[style.z-index]": "zIndex()",
    "[class.ng0-sidenav-start]": "position() == 'start'",
    "[class.ng0-sidenav-end]": "position() == 'end'",
    "[class.ng0-sidenav-top]": "position() == 'top'",
    "[class.ng0-sidenav-bottom]": "position() == 'bottom'",
    "[class.ng0-sidenav-open]": "open()",
    "[class.ng0-sidenav-small]": "size() == 'small'",
    "[class.ng0-sidenav-medium]": "size() == 'medium'",
    "[class.ng0-sidenav-large]": "size() == 'large'",
    "[class.ng0-sidenav-full]": "size() == 'full'",
    "[class.ng0-sidenav-fixed]": "fixedInViewport()",
  }
})
export class SidenavComponent implements OnDestroy {
  private _bodyOverflowStyle?: string;
  private _sidenavContainer = inject(SidenavContainerComponent);
  private _vcr = inject(ViewContainerRef);
  private _renderer = inject(Renderer2);
  private _backdropRef?: ComponentRef<BackdropComponent>;
  private _backdropClickHandlerUnlisten?: () => void;
  private _platformId = inject(PLATFORM_ID);
  protected _isPlatformServer = isPlatformServer(this._platformId)
  private _resizeSubscription?: Subscription;
  private readonly _elementRef = inject(ElementRef<HTMLElement>);


  /**
   * Whether the sidenav is open.
   */
  public open = input(false, { transform: booleanAttribute });

  /**
   * Sidenav mode.
   * Determines how the sidenav is displayed.
   * Can be either 'push' or 'over'.
   * - 'push': The content is pushed aside to make room for the sidenav.
   * - 'over': The sidenav is displayed on top of the content.
   */
  public mode = input<SidenavMode>('push');

  /**
   * Whether the sidenav has a backdrop.
   * The backdrop is shown only when the sidenav is open and mode is 'over'.
   */
  public hasBackdrop = input(true, { transform: booleanAttribute });

  /**
   * Sidenav z-index.
   * Determines the stack order of the sidenav.
   */
  public zIndex = input(undefined, { transform: numberAttribute });

  /**
   * Sidenav position.
   * Determines the position of the sidenav.
   * Can be either 'start', 'end', 'top', or 'bottom'.
   */
  public position = input<SidenavPosition>('start');

  /**
   * Sidenav size.
   * Determines the size of the sidenav.  
   * Can be either 'small', 'medium', 'large', 'full', or a specific value.  
   * If a specific value is provided, it will be used as the width/height of the sidenav.
   * @example
   * - 100, '300px', '50%', '50vh', 'small', 'full', ...
   */
  public size = input<SidenavSize>();

  /**
   * Whether the sidenav is fixed in the viewport.
   */
  public fixedInViewport = input(false, { transform: booleanAttribute });

  public elmentRef = inject(ElementRef);

  /**
   * Emits when the backdrop is clicked.
   */
  @Output() public backdropClick = new EventEmitter<PointerEvent>();

  constructor() {
    effect(() => {
      var hasBackdrop = this.hasBackdrop();
      var mode = this.mode();
      var open = this.open();

      if (mode == 'over' && hasBackdrop && open) {
        this._createBackdrop();
      } else {
        this._destroyBackdrop();
      }
    });

    if (!this._isPlatformServer) {
      this._observeResize()
        .pipe(throttleTime(100, undefined, { leading: true, trailing: true }))
        .subscribe(entries => {
          this._sidenavContainer.changeDetectorRef.markForCheck();
          // console.log('Resized to:', entries[0].contentRect.width, entries[0].contentRect.height);
        });
    }
  }

  _getFixedSize(): string | undefined {
    let size = this.size();
    let t = typeof size;
    if (t == 'string') {
      return ['small', 'medium', 'large', 'full'].includes(size as string) ? undefined : size as string;
    } else if (t == 'number') {
      return `${size}px`;
    } else {
      return undefined;
    }
  };

  private _observeResize(): Observable<ResizeObserverEntry[]> {
    return new Observable(observer => {
      const resizeObserver = new ResizeObserver(entries => observer.next(entries));
      resizeObserver.observe(this._elementRef.nativeElement);
      return () => resizeObserver.disconnect();
    });
  }

  private _createBackdrop() {
    if (this._backdropRef) return;

    this._backdropRef = this._vcr.createComponent(BackdropComponent);
    const backdropElm = this._backdropRef.location.nativeElement;
    this._backdropRef.instance.fixed.set(this.fixedInViewport());
    if (this.zIndex() != undefined) {
      this._renderer.setStyle(backdropElm, 'z-index', this.zIndex());
    }
    this._backdropClickHandlerUnlisten = this._renderer.listen(backdropElm, 'click', (e) => {
      this.backdropClick.emit(e);
    });

    // Move backdrop element before Host element
    const hostElm = this.elmentRef.nativeElement;
    const parentElm = hostElm.parentNode;
    this._renderer.insertBefore(parentElm, backdropElm, hostElm);


    // disable body scroll when sidenav is open and fixedInViewport is true
    if (!this._isPlatformServer && this.fixedInViewport()) {
      const body = document.getElementsByTagName('body')[0];
      this._bodyOverflowStyle = body.style.overflow;
      body.style.overflow = 'hidden';
      this._renderer.setStyle(body, 'overflow', 'hidden');
    }
  }

  private _destroyBackdrop() {
    this._backdropClickHandlerUnlisten?.();
    this._backdropRef?.destroy();
    this._backdropClickHandlerUnlisten = undefined;
    this._backdropRef = undefined;

    // restore body scroll when sidenav is closed
    if (!this._isPlatformServer && this.fixedInViewport()) {
      const body = document.getElementsByTagName('body')[0];
      this._renderer.setStyle(body, 'overflow', this._bodyOverflowStyle);
    }
  }

  ngOnDestroy(): void {
    this._destroyBackdrop();
    this._resizeSubscription?.unsubscribe();
  }
}
