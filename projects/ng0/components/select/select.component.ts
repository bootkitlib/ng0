import { Component, ElementRef, Renderer2, input, OnInit, DestroyRef, signal, model, HostListener, inject, forwardRef, ViewChild, TemplateRef, ContentChild, ViewEncapsulation, DOCUMENT, ChangeDetectionStrategy, booleanAttribute, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dataSourceAttribute, DataRequest, DataSource, DataSourceLike, ValueExtractorAttribute, defaultValueExtractor, stringFilter, FilterPredicate } from '@bootkit/ng0/data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FlexibleConnectedPositionStrategy, Overlay, OverlayModule, ScrollStrategy, ViewportRuler } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { SelectOption, _IdGenerator } from '@bootkit/ng0/common';
import { ValueFormatterAttribute, defaultValueFormatter, LocalizationService } from '@bootkit/ng0/localization';

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
export class SelectComponent implements OnInit, ControlValueAccessor {
    private _viewportRuler = inject(ViewportRuler);
    private _overlay = inject(Overlay);
    private _document = inject(DOCUMENT);
    private _ls = inject(LocalizationService);
    private _changeDetector = inject(ChangeDetectorRef);
    private _resizeObserver?: ResizeObserver;
    private _resizeObserverInitialized = false;
    private _viewpoerRulerSubscription?: Subscription;
    protected _value = signal<any>(undefined);
    @ViewChild('filterInput') private _filterElementRef?: ElementRef;
    private _onChangeCallback!: (value: any) => void;
    private _onTouchedCallback!: (value: any) => void;

    protected readonly _options = signal<SelectOption[]>([]);
    protected readonly _isDisabled = signal<boolean>(false);
    protected readonly _selectedOptionIndex = signal<number>(-1);
    protected readonly _activeOptionIndex = signal<number>(-1);
    @ContentChild(TemplateRef) protected _optionTemplate?: TemplateRef<any>;
    protected _positionStrategy!: FlexibleConnectedPositionStrategy;
    protected _scrollStrategy!: ScrollStrategy;

    /**
     * The data source for the select component.
     * This can be an array of data, a function that returns an observable of data,
     * or an instance of DataSource.
     */
    public readonly source = input.required<DataSource<any>, DataSourceLike<any>>({
        transform: v => dataSourceAttribute(v)
    });

    /** 
     * Indicates whether the dropdown is open or closed.
     */
    public readonly open = model(false);

    /**
     * Custom compare function to determine equality between two items.
     * Default is a simple equality check.
     */
    // public readonly compareFunction = input<ValueComparerFunction>(defaultValueComparer);

    /**
     * Custom value extractor function to extract the value of any object.
     */
    public readonly extractBy = input(defaultValueExtractor, {
        transform: ValueExtractorAttribute
    });

    /**
     * Custom format function to convert an item to a string for display.
     * Default converts the item to a string using its toString method.
     */
    public readonly formatBy = input(defaultValueFormatter, {
        transform: ValueFormatterAttribute(this._ls.get())
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

    constructor(protected _el: ElementRef<HTMLDivElement>, private _renderer: Renderer2, private _destroyRef: DestroyRef) {
        this._renderer.addClass(this._el.nativeElement, 'form-select');
        this._renderer.setAttribute(this._el.nativeElement, 'tabindex', '0');
        this._scrollStrategy = this._overlay.scrollStrategies.block();
    }

    ngOnInit(): void {
        var r = new DataRequest();
        this.source().load(r).pipe(takeUntilDestroyed(this._destroyRef)).subscribe(res => {
            this._insertOptions(0, ...res.data)
        })

        this._handleDataSourceChange();
    }

    private _handleDataSourceChange() {
        let options = this._options();
        this.source().change.subscribe(e => {
            e.changes.forEach(change => {
                switch (change.type) {
                    case 'insert':
                        this._insertOptions(change.index!, ...change.items);
                        break;
                    case 'replace':
                        options[change.index].value = change.value;
                        break;
                    case 'remove':
                        options.splice(change.index, change.count);
                }
            });
        });
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
        this._value.set(this.extractBy()(option.value));
        this._onChangeCallback(this._value());
    }

    public isSelected(value: any) {
        let v = this.extractBy()(value);
        return v === this._value();
    }

    /**
     * Sets an option as active
     */
    public active(index: number) {
        if (index < 0) {
            throw Error();
        }

        this._activeOptionIndex.set(index);
        if (this.open()) {
            this.scrollItemIntoView(this._activeOptionIndex(), 'nearest');
        }
    }

    /**
     * Scrolls the item at the specified index into view within the dropdown list.
     * @param index The index of the item to scroll into view.
     * @param position The vertical alignment of the item after scrolling.
     *                 Can be 'start', 'center', 'end', or 'nearest'.
     *                 Default is 'nearest'.
     * @param behavior The scrolling behavior.
     */
    public scrollItemIntoView(index: number, position?: ScrollLogicalPosition, behavior?: ScrollBehavior) {
        let item = this._options()[index];
        let elm = this._document.getElementById(item.id) as HTMLUListElement;
        elm!.scrollIntoView({ block: position, behavior: behavior });
    }

    protected _insertOptions(index?: number, ...items: any[]) {
        // let filter = this.filterBy()()
        var options = items.map(x => ({
            id: this._getNextOptionId(),
            value: x,
            show: true
        }) as SelectOption)

        if (Number.isInteger(index)) {
            this._options().splice(index!, 0, ...options);
        } else {
            this._options().push(...options);
        }

        this._changeDetector.markForCheck();
    }

    writeValue(obj: any): void {
        let value = this.extractBy()(obj)
        this._value.set(value);
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

    @HostListener('keydown', ['$event'])
    protected _onKeydown(e: KeyboardEvent, firedByFilter: boolean = false) {
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
                    if (this._activeOptionIndex() < optionsCount - 1) {
                        this.active(this._activeOptionIndex() + 1);
                    }
                } else {
                    if (this._selectedOptionIndex()! < optionsCount - 1) {
                        this._selectByIndex(this._selectedOptionIndex() + 1)
                    }
                }
                e.preventDefault();
                break;

            case 'ArrowUp':
                if (open) {
                    if (this._activeOptionIndex() > 0) {
                        this.active(this._activeOptionIndex()! - 1);
                    }
                } else {
                    if (this._selectedOptionIndex() > 0) {
                        this._selectByIndex(this._selectedOptionIndex()! - 1)
                    }
                }
                e.preventDefault();
                break;

            case 'Enter':
                if (open) {
                    if (this._activeOptionIndex() == this._selectedOptionIndex()) {
                        this.open.set(false);
                    } else {
                        this._selectByIndex(this._activeOptionIndex());
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
                    this._selectByIndex(0)
                }

                e.preventDefault();
                break;

            case 'End':
                if (open) {
                    this.active(optionsCount - 1);
                } else {
                    this._selectByIndex(optionsCount - 1);
                }

                e.preventDefault();
                break;
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
            this.scrollItemIntoView(this._selectedOptionIndex(), 'start', 'instant');
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
