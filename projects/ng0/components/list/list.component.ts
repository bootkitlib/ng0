import { Component, ElementRef, input, signal, HostListener, inject, forwardRef, TemplateRef, ContentChild, ChangeDetectionStrategy, booleanAttribute, ChangeDetectorRef, effect, EventEmitter, Output, computed, ViewChildren, QueryList, ViewEncapsulation, ViewContainerRef, HostBinding, OnInit, AfterViewInit, untracked, model, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dataSourceAttribute, DataRequest, DataSource, DataSourceLike } from '@bootkit/ng0/data';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { objectFormatterAttribute, defaultObjectFormatter, LocalizationService } from '@bootkit/ng0/localization';
import { ListItem } from "./list-item";
import {
    CssClassAttribute, defaultEqualityComparer, equalityComparerAttribute, valueWriterAttribute,
    defaultValueWriter, filterPredicateAttribute, noopFilter, IdGeneratorAttribute, TrackByAttribute, trackByIndex, IfDirective
} from '@bootkit/ng0/common';

/** 
 * ListComponent is a versatile component that displays a list of items with support for single or multiple selection,
 * custom item templates, filtering, and keyboard navigation.
 */
@Component({
    selector: 'ng0-list, ng0-select-list',
    exportAs: 'ng0List',
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        IfDirective,
        ListItem
    ],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ListComponent),
        multi: true
    }],
    host: {
        '[class.ng0-list-loading]': 'source().isLoading()',
        '[attr.aria-activedescendant]': '_hostAriaActiveDescendant()',
        '[attr.disabled]': '_isDisabled() ? "" : undefined',
        '[attr.aria-disabled]': '_isDisabled() ? "" : undefined',
        '[attr.tabindex]': '_hostTabIndex()',
    }
})
export class ListComponent implements ControlValueAccessor {
    private _localizationService = inject(LocalizationService);
    private _changeDetector = inject(ChangeDetectorRef);
    private _changeCallback?: (value: any) => void;
    private _touchCallback?: () => void;
    private readonly _selectedItems = new Set<any>();

    protected readonly _sourceItems = signal<any[]>([]);
    @ContentChild(TemplateRef) protected _itemTemplate?: TemplateRef<any>;
    protected readonly _activeItem = signal<ListItem | undefined>(undefined);
    protected readonly _isDisabled = signal<boolean>(false);
    private readonly _value = signal<any>(undefined);
    private _renderer = inject(Renderer2);

    /**
     * A list of all visible list items.
     */
    @ViewChildren(ListItem) public readonly listItems?: QueryList<ListItem>;

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
    * A comparer to compare items for selection.
    * Default uses strict equality (===).
    */
    public readonly compareBy = input(defaultEqualityComparer, {
        transform: equalityComparerAttribute
    });

    /**
     * A fromatter to convert each item to a string for display.
     * Default converts the item to a string using its toString method.
     */
    public readonly formatBy = input(defaultObjectFormatter, {
        transform: objectFormatterAttribute(this._localizationService.get())
    });

    /**
     * Custom value writer to extract the value of any object while writing values.
     */
    public readonly writeBy = input(defaultValueWriter, {
        transform: valueWriterAttribute
    });

    /**
     * Custom filter function to filter items.
     * Default is a noop filter that does not filter any items.
     */
    public readonly filterBy = input(noopFilter, {
        transform: filterPredicateAttribute
    });

    /**
     * A function that uniquely identifies each item in the list.
     * If set to a function, it will be called with the index and item as arguments to generate the unique id.
     * If set to a string, it will be used as the property name to extract the unique id from each item.
     * Two predifined trackBy options are available:
     * - '@index': uses the index of the item as its unique id.
     * - '@item': uses the item itself as its unique id.
     * @example
     * trackBy="@index"
     * trackBy="@item"
     * trackBy="objectFieldName"
     * [trackBy]="customTrackByFunction"
     * @default trackByIndex
     */
    public readonly trackBy = input(trackByIndex, {
        transform: TrackByAttribute
    });

    /**
     * CSS class or classes to apply to the list container.
     * Default is undefined.
     */
    public readonly itemClass = input(undefined, {
        transform: CssClassAttribute
    });

    /**
     * Defines the focus behavior of the list component.
     * - 'none': No keyboard interaction is possible. The list cannot be focused.
     * - 'roving': Roving tabindex is enabled. The list can be focused and the active item is tabbable.
     * - 'activeDescendant': The list can be focused, but no item is tabbable. The active item is indicated using aria-activedescendant.
     * @default 'activeDescendant'.
     */
    public readonly focusMode = input<'none' | 'roving' | 'activeDescendant'>('activeDescendant');

    /**
     * A function that generates unique ids for each item in the list.
     * If set to a function, it will be called with the item as an argument to generate the id.
     * If set to undefined, no ids will be generated for the items.
     * @default undefined
     */
    public readonly idGenerator = input(undefined, {
        transform: IdGeneratorAttribute
    });

    /**
     * Event emitted when the selection state of an item changes by user interaction.
     */
    @Output() public readonly selectionChange = new EventEmitter<ListSelectionChangeEvent>();

    /**
     * The template to use for each item in the list.
     */
    public readonly itemTemplate = input<TemplateRef<any> | undefined>(undefined);

    constructor() {
        effect(() => {
            this.source().load(new DataRequest()).subscribe(res => {
                untracked(() => {
                    this._activeItem.set(undefined);
                    this._sourceItems.set(res.data);
                    this._updateSelectedItems();
                    this._activateFirstSelectedItem();
                });
            });
        });
    }

    /**
     * Indicates whether an item is active.
     * @param item  
     * @returns 
     */
    public isActive(item: ListItem): boolean {
        return item === this._activeItem();
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
                this._changeCallback?.(this._value())
            }
        } else {
            this._selectedItems.clear();
            this._selectedItems.add(value);
            this._updateValue();
            this._changeCallback?.(this._value())
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

    /**
     * Deselects all items in the list.
     */
    public deselectAll(): void {
        this._selectedItems.clear();
        this._updateValue();
        this._changeCallback?.(this._value());
    }

    /**
     * Selects all items in the list. Only applicable in multiple selection mode.
     */
    public selectAll(): void {
        if (this.multiple()) {
            this._selectedItems.clear();
            this._sourceItems().forEach(i => this._selectedItems.add(i));
            this._updateValue();
            this._changeCallback?.(this._value());
        } else {
            throw new Error('selectAll is only available in multiple selection mode.');
        }
    }

    /**
     * Gets the current value(s) of the list.
     */
    public get value(): ReadonlyArray<any | any[]> {
        return this._value();
    }

    /**
     * Gets the current items in the list.
     */
    public get items(): ReadonlyArray<any[]> {
        return this._sourceItems();
    }

    writeValue(value: any): void {
        if (this.multiple()) {
            if (value === null || value === undefined) {
                value = [];
            } else if (!Array.isArray(value)) {
                throw Error('invalid value. Expected an array in multiple selection mode.');
            }
        }

        this._value.set(value);
        this._updateSelectedItems();
        this._activateFirstSelectedItem();
        this._changeDetector.markForCheck();
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

    protected _handleUserSelection(item: ListItem, index: number) {
        let value = item.value();

        if (this.multiple()) {
            this.toggle(value);
        } else {
            this.select(value);
        }

        this._activeItem.set(item);
        this.selectionChange.emit({ index, value: item.value(), item: item, list: this });
        this._changeDetector.detectChanges();
    }

    protected _showLoadingSppiner = computed(() => {
        let source = this.source();
        return source.isLoading() && source.type == 'remote';
    });

    private _updateSelectedItems(): void {
        let value = this._value();
        let compareBy = this.compareBy();
        let findAndSelect = (v: any) => {
            let index = this._sourceItems().findIndex(i => compareBy(i, v));
            if (index > -1) {
                let item = this._sourceItems().at(index)!;
                this._selectedItems.add(item);
            }

            return index;
        };

        this._selectedItems.clear();
        if (this.multiple()) {
            if (Array.isArray(value)) {
                (value as any[]).forEach(v => findAndSelect(v));
            }
        } else {
            findAndSelect(value);
        }
    }

    private _activateFirstSelectedItem(): void {
        if (this._selectedItems.size > 0) {
            let value = this._selectedItems.values().next().value;
            let item = this.listItems?.find(i => i.value() === value);
            if (item) {
                this._activeItem.set(item);
            }
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

    private _hostAriaActiveDescendant = computed(() => {
        if (this._activeItem() && !this._isDisabled() && this.focusMode() == 'activeDescendant') {
            return this._activeItem()!.id();
        }

        return undefined;
    });

    private _hostTabIndex = computed(() => {
        let isDisabled = this._isDisabled(); // track the value
        let activeItem = this._activeItem(); // track the value

        if (isDisabled) {
            return undefined;
        }

        switch (this.focusMode()) {
            case 'none':
                return undefined;
            case 'activeDescendant':
                return 0;
            case 'roving':

                return activeItem ? undefined : 0;
        }
    });

    @HostListener('blur')
    private _onHostBlur() {
        this._touchCallback?.();
    }

    @HostListener('keydown', ['$event'])
    private _onKeydown(e: KeyboardEvent) {
        if (this._isDisabled())
            return;

        let listLength = this.listItems!.length;
        if (listLength == 0) {
            return;
        }

        let activeItem = this._activeItem();
        let activeItemindex = activeItem ? this.listItems!.toArray().findIndex(i => i === activeItem) : -1;

        switch (e.key) {
            case 'ArrowDown':
                if (activeItemindex < listLength - 1) {
                    const next = this.listItems!.get(activeItemindex + 1);
                    this._activeItem.set(next);
                }
                e.preventDefault();
                break;
            case 'ArrowUp':
                if (activeItemindex == -1) {
                    const last = this.listItems!.get(listLength - 1);
                    this._activeItem.set(last);
                } else if (activeItemindex > 0) {
                    const previous = this.listItems!.get(activeItemindex - 1);
                    this._activeItem.set(previous);
                }
                e.preventDefault();
                break;
            case 'Enter':
                if (activeItem) {
                    this._handleUserSelection(activeItem, activeItemindex);
                }
                break;
            case 'Home':
                const first = this.listItems!.get(0);
                this._activeItem.set(first);
                e.preventDefault();
                break;
            case 'End':
                const last = this.listItems!.get(listLength - 1);
                this._activeItem.set(last);
                e.preventDefault();
                break;
        }

        this._activeItem()?.scrollIntoView('nearest', listLength > 100 ? 'instant' : 'smooth');
        if (this.focusMode() === 'roving') {
            this._activeItem()?.focus();
        }
    }
}


/**
 * Event emitted when the selection state of the list changes by user interaction.
 */
export interface ListSelectionChangeEvent {
    /**
     * The index of the item that was selected or deselected.
     * This is the index of the item in the list and ignores any items that are not currently visible.
     */
    index: number;

    /**
     * The value of the item that was selected or deselected.
     */
    value: any;

    /**
     * The item that was selected or deselected.
     */
    readonly item: ListItem;

    /**
     * The list component that emitted the event.
     */
    readonly list: ListComponent
}
