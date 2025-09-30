import { Component, ElementRef, Renderer2, ChangeDetectionStrategy, HostBinding, ContentChild, effect, AfterViewInit, inject, input, ContentChildren, QueryList, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Placement } from '@bootkit/ng0/common';
import { DropdownItemComponent } from './dropdown-item.component';
import { Overlay, OverlayModule, ScrollStrategy } from '@angular/cdk/overlay';
import { DropdownAutoCloseBehavior } from './types';

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
    @ContentChildren(DropdownItemComponent) protected _items!: QueryList<DropdownItemComponent>;


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
     * Indicates whether the dropdown is open or closed.
     */
    public readonly open = model(false);

    /**
     * 
     */
    public readonly autoClose = input<DropdownAutoCloseBehavior>('default');

    constructor() {
        this._renderer.addClass(this._el.nativeElement, 'dropdown');
        this._scrollStrategy = this._overlay.scrollStrategies.block();

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

}
