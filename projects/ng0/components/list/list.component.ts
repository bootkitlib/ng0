import { Component, ElementRef, Renderer2, input, OnInit, DestroyRef, signal, HostListener, inject, forwardRef, TemplateRef, ContentChild, DOCUMENT, ChangeDetectionStrategy, booleanAttribute, ChangeDetectorRef, effect, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dataSourceAttribute, DataRequest, DataSource, DataSourceLike, ValueWriterAttribute, defaultValueWriter, stringFilter, FilterPredicate, FilterPredicateAttribute, BooleanValueComparerAttribute } from '@bootkit/ng0/data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { _IdGenerator, CssClassAttribute, IdGenerator, sequentialIdGenerator, } from '@bootkit/ng0/common';
import { ValueFormatterAttribute, defaultValueFormatter, LocalizationService } from '@bootkit/ng0/localization';
import { ListItem } from './types';
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
    // encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
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
    private _renderer = inject(Renderer2);
    private _destroyRef = inject(DestroyRef);
    private _el = inject<ElementRef<HTMLDivElement>>(ElementRef<HTMLDivElement>);
    private _changeDetector = inject(ChangeDetectorRef);
    private _onChangeCallback?: (value: any) => void;
    private _onTouchedCallback?: (value: any) => void;
    protected _value = signal<any>(undefined);

    protected readonly _items = signal<ListItem[]>([]);
    protected readonly _isDisabled = signal<boolean>(false);
    protected readonly _activeOptionIndex = signal<number>(-1);
    @ContentChild(TemplateRef) protected _itemTemplate?: TemplateRef<any>;

    /**
     * Event emitted when the selected value has been changed by the user.
     */
    @Output() public readonly selectionChange = new EventEmitter<any>();

    /**
     * The data source for the select component.
     * This can be an array of data, a function that returns an observable of data,
     * or an instance of DataSource.
     */
    public readonly source = input.required<DataSource<any>, DataSourceLike<any>>({
        transform: v => dataSourceAttribute(v)
    });

    /** 
     * Value of the list control.
     */
    public value = input<any>(undefined);

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
    public readonly itemClass = input((item) => ['ng0-list-item'], {
        transform: CssClassAttribute
    });

    public readonly focus = input<'none' | 'roving' | 'activeDescendant'>('roving');

    public readonly idGenerator = input<IdGenerator | undefined>(sequentialIdGenerator('ng0-list-item-'));

    constructor() {
        effect(() => {
            var value = this.value(); // track value
            this._updateSelectionState();
        })
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
     * Toggles the selection state of an option by index
     * @param index The index of the option to toggle.
     * @returns void
     */
    public toggleSelection(index: number) {
        this._select(index, !this.isSelected(index));
    }

    /**
     * Selects an option by index
     * @param index The index of the option to select.
     * @returns void
     */
    public select(index: number) {
        this._select(index, true);
    }

    /**
     * Deselects an option by index
     * @param index The index of the option to deselect.
     * @returns void
     */
    public deselect(index: number) {
        this._select(index, false);
    }

    /**
     * Checks if an option is selected.
     * @param index The index of the option to check.
     * @returns True if the option is selected, false otherwise.
     */
    public isSelected(index: number) {
        return this._items()[index]?.selected || false;
    }

    /**
     *  Checks if an option is active.
     * @param index The index of the option to check.
     * @returns True if the option is active, false otherwise.
     */
    public isActive(index: number) {
        return this._activeOptionIndex() === index;
    }

    writeValue(value: any): void {
        if (this.multiple() && value !== null && value !== undefined && !Array.isArray(value)) {
            throw Error('Provide array or null as the value for multi-select list/select/autocomplete component.');
        }

        this._value.set(value);
        this._updateSelectionState();
    }

    private _updateSelectionState() {
        let compareBy = this.compareBy();
        if (this.multiple() && Array.isArray(this._value())) {
            let values = this._value() as any[];
            this._items().forEach(i => i.selected = values.some(v => compareBy(i.value, v)));
        } else {
            let value = this._value();
            this._items().forEach(i => i.selected = compareBy(i.value, value));
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
            case 'Tab': // Go to next item if roving focus is enabled
                if (this.focus() === 'roving' && this._activeOptionIndex() < optionsCount - 1) {
                    this.active(this._activeOptionIndex() + 1);
                    e.preventDefault();
                }
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

    protected _getItemTabIndex(index: number) {
        let focus = this.focus();
        if (this._isDisabled() || focus == 'none') {
            return -1;
        }

        return focus === 'roving' ? (this._activeOptionIndex() === index ? 0 : -1) : -1;
    }

    @HostListener('click', ['$event'])
    private _onHostClick(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (this.focus() != 'none') {
            this._el.nativeElement.focus();
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

            this._changeDetector.markForCheck();
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

    private _select(index: number, selected: boolean) {
        let optionsCount = this._items().length;
        if (optionsCount == 0 || index < 0 || index > optionsCount - 1) {
            throw new Error('Index out of range');
        }

        let item = this._items()[index];
        if (item.selected === selected) {
            return;
        }

        if (this.multiple()) {
            item.selected = selected;
            let selectedItems = this._items().filter(x => x.selected).map(x => (x.value));
            let writeBy = this.writeBy();
            let selectedValues = selectedItems.map(x => writeBy(x));
            this._value.set(selectedValues);
        } else {
            this._items().forEach(x => x.selected = false);
            item.selected = selected;
            let itemValue = this.writeBy()(item.value);
            this._value.set(itemValue);
        }

        this.selectionChange.emit(this._value());
        this._onChangeCallback?.(this._value());
    }
}
