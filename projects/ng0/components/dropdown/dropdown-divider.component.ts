import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ng0-dropdown-divider',
    exportAs: 'ng0DropdownDivider',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
    ],
    template: `<hr class="dropdown-divider">`,
})
export class DropdownDividerComponent {
}
