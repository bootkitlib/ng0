import { Component, ChangeDetectionStrategy, input, booleanAttribute, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CssClass } from '@bootkit/ng0/common';

/**
 * An item within a dropdown menu.
 */
@Component({
    selector: 'ng0-dropdown-item',
    exportAs: 'ng0DropdownItem',
    standalone: true,
    templateUrl: './dropdown-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RouterModule
    ],
})
export class DropdownItemComponent {
    /**
     * The CSS classes to apply to the dropdown item.
     * */
    public readonly cssClass = input<CssClass>();

    /**
     * Whether the dropdown item is disabled.
     */
    public readonly disabled = input(false, { transform: booleanAttribute });

    @HostListener('click', ['$event'])
    protected _onClick(e: MouseEvent) {
        if (this.disabled()) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }
}
