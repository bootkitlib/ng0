import {
    Directive, TemplateRef, Input, ViewContainerRef, OnDestroy, EventEmitter, Output, OnInit, HostListener, ElementRef
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayPosition } from './overlay';

@Directive({
    selector: '[jssOverlay]',
    exportAs: 'jssOverlay',
})
export class OverlayDirective implements OnInit, OnDestroy {
    @Input() triggerBy: 'click' | 'dblclick' | 'hover' | 'focus';
    @Input() overlay: TemplateRef<any>;
    @Input() positions: OverlayPosition[] = [{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }];
    @Output() openChange = new EventEmitter<boolean>();
    @Input() set open(value: boolean) {
        if (value && !this._open) {
            this._createOverlay();
        } else if (!value && this._open) {
            this._disposeOverlay();
        }

        this._open = value;
        this.openChange.emit(value);
    }

    get open(): boolean {
        return this._open;
    }

    private _portal: TemplatePortal;
    private _overlayRef: OverlayRef;
    private _open = false;

    constructor(
        private _overlayService: Overlay,
        private _viewRef: ViewContainerRef,
        private _elementRef: ElementRef,

    ) {
    }

    ngOnInit(): void {
        this._portal = new TemplatePortal(this.overlay, this._viewRef);
    }

    private _createOverlay(): void {
        const scrollStrategy = this._overlayService.scrollStrategies.reposition();
        const positionStrategy = this._overlayService.position().flexibleConnectedTo(this._elementRef.nativeElement)
            .withPositions(this.positions);

        this._overlayRef = this._overlayService.create({
            scrollStrategy,
            positionStrategy,
            // hasBackdrop: this.hasBackdrop,
            // backdropClass: this.transparentBackdrop ? 'cdk' : '',
        });

        this._overlayRef.attach(this._portal);
    }

    private _disposeOverlay(): void {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
    }

    @HostListener('click') private _onClick(): void {
        if (this.triggerBy === 'click') {
            this.open = !this.open;
        }
    }

    @HostListener('dblclick') private _onDblclick(): void {
        if (this.triggerBy === 'dblclick') {
            this.open = !this.open;
        }
    }

    @HostListener('mouseenter') private _onMouseEnter(): void {
        if (this.triggerBy === 'hover') {
            this.open = true;
        }
    }

    @HostListener('mouseleave') private _onMouseLeave(): void {
        if (this.triggerBy === 'hover') {
            this.open = false;
        }
    }

    @HostListener('focus') private _onFocus(): void {
        if (this.triggerBy === 'focus') {
            this.open = true;
        }
    }

    @HostListener('focusout') private _onFocusout(): void {
        if (this.triggerBy === 'focus') {
            this.open = false;
        }
    }

    ngOnDestroy(): void {
        this._disposeOverlay();
    }
}
