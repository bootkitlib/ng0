import { Component, ElementRef, Renderer2, input, OnInit, DestroyRef, signal, model, HostListener, inject, forwardRef, ViewChild, TemplateRef, ContentChild, afterNextRender, ViewEncapsulation, DOCUMENT } from '@angular/core';
import { CommonModule } from '@angular/common';
import { convertToDataSource, DataRequest, DataSource, DataSourceLike } from '@bootkit/ng0/data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkConnectedOverlay, FlexibleConnectedPositionStrategy, Overlay, OverlayModule, ScrollStrategy, ViewportRuler } from '@angular/cdk/overlay';
import { getConnectedPositions } from '@bootkit/ng0/components/overlay';
import { Subscription } from 'rxjs';
import { SelectListItem } from './types';

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
    // changeDetection: ChangeDetectionStrategy.OnPush,
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
        '[attr.aria-activedescendant]': '_activeItemIndex() > -1 ? (_items()[_activeItemIndex()].id) : undefined',
        '[attr.disabled]': '_isDisabled()',
        '[attr.aria-disabled]': '_isDisabled()'
    }
})
export class SelectComponent implements OnInit, ControlValueAccessor {
    /**
     * The data source for the select component.
     * This can be an array of data, a function that returns an observable of data,
     * or an instance of DataSource.
     */
    public source = input.required<DataSource<any>, DataSourceLike<any>>({
        transform: v => convertToDataSource(v)
    });

    /** 
     * Indicates whether the dropdown is open or closed.
     */
    public readonly open = model(false);
    public readonly filter = input(false);
    public readonly filterPlaceholder = input('');

    protected readonly _items = signal<SelectListItem[]>([]);
    protected readonly _isDisabled = signal<boolean>(false);
    protected readonly _selectedItemIndex = signal<number>(-1);
    protected readonly _activeItemIndex = signal<number>(-1);
    @ContentChild(TemplateRef) protected _optionTemplate?: TemplateRef<any>;
    protected _onChangeCallback!: (value: any) => void;
    protected _onTouchedCallback!: (value: any) => void;
    protected _overlay = inject(Overlay);
    protected _viewportRuler = inject(ViewportRuler);
    protected _document = inject(DOCUMENT);
    @ViewChild(CdkConnectedOverlay) _connectedOverlay!: CdkConnectedOverlay;

    protected _positionStrategy!: FlexibleConnectedPositionStrategy;
    protected _scrollStrategy!: ScrollStrategy;
    protected _resizeObserver?: ResizeObserver;
    protected _resizeObserverInitialized = false;
    protected _filterValue = signal('');
    private _viewpoerRulerSubscription?: Subscription;
    @ViewChild('filterInput') private _filterElementRef?: ElementRef;
    private static _idCounter = 1;

    constructor(protected _el: ElementRef<HTMLDivElement>, private _renderer: Renderer2, private _destroyRef: DestroyRef) {
        this._renderer.addClass(this._el.nativeElement, 'form-select');
        this._renderer.setAttribute(this._el.nativeElement, 'tabindex', '0');

        this._positionStrategy = this._overlay.position()
            .flexibleConnectedTo(this._el.nativeElement)
            .withPositions(getConnectedPositions('bottom', 'start'))
            .withFlexibleDimensions(false)
            .withPush(false);

        this._scrollStrategy = this._overlay.scrollStrategies.block();
    }

    ngOnInit(): void {
        var r = new DataRequest();
        this.source().load(r).pipe(takeUntilDestroyed(this._destroyRef)).subscribe(res => {
            let items = res.data.map(x => ({
                id: 'ng0-select-item-' + (SelectComponent._idCounter++).toString(),
                value: x,
            }) as SelectListItem);

            this._items.set(items);
        })
    }

    /**
     * Selects an option by index
     */
    public select(index: number) {
        let optionsCount = this._items().length;
        if (optionsCount == 0 || index < 0 || index > optionsCount - 1) {
            return;
        }

        if (this._selectedItemIndex() > -1) {
            this._items()[this._selectedItemIndex()].selected = false
        }

        let item = this._items()[index];
        item.selected = true;
        this._selectedItemIndex.set(index);
        this._activeItemIndex.set(index);
        this._onChangeCallback(item.value);
    }

    /**
     * Sets an option as active
     */
    public active(index: number) {
        if (this._activeItemIndex() > -1) {
            this._items()[this._activeItemIndex()].active = false
        }

        this._activeItemIndex.set(index);
        let item = this._items()[index]
        item.active = true;

        if (this.open()) {
            this.scrollItemIntoView(this._activeItemIndex(), 'nearest');
        }
    }

    public scrollItemIntoView(index: number, position?: ScrollLogicalPosition, behavior?: ScrollBehavior) {
        let item = this._items()[index];
        let elm = this._document.getElementById(item.id) as HTMLUListElement;
        elm!.scrollIntoView({ block: position, behavior: behavior });
    }

    writeValue(obj: any): void {
        let index = this._items().findIndex(x => x.value === obj);
        if (index > -1) {
            var item = this._items()[index];
            item.active = true;
            item.selected = true;

            this._selectedItemIndex.set(index);
            this._activeItemIndex.set(index);
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

    @HostListener('click', ['$event'])
    private _onHostClick(e: MouseEvent) {
        if (this._isDisabled())
            return;

        this.open.update(x => !x);
        // this._onTouchedCallback?.(this._selectedValue());
    }

    @HostListener('keydown', ['$event'])
    protected _onKeydown(e: KeyboardEvent, firedByFilter: boolean = false) {
        let open = this.open();

        if (this._isDisabled())
            return;

        let optionsCount = this._items().length;
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

    protected _filterItems(value: any) {
        let filter = this._filterValue();
        if (!this.filter() || filter == '' || filter == null) {
            return false;
        }

        let valueType = typeof value;
        if (valueType == 'number') {
            return (value as number).toString() !== filter;
        } else if (valueType == 'string')
            return (value as string).toLowerCase().includes(filter.toLowerCase())
        else {
            return value === filter
        }
    }

    protected _onOverlayAttach() {
        this._activeItemIndex.set(this._selectedItemIndex())

        this._listenToResizeEvents();

        if (this.filter()) {
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
        if (this.filter()) {
            this._el?.nativeElement.focus();
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
}
