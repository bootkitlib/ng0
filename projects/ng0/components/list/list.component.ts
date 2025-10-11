import { Component, ElementRef, Renderer2, input, OnInit, DestroyRef, signal, HostListener, inject, forwardRef, TemplateRef, ContentChild, DOCUMENT, ChangeDetectionStrategy, booleanAttribute, ChangeDetectorRef, effect, EventEmitter, Output, ViewEncapsulation, model, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dataSourceAttribute, DataRequest, DataSource, DataSourceLike } from '@bootkit/ng0/data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
    CssClassAttribute, IdGenerator, sequentialIdGenerator, defaultEqualityComparer, equalityComparerAttribute, valueWriterAttribute,
    defaultValueWriter, FilterPredicate, filterPredicateAttribute,
    noopFilter
} from '@bootkit/ng0/common';
import { objectFormatterAttribute, defaultObjectFormatter, LocalizationService } from '@bootkit/ng0/localization';

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
        '[attr.aria-activedescendant]': '_ariaActiveDescendant()',
        '[attr.disabled]': '_isDisabled()',
        '[attr.tabindex]': '_isDisabled() || focus() === "none" ? undefined : "0"',
        '[attr.aria-disabled]': '_isDisabled()'
    }
})
export class ListComponent implements ControlValueAccessor {
    private _document = inject(DOCUMENT);
    private _ls = inject(LocalizationService);
    private _renderer = inject(Renderer2);
    private _destroyRef = inject(DestroyRef);
    private _changeDetector = inject(ChangeDetectorRef);
    private _value: any = undefined;
    private _changeCallback?: (value: any) => void;
    private _touchCallback?: (value: any) => void;
    private _selectedIndices = new Set<number>();

    protected readonly _items = signal<ListItem[]>([]);

    protected readonly _isDisabled = signal<boolean>(false);
    protected readonly _activeOptionIndex = signal<number>(-1);
    @ContentChild(TemplateRef) protected _itemTemplate?: TemplateRef<any>;

    private _ariaActiveDescendant = computed(() => {
        if (this.focus() == 'activeDescendant' && this._activeOptionIndex() > -1 && this._items().length) {
            return this._items()[this._activeOptionIndex()].id;
        }
        return undefined;
    });

    /**
     * Reference to the host element
     */
    public elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);

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
    * A custom comparer function or the name of a field for comparing two objects.
    */
    public readonly compareBy = input(defaultEqualityComparer, {
        transform: equalityComparerAttribute
    });

    /**
     * Custom format function to convert an item to a string for display.
     * Default converts the item to a string using its toString method.
     */
    public readonly formatBy = input(defaultObjectFormatter, {
        transform: objectFormatterAttribute(this._ls.get())
    });

    /**
     * Custom value extractor function to extract the value of any object while writing values.
     */
    public readonly writeBy = input(defaultValueWriter, {
        transform: valueWriterAttribute
    });

    /**
     * A custom filter predicate function to filter items based on a search string.
     * Default checks if the item's string representation contains the filter string (case-insensitive).
     * The filter predicate can be a function or a string representing the property name to filter.
     */
    public readonly filterBy = input(noopFilter, {
        transform: filterPredicateAttribute
    });

    /**
     * CSS class or classes to apply to the list container.
     * Default is undefined.
     */
    public readonly itemClass = input((item) => ['ng0-list-item'], {
        transform: CssClassAttribute
    });

    /**
     * Defines the focus behavior of the list component.
     * - 'none': No keyboard interaction is possible. The list cannot be focused.
     * - 'roving': Roving tabindex is enabled. The list can be focused and the active item is tabbable.
     * - 'activeDescendant': The list can be focused, but no item is tabbable. The active item is indicated using aria-activedescendant.
     * @default 'activeDescendant'.
     */
    public readonly focus = input<'none' | 'roving' | 'activeDescendant'>('activeDescendant');

    /**
     * Custom id generator function to generate unique ids for each item.
     * Default generates sequential ids with the prefix 'ng0-list-item-'.
     * If set to undefined, no ids will be generated.
     * @default sequentialIdGenerator('ng0-list-item-')
     */
    public readonly idGenerator = input<IdGenerator>(sequentialIdGenerator('ng0-list-item-'));

    /**
     * Event emitted when the selection state of an item changes by user interaction.
     */
    @Output() public readonly selectionChange = new EventEmitter<ListSelectionChangeEvent>();

    constructor() {
        effect(() => {
            let source = this.source(); // track source
            this._activeOptionIndex.set(-1);
            this._selectedIndices.clear();
            this._loadItems();
        });
    }

    /**
     * Gets the items of the list component.
     * @returns A readonly array of the items in the list.
     */
    public items(): ReadonlyArray<ListItem> {
        return [...this._items()];
    }

    /**
     * Sets an option as active
     * @param index The index of the option to set as active.
     * @param scrollIntoView Whether to scroll the active option into view. Default is true.
     * @returns void
     */
    public active(index: number, scrollIntoView = true): void {
        if (index < 0 || index >= this._items().length) {
            throw Error('Index out of range');
        }

        this._activeOptionIndex.set(index);
        if (scrollIntoView) {
            this.scrollIntoView(this._activeOptionIndex(), 'nearest');
        }
    }

    /**
     * Selects an option by index
     * @param index The index of the option to select.
     * @returns void
     */
    public select(index: number) {
        this._verifyIndexRange(index);

        if (this._selectedIndices.has(index)) {
            return;
        } else {
            if (!this.multiple()) {
                this._selectedIndices.clear();
            }

            this._selectedIndices.add(index);
        }

        if (this.multiple()) {
            this._value = [];
            for (const idx of this._selectedIndices) {
                this._value.push(this.writeBy()(this._items()[idx].value));
            }
        } else {
            this._value = this.writeBy()(this._items()[index].value);
        }

        this._changeCallback?.(this._value);
        this._changeDetector.markForCheck();
    }

    /**
     * Deselects an option by index
     * @param index The index of the option to deselect.
     * @returns void
     */
    public deselect(index: number) {
        this._verifyIndexRange(index);

        if (this._selectedIndices.has(index)) {
            this._selectedIndices.delete(index);
        } else {
            return;
        }

        if (this.multiple()) {
            this._value = [];
            for (const idx of this._selectedIndices) {
                this._value.push(this.writeBy()(this._items()[idx].value));
            }
        } else {
            this._value = undefined;
        }

        this._changeCallback?.(this._value);
        this._changeDetector.markForCheck();
    }



    /**
     * Toggles the selection state of an option by index
     * @param index The index of the option to toggle.
     * @returns void
     */
    public toggle(index: number) {
        if (this.isSelected(index)) {
            this.deselect(index);
        } else {
            this.select(index);
        }
    }

    /**
     * Checks if an option is selected.
     * @param index The index of the option to check.
     * @returns True if the option is selected, false otherwise.
     */
    public isSelected(index: number) {
        return this._selectedIndices.has(index);
    }

    /**
     * Checks if an option is active.
     * @param index The index of the option to check.
     * @returns True if the option is active, false otherwise.
     */
    public isActive(index: number) {
        return this._activeOptionIndex() === index;
    }

    /**
     * Sets the value of the list component.
     * @param value The value to set. Can be a single value or an array of values in multiple selection mode.
     */
    public set(value: any): void {
        this._setValue(value, true);
    }

    /**
     * Gets the currently selected indices.
     * @returns An array of the currently selected indices.
     * @description   
     * - In single selection mode, the array will contain at most one item.
     * - In multiple selection mode, the array can contain multiple items.
     * - Changing the selection should be done using select(), deselect(), or toggle() methods to ensure proper event emission and state management.
     * - Direct manipulation of the returned array will not affect the component's state.
     */
    public selectedIndices(): ReadonlyArray<number> {
        return Array.from(this._selectedIndices);
    }

    /**
     * Scrolls the item at the specified index into view within the dropdown list.
     * @param index The index of the item to scroll into view.
     * @param position The vertical alignment of the item after scrolling.
     *                 Can be 'start', 'center', 'end', or 'nearest'.
     *                 Default is 'nearest'.
     * @param behavior The scrolling behavior.
     */
    public scrollIntoView(index: number, position?: ScrollLogicalPosition, behavior?: ScrollBehavior) {
        let item = this._items()[index];
        let elm = this._document.getElementById(item.id) as HTMLElement;
        elm!.scrollIntoView({ block: position, behavior: behavior });
    }

    writeValue(value: any): void {
        this._setValue(value, false);
    }

    private _setValue(value: any, fireCallback: boolean) {
        if (this.multiple() && value !== null && value !== undefined && !Array.isArray(value)) {
            throw Error('invalid value. Expected an array in multiple selection mode.');
        }

        let compareBy = this.compareBy();
        let findAndSelect = (v: any) => {
            let index = this._items().findIndex(i => compareBy(i.value, v));
            if (index > -1) {
                this._selectedIndices.add(index);
            }
        };

        this._selectedIndices.clear();
        if (this.multiple()) {
            if (Array.isArray(value)) {
                (value as any[]).forEach(i => findAndSelect(i));
            }
        } else {
            findAndSelect(value);
        }

        this._value = value;
        this._changeDetector.markForCheck();
        if (fireCallback) {
            this._changeCallback?.(value);
        }
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

    protected _getItemTabIndex(index: number) {
        let focus = this.focus();
        if (this._isDisabled() || focus == 'none' || focus == 'activeDescendant') {
            return undefined;
        } else {
            // roving
            return this._activeOptionIndex() === index ? 0 : -1
        }
    }

    protected _handleUserSelection(index: number, item: ListItem) {
        let selected: boolean;

        this.active(index)

        if (this.multiple() && this.isSelected(index)) {
            this.deselect(index);
            selected = false;
        } else {
            this.select(index);
            selected = true;
        }

        this.selectionChange.emit({
            value: item.value,
            index: index,
            selected: selected,
            selectedIndices: this.selectedIndices(),
            list: this,
        });
    }

    private _loadItems() {
        var r = new DataRequest();
        this.source().load(r).pipe(takeUntilDestroyed(this._destroyRef)).subscribe(res => {
            let items = this._createItems(res.data);
            this._items().push(...items);
        });

        // listen to changes
        this.source().change.subscribe(e => {
            let items = this._items();
            e.changes.forEach(change => {
                switch (change.type) {
                    case 'push':
                        this._items().push(...this._createItems(change.items));
                        break;
                    // case 'replace':
                    //     change.replacements.forEach(({ index, value }) => {
                    //         items[index] = { id: this.idGenerator()(value), value };
                    //     });
                    //     break;
                    // case 'remove':
                    //     this._activeOptionIndex.set(-1);
                    //     change.indices.forEach(i => {
                    //         this.deselect(i);
                    //         items.splice(i, 1)
                    //     });
                    //     break;
                }

                this._changeDetector.markForCheck();
            });
        });
    }

    private _createItems(items: any[]) {
        let idGenerator = this.idGenerator()

        return items.map(x => ({
            id: idGenerator(x),
            value: x,
        }));
    }

    @HostListener('click')
    private _onHostClick() {
        if (this.focus() != 'none') {
            this.elementRef.nativeElement.focus();
        }
    }

    @HostListener('keydown', ['$event'])
    private _onKeydown(e: KeyboardEvent, firedByFilter: boolean = false) {
        if (this._isDisabled())
            return;

        let optionsCount = this._items().length;
        if (optionsCount == 0) {
            return;
        }

        let index = this._activeOptionIndex();

        switch (e.key) {
            case 'ArrowDown':
                if (index < optionsCount - 1) {
                    this.active(index + 1);
                }
                e.preventDefault();
                break;
            case 'ArrowUp':
                if (index > 0) {
                    this.active(index - 1);
                }
                e.preventDefault();
                break;
            case 'Tab': // Go to next item if roving focus is enabled
                // if (this.focus() === 'roving' && index < optionsCount - 1) {
                //     this.active(index + 1);
                //     e.preventDefault();
                // }
                break;
            case 'Enter':
                if (index > -1) {
                    this._handleUserSelection(index, this._items()[index]);
                }
                // e.preventDefault();
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

    private _verifyIndexRange(index: number) {
        let optionsCount = this._items().length;
        if (optionsCount == 0 || index < 0 || index > optionsCount - 1) {
            throw new Error('Index out of range');
        }
    }
}

/**
 * Represents an item in the list.
 */
export interface ListItem {
    /**
     * Id of the item (if idGenerator is provided, otherwise undefined).
     */
    id: string,

    /**
     * Value of the item.
     */
    value: any,
}

/**
 * Event emitted when the selection state of the list changes by user interaction.
 */
export interface ListSelectionChangeEvent {
    /**
     * Index of the item that was selected or deselected.
     */
    readonly index: number;

    /**
     * The value of the item that was selected or deselected.
     */
    readonly value: any;

    /**
     * Indicates whether the item was selected (true) or deselected (false).
     */
    readonly selected: boolean;

    /**
     * The indices of all currently selected items.
     */
    readonly selectedIndices: ReadonlyArray<number>;

    /**
     * The list component that emitted the event.
     */
    readonly list: ListComponent
}
