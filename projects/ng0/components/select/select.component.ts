import { Component, ElementRef, Renderer2, ChangeDetectionStrategy, input, OnInit, DestroyRef, signal, model, HostListener, inject, forwardRef, ViewChild, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { convertToDataSource, DataSource, DataSourceLike } from '@bootkit/ng0/data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataRequest } from 'dist/ng0/data';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';

/**
 * Select component that allows users to choose an option from a dropdown list.
 */
@Component({
    selector: 'ng0-select',
    exportAs: 'ng0Select',
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        OverlayModule,
    ],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectComponent),
        multi: true
    }],
    host: {
        '[class.is-open]': 'open()',
        '[attr.aria-activedescendant]': '_activeIndex() > -1 ? ("ng0-option-" + _activeIndex()) : undefined',
        '[attr.disabled]': '_isDisabled()',
        '[attr.aria-disabled]': '_isDisabled()'
    }
})
export class SelectComponent implements OnInit, ControlValueAccessor {

    /**
     * The data source for the select component.
     * This can be an array of data, a function that returns an observable of data,
     * or an instance of DataSource.
     */
    public source = input.required<DataSource<any>, DataSourceLike<any>>({
        transform: v => convertToDataSource(v)
    });

    /** 
     * Indicates whether the dropdown is open or closed.
     */
    public readonly open = model(false);

    protected readonly _options = signal<any[]>([]);
    protected readonly _isDisabled = signal<boolean>(false);
    protected readonly _selectedIndex = signal<number>(-1);
    protected readonly _selectedValue = signal<any>(undefined);
    protected readonly _activeIndex = signal<number>(-1);
    protected readonly _activeValue = signal<any>(undefined);
    @ContentChild(TemplateRef) protected _optionTemplate?: TemplateRef<any>;
    protected _onChangeCallback!: (value: any) => void;
    protected _onTouchedCallback!: (value: any) => void;

    constructor(protected _el: ElementRef, private _renderer: Renderer2, private _destroyRef: DestroyRef) {
        this._renderer.addClass(this._el.nativeElement, 'form-select');
        this._renderer.setAttribute(this._el.nativeElement, 'tabindex', '0');
    }

    ngOnInit(): void {
        var r = new DataRequest();
        this.source().load(r).pipe(takeUntilDestroyed(this._destroyRef)).subscribe(res => {
            this._options.set(res.data);
        })
    }

    @HostListener('click', ['$event'])
    private _onHostClick() {
        if (this._isDisabled())
            return;

        this.open.update(x => !x);
        // this._onTouchedCallback?.(this._selectedValue());
    }

    @HostListener('keydown', ['$event'])
    protected _onHostKeydown(e: KeyboardEvent) {
        let open = this.open();

        if (this._isDisabled())
            return;

        let optionsCount = this._options().length;
        if (optionsCount == 0) {
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                if (open) {
                    if (this._activeIndex() < optionsCount - 1) {
                        this.active(this._activeIndex() + 1);
                    }
                } else {
                    if (this._selectedIndex()! < optionsCount - 1) {
                        this.select(this._selectedIndex() + 1)
                    }
                }
                e.preventDefault();
                break;

            case 'ArrowUp':
                if (open) {
                    if (this._activeIndex() > 0) {
                        this.active(this._activeIndex()! - 1);
                    }
                } else {
                    if (this._selectedIndex() > 0) {
                        this.select(this._selectedIndex()! - 1)
                    }
                }
                e.preventDefault();
                break;

            case 'Enter':
                if (open) {
                    if (this._activeIndex() == this._selectedIndex()) {
                        this.open.set(false);
                    } else {
                        this.select(this._activeIndex());
                        this.open.set(false);
                    }
                } else {
                    this.open.set(true);
                }
                e.preventDefault();
                break;

            case ' ':
                if (!open) {
                    this.open.set(true);
                }
                e.preventDefault();
                break;

            case 'Escape':
                this.open.set(false);
                e.preventDefault();
                break;

            case 'Home':
                if (open) {
                    this.active(0);
                } else {
                    this.select(0)
                }

                e.preventDefault();
                break;

            case 'End':
                if (open) {
                    this.active(optionsCount - 1);
                } else {
                    this.select(optionsCount - 1);
                }

                e.preventDefault();
                break;
        }
    }

    /**
     * Selects an option by index
     */
    public select(index: number) {
        let optionsCount = this._options().length;
        if (optionsCount == 0 || index < 0 || index > optionsCount - 1) {
            return;
        }

        let value = this._options()[index];
        this._selectedIndex.set(index)
        this._selectedValue.set(value)
        this._activeIndex.set(index)
        this._activeValue.set(value)
        this._onChangeCallback(value)
    }

    /**
     * Sets an option as active
     */
    active(index: number) {
        this._activeIndex.set(index);
        this._activeValue.set(this._options()[index]);
    }

    writeValue(obj: any): void {
        let index = this._options().findIndex(x => x === obj);
        this._selectedIndex.set(index);
        this._selectedValue.set(obj);
        this._activeIndex.set(index);
        this._activeValue.set(obj);
    }

    registerOnChange(fn: any): void {
        this._onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouchedCallback = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this._isDisabled.set(isDisabled);
    }
}
