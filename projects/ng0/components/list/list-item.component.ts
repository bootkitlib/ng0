import { Component, ChangeDetectionStrategy, ViewEncapsulation, inject, input, booleanAttribute, ElementRef, signal, OnInit } from '@angular/core';
import { ListComponent } from './list.component';
import { CommonModule } from '@angular/common';

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
    imports: [
        CommonModule,
    ],
    host: {
        '[class.active]': 'isActive()',
        '[class.selected]': 'isSelected()',
        '[attr.id]': 'id()',
        '[attr.tabIndex]': '_getTabIndex()'
    }
})
export class ListItemComponent {
    /**
     * The value associated with the item. This can be of any type.
     */
    public readonly value = input<any>();

    /**
     * The id of the item.
     */
    public readonly id = input<any>();

    /**
     * Reference to the parent list component
     */
    public readonly list = inject(ListComponent);

    /**
     * Reference to the host element
     */
    public readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    /**
     * Indicates whether the item is active.
     * @returns True if the item is active, false otherwise.
     */
    public isActive() {
        return this.list.isActive(this);
    }

    /**
     * Indicates whether the item is selected.
     * @returns True if the item is selected, false otherwise.
     */
    public isSelected() {
        return this.list.isSelected(this.value());
    }

    /**
     * Selects the item.
     * @returns 
     */
    public select() {
        return this.list.select(this.value());
    }

    /**
     * Deselects the item.
     * @returns 
     */
    public deselect() {
        this.list.deselect(this);
    }

    /**
     * Toggles the selection state of the item.
     * @returns void
     */
    public toggle() {
        this.list.toggle(this.value());
    }

    // /**
    //  * Indicates whether the item is disabled. Default is false.
    //  */
    // public readonly disabled = input(false, { transform: booleanAttribute });

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

    /**
     * Sets focus on the item.
     */
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
