import { trigger, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { timer } from 'rxjs';
import { ToastConfig } from './types';
import { CommonModule } from '@angular/common';
import { ToastRef } from './toast-ref';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'ng0-toast',
    exportAs: 'ng0Toast',
    templateUrl: 'toast.component.html',
    styleUrls: ['toast.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
    ],
    animations: [
        trigger('hostTrigger', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(.95)' }),
                animate('.1s', style({ opacity: '1', transform: 'scale(1)' })),
            ]),
            transition(':leave', [
                style({ opacity: 1, transform: 'scale(1)' }),
                animate('.1s', style({ opacity: 0, transform: 'scale(.95)' })),
            ]),
        ]),
    ],
})
export class ToastComponent implements OnInit {
    _config!: ToastConfig;
    _toastRef!: ToastRef;
    protected _message?: string;
    protected _title?: string;
    protected _showToast = true;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _destroyRef: DestroyRef) {
    }

    ngOnInit(): void {
        this._title = this._config.title;
        this._message = this._config.message;

        this._toastRef.closed.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(x => {
            this._showToast = false;
            this._changeDetectorRef.markForCheck();
        })

        timer(this._config?.duration ?? 3000).pipe(takeUntilDestroyed(this._destroyRef)).subscribe(x => {
            this._toastRef.close();
        });
    }
}
