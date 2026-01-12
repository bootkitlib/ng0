import {
    Directive, TemplateRef, ViewContainerRef, OnDestroy, ElementRef, HostListener, input, DestroyRef,
    inject
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipWrapperComponent } from './tooltip-wrapper/tooltip-wrapper.component';
import { TooltipPlacement } from './types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
    selector: '[ng0Tooltip]',
    exportAs: 'ng0Tooltip',
    standalone: true
})
export class TooltipDirective implements OnDestroy {
    private _portal!: ComponentPortal<TooltipWrapperComponent>;
    private _overlayRef?: OverlayRef;
    private _overlayService = inject(Overlay);
    private _elementRef = inject(ElementRef);
    private _destroyRef = inject(DestroyRef);
    private _viewRef = inject(ViewContainerRef);

    /**
     * Tooltip content. Can be a string or a TempateRef.
     */
    public content = input<string | TemplateRef<any> | undefined | null>(undefined, { alias: 'ng0Tooltip' });

    /**
     * Tooltip placement.
     */
    public placement = input<TooltipPlacement>('bottom');

    constructor() {
        this._portal = new ComponentPortal(TooltipWrapperComponent, this._viewRef);
    }

    @HostListener('mouseenter')
    protected _onMouseEnter(): void {
        this._createOverlay();
    }

    @HostListener('mouseleave')
    protected _onMouseLeave(): void {
        this._disposeOverlay();
    }

    private _createOverlay(): void {
        let wrapperInstance: TooltipWrapperComponent;

        const scrollStrategy = this._overlayService.scrollStrategies.reposition();
        const positionStrategy = this._overlayService.position().flexibleConnectedTo(this._elementRef).withPositions(this._getPositions());

        positionStrategy.positionChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(p => {
            wrapperRef.instance.set(this.content(), (p.connectionPair as any).key);
        });

        this._overlayRef = this._overlayService.create({ scrollStrategy, positionStrategy });
        let wrapperRef = this._overlayRef.attach(this._portal);
        wrapperRef.instance.set(this.content(), this.placement());
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
