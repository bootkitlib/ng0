import { Component, ElementRef, Renderer2, input, OnInit, DestroyRef, signal, HostListener, inject, forwardRef, TemplateRef, ContentChild, DOCUMENT, ChangeDetectionStrategy, booleanAttribute, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { convertToDataSource, DataRequest, DataSource, DataSourceLike } from '@bootkit/ng0/data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { defaultFilterFunction, FilterFunction, IdGenerator, ValueExtractorAttribute } from '@bootkit/ng0/common';
import { ValueFormatterAttribute, defaultValueFormatter, LocalizationService } from '@bootkit/ng0/localization';
import { defaultValueExtractor } from '@bootkit/ng0/common';
import { ListItem } from './types';
import { BooleanValueComparerAttribute, defaultBooleanValueComparer } from '@bootkit/ng0/common/boolean-value-comparer';

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
        '[attr.tabindex]': '_isDisabled() ? "-1" : "0"',
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
    @ContentChild(TemplateRef) protected _optionTemplate?: TemplateRef<any>;

    /**
     * The data source for the select component.
     * This can be an array of data, a function that returns an observable of data,
     * or an instance of DataSource.
     */
    public readonly source = input.required<DataSource<any>, DataSourceLike<any>>({
        transform: v => convertToDataSource(v)
    });

    /** 
     * Indicates whether multi selection is enabled or not.
     */
    public readonly multiple = input(false, { transform: booleanAttribute });

    /**
     * Selection indicator control
     */
    public readonly indicator = input(false, { transform: booleanAttribute });

    /**
     * Custom compare function to determine equality between two items.
     * Default is a simple equality check.
     */
    // public readonly compareFunction = input<ValueComparerFunction>(defaultValueComparer);

    /**
     * Custom value extractor function to extract the value of any object while writing values.
     */
    public readonly writeValueBy = input(defaultValueExtractor, {
        transform: ValueExtractorAttribute
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
     * Indicates whether the dropdown is filterable.
     */
    public readonly filterable = input(false, { transform: booleanAttribute });

    /**
     * Custom filter function to filter items based on a filter value.
     * Default checks if the item contains the filter value (case-insensitive).
     */
    public readonly filterBy = input<FilterFunction>(defaultFilterFunction);

    constructor(protected _el: ElementRef<HTMLDivElement>, private _renderer: Renderer2, private _destroyRef: DestroyRef) {
        // this._renderer.setAttribute(this._el.nativeElement, 'tabindex', '0');
        this._renderer.addClass(this._el.nativeElement, 'list-group');
    }

    ngOnInit(): void {
        var r = new DataRequest();
        this.source().load(r).pipe(takeUntilDestroyed(this._destroyRef)).subscribe(res => {
            this._insertItems(0, ...res.data)
        })

        this._handleDataSourceChange();
    }

    /**
     * Sets an option as active
     */
    public active(index: number) {
        if (index < 0) {
            throw Error();
        }

        this._activeOptionIndex.set(index);
        // this.scrollItemIntoView(this._activeOptionIndex(), 'nearest');
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

    writeValue(v: any): void {
        if (this.multiple()) {
            if (Array.isArray(v)) {
                this._value.set(v);
            } else if (v === null || v === undefined) {
                this._value.set([]);
            } else {
                throw Error('Provide an array or null as the value ng0-list component');
            }
        } else {
            this._value.set(v);
        }

        this._updateSelectionStatus();
    }

    private _updateSelectionStatus() {
        let value = this._value();
        let compareBy = this.compareBy();

        if(this.multiple()) {
            this._items().forEach(x => x.selected = (value as any[]).some(x => compareBy(x.value, value)));
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
                this._toggleSelection(this._activeOptionIndex());
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

    protected _insertItems(index?: number, ...items: any[]) {
        // let filter = this.filterBy()()
        var options = items.map(x => ({
            id: this._getNextOptionId(),
            value: x,
            show: true
        }) as ListItem)

        if (Number.isInteger(index)) {
            this._items().splice(index!, 0, ...options);
        } else {
            this._items().push(...options);
        }

        this._changeDetector.markForCheck();
    }

    protected _filterItems(filter: string) {
        let filterFunc = this.filterBy();
        this._items().forEach(x => x.show = filterFunc(x.value, filter));
    }

    /**
     * Selects an option by index
     */
    protected _toggleSelection(index: number) {
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

    private _getNextOptionId() {
        return `ng0-select-item-${IdGenerator.next().toString()}`;
    }

    private _handleDataSourceChange() {

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

    // @HostListener('click', ['$event'])
    // private _onHostClick(e: MouseEvent) {
    //     if (this._isDisabled())
    //         return;

    //     this.open.update(x => !x);
    //     // this._onTouchedCallback?.(this._selectedValue());
    // }
}
