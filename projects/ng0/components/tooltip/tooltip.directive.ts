import {
    Directive, TemplateRef, ViewContainerRef, OnDestroy, ElementRef, HostListener, OnInit,
    input,
    DestroyRef
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
export class TooltipDirective implements OnInit, OnDestroy {
    public content = input<string | TemplateRef<any> | undefined | null>(undefined, { alias: 'ng0Tooltip' });
    public placement = input<TooltipPlacement>('bottom');
    private portal!: ComponentPortal<TooltipWrapperComponent>;
    private overlayRef?: OverlayRef;

    constructor(
        private overlayService: Overlay,
        private elementRef: ElementRef,
        private destroyRef: DestroyRef,
        private viewRef: ViewContainerRef) {
    }

    ngOnInit(): void {
        this.portal = new ComponentPortal(TooltipWrapperComponent, this.viewRef);
    }

    @HostListener('mouseenter') 
    private onMouseEnter(): void {
        this.createOverlay();
    }

    @HostListener('mouseleave') 
    private onMouseLeave(): void {
        this.disposeOverlay();
    }

    private createOverlay(): void {
        let wrapperInstance: TooltipWrapperComponent;

        const scrollStrategy = this.overlayService.scrollStrategies.reposition();
        const positionStrategy = this.overlayService.position().flexibleConnectedTo(this.elementRef).withPositions(this.getPositions());

        positionStrategy.positionChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(p => {
            wrapperRef.instance.set(this.content(), (p.connectionPair as any).key);
        });

        this.overlayRef = this.overlayService.create({ scrollStrategy, positionStrategy });
        let wrapperRef = this.overlayRef.attach(this.portal);
        wrapperRef.instance.set(this.content(), this.placement());
    }

    private disposeOverlay(): void {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = undefined;
        }
    }

    private getPositions(): any[] {
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
        this.disposeOverlay();
    }
}
