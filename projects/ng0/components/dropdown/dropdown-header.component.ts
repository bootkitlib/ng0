import { Component, ElementRef, Renderer2, ChangeDetectionStrategy, inject, input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ng0-dropdown-header',
    exportAs: 'ng0DropdownItem',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<h6 class="dropdown-header"><ng-content></ng-content></h6>`,
})
export class DropdownHeaderComponent {
}
