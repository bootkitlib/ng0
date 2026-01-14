import {
    Directive, TemplateRef, ViewContainerRef, OnDestroy, ElementRef, HostListener, OnInit,
    input
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { PopoverWrapperComponent } from './popover-wrapper/popover-wrapper.component';
import { PopoverContent, PopoverPlacement, PopoverTrigger } from './types';

@Directive({
    selector: '[ng0Popover]',
    exportAs: 'ng0Popover',
    standalone: true
})
export class PopoverDirective implements OnInit, OnDestroy {
    public header = input<string>();
    public content = input<PopoverContent>(undefined, { alias: 'ng0Popover' });
    public placement = input<PopoverPlacement>('bottom');
    public triggerBy = input<PopoverTrigger>('click');

    private _portal!: ComponentPortal<PopoverWrapperComponent>;
    private _overlayRef?: OverlayRef;

    constructor(
        private _overlayService: Overlay,
        private _elementRef: ElementRef,
        private _viewRef: ViewContainerRef) {
    }

    ngOnInit(): void {
        this._portal = new ComponentPortal(PopoverWrapperComponent, this._viewRef);
    }

    private _createOverlay(): void {
        let wrapperInstance: PopoverWrapperComponent;

        const scrollStrategy = this._overlayService.scrollStrategies.reposition();
        const positionStrategy = this._overlayService.position()
            .flexibleConnectedTo(this._elementRef)
            .withPositions(this._getPositions());

        positionStrategy.positionChanges.subscribe(p => {
            // wrapperInstance.placement = (p.connectionPair as any).key;
        });

        this._overlayRef = this._overlayService.create({ scrollStrategy, positionStrategy });

        wrapperInstance = this._overlayRef.attach(this._portal).instance;
        wrapperInstance.header = this.header();
        wrapperInstance.content = this.content();
        wrapperInstance.placement = this.placement();
    }

    private _disposeOverlay(): void {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = undefined;
        }
    }

    private _toggleOverlay() {
        if (this._overlayRef) {
            this._disposeOverlay();
        } else {
            this._createOverlay();
        }
    }

    private _getPositions(): any[] {
        const c = 'center', t = 'top', b = 'bottom', s = 'start', e = 'end';
        const top = { key: t, originX: c, originY: t, overlayX: c, overlayY: b, };
        const bottom = { key: b, originX: c, originY: b, overlayX: c, overlayY: t, };
        const start = { key: s, originX: s, originY: c, overlayX: e, overlayY: c, };
        const end = { key: e, originX: e, originY: c, overlayX: s, overlayY: c, };

        let positions: Array<any>;

        switch (this.placement()) {
            case 'bottom':
                positions = [bottom, top];
                break;
            case 'start':
                positions = [start, start];
                break;
            case 'end':
                positions = [end, start];
                break;
            case 'top':
                positions = [top, bottom];
                break;
            default:
                positions = [bottom, top];
        }

        return positions;
    }

    @HostListener('click') protected _onClick(): void {
        if (this.triggerBy() === 'click') {
            this._toggleOverlay()
        }
    }

    @HostListener('dblclick') protected _onDblclick(): void {
        if (this.triggerBy() === 'dblclick') {
            this._toggleOverlay()
        }
    }

    @HostListener('mouseenter') protected _onMouseEnter(): void {
        if (this.triggerBy() === 'hover') {
            this._toggleOverlay()
        }
    }

    @HostListener('mouseleave') protected _onMouseLeave(): void {
        if (this.triggerBy() === 'hover') {
            this._toggleOverlay()
        }
    }

    @HostListener('focus') protected _onFocus(): void {
        if (this.triggerBy() === 'focus') {
            this._toggleOverlay()
        }
    }

    @HostListener('focusout') protected _onFocusout(): void {
        if (this.triggerBy() === 'focus') {
            this._toggleOverlay()
        }
    }

    ngOnDestroy(): void {
        this._disposeOverlay();
    }
}
