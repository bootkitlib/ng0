import { Component, ElementRef, Renderer2, input, DestroyRef, signal, model, HostListener, inject, forwardRef, ViewChild, TemplateRef, ContentChild, ViewEncapsulation, DOCUMENT, ChangeDetectionStrategy, booleanAttribute, ChangeDetectorRef, effect, OnInit, computed, EffectRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dataSourceAttribute, DataSource, DataSourceLike, stringFilter, FilterPredicate, DataRequest } from '@bootkit/ng0/data';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FlexibleConnectedPositionStrategy, Overlay, OverlayModule, ScrollStrategy, ViewportRuler } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { CssClassAttribute, IdGenerator, SelectOption, sequentialIdGenerator, equalityComparerAttribute, defaultEqualityComparer, valueWriterAttribute, defaultValueWriter, findValuesByComparer, findValueByComparer } from '@bootkit/ng0/common';
import { valueFormatterAttribute, defaultValueFormatter, LocalizationService } from '@bootkit/ng0/localization';
import { ListComponent, ListModule, ListItemSelectionChangeEvent } from '@bootkit/ng0/components/list';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class SelectComponent implements OnInit, ControlValueAccessor {
    private _resizeObserver?: ResizeObserver;
    private _resizeObserverInitialized = false;
    private _viewpoerRulerSubscription?: Subscription;
    @ViewChild('filterInput') private _filterElementRef?: ElementRef;
    @ViewChild(ListComponent) private _listComponent?: ListComponent;
    private _changeCallback!: (value: any) => void;
    private _touchCallback!: (value: any) => void;
    protected readonly _options = signal<SelectOption[]>([]);
    protected readonly _isDisabled = signal<boolean>(false);
    // protected readonly _selectedOptionIndex = signal<number>(-1);
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
    private _activateSlectedItemEffectRef!: EffectRef;

    /**
     * The data source for the select component.
     * This can be an array of data, a function that returns an observable of data,
     * or an instance of DataSource.
     */
    public readonly source = input.required<DataSource<any>, DataSourceLike<any>>({
        transform: v => dataSourceAttribute(v)
    });

    /** 
     * Value of the select component.
     */
    public value = model<any>(undefined);

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
    public readonly compareBy = input(defaultEqualityComparer, {
        transform: equalityComparerAttribute
    });

    /**
     * Custom format function to convert an item to a string for display.
     * Default converts the item to a string using its toString method.
     */
    public readonly formatBy = input(defaultValueFormatter, {
        transform: valueFormatterAttribute(this._ls.get())
    });

    /**
     * Custom value writer function to extract the value of any object while writing values.
     */
    public readonly writeBy = input(defaultValueWriter, {
        transform: valueWriterAttribute
    });

    /**
     * Indicates whether the select component is filterable.
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
     * CSS class or classes to apply to the items.
     */
    public readonly itemClass = input((item) => undefined, {
        transform: CssClassAttribute
    });

    /**
     * Custom id generator function to generate unique ids for each item.
     * Default generates sequential ids with the prefix 'ng0-select-item-'.
     * If set to undefined, no ids will be generated.
     */
    public readonly idGenerator = input<IdGenerator | undefined>(sequentialIdGenerator('ng0-select-item-'));

    constructor() {
        this._renderer.addClass(this._el.nativeElement, 'form-select');
        this._renderer.setAttribute(this._el.nativeElement, 'tabindex', '0');
        this._scrollStrategy = this._overlay.scrollStrategies.block();

        effect(() => {
            var value = this.value(); // track value
            this._changeCallback?.(value);
        })


        effect(() => {
            var value = this.open(); // track value
        })

        this._activateSlectedItemEffectRef = effect(() => {
            var value = this.value(); // track value
            var options = this._options(); // track options

            if (!this.multiple() && this._activeOptionIndex() == -1 && options.length > 0) {
                let index = options.findIndex(x => this.compareBy()(x, this.value()));
                if (index > -1) {
                    this._activeOptionIndex.set(index);
                    this._activateSlectedItemEffectRef.destroy();
                }
            }
        })
    }

    ngOnInit(): void {
        this.source().load(new DataRequest()).pipe(takeUntilDestroyed(this._destroyRef)).subscribe(res => {
            this._options.set(res.data);
            this._changeDetector.markForCheck();
        });
    }

    writeValue(obj: any): void {
        this.value.set(obj);
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

    protected _onFilterBlur() {
        // use setTimeout to allow next element receives the focus.
        // setTimeout(() => {
        //     if (!this._el.nativeElement.matches(':focus')) {
        //         this.open.set(false);
        //     }
        // }, 0);
    }

    protected _onOverlayAttach() {
        this._listenToResizeEvents();

        setTimeout(() => {
            if (this.filterable()) {
                this._filterElementRef?.nativeElement.focus();
            }

            if (this._activeOptionIndex() > -1) {
                this._listComponent?.active(this._activeOptionIndex());
            }
        }, 0);
    }

    protected _onOverlayDetach() {
        this._unlistenFromResizeEvents();
        this._el!.nativeElement.focus();
        this.open.set(false);
    }

    protected _onListSelectionChange(e: ListItemSelectionChangeEvent) {
        if (!this.multiple()) {
            this._activeOptionIndex.set(e.index);
            this.open.set(false);
        }
    }

    // Find the value in options using the comparer function
    protected _mappedValue = computed(() => {
        return this.multiple() ?
            findValuesByComparer(this._options(), this.value(), this.compareBy()) :
            findValueByComparer(this._options(), this.value(), this.compareBy());
    });

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

    private _selectFirst() {
        let optionsCount = this._options().length;
        if (optionsCount > 0) {
            this._activeOptionIndex.set(0);
            let value = this.writeBy()(this._options()[this._activeOptionIndex()]);
            this.value.set(value);
        }
    }
    private _selectLast() {
        let optionsCount = this._options().length;

        if (optionsCount > 0) {
            this._activeOptionIndex.set(optionsCount - 1);
            let value = this.writeBy()(this._options()[this._activeOptionIndex()]);
            this.value.set(value);
        }
    }

    private _selectNext() {
        let optionsCount = this._options().length;

        if (this._activeOptionIndex() < optionsCount - 1) {
            this._activeOptionIndex.update(x => x + 1);
            let value = this.writeBy()(this._options()[this._activeOptionIndex()]);
            this.value.set(value);
        }
    }

    private _selectPrevious() {
        // let optionsCount = this._options().length;

        if (this._activeOptionIndex() > 0) {
            this._activeOptionIndex.update(x => x - 1);
            let value = this.writeBy()(this._options()[this._activeOptionIndex()]);
            this.value.set(value);
        }
    }

    @HostListener('keydown', ['$event'])
    private _onHostKeydown(e: KeyboardEvent) {
        if (this._isDisabled())
            return;

        let optionsCount = this._options().length;
        if (optionsCount == 0) {
            return;
        }

        if (this.open()) {
            const newEvent = new KeyboardEvent(e.type, e);
            this._listComponent?.elementRef.nativeElement.dispatchEvent(newEvent);
        } else {
            switch (e.key) {
                case 'ArrowDown':
                    if (this.multiple()) return;
                    this._selectNext();
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    if (this.multiple()) return;
                    this._selectPrevious();
                    e.preventDefault();
                    break;
                case 'Enter':
                    this.open.set(!this.open());
                    // e.preventDefault();
                    break;
                case 'Home':
                    if (this.multiple()) return;
                    this._selectFirst();
                    e.preventDefault();
                    break;
                case 'End':
                    if (this.multiple()) return;
                    this._selectLast();
                    e.preventDefault();
                    break;
            }
        }
    }

    @HostListener('click', ['$event'])
    private _onHostClick(e: MouseEvent) {
        if (!this._isDisabled()) {
            this.open.update(x => !x);
            // this._onTouchedCallback?.(this._selectedValue());
        }
    }
}
