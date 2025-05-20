import {
    Input, Component, Output, EventEmitter, Renderer2, ElementRef, ComponentFactoryResolver,
    ViewContainerRef, OnDestroy, HostBinding, OnChanges, SimpleChanges
} from '@angular/core';
import { PanelBackdropComponent } from './panel-backdrop.component';
import { LayoutContentPosition, PanelPlacement, PanelPosition, PanelStretch } from './types';
import { LayoutComponentState } from './layout-state';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Directionality } from '@angular/cdk/bidi';

@Component({
    selector: 'jss-panel',
    exportAs: 'jssPanel',
    styleUrls: ['./panel.component.scss'],
    template: '<ng-content></ng-content>',
    animations: [
        trigger('t', [
            state('0', style({
                left: '{{left}}',
                right: '{{right}}',
                top: '{{top}}',
                bottom: '{{bottom}}',
                width: '{{width}}',
                height: '{{height}}',
                transform: '{{transform}}'
            }), { params: { left: '', right: '', top: '', bottom: '', width: '', height: '', transform: '' } }),
            state('1', style({
                left: '{{left}}',
                right: '{{right}}',
                top: '{{top}}',
                bottom: '{{bottom}}',
                width: '{{width}}',
                height: '{{height}}',
                transform: '{{transform}}'
            }), { params: { left: '', right: '', top: '', bottom: '', width: '', height: '', transform: '' } }),
            transition('0 <=> 1', [
                animate('.1s'),
            ])
        ]),
    ]
})
export class PanelComponent implements OnChanges, OnDestroy {
    private _backdropValue: boolean;
    private _backdropUnlisten: any;
    private _contentPos: LayoutContentPosition;
    private _animationState = false;
    @Input() position: PanelPosition = 'start';
    @Input() placement: PanelPlacement = 'container';
    @Input() stretch: PanelStretch = 'both';
    @Input() show = true;
    @Input() size = 200;
    @Input() over = true;
    @Input() zOrder = 1;
    @Input() set backdrop(value: boolean) {
        if (value === this._backdropValue) { return; }
        if (value) {
            const compRef = this.viewRef.createComponent(this.factoryResolver.resolveComponentFactory(PanelBackdropComponent));
            this.renderer.setStyle(compRef.instance.elementRef.nativeElement, 'z-index', this.zOrder * 2 - 1);
            this._backdropUnlisten = this.renderer.listen(compRef.instance.elementRef.nativeElement, 'click', (e) => {
                this.backdropClick.emit(e);
            });
        } else {
            this.viewRef.clear();
        }
        this._backdropValue = value;
    }
    get backdrop(): boolean {
        return this._backdropValue;
    }

    @Output() backdropClick = new EventEmitter<any>();

    constructor(
        private layoutState: LayoutComponentState,
        private renderer: Renderer2,
        public elementRef: ElementRef,
        private factoryResolver: ComponentFactoryResolver,
        private viewRef: ViewContainerRef,
        private _dir: Directionality,
    ) {
        layoutState.layoutChange.subscribe(p => {
            this._contentPos = p;
            this._animationState = !this._animationState;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const change = changes.position || changes.stretch || changes.size || changes.show || changes.over;
        if (change && !change.isFirstChange()) {
            this.layoutState.panelChanged(this);
        }
    }

    @HostBinding('style.z-index') private get _zIndex() {
        return this.zOrder * 2;
    }

    @HostBinding('style.position') private get _position() {
        return this.placement === 'container' ? 'absolute' : 'fixed';
    }

    @HostBinding('@t') private get _animationTrigger() {
        const ltr = this._dir.value === 'ltr';
        const s = this.stretch;
        const p = this.position;
        const isStretchNoneOrStart = s === 'none' || s === 'start';
        const isStretchNoneOrEnd = s === 'none' || s === 'end';
        const isPosStartOrEnd = p === 'start' || p === 'end';
        const isPosTopOrBottom = p === 'top' || p === 'bottom';

        const positions = {
            start: {
                top: isStretchNoneOrEnd ? `${this._contentPos?.top ?? 0}px` : '0',
                bottom: isStretchNoneOrStart ? `${this._contentPos?.bottom ?? 0}px` : '0',
                left: ltr ? '0' : '',
                right: ltr ? '' : '0',
                hideTransform: `translateX(${ltr ? -100 : 100}%)`,
            },
            end: {
                top: isStretchNoneOrEnd ? `${this._contentPos?.top ?? 0}px` : '0',
                bottom: isStretchNoneOrStart ? `${this._contentPos?.bottom ?? 0}px` : '0',
                left: ltr ? '' : '0',
                right: ltr ? '0' : '',
                hideTransform: `translateX(${ltr ? 100 : -100}%)`,
            },
            top: {
                top: '0',
                bottom: '',
                left: isStretchNoneOrEnd ? `${this._contentPos?.left ?? 0}px` : '0',
                right: isStretchNoneOrStart ? `${this._contentPos?.right ?? 0}px` : '0',
                hideTransform: 'translateY(-100%)',
            },
            bottom: {
                top: '',
                bottom: '0',
                left: isStretchNoneOrEnd ? `${this._contentPos?.left ?? 0}px` : '0',
                right: isStretchNoneOrStart ? `${this._contentPos?.right ?? 0}px` : '0',
                hideTransform: 'translateY(100%)',
            }
        };

        const pos = positions[this.position];

        return {
            value: this._animationState,
            params: {
                left: pos.left,
                right: pos.right,
                top: pos.top,
                bottom: pos.bottom,
                transform: this.show ? 'translateX(0)' : pos.hideTransform,
                width: isPosStartOrEnd ? `${this.size}px` : '',
                height: isPosTopOrBottom ? `${this.size}px` : '',
            }
        };
    }

    ngOnDestroy(): void {
        if (this._backdropUnlisten) {
            this._backdropUnlisten();
        }
    }
}
