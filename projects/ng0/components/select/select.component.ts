import { Component, ElementRef, Renderer2, input, OnInit, DestroyRef, signal, model, HostListener, inject, forwardRef, ViewChild, TemplateRef, ContentChild, ViewEncapsulation, DOCUMENT, ChangeDetectionStrategy, booleanAttribute, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dataSourceAttribute, DataRequest, DataSource, DataSourceLike, ValueWriterAttribute, defaultValueWriter, stringFilter, FilterPredicate, BooleanValueComparerAttribute, defaultBooleanValueComparer } from '@bootkit/ng0/data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FlexibleConnectedPositionStrategy, Overlay, OverlayModule, ScrollStrategy, ViewportRuler } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { CssClassAttribute, SelectOption, _IdGenerator } from '@bootkit/ng0/common';
import { ValueFormatterAttribute, defaultValueFormatter, LocalizationService } from '@bootkit/ng0/localization';
import { ListModule } from '@bootkit/ng0/components/list';

/**
 * Select component that allows users to choose an option from a dropdown list.
 */
@Component({
    selector: 'ng0-select',
    exportAs: 'ng0Select',
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        OverlayModule,
        ListModule,
    ],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectComponent),
        multi: true
    }],
    host: {
        '[class.ng0-select-open]': 'open()',
        '[class.ng0-select-loading]': 'source().isLoading()',
        '[attr.aria-activedescendant]': '_activeOptionIndex() > -1 ? (_options()[_activeOptionIndex()].id) : undefined',
        '[attr.disabled]': '_isDisabled()',
        '[attr.aria-disabled]': '_isDisabled()'
    }
})
export class SelectComponent implements ControlValueAccessor {
    private _resizeObserver?: ResizeObserver;
    private _resizeObserverInitialized = false;
    private _viewpoerRulerSubscription?: Subscription;
    protected _value = signal<any>(undefined);
    @ViewChild('filterInput') private _filterElementRef?: ElementRef;
    private _changeCallback!: (value: any) => void;
    private _touchCallback!: (value: any) => void;
    protected readonly _options = signal<SelectOption[]>([]);
    protected readonly _isDisabled = signal<boolean>(false);
    protected readonly _selectedOptionIndex = signal<number>(-1);
    protected readonly _activeOptionIndex = signal<number>(-1);
    @ContentChild(TemplateRef) protected _optionTemplate?: TemplateRef<any>;
    protected _positionStrategy!: FlexibleConnectedPositionStrategy;
    protected _scrollStrategy!: ScrollStrategy;

    private _overlay = inject(Overlay);
    private _document = inject(DOCUMENT);
    private _ls = inject(LocalizationService);
    private _destroyRef = inject(DestroyRef);
    protected _el = inject(ElementRef<HTMLDivElement>);
    private _renderer = inject(Renderer2);
    private _viewportRuler = inject(ViewportRuler);
    private _changeDetector = inject(ChangeDetectorRef);

    /**
     * The data source for the select component.
     * This can be an array of data, a function that returns an observable of data,
     * or an instance of DataSource.
     */
    public readonly source = input.required<DataSource<any>, DataSourceLike<any>>({
        transform: v => dataSourceAttribute(v)
    });

    /** 
     * Indicates whether multi selection is enabled or not.
     */
    public readonly multiple = input(false, {
        transform: booleanAttribute
    });

    /** 
     * Indicates whether the dropdown is open or closed.
     */
    public readonly open = model(false);

    /**
    * A custom comparer function or the name of a field for comparing two objects.
    */
    public readonly compareBy = input(defaultBooleanValueComparer, {
        transform: BooleanValueComparerAttribute
    });

    /**
     * Custom format function to convert an item to a string for display.
     * Default converts the item to a string using its toString method.
     */
    public readonly formatBy = input(defaultValueFormatter, {
        transform: ValueFormatterAttribute(this._ls.get())
    });

    /**
     * Custom value extractor function to extract the value of any object while writing values.
     */
    public readonly writeBy = input(defaultValueWriter, {
        transform: ValueWriterAttribute
    });

    /**
     * Indicates whether the dropdown is filterable.
     */
    public readonly filterable = input(false, { transform: booleanAttribute });

    /**
     * Placeholder text for the filter input field.
     */
    public readonly filterPlaceholder = input('');

    /**
     * Custom filter function to filter items based on a filter value.
     * Default checks if the item contains the filter value (case-insensitive).
     */
    public readonly filterBy = input<FilterPredicate>(stringFilter);

    /**
     * CSS class or classes to apply to the list container.
     */
    public readonly itemClass = input((item) => undefined, {
        transform: CssClassAttribute
    });

    constructor() {
        this._renderer.addClass(this._el.nativeElement, 'form-select');
        this._renderer.setAttribute(this._el.nativeElement, 'tabindex', '0');
        this._scrollStrategy = this._overlay.scrollStrategies.block();
    }

    /**
     * Selects an option by index
     */
    protected _selectByIndex(index: number) {
        let optionsCount = this._options().length;
        if (optionsCount == 0 || index < 0 || index > optionsCount - 1) {
            throw new Error('Index out of range');
        }

        if (index == this._selectedOptionIndex()) {
            return;
        }

        let option = this._options()[index];
        // this._onChangeCallback();
    }

    protected _onSelectionChange(value: any) {
        if (!this.multiple()) {
            this.open.set(false);
        }

        this._value.set(value);
        this._changeCallback(value);
    }

    writeValue(obj: any): void {
        this._value.set(obj);
    }

    registerOnChange(fn: any): void {
        this._changeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this._touchCallback = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this._isDisabled.set(isDisabled);
    }

    @HostListener('keydown', ['$event'])
    protected _onKeydown(e: KeyboardEvent, firedByFilter: boolean = false) {
        let open = this.open();

        if (this._isDisabled())
            return;

        let optionsCount = this._options().length;
        if (optionsCount == 0) {
            return;
        }
    }

    protected _onFilterBlur() {
        // use setTimeout to allow next element receives the focus.
        setTimeout(() => {
            if (!this._el.nativeElement.matches(':focus')) {
                this.open.set(false);
            }
        }, 0);
    }

    protected _filterItems(filter: string) {
        let filterFunc = this.filterBy();
        this._options().forEach(x => x.show = filterFunc(x.value, filter));
    }

    protected _onOverlayAttach() {
        this._activeOptionIndex.set(this._selectedOptionIndex())

        this._listenToResizeEvents();

        if (this.filterable()) {
            setTimeout(() => {
                this._filterElementRef?.nativeElement.focus();
            }, 0);
        }

        if (this._selectedOptionIndex() > -1) {
            // this.scrollItemIntoView(this._selectedOptionIndex(), 'start', 'instant');
        }
    }

    protected _onOverlayDetach() {
        this._unlistenFromResizeEvents();
        if (this.filterable()) {
            this._el?.nativeElement.focus();
            this._options().forEach(x => x.show = false);
        }
    }

    private _getNextOptionId() {
        return `ng0-select-item-${_IdGenerator.next().toString()}`;
    }

    private _listenToResizeEvents() {
        this._viewportRuler.change().subscribe(x => {
            this.open.set(false);
        });

        this._resizeObserver = new ResizeObserver(e => {
            // Sterategy 1: close overlay
            if (!this._resizeObserverInitialized) {
                this._resizeObserverInitialized = true;
                return;
            } else {
                this.open.set(false);
                this._resizeObserver?.disconnect();
            }

            // Sterategy 2: update overlay size
            // const width = (e[0].target as HTMLDivElement).offsetWidth;
            // this._connectedOverlay.overlayRef.updateSize({ width });
        });

        this._resizeObserver.observe(this._el.nativeElement);
    }

    private _unlistenFromResizeEvents() {
        this._viewpoerRulerSubscription?.unsubscribe();
        this._viewpoerRulerSubscription = undefined;

        this._resizeObserver?.disconnect();
        this._resizeObserver = undefined;
        this._resizeObserverInitialized = false;
    }

    @HostListener('click', ['$event'])
    private _onHostClick(e: MouseEvent) {
        if (this._isDisabled())
            return;

        this.open.update(x => !x);
        // this._onTouchedCallback?.(this._selectedValue());
    }
}
