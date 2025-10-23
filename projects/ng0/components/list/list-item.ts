import { inject, input, ElementRef, Directive } from '@angular/core';

/**
 * ListItem represents an individual item within a ListComponent.
 */
@Directive({
    selector: '[ng0ListItem]',
    exportAs: 'ng0ListItem',
    standalone: true,
    host: {
        '[attr.id]': 'id()',
    }
})
export class ListItem {
    /**
     * The value associated with the item. This can be of any type.
     */
    public readonly value = input<any>();

    /**
     * The id of the item.
     */
    public readonly id = input<any>();

    /**
     * Reference to the host element
     */
    public readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

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
}
