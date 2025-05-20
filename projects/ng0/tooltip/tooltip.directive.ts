import {
    Directive, TemplateRef, ViewContainerRef, OnDestroy, ElementRef, HostListener, OnInit,
    input
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
// import { Placement } from '../../../src/lib';
import { TooltipWrapperComponent } from './tooltip-wrapper/tooltip-wrapper.component';
import { TooltipPlacement } from './types';

@Directive({
    selector: '[ng0Tooltip]',
    exportAs: 'ng0Tooltip',
    standalone: true
})
export class TooltipDirective implements OnInit, OnDestroy {
    public content = input<string | TemplateRef<any> | undefined | null>(undefined, { alias: 'ng0Tooltip' });
    public placement = input<TooltipPlacement>('bottom');
    private _portal!: ComponentPortal<TooltipWrapperComponent>;
    private _overlayRef?: OverlayRef;

    constructor(
        private _overlayService: Overlay,
        private _elementRef: ElementRef,
        private _viewRef: ViewContainerRef) {
    }

    ngOnInit(): void {
        this._portal = new ComponentPortal(TooltipWrapperComponent, this._viewRef);
    }

    @HostListener('mouseenter') private _onMouseEnter(): void {
        this._createOverlay();
    }

    @HostListener('mouseleave') private _onMouseLeave(): void {
        this._disposeOverlay();
    }

    private _createOverlay(): void {
        let wrapperInstance: TooltipWrapperComponent;

        const scrollStrategy = this._overlayService.scrollStrategies.reposition();
        const positionStrategy = this._overlayService.position().flexibleConnectedTo(this._elementRef).withPositions(this._getPositions());

        positionStrategy.positionChanges.subscribe(p => {
            // wrapperInstance.placement = (p.connectionPair as any).key;
        });

        this._overlayRef = this._overlayService.create({ scrollStrategy, positionStrategy });
        let wrapperRef = this._overlayRef.attach(this._portal);
        wrapperRef.instance.content = this.content();
        wrapperRef.instance.placement = this.placement();
    }

    private _disposeOverlay(): void {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = undefined;
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

    ngOnDestroy(): void {
        this._disposeOverlay();
    }
}
