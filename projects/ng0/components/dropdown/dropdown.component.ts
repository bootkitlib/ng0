import { Component, ElementRef, Renderer2, ChangeDetectionStrategy, inject, input, model, HostListener, ContentChild, booleanAttribute, ViewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CssClass, Placement } from '@bootkit/ng0/common';
import { OverlayModule } from '@angular/cdk/overlay';
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
    ],
    host: {
        '[class]': '_directionCssClass()',
    }
})
export class DropdownComponent {
    // @ContentChildren(DropdownItemComponent) private _items!: QueryList<DropdownItemComponent>;
    @ContentChild(DropdownMenuComponent) private _dropdownMenu!: DropdownMenuComponent;
    @ViewChild('mainButton') private _mainButton!: ElementRef<HTMLButtonElement>;
    @ViewChild('splitButton') private _splitButton?: ElementRef<HTMLButtonElement>;
    // protected _scrollStrategy!: ScrollStrategy;
    protected _el = inject(ElementRef);
    private _renderer = inject(Renderer2);


    /**
     * The placement of the dropdown menu in relation to the dropdown toggle.
     */
    public placement = input<Placement>('bottom');

    /**
     * The CSS classes to apply to the dropdown toggle button.
     * @default 'btn btn-primary'
     */
    public cssClass = input<CssClass>('btn btn-primary');

    /**
     * The CSS classes to apply to the dropdown split button.
     * @default 'btn btn-primary'
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

    /**
     * Dropdown size
     * @default 'default'
     */
    public readonly size = input<DropdownSize>('default');

    protected _directionCssClass = computed(() => {
        switch (this.placement()) {
            case 'top':
                return 'dropup';
            case 'start':
                return 'dropstart';
            case 'end':
                return 'dropend';
            case 'bottom':
            default:
                return undefined;
        }
    })

    constructor() {
        this._renderer.addClass(this._el.nativeElement, 'btn-group');
        // this._scrollStrategy = this._overlay.scrollStrategies.block();
    }

    /**
     * Toggle the dropdown open or closed.
     */
    public toggle() {
        this.open.set(!this.open());
    }

    @HostListener('document:click', ['$event'])
    private _onDocumentClick(e: MouseEvent) {
        const splitButtonClicked = e.target === this._splitButton?.nativeElement;
        const mainButtonClicked = e.target === this._mainButton?.nativeElement;
        const toggleClicked = this.split() ? splitButtonClicked : mainButtonClicked;
        const dropdownClicked = splitButtonClicked || mainButtonClicked;
        const menuClicked = this._dropdownMenu.elementRef.nativeElement.contains(e.target);
        const outsideClicked = !dropdownClicked && !menuClicked;

        if (this.open()) {
            if (toggleClicked) {
                this.open.set(false);
                return;
            }

            switch (this.autoClose()) {
                case 'default':
                    this.open.set(false);
                    break;
                case 'outside':
                    if (outsideClicked || mainButtonClicked) {
                        this.open.set(false);
                    }
                    break;
                case 'inside':
                    if (menuClicked) {
                        this.open.set(false);
                    }
                    break;
                case 'manual':
                    break;
            }
        } else {
            if (toggleClicked) {
                this.open.set(true);
            }
        }
    }
}
