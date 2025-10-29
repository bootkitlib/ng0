import { Component, ElementRef, Renderer2, input, signal, model, HostListener, inject, forwardRef, ViewChild, TemplateRef, ContentChild, ViewEncapsulation, ChangeDetectionStrategy, booleanAttribute, ChangeDetectorRef, effect, computed, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dataSourceAttribute, DataSource, DataSourceLike, DataRequest } from '@bootkit/ng0/data';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FlexibleConnectedPositionStrategy, Overlay, OverlayModule, ScrollStrategy, ViewportRuler } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { objectFormatterAttribute, defaultFormatter, LocalizationService } from '@bootkit/ng0/localization';
import { ListComponent, ListModule, ListItemSelectEvent } from '@bootkit/ng0/components/list';
import {
    CssClassAttribute, equalityComparerAttribute, defaultEqualityComparer, valueWriterAttribute, defaultValueWriter,
    IdGeneratorAttribute, defaultFilter, filterPredicateAttribute
} from '@bootkit/ng0/common';

/**
 * Select component that allows users to choose an option from a dropdown list.
 */
@Component({
    selector: 'ng0-autocomplete',
    exportAs: 'ng0Autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrl: './autocomplete.component.scss',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ListModule, OverlayModule],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AutocompleteComponent),
        multi: true
    }],
    host: {
        '[class.ng0-autocomplete-open]': 'open()',
        '[class.ng0-autocomplete-filterable]': 'filterable()',
        '[class.ng0-autocomplete-loading]': 'source().isLoading()',
        '[attr.disabled]': '_isDisabled() ? "" : undefined',
        '[attr.aria-disabled]': '_isDisabled() ? "" : undefined',
        '[attr.tabindex]': '_isDisabled() ? undefined : 0',
    }
})
export class AutocompleteComponent implements ControlValueAccessor {
    // private _resizeObserver?: ResizeObserver;
    private _viewpoerRulerSubscription?: Subscription;
    @ViewChild('filterInput') private _filterElementRef?: ElementRef;
    @ViewChild(ListComponent) private _listComponent?: ListComponent;
    private _changeCallback!: (value: any) => void;
    private _touchCallback!: () => void;
    protected readonly _sourceItems = signal<any[] | undefined>(undefined);
    protected readonly _selectedItems = new Set<any>();
    protected readonly _isDisabled = signal<boolean>(false);
    protected _positionStrategy!: FlexibleConnectedPositionStrategy;
    protected _scrollStrategy!: ScrollStrategy;
    private _overlay = inject(Overlay);
    private _localizationService = inject(LocalizationService);
    protected _elementRef = inject(ElementRef<HTMLDivElement>);
    protected readonly _filterValue = signal('');
    private _renderer = inject(Renderer2);
    private _viewportRuler = inject(ViewportRuler);
    private _changeDetectorRef = inject(ChangeDetectorRef);
    private readonly _value = signal<any>(undefined);

    /**
     * Template for rendering each item in the select component.
     */
    @ContentChild(TemplateRef) public itemTemplate?: TemplateRef<any>;

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
     * Indicates whether to show selection indicator (checkbox/radio) next to each item.
     * Default is false.
     */
    public readonly showSelectionIndicator = input(false, {
        transform: booleanAttribute
    });

    /** 
     * Indicates whether the dropdown is open or closed.
     */
    public readonly open = model(false);

    /**
    * A comparer to compare items for selection.
    */
    public readonly compareBy = input(defaultEqualityComparer, {
        transform: equalityComparerAttribute
    });

    /**
     * A fromatter to convert each item to a string for display.
     */
    public readonly formatBy = input(defaultFormatter, {
        transform: objectFormatterAttribute(this._localizationService.get())
    });

    /**
     * Custom value writer to extract the value of any object while writing values.
     */
    public readonly writeBy = input(defaultValueWriter, {
        transform: valueWriterAttribute
    });

    /**
     * Indicates whether the select component is filterable.
     */
    public readonly filterable = input(false, { transform: booleanAttribute });

    /**
     * Custom filter function to filter items based on a filter value.
     * Default checks if the item contains the filter value (case-insensitive).
     */
    public readonly filterBy = input(defaultFilter, {
        transform: filterPredicateAttribute
    });

    /**
     * Placeholder text for the filter input field.
     */
    public readonly filterPlaceholder = input<string | undefined>(undefined);

    /**
     * CSS class or classes to apply to the items.
     */
    public readonly itemClass = input(undefined, {
        transform: CssClassAttribute
    });

    /**
     * A function that generates unique ids for each item in the list.
     * If set to a function, it will be called with the item as an argument to generate the id.
     * If set to undefined, no ids will be generated for the items.
     * @default undefined
     */
    public readonly idGenerator = input(undefined, {
        transform: IdGeneratorAttribute
    });

    constructor() {
        ['ng0-select', 'form-select'].forEach(c => this._renderer.addClass(this._elementRef.nativeElement, c));
        this._scrollStrategy = this._overlay.scrollStrategies.block();

        effect(() => {
            let source = this.source();
            source.load(new DataRequest()).subscribe(res => {
                untracked(() => {
                    this._sourceItems.set(res.data);
                    this._findAndSelectItems();
                    this._changeDetectorRef.markForCheck();
                })
            });
        });
    }

    /**
     * Indicates whether the given value is selected.
     * @param item 
     * @returns 
     */
    public isSelected(value: any): boolean {
        return this._selectedItems.has(value);
    }

    /**
     * Selects the given value.
     * @param item 
     */
    public select(value: any): void {
        if (this.multiple()) {
            if (!this._selectedItems.has(value)) {
                this._selectedItems.add(value);
                this._updateValue();
                this._changeCallback?.(this._value());
            }
        } else {
            this._selectedItems.clear();
            this._selectedItems.add(value);
            this._updateValue();
            this._changeCallback?.(this._value());
        }
    }

    /**
     * Deselects the given value.
     * @param item 
     */
    public deselect(value: any): void {
        this._selectedItems.delete(value);
        this._updateValue();
        this._changeCallback?.(this._value());
    }

    /**
     * Toggles the selection state of the given value.
     * @param item
    */
    public toggle(value: any): void {
        if (this.isSelected(value)) {
            this.deselect(value);
        } else {
            this.select(value);
        }
    }

    writeValue(obj: any): void {
        if (this.multiple()) {
            if (obj === null || obj === undefined) {
                obj = [];
            } else if (!Array.isArray(obj)) {
                throw Error('invalid value. Expected an array in multiple selection mode.');
            }
        }

        this._value.set(obj);
        this._findAndSelectItems();
        this._changeDetectorRef.markForCheck();
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

    private _findAndSelectItems(): void {
        let value = this._value();
        let compareBy = this.compareBy();
        let sourceItems = this._sourceItems();
        if (sourceItems == undefined) {
            return;
        }

        let findAndSelect = (v: any) => {
            let index = sourceItems.findIndex(sourceItem => compareBy(sourceItem, v));
            if (index > -1) {
                let item = sourceItems.at(index)!;
                this._selectedItems.add(item);
            }
        };

        if (this.multiple()) {
            if (Array.isArray(value)) {
                (value as any[]).forEach(v => findAndSelect(v));
            }
        } else {
            findAndSelect(value);
        }
    }

    private _updateValue(): void {
        let value: any;

        if (this.multiple()) {
            let values: any[] = [];
            this._selectedItems.forEach(v => {
                values.push(this.writeBy()(v));
            });
            value = values;
        } else {
            if (this._selectedItems.size > 0) {
                let first = this._selectedItems.values().next().value;
                value = this.writeBy()(first);
            } else {
                value = undefined;
            }
        }

        this._value.set(value);
    }

    protected _onOverlayAttach() {
        this._listenToResizeEvents();

        setTimeout(() => {
            if (this.filterable()) {
                this._filterElementRef?.nativeElement.focus();
            }

            this._listComponent!.writeValue(this._value());
            // if (this._activeOptionIndex() > -1) {
            //     this._listComponent?.active(this._activeOptionIndex());
            // }
        }, 0);
    }

    protected _onOverlayDetach() {
        this._unlistenFromResizeEvents();
        this._elementRef!.nativeElement.focus();
        this._filterValue.set('');
        this.open.set(false);
    }

    protected _onListSelectionChange(e: ListItemSelectEvent) {
        let value = e.item.value();

        if (this.multiple()) {
            this.toggle(value);
        } else {
            this.select(value);
        }

        // this.selectionChange.emit({ item: item, list: this });
        this._changeDetectorRef.detectChanges();
        if (!this.multiple()) {
            this.open.set(false);
        }
    }

    protected _filterPredicate = computed(() => {
        let filterValue = this._filterValue();
        let filterBy = this.filterBy();

        return (item: any) => filterBy(item, filterValue);
    })

    protected _onFilterKeydown(e: KeyboardEvent) {
        let keys = ['ArrowDown', 'ArrowUp', 'Enter', 'Home', 'End'];

        if (e.key === 'Tab') {
            e.preventDefault();
            this.open.set(false);
        }

        if (keys.includes(e.key)) {
            e.preventDefault();
            const newEvent = new KeyboardEvent(e.type, e);
            this._listComponent?.elementRef.nativeElement.dispatchEvent(newEvent);
        }
    }

    private _listenToResizeEvents() {
        this._viewportRuler.change().subscribe(x => {
            this.open.set(false);
        });

        // this._resizeObserver = new ResizeObserver(e => {
        //     // update overlay size
        //     // const width = (e[0].target as HTMLDivElement).offsetWidth;
        //     // this._connectedOverlay.overlayRef.updateSize({ width });
        // });

        // this._resizeObserver.observe(this._elementRef.nativeElement);
    }

    private _unlistenFromResizeEvents() {
        this._viewpoerRulerSubscription?.unsubscribe();
        this._viewpoerRulerSubscription = undefined;

        // this._resizeObserver?.disconnect();
        // this._resizeObserver = undefined;
    }

    @HostListener('keydown', ['$event'])
    private _onHostKeydown(e: KeyboardEvent) {
        let sourceItems = this._sourceItems()
        let itemsCount = sourceItems?.length || 0;

        if (this._isDisabled() || !sourceItems || itemsCount === 0) {
            return;
        }

        if (this.open()) {
            const newEvent = new KeyboardEvent(e.type, e);
            this._listComponent?.elementRef.nativeElement.dispatchEvent(newEvent);
            return;
        }

        let selectedItemindex: number;
        if (this._selectedItems.size == 0) {
            selectedItemindex = -1
        } else {
            let firstValue = this._selectedItems.values().next().value;
            selectedItemindex = sourceItems.findIndex(i => i === firstValue);
        }

        switch (e.key) {
            case 'ArrowDown':
                if (selectedItemindex < itemsCount - 1) {
                    this.select(sourceItems[selectedItemindex + 1]);
                }
                e.preventDefault();
                break;
            case 'ArrowUp':
                if (selectedItemindex > 0) {
                    this.select(sourceItems[selectedItemindex - 1]);
                }
                e.preventDefault();
                break;
            case 'Enter':
                this.open.set(true);
                e.preventDefault();
                break;
            case 'Home':
                if (itemsCount > 0) {
                    this.select(sourceItems[0]);
                }
                e.preventDefault();
                break;
            case 'End':
                if (itemsCount > 0) {
                    this.select(sourceItems[itemsCount - 1]);
                }
                e.preventDefault();
                break;
        }

        this._changeDetectorRef.markForCheck();
    }

    @HostListener('click', ['$event'])
    private _onHostClick(e: MouseEvent) {
        if (this._isDisabled() || this.source().isLoading()) {
            return;
        }

        this.open.update(x => !x);
        this._touchCallback?.();
    }
}
