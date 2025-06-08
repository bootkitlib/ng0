import { Directive, EventEmitter, Injector, OnDestroy, Output, Renderer2, TemplateRef, ViewContainerRef, effect, input, model } from '@angular/core';
import { Alignment, flipPlacement, Placement } from '@bootkit/ng0/common';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { getOverlayPosition } from './private/utils';
import { Subscription } from 'rxjs';

/**
 * Directive to manage overlay behavior.
 */
@Directive({
      selector: '[ng0Overlay]',
      exportAs: 'ng0Overlay',
      standalone: true,
})
export class OverlayDirective implements OnDestroy {
      public anchor = input.required<any>();
      public open = model(false);
      public placement = input<Placement>('bottom');
      public alignment = input<Alignment>('start');

      /**
       * Event emitted when a pointer event occurs outside the overlay.
       */
      @Output() public outsidePointerEvent = new EventEmitter<MouseEvent>();

      private _overlayRef?: OverlayRef;
      private _templatePortal: TemplatePortal<any>;
      private _outsidePointerEventsSubscription?: Subscription;
      private _hideTimeoutId: any;

      constructor(
            public readonly templateRef: TemplateRef<any>,
            private _overlayService: Overlay,
            private _injector: Injector,
            private _renderer: Renderer2,
            private _viewRef: ViewContainerRef) {

            this._templatePortal = new TemplatePortal(this.templateRef, this._viewRef, null, this._injector);

            effect(() => {
                  if (this.open()) {
                        this._clearTimeout()

                        if (!this._overlayRef) {
                              const p1 = getOverlayPosition(this.placement(), this.alignment());
                              const p2 = getOverlayPosition(flipPlacement(this.placement()), this.alignment());
                              const scrollStrategy = this._overlayService.scrollStrategies.reposition();
                              const positionStrategy = this._overlayService.position().flexibleConnectedTo(this.anchor()).withPositions([p1, p2]);
                              this._overlayRef = this._overlayService.create({ scrollStrategy, positionStrategy, });
                        }

                        this._outsidePointerEventsSubscription = this._overlayRef.outsidePointerEvents().subscribe(e => this.outsidePointerEvent.emit(e))
                        this._overlayRef.attach(this._templatePortal);
                  } else {
                        this._clearTimeout();
                        this._outsidePointerEventsSubscription?.unsubscribe();
                        this._overlayRef?.detach();
                  }
            });
      }

      /**
       * Show the overlay.
       */
      public show() {
            this._clearTimeout();
            this.open.set(true);
      }

      /**
       * Hide the overlay.
       */
      public hide() {
            this._clearTimeout();
            this.open.set(false);
      }

      /**
       * Hide the overlay after a period of time.
       */
      public hideAfter(ms: number) {
            this._clearTimeout();
            this._hideTimeoutId = setTimeout(() => {
                  this.open.set(false);
            }, ms);
      }

      /**
       * Toggle the overlay visibility.
       */
      public toggle() {
            this.open.update(x => !x);
      }

      private _clearTimeout() {
            if (this._hideTimeoutId) {
                  clearTimeout(this._hideTimeoutId);
                  this._hideTimeoutId = 0;
            }
      }

      /**
       * Lifecycle hook that is called when the directive is destroyed.
       */
      ngOnDestroy(): void {
            this._outsidePointerEventsSubscription?.unsubscribe();
            this._clearTimeout()
            this._overlayRef?.dispose();
      }
}
