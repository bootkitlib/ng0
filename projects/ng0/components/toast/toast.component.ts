import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, ChangeDetectorRef, Renderer2, ElementRef, TemplateRef, inject, ViewEncapsulation, HostBinding, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastRef } from './toast-ref';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'ng0-toast',
    exportAs: 'ng0Toast',
    templateUrl: 'toast.component.html',
    styleUrls: ['./toast.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
    ]
})
export class ToastComponent implements OnInit {
    private readonly _changeDetectorRef = inject(ChangeDetectorRef);
    private readonly _renderer = inject(Renderer2);
    private readonly _elementRef = inject(ElementRef);
    private readonly _destroyRef = inject(DestroyRef);

    protected _hasHeaderTemplate!: boolean;
    protected _hasBodyTemplate!: boolean;
    protected _closed = false;

    public toastRef!: ToastRef;

    ngOnInit(): void {
        const elm = this._elementRef.nativeElement;

        this._hasHeaderTemplate = this.toastRef.config.header instanceof TemplateRef;
        this._hasBodyTemplate = this.toastRef.config.body instanceof TemplateRef;

        const hostCss = ['toast', 'show', 'ng0-toast-enter', `text-bg-${this.toastRef.config.style}`];
        hostCss.forEach(cssClass => this._renderer.addClass(elm, cssClass));

        this.toastRef.closed.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(x => {
            this._renderer.addClass(elm, 'ng0-toast-leave');
            this._closed = true;
        })
    }

    @HostListener('animationend')
    protected _onHostAnimationend() {
        if (this._closed) {
            this.toastRef.dispose();
        }
    }



}
