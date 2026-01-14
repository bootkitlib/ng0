import { Component, ChangeDetectionStrategy, input, booleanAttribute, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * A link item within a dropdown menu.
 * This component is used to create a navigable link inside a dropdown.
 */
@Component({
    selector: 'ng0-dropdown-link',
    exportAs: 'ng0DropdownLink',
    standalone: true,
    templateUrl: './dropdown-link.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RouterModule
    ],
})
export class DropdownLinkComponent {
    /**
     * The link or URL to navigate to when the dropdown item is clicked.
     */
    public readonly link = input.required<string | string[] | undefined>();

    /**
     * The router link active class to apply when the link is active.
     */
    public readonly active = input<string | string[]>('');

    /**
     * Specifies where to open the linked document.
     */
    public readonly target = input<'_self' | '_blank' | '_parent' | '_top' | undefined>(undefined);

    /**
     * Whether the dropdown link is disabled.
     */
    public readonly disabled = input(false, { transform: booleanAttribute });


    @HostListener('click', ['$event'])
    protected _onClick(e: MouseEvent) {
        if (this.disabled()) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
}
