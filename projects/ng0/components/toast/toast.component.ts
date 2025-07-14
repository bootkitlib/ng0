import { trigger, style, transition, animate, state } from '@angular/animations';
import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, ChangeDetectorRef, HostBinding, Renderer2, ElementRef, TemplateRef } from '@angular/core';
import { ToastConfig } from './types';
import { CommonModule } from '@angular/common';
import { ToastRef } from './toast-ref';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'ng0-toast',
    exportAs: 'ng0Toast',
    templateUrl: 'toast.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
    ],
    animations: [
        trigger('host', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(.85)' }),
                animate('.1s', style({ opacity: '1', transform: 'scale(1)' })),
            ]),
            state('false', style({ opacity: 0, transform: 'scale(.85)' })),
            transition('true => false', [
                animate('.1s'),
            ]),
        ]),
    ],
})
export class ToastComponent implements OnInit {
    public toastRef!: ToastRef;
    protected _config!: ToastConfig;
    @HostBinding('@host') protected _show = true;
    protected _hasBodyTemplate!: boolean;
    protected _hasHeaderTemplate!: boolean;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private _destroyRef: DestroyRef) {
            
    }

    ngOnInit(): void {
        this._config = this.toastRef.config;
        this._hasHeaderTemplate = this._config.header instanceof TemplateRef;
        this._hasBodyTemplate = this._config.body instanceof TemplateRef;
        
        let style = this._config.style ?? 'success';
        ['toast', 'show', `text-bg-${style}`].forEach(x => this._renderer.addClass(this._elementRef.nativeElement, x));
        this.toastRef.closed.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(x => {
            this._show = false;
            this._changeDetectorRef.markForCheck();
        })
    }
}
