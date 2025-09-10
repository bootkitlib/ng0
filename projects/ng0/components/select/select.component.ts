import { Component, ElementRef, Renderer2, ChangeDetectionStrategy, HostBinding, ContentChild, effect, AfterViewInit, input, OnInit, DestroyRef, signal, ViewChild, model, HostListener, inject, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { convertToDataSource, DataSource, DataSourceLike } from '@bootkit/ng0/data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataRequest } from 'dist/ng0/data';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FlexibleConnectedPositionStrategyOrigin, Overlay, OverlayModule } from '@angular/cdk/overlay';
import { getConnectedPositions } from '@bootkit/ng0/components/overlay';
import { CdkListboxModule, ListboxValueChangeEvent } from '@angular/cdk/listbox';

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
        CdkListboxModule
    ],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectComponent),
        multi: true
    }],
    host: {
        '[class.is-open]': 'open()'
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

    protected readonly _items = signal<any[]>([]);
    protected readonly _isDisabled = signal<boolean>(false);
    protected readonly _selectedValue = signal<any>(undefined);
    protected _onChangeCallback?: (value: any) => void;
    protected _onTouchedCallback?: (value: any) => void;
    private _overlay = inject(Overlay);

    /** 
     * Indicates whether the dropdown is open or closed.
     */
    public readonly open = model(false);

    constructor(protected _el: ElementRef, private _renderer: Renderer2, private _destroyRef: DestroyRef) {
        this._renderer.addClass(this._el.nativeElement, 'form-select');
        // this._hostOrigin = this._overlay.position()
        //             .flexibleConnectedTo(this.el.nativeElement)
        //             .withPositions(getConnectedPositions('bottom', 'start', true));
    }

    ngOnInit(): void {
        var r = new DataRequest();
        this.source().load(r).pipe(takeUntilDestroyed(this._destroyRef)).subscribe(res => {
            this._items.set(res.data);
        })
    }

    @HostListener('click', ['$event'])
    private _onClick() {
        if (this._isDisabled())
            return;

        this.open.update(x => !x);
        // this._onTouchedCallback?.(this._selectedValue());
    }

    protected _onValueChange($event: ListboxValueChangeEvent<any>) {
        let value = $event.value[0];
        this._selectedValue.set(value);
        this._onChangeCallback!(value);
        // this.open.set(false);
    }

    writeValue(obj: any): void {
        this._selectedValue.set(obj);
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
