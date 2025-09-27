import { Directive, OnInit, ElementRef, Renderer2, input, OnDestroy, Optional, DestroyRef, HostListener, TemplateRef, ViewContainerRef, EventEmitter, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { BehaviorSubject, startWith, switchMap } from 'rxjs';
import { DataResult, DataRequest } from '@bootkit/ng0/data';
import { DataSourceLike, LogicalOperator, dataSourceAttribute } from '@bootkit/ng0/data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AutocompleteContainerComponent } from './autocomplete-container.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { getConnectedPositions } from '@bootkit/ng0/components/overlay';


@Directive({
    selector: 'input[ng0Autocomplete], textarea[ng0Autocomplete]',
    exportAs: 'ng0AutocompleteTrigger',
    standalone: true,
})
export class AutocompleteTriggerDirective implements OnInit, OnDestroy {
    /**
     * The data source for the autocomplete.
     */
    public source = input.required({ transform: (v: DataSourceLike) => dataSourceAttribute(v) });

    /**
     * The formatter function to format the selected value.
     * This is used to display the selected value in the input field.
     * If not provided, the value will be used as is.
     * @default (value) => value
     */
    public formatter = input<(value: any) => string>(v => v != null ? v.toString() : '');

    /**
     * The template for the options.
     */
    public optionsTemplate = input<TemplateRef<any>>();


    /**
     * Event emitted when an item is selected from the autocomplete options.
     * This event is emitted with the selected item.
     */
    @Output() public itemSelect = new EventEmitter<any>();

    protected _dataResultBehavior = new BehaviorSubject<DataResult<any>>({ data: [], total: 0 });
    protected _dataResult$ = this._dataResultBehavior.asObservable();

    private _overlayRef?: OverlayRef;
    private _instance?: AutocompleteContainerComponent;
    private _portal!: ComponentPortal<AutocompleteContainerComponent>;
    private _selectedItem?: any;

    constructor(
        private _el: ElementRef,
        private _renderer: Renderer2,
        private _overlay: Overlay,
        private _destroyRef: DestroyRef,
        private _viewRef: ViewContainerRef,
        @Optional() private _ngControl?: NgControl,
    ) {
        if (!_ngControl) {
            throw new Error('AutocompleteTriggerDirective requires a NgControl instance.');
        }
    }

    ngOnInit(): void {
        this._renderer.setAttribute(this._el.nativeElement, 'autocomplete', 'off');
        this._portal = new ComponentPortal(AutocompleteContainerComponent, this._viewRef);

        this._ngControl!.valueChanges?.subscribe(value => {
            this._renderer.setProperty(this._el.nativeElement, 'value', this.formatter()(value));
        })
    }

    openPanel() {
        const scrollStrategy = this._overlay.scrollStrategies.reposition();
        const positionStrategy = this._overlay.position()
            .flexibleConnectedTo(this._el.nativeElement)
            .withPositions(getConnectedPositions('bottom', 'start', true));

        positionStrategy.positionChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(p => {
            // wrapperRef.instance.set(this.content(), (p.connectionPair as any).key);
        });

        this._overlayRef = this._overlay.create({ scrollStrategy, positionStrategy, hasBackdrop: false });
        let componentRef = this._overlayRef.attach(this._portal);

        this._instance = componentRef.instance;
        this._instance.itemSelect.subscribe((item) => {
            this._selectedItem = item;
            this._ngControl!.control!.setValue(item);
            this.itemSelect.emit(item);
            this._ngControl!.control!.markAsTouched();
            this._ngControl!.control!.markAsDirty();
            this.hidePanel();
        });

        this._instance.dataResult$ = this._ngControl!.control!.valueChanges.pipe(
            startWith(this.formatter()(this._ngControl!.control!.value)),
            switchMap(v => {
                let request = new DataRequest({ filters: v ? [{ value: this.formatter()(v), operator: 'contains' }] : [] });
                return this.source().load(request);
            })
        )
    }

    hidePanel() {
        if (this._overlayRef) {
            this._overlayRef.detach();
            this._overlayRef.dispose();
            this._overlayRef = undefined;
        }
    }

    @HostListener('focus', ['$event'])
    private _onFocus(event: FocusEvent) {
        this.openPanel();
    }

    @HostListener('focusout', ['$event'])
    private _onFocusOut(event: FocusEvent) {
        this.hidePanel();
    }

    ngOnDestroy(): void {
        this.hidePanel();
    }
}
