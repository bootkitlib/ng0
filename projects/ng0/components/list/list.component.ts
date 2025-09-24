import { Component, ElementRef, Renderer2, input, OnInit, DestroyRef, signal, HostListener, inject, forwardRef, TemplateRef, ContentChild, DOCUMENT, ChangeDetectionStrategy, booleanAttribute, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dataSourceAttribute, DataRequest, DataSource, DataSourceLike, ValueExtractorAttribute, defaultValueExtractor, stringFilter, FilterPredicate, FilterPredicateAttribute, BooleanValueComparerAttribute } from '@bootkit/ng0/data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { _IdGenerator, CssClassLike, CssClassAttribute, IdGenerator, sequentialIdGenerator, } from '@bootkit/ng0/common';
import { ValueFormatterAttribute, defaultValueFormatter, LocalizationService } from '@bootkit/ng0/localization';
import { ListItem } from './types';
import { } from '@bootkit/ng0/data';
import { defaultBooleanValueComparer } from '@bootkit/ng0/data';

/**
 * Select component that allows users to choose an option from a dropdown list.
 */
@Component({
    selector: 'ng0-list',
    exportAs: 'ng0List',
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        OverlayModule,
    ],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ListComponent),
        multi: true
    }],
    host: {
        '[class.ng0-list-loading]': 'source().isLoading()',
        '[attr.aria-activedescendant]': '_activeOptionIndex() > -1 ? (_items()[_activeOptionIndex()].id) : undefined',
        '[attr.disabled]': '_isDisabled()',
        '[attr.tabindex]': '_isDisabled() || focus() === "none" ? "-1" : "0"',
        '[attr.aria-disabled]': '_isDisabled()'
    }
})
export class ListComponent implements OnInit, ControlValueAccessor {
    private _document = inject(DOCUMENT);
    private _ls = inject(LocalizationService);
    private _changeDetector = inject(ChangeDetectorRef);
    protected _value = signal<any>(undefined);
    private _onChangeCallback!: (value: any) => void;
    private _onTouchedCallback!: (value: any) => void;

    protected readonly _items = signal<ListItem[]>([]);
    protected readonly _isDisabled = signal<boolean>(false);
    protected readonly _activeOptionIndex = signal<number>(-1);
    @ContentChild(TemplateRef) protected _itemTemplate?: TemplateRef<any>;

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
    public readonly showIndicator = input(false, {
        transform: booleanAttribute
    });

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
    public readonly writeValueBy = input(defaultValueExtractor, {
        transform: ValueExtractorAttribute
    });

    /**
     * A custom filter predicate function to filter items based on a search string.
     * Default checks if the item's string representation contains the filter string (case-insensitive).
     * The filter predicate can be a function or a string representing the property name to filter.
     */
    public readonly filterBy = input(stringFilter, {
        transform: FilterPredicateAttribute
    });


    /**
     * CSS class or classes to apply to the list container.
     * Default is undefined.
     */
    public readonly itemClass = input((item) => undefined, {
        transform: CssClassAttribute
    });

    public readonly focus = input<'none' | 'roving' | 'activeDescendant'>('activeDescendant');

    public readonly idGenerator = input<IdGenerator | undefined>(sequentialIdGenerator('ng0-list-item-'));

    constructor(protected _el: ElementRef<HTMLDivElement>, private _renderer: Renderer2, private _destroyRef: DestroyRef) {
    }

    ngOnInit(): void {
        this._loadItems();
        this._listenToDataSourceChanges();
    }

    /**
     * Sets an option as active
     */
    public active(index: number): void {
        if (index < 0) {
            throw Error();
        }

        this._activeOptionIndex.set(index);
        // this.scrollItemIntoView(this._activeOptionIndex(), 'nearest');
    }

    /**
     * Filters the list items based on the provided criteria.
     * @param params The filter parameters to apply.
     * @returns void
     */
    public filter(...params: any[]): void {
        let filterBy = this.filterBy();
        this._items().forEach(x => x.filtered = !filterBy(x.value, ...params));
        this._changeDetector.markForCheck();
    }

    /**
     * Clears any applied filters and shows all items in the list.
     * @returns void
     */
    public clearFilter(): void {
        this._items().forEach(x => x.filtered = false);
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
        let item = this._items()[index];
        let elm = this._document.getElementById(item.id) as HTMLUListElement;
        elm!.scrollIntoView({ block: position, behavior: behavior });
    }

    /**
     * Toggles the selection of an option by index
     */
    public toggleSelection(index: number) {
        let optionsCount = this._items().length;
        if (optionsCount == 0 || index < 0 || index > optionsCount - 1) {
            throw new Error('Index out of range');
        }

        let item = this._items()[index];
        let writeValueBy = this.writeValueBy();

        if (this.multiple()) {
            item.selected = !item.selected;
            let selectedValues = this._items().filter(x => x.selected).map(x => (x.value));
            this._value.set(selectedValues);
        } else {
            if (item.selected) {
                return;
            }
            let itemValue = writeValueBy(item.value);
            this._items().forEach(x => x.selected = false);
            item.selected = true;
            this._value.set(itemValue);
        }

        this._onChangeCallback(this._value());
    }

    writeValue(v: any): void {
        let value;

        if (this.multiple()) {
            if (Array.isArray(v)) {
                value = v;
            } else if (v === null || v === undefined) {
                value = [];
            } else {
                throw Error('Provide an array or null as the value ng0-list component');
            }
        } else {
            value = v;
        }

        this._value.set(value);

        // Update selection state of items
        let compareBy = this.compareBy();
        if (this.multiple()) {
            this._items().forEach(x => x.selected = (value as any[]).some(y => compareBy(x.value, y)));
        } else {
            this._items().forEach(x => x.selected = compareBy(x.value, value));
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
        if (this._isDisabled())
            return;

        let optionsCount = this._items().length;
        if (optionsCount == 0) {
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                if (this._activeOptionIndex() < optionsCount - 1) {
                    this.active(this._activeOptionIndex() + 1);
                }
                e.preventDefault();
                break;

            case 'ArrowUp':
                if (this._activeOptionIndex() > 0) {
                    this.active(this._activeOptionIndex()! - 1);
                }
                e.preventDefault();
                break;

            case 'Enter':
                this.toggleSelection(this._activeOptionIndex());
                e.preventDefault();
                break;

            case 'Home':
                this.active(0);
                e.preventDefault();
                break;

            case 'End':
                this.active(optionsCount - 1);
                e.preventDefault();
                break;
        }
    }

    private _loadItems() {
        var r = new DataRequest();
        this.source().load(r).pipe(takeUntilDestroyed(this._destroyRef)).subscribe(res => {
            this._insertItems(0, ...res.data);
        });
    }

    private _listenToDataSourceChanges() {
        this.source().change.subscribe(e => {
            let options = this._items();
            e.changes.forEach(change => {
                switch (change.type) {
                    case 'insert':
                        this._insertItems(change.index!, ...change.items);
                        break;
                    case 'replace':
                        options[change.index].value = change.value;
                        break;
                    case 'remove':
                        options.splice(change.index, change.count);
                }
            });

            // this._changeDetector.markForCheck();
        });
    }

    private _insertItems(index?: number, ...items: any[]) {
        // let filter = this.filterBy()()
        let idGenerator = this.idGenerator()
        let compareBy = this.compareBy();
        let value = this._value();
        let isItemSelected = this.multiple() && Array.isArray(value) ?
            (item: any) => (value as any[]).some(x => compareBy(x.value, item)) :
            (item: any) => compareBy(value, item);

        var options = items.map(x => ({
            id: idGenerator ? idGenerator(x) : undefined,
            value: x,
            selected: isItemSelected(x),
            filtered: false,
        }) as ListItem)

        if (Number.isInteger(index)) {
            this._items().splice(index!, 0, ...options);
        } else {
            this._items().push(...options);
        }

        this._changeDetector.markForCheck();
    }
}
