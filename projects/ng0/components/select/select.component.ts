import { Component, ElementRef, Renderer2, input, OnInit, DestroyRef, signal, model, HostListener, inject, forwardRef, ViewChild, TemplateRef, ContentChild, ViewEncapsulation, DOCUMENT, ChangeDetectionStrategy, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { convertToDataSource, DataRequest, DataSource, DataSourceLike } from '@bootkit/ng0/data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FlexibleConnectedPositionStrategy, Overlay, OverlayModule, ScrollStrategy, ViewportRuler } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { defaultFilterFunction, FilterFunction, SelectOption, IdGenerator, ValueExtractorAttribute } from '@bootkit/ng0/common';
import { ValueFormatterAttribute, defaultValueFormatter, LocalizationService } from '@bootkit/ng0/localization';
import { defaultValueExtractor } from '@bootkit/ng0/common';

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
        '[class.is-open]': 'open()',
        '[attr.aria-activedescendant]': '_activeItemIndex() > -1 ? (_options()[_activeItemIndex()].id) : undefined',
        '[attr.disabled]': '_isDisabled()',
        '[attr.aria-disabled]': '_isDisabled()'
    }
})
export class SelectComponent implements OnInit, ControlValueAccessor {
    private _viewportRuler = inject(ViewportRuler);
    private _overlay = inject(Overlay);
    private _document = inject(DOCUMENT);
    private _ls = inject(LocalizationService);
    private _resizeObserver?: ResizeObserver;
    private _resizeObserverInitialized = false;
    private _viewpoerRulerSubscription?: Subscription;
    @ViewChild('filterInput') private _filterElementRef?: ElementRef;
    private _onChangeCallback!: (value: any) => void;
    private _onTouchedCallback!: (value: any) => void;

    protected readonly _options = signal<SelectOption[]>([]);
    protected readonly _isDisabled = signal<boolean>(false);
    protected readonly _selectedItemIndex = signal<number>(-1);
    protected readonly _activeItemIndex = signal<number>(-1);
    @ContentChild(TemplateRef) protected _optionTemplate?: TemplateRef<any>;
    protected _positionStrategy!: FlexibleConnectedPositionStrategy;
    protected _scrollStrategy!: ScrollStrategy;

    /**
     * The data source for the select component.
     * This can be an array of data, a function that returns an observable of data,
     * or an instance of DataSource.
     */
    public readonly source = input.required<DataSource<any>, DataSourceLike<any>>({
        transform: v => convertToDataSource(v)
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
    public readonly filterBy = input<FilterFunction>(defaultFilterFunction);

    constructor(protected _el: ElementRef<HTMLDivElement>, private _renderer: Renderer2, private _destroyRef: DestroyRef) {
        this._renderer.addClass(this._el.nativeElement, 'form-select');
        this._renderer.setAttribute(this._el.nativeElement, 'tabindex', '0');
        this._scrollStrategy = this._overlay.scrollStrategies.block();
    }

    ngOnInit(): void {
        var r = new DataRequest();
        this.source().load(r).pipe(takeUntilDestroyed(this._destroyRef)).subscribe(res => {
            let options = res.data.map(x => ({
                id: 'ng0-select-item-' + IdGenerator.next().toString(),
                value: x,
            }) as SelectOption);
            this._options.set(options);
        })
    }

    /**
     * Selects an option by index
     */
    public select(index: number) {
        let optionsCount = this._options().length;
        if (optionsCount == 0 || index < 0 || index > optionsCount - 1) {
            throw new Error('Index out of range');
        }

        // Deselect previous selected item
        if (this._selectedItemIndex() > -1) {
            this._options()[this._selectedItemIndex()].isSelected = false
        }

        this._selectedItemIndex.set(index);
        let item = this._options()[index];
        item.isSelected = true;

        this._onChangeCallback(this.extractBy()(item.value));
    }

    /**
     * Sets an option as active
     */
    public active(index: number) {
        if (this._activeItemIndex() > -1) {
            this._options()[this._activeItemIndex()].isActive = false
        }

        this._activeItemIndex.set(index);
        let item = this._options()[index]
        item.isActive = true;

        if (this.open()) {
            this.scrollItemIntoView(this._activeItemIndex(), 'nearest');
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

    writeValue(obj: any): void {
        let index = this._options().findIndex(x => this.extractBy()(x.value) == obj);

        if (index > -1) {
            var item = this._options()[index];
            item.isActive = true;
            item.isSelected = true;

            this._selectedItemIndex.set(index);
        }
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
                    if (this._activeItemIndex() < optionsCount - 1) {
                        this.active(this._activeItemIndex() + 1);
                    }
                } else {
                    if (this._selectedItemIndex()! < optionsCount - 1) {
                        this.select(this._selectedItemIndex() + 1)
                    }
                }
                e.preventDefault();
                break;

            case 'ArrowUp':
                if (open) {
                    if (this._activeItemIndex() > 0) {
                        this.active(this._activeItemIndex()! - 1);
                    }
                } else {
                    if (this._selectedItemIndex() > 0) {
                        this.select(this._selectedItemIndex()! - 1)
                    }
                }
                e.preventDefault();
                break;

            case 'Enter':
                if (open) {
                    if (this._activeItemIndex() == this._selectedItemIndex()) {
                        this.open.set(false);
                    } else {
                        this.select(this._activeItemIndex());
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
        this._options().forEach(x => x.isFiltered = !filterFunc(x.value, filter));
    }

    protected _onOverlayAttach() {
        this._activeItemIndex.set(this._selectedItemIndex())

        this._listenToResizeEvents();

        if (this.filterable()) {
            setTimeout(() => {
                this._filterElementRef?.nativeElement.focus();
            }, 0);
        }

        if (this._selectedItemIndex() > -1) {
            this.scrollItemIntoView(this._selectedItemIndex(), 'start', 'instant');
        }
    }

    protected _onOverlayDetach() {
        this._unlistenFromResizeEvents();
        if (this.filterable()) {
            this._el?.nativeElement.focus();
            this._options().forEach(x => x.isFiltered = false);
        }
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
