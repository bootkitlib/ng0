import { Component, ElementRef, input, DestroyRef, signal, HostListener, inject, forwardRef, TemplateRef, ContentChild, DOCUMENT, ChangeDetectionStrategy, booleanAttribute, ChangeDetectorRef, effect, EventEmitter, Output, computed, ViewChildren, QueryList, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dataSourceAttribute, DataRequest, DataSource, DataSourceLike } from '@bootkit/ng0/data';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
    CssClassAttribute, defaultEqualityComparer, equalityComparerAttribute, valueWriterAttribute,
    defaultValueWriter, filterPredicateAttribute,
    noopFilter,
    IdGeneratorAttribute,
    TrackByAttribute,
    trackByIndex
} from '@bootkit/ng0/common';
import { objectFormatterAttribute, defaultObjectFormatter, LocalizationService } from '@bootkit/ng0/localization';
import { ListItemFilterDirective } from './list-item-filter.directive';
import { ListItemComponent } from "./list-item.component";

/**
 * Select component that allows users to choose an option from a dropdown list.
 */
@Component({
    selector: 'ng0-list',
    exportAs: 'ng0List',
    templateUrl: './list.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        ListItemFilterDirective,
        ListItemComponent
    ],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ListComponent),
        multi: true
    }],
    host: {
        '[class.ng0-list-loading]': 'source().isLoading()',
        '[attr.aria-activedescendant]': '_hostAriaActiveDescendant()',
        '[attr.disabled]': '_isDisabled()',
        '[attr.tabindex]': '_hostTabIndex()',
        '[attr.aria-disabled]': '_isDisabled()'
    }
})
export class ListComponent implements ControlValueAccessor {
    private _ls = inject(LocalizationService);
    private _changeDetector = inject(ChangeDetectorRef);
    private _value = signal<any>(undefined);
    private _changeCallback?: (value: any) => void;
    private _touchCallback?: (value: any) => void;
    protected readonly _sourceItems = signal<any[]>([]);
    private readonly _selectedItems = new Set<ListItemComponent>();
    private readonly _activeItem = signal<ListItemComponent | undefined>(undefined);
    @ViewChildren(ListItemComponent) private readonly _listItems!: QueryList<ListItemComponent>;
    protected readonly _isDisabled = signal<boolean>(false);
    @ContentChild(TemplateRef) protected _itemTemplate?: TemplateRef<any>;

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
     * A function that uniquely identifies each item in the list.
     * If set to a function, it will be called with the index and item as arguments to generate the unique id.
     * If set to a string, it will be used as the property name to extract the unique id from each item.
     */
    public readonly trackBy = input(trackByIndex, {
        transform: TrackByAttribute
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

    constructor() {
        effect(() => {
            this.source().load(new DataRequest()).subscribe(res => {
                this._sourceItems.set(res.data);
            });
        })
    }

    public isActive(item: ListItemComponent): boolean {
        return this._activeItem() == item;
    }

    public isSelected(item: ListItemComponent): boolean {
        return this._selectedItems.has(item);
    }

    public select(item: ListItemComponent) {
        return this._selectedItems.add(item);
    }

    public deselect(item: ListItemComponent) {
        this._selectedItems.delete(item);
    }

    public toggle(item: ListItemComponent) {
        if (this._selectedItems.has(item)) {
            this.deselect(item);
        } else {
            this.select(item);
        }
    }

    writeValue(value: any): void {
        if (this.multiple() && value !== null && value !== undefined && !Array.isArray(value)) {
            throw Error('invalid value. Expected an array in multiple selection mode.');
        }

        // let compareBy = this.compareBy();
        // let findAndSelect = (v: any) => {
        //     let index = this._sourceItems().findIndex(i => compareBy(i, v));
        //     if (index > -1) {
        //         this._items?.get(index)!.selected.set(true);
        //     }
        // };

        // if (this.multiple()) {
        //     if (Array.isArray(value)) {
        //         (value as any[]).forEach(i => findAndSelect(i));
        //     }
        // } else {
        //     findAndSelect(value);
        // }

        // this._value = value;
        // this._changeDetector.markForCheck();
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

    protected _handleUserSelection(item: ListItemComponent) {
        // this._listItems?.find(i => i.active())?.active.set(false);

        if (this.multiple()) {
            this.toggle(item);
            let values: any[] = [];
            this._selectedItems.forEach(i => {
                if (i.isSelected()) {
                    values.push(this.writeBy()(i.value()));
                }
            });
            this._value.set(values);
        } else {
            this._selectedItems.clear()
            this._selectedItems.add(item);
            this._value.set(this.writeBy()(item.value()));
        }

        this._changeCallback?.(this._value);
        this.selectionChange.emit({
            item: item,
            list: this,
        });

        // item.active.set(true);
        this._changeDetector.markForCheck();
    }

    @HostListener('click')
    private _onHostClick() {
        if (this.focus() != 'none') {
            this.elementRef.nativeElement.focus();
        }
    }

    @HostListener('keydown', ['$event'])
    private _onKeydown(e: KeyboardEvent) {
        if (this._isDisabled())
            return;

        let optionsCount = this._sourceItems().length;
        if (optionsCount == 0) {
            return;
        }

        let activeItemindex = this._listItems.toArray().findIndex(i => i == this._activeItem());

        switch (e.key) {
            case 'ArrowDown':
                if (activeItemindex == -1) {
                    this._activeItem.set(this._listItems.get(0));
                } else if (activeItemindex < optionsCount - 1) {
                    this._activeItem.set(this._listItems.get(activeItemindex + 1));
                }
                e.preventDefault();
                break;
            case 'ArrowUp':
                if (activeItemindex == -1) {
                    this._activeItem.set(this._listItems.get(optionsCount - 1));
                } else if (activeItemindex > 0) {
                    this._activeItem.set(this._listItems.get(activeItemindex - 1));
                }
                e.preventDefault();
                break;
            case 'Tab':
                break;
            case 'Enter':
                if (activeItemindex > -1) {
                    this._handleUserSelection(this._sourceItems()[activeItemindex]);
                }
                break;
            case 'Home':
                this._activeItem.set(this._listItems.get(0));
                e.preventDefault();
                break;
            case 'End':
                this._activeItem.set(this._listItems.get(optionsCount - 1));
                e.preventDefault();
                break;
        }

        if (this.focus() === 'roving') {
            this._activeItem()?.focus();
        }
    }

    private _hostAriaActiveDescendant = computed(() => {
        if (this._activeItem() && !this._isDisabled() && this.focus() == 'activeDescendant') {
            return this._activeItem()?.id;
        }

        return undefined;
    });

    private _hostTabIndex = computed(() => {
        if (this._isDisabled() || this.focus() === 'none') {
            return -1;
        }

        if (this.focus() === "roving") {
            return this._activeItem() ? -1 : 0;
        } else {
            return 0; // activeDescendant
        }
    });
}


/**
 * Event emitted when the selection state of the list changes by user interaction.
 */
export interface ListSelectionChangeEvent {
    /**
     * The item that was selected or deselected.
     */
    readonly item: ListItemComponent;

    /**
     * The list component that emitted the event.
     */
    readonly list: ListComponent
}
