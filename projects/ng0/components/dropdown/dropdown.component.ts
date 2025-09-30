import { Component, ElementRef, Renderer2, ChangeDetectionStrategy, inject, input, ContentChildren, QueryList, model, ViewEncapsulation, HostListener, ContentChild, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CssClass, Placement } from '@bootkit/ng0/common';
import { DropdownItemComponent } from './dropdown-item.component';
import { Overlay, OverlayModule, ScrollStrategy } from '@angular/cdk/overlay';
import { DropdownAutoCloseBehavior, DropdownSize } from './types';
import { DropdownMenuComponent } from './dropdown-menu.component';

@Component({
    selector: 'ng0-dropdown',
    exportAs: 'ng0Dropdown',
    templateUrl: './dropdown.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        OverlayModule,
    ]
})
export class DropdownComponent {
    _onOverlayOutsideClick() {
        this.open.set(false);
    }

    @ContentChildren(DropdownItemComponent) protected _items!: QueryList<DropdownItemComponent>;
    @ContentChild(DropdownMenuComponent) protected _dropdownMenu!: DropdownMenuComponent;


    // @HostBinding('class.dropstart')
    // private get _placementStart() { return this.placement() == 'start' };

    // @HostBinding('class.dropend')
    // private get _placementEnd() { return this.placement() == 'end' };

    // @HostBinding('class.dropup')
    // private get _placementTop() { return this.placement() == 'top' };

    // @HostBinding('class.dropdown')
    // private get _placementBottom() { return this.placement() == 'bottom' };
    protected _scrollStrategy!: ScrollStrategy;

    protected _el = inject(ElementRef);
    private _renderer = inject(Renderer2);
    private _overlay = inject(Overlay);

    /**
     * The placement of the dropdown menu in relation to the dropdown toggle.
     */
    public placement = input<Placement>('bottom');

    /**
     * The CSS classes to apply to the dropdown toggle button.
     * @default 'btn btn-secondary'
     */
    public cssClass = input<CssClass>('btn btn-primary');

    /**
     * The CSS classes to apply to the dropdown split button.
     */
    public splitCssClass = input<CssClass>('btn btn-primary');

    /** 
     * Indicates whether the dropdown is open or closed.
     * @default false
     */
    public readonly open = model(false);

    /**
     * Indicates whether the dropdown is a split button. 
     * A split button dropdown has a separate toggle button.
     * @default false
     */
    public readonly split = input(false, { transform: booleanAttribute });

    /**
     * Indicates whether the dropdown has an automatic close behavior.
     * @default 'default'
     */
    public readonly autoClose = input<DropdownAutoCloseBehavior>('default');
    public readonly size = input<DropdownSize>('default');

    constructor() {
        this._renderer.addClass(this._el.nativeElement, 'btn-group');
        this._scrollStrategy = this._overlay.scrollStrategies.block();
    }

    /**
     * Toggle the dropdown open or closed.
     */
    public toggle() {
        this.open.set(!this.open());
    }

    protected _onOverlayAttach() {
        // this._activeOptionIndex.set(this._selectedOptionIndex())

        // this._listenToResizeEvents();

        // if (this.filterable()) {
        //     setTimeout(() => {
        //         this._filterElementRef?.nativeElement.focus();
        //     }, 0);
        // }

        // if (this._selectedOptionIndex() > -1) {
        //     // this.scrollItemIntoView(this._selectedOptionIndex(), 'start', 'instant');
        // }
    }

    protected _onOverlayDetach() {
        // this._unlistenFromResizeEvents();
        // if (this.filterable()) {
        //     this._el?.nativeElement.focus();
        //     this._options().forEach(x => x.show = false);
        // }
    }

    @HostListener('document:click', ['$event'])
    private _onDocumentClick(e: MouseEvent) {
        if (this.open()) {
            // if (this.autoClose() == 'default' || this.autoClose() == 'outside') {
            //     // if (!this._el.nativeElement.contains(e.target)) {
            //     this.open.set(false);
            //     // }
            // }
        }
    }
}
