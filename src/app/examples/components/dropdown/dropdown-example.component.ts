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
    open1 = false;
    open2 = false;
    open3 = false;
    open4 = false;
    open5 = false;
}
