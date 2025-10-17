import { Component, ChangeDetectionStrategy, ViewEncapsulation, inject, input, model, booleanAttribute, ElementRef, signal, OnInit } from '@angular/core';
import { ListComponent } from './list.component';

/**
 * ListItemComponent represents an individual item within a ListComponent.
 */
@Component({
    selector: 'ng0-list-item',
    exportAs: 'ng0ListItem',
    templateUrl: './list-item.component.html',
    styleUrls: ['./list-item.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.active]': 'isActive()',
        '[class.selected]': 'isSelected()',
        '[attr.id]': 'id()',
        '[attr.tabIndex]': '_getTabIndex()'
    }
})
export class ListItemComponent implements OnInit {
    private readonly _id = signal<any>(undefined);

    ngOnInit(): void {
        this._id.set(this.list.idGenerator()?.(this.value()))
    }

    /**
     * Reference to the host element
     */
    public elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    /**
     * Reference to the parent list component
     */
    public readonly list = inject(ListComponent);

    /**
 * The value associated with the item. This can be of any type.
 */
    public readonly value = input<any>();


    public isActive() {
        return this.list.isActive(this);
    }

    public isSelected() {
        return this.list.isSelected(this);
    }

    public select() {
        return this.list.select(this);
    }

    public deselect() {
        this.list.deselect(this);
    }

    /**
     * Toggles the selection state of the item.
     * @returns void
     */
    public toggle() {
        this.list.toggle(this);
    }

    /**
     * Indicates whether the item is disabled. Default is false.
     */
    public readonly disabled = input(false, { transform: booleanAttribute });

    /**
     * The id of the item.
     */
    public id() {
        return this._id();
    }

    /**
     * Scrolls the item into view within its parent container.
     * @param position The vertical alignment of the item after scrolling.
     *                 Can be 'start', 'center', 'end', or 'nearest'.
     *                 Default is 'nearest'.
     * @param behavior The scrolling behavior.
     */
    public scrollIntoView(position?: ScrollLogicalPosition, behavior?: ScrollBehavior) {
        this.elementRef.nativeElement.scrollIntoView({ block: position, behavior: behavior });
    }

    public focus() {
        this.elementRef.nativeElement.focus();
    }

    private _getTabIndex() {
        let focus = this.list.focus();
        // if (this.list.isDisabled()) {
        //     return undefined;
        // }

        if (focus == 'none' || focus == 'activeDescendant') {
            return undefined;
        } else {
            // focus: roving
            return this.isActive() ? 0 : -1
        }
    }
}
