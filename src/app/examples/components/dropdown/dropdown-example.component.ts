import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DropdownModule } from '@bootkit/ng0/components/dropdown';

@Component({
    selector: 'app-dropdown-example',
    templateUrl: './dropdown-example.component.html',
    standalone: true,
    imports: [
        CommonModule,
        DropdownModule,
    ]
})
export class DropdownExampleComponent {
    thankYou() {
        alert('Thank you for clicking me! :)');
    }
}
